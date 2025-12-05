'use client';

import * as React from 'react';

interface ScratchCardProps {
    children: React.ReactNode;
    width?: number;
    height?: number;
    brushSize?: number;
    onComplete?: () => void;
    completeThreshold?: number;
    storageKey?: string;
}

export function ScratchCard({
    children,
    width = 800,
    height = 400,
    brushSize = 40,
    onComplete,
    completeThreshold = 70,
    storageKey = 'scratch-card-revealed',
}: ScratchCardProps) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isScratching, setIsScratching] = React.useState(false);
    const [isRevealed, setIsRevealed] = React.useState(false);
    const [canvasSize, setCanvasSize] = React.useState({ width, height });

    // Check if already revealed in this session
    React.useEffect(() => {
        const revealed = sessionStorage.getItem(storageKey);
        if (revealed === 'true') {
            setIsRevealed(true);
        }
    }, [storageKey]);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) {
            return;
        }

        // Set canvas size based on container
        const updateSize = () => {
            const rect = container.getBoundingClientRect();
            setCanvasSize({ width: rect.width, height: rect.height });
        };

        updateSize();
        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        // Set canvas dimensions
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        // Create gradient scratch surface
        const gradient = ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );
        gradient.addColorStop(0, '#64B5F6');
        gradient.addColorStop(0.5, '#42A5F5');
        gradient.addColorStop(1, '#1E88E5');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add text instructions
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 24px "Pacifico", cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            '✨ Scratch to reveal ✨',
            canvas.width / 2,
            canvas.height / 2
        );

        // Add some sparkle decorations
        ctx.font = '32px Arial';
        ctx.fillText('💙', canvas.width / 4, canvas.height / 3);
        ctx.fillText('🐧', (canvas.width / 4) * 3, canvas.height / 3);
        ctx.fillText('🐥', canvas.width / 4, (canvas.height / 3) * 2);
        ctx.fillText('💙', (canvas.width / 4) * 3, (canvas.height / 3) * 2);
    }, [canvasSize]);

    const scratch = (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
        ctx.fill();
    };

    const checkScratchPercentage = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let transparent = 0;
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) {
                transparent++;
            }
        }

        const percentage = (transparent / (pixels.length / 4)) * 100;

        if (percentage > completeThreshold && !isRevealed) {
            setIsRevealed(true);
            // Save to session storage
            sessionStorage.setItem(storageKey, 'true');
            // Fade out the canvas
            if (canvas) {
                canvas.style.transition = 'opacity 0.5s ease-out';
                canvas.style.opacity = '0';
                setTimeout(() => {
                    canvas.style.display = 'none';
                }, 500);
            }
            onComplete?.();
        }
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
        setIsScratching(true);
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        scratch(x, y);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        if (!isScratching) {
            return;
        }

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        scratch(x, y);
    };

    const handlePointerUp = () => {
        if (isScratching) {
            setIsScratching(false);
            checkScratchPercentage();
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden"
            style={{ touchAction: 'none' }}
        >
            {/* Hidden content */}
            <div className="relative z-0">{children}</div>

            {/* Scratch overlay */}
            {!isRevealed && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-10 cursor-pointer"
                    style={{ touchAction: 'none' }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                />
            )}
        </div>
    );
}
