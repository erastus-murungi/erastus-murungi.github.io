'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useReward } from 'react-rewards';
import { Pacifico } from 'next/font/google';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

const pacifico = Pacifico({ weight: '400', subsets: ['latin'] });

interface Balloon {
    id: number;
    emoji: string;
    left: string;
    delay: number;
}

export function BirthdayPopup() {
    const [open, setOpen] = React.useState(false);
    const [balloons, setBalloons] = React.useState<Balloon[]>([]);
    const router = useRouter();
    const { reward: confettiReward } = useReward('confettiReward', 'confetti', {
        lifetime: 5000,
        angle: 90,
        decay: 0.91,
        spread: 150,
        startVelocity: 45,
        elementCount: 150,
        elementSize: 12,
        colors: [
            '#4A90E2',
            '#5DADE2',
            '#85C1E9',
            '#AED6F1',
            '#1E88E5',
            '#42A5F5',
            '#64B5F6',
            '#90CAF9',
            '#000000',
            '#ffffff',
            '#ffa500',
        ],
    });

    React.useEffect(() => {
        // Open popup after 500ms delay
        const timer = setTimeout(() => {
            setOpen(true);
            // Trigger confetti after dialog animation
            setTimeout(() => {
                confettiReward();
            }, 300);
        }, 500);

        return () => clearTimeout(timer);
    }, [confettiReward]);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        // Trigger confetti every 20 seconds after the first one
        const confettiInterval = setInterval(() => {
            confettiReward();
        }, 20_000);

        return () => clearInterval(confettiInterval);
    }, [open, confettiReward]);

    React.useEffect(() => {
        if (!open) {
            return;
        }

        // Start spawning balloons after 5 seconds
        const startBalloonTimer = setTimeout(() => {
            // eslint-disable-next-line unicorn/consistent-function-scoping
            function spawnBalloons() {
                const balloonEmojis = [
                    '🎈',
                    '🎉',
                    '🎊',
                    '🐧',
                    '🐥',
                    '🐧',
                    '🐥',
                ];
                const newBalloons: Balloon[] = Array.from(
                    { length: 5 },
                    (_, i) => ({
                        id: Date.now() + i,
                        emoji: balloonEmojis[
                            Math.floor(Math.random() * balloonEmojis.length)
                        ],
                        left: `${Math.random() * 80 + 10}%`,
                        delay: Math.random() * 0.5,
                    })
                );

                setBalloons((prev) => [...prev, ...newBalloons]);

                // Remove balloons after animation completes (8 seconds)
                setTimeout(() => {
                    setBalloons((prev) => prev.slice(5));
                }, 8000);
            }

            // Spawn immediately after 5 seconds
            spawnBalloons();

            // Then spawn every 7 seconds
            const interval = setInterval(spawnBalloons, 7000);

            return () => clearInterval(interval);
        }, 5000);

        return () => clearTimeout(startBalloonTimer);
    }, [open]);

    const handleOpenPresent = () => {
        setOpen(false);
        // Navigate to birthday page after dialog closes
        setTimeout(() => {
            router.push('/birthday');
        }, 300);
    };

    return (
        <>
            {/* Hidden element for confetti origin */}
            <div
                id="confettiReward"
                className="pointer-events-none fixed top-1/2 left-1/2 z-[100] -translate-x-1/2 -translate-y-1/2"
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md overflow-hidden border-4 border-blue-400 bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-50 p-0 shadow-2xl sm:max-w-lg">
                    {/* Floating balloons */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {balloons.map((balloon) => (
                            <div
                                key={balloon.id}
                                className="balloon"
                                style={{
                                    left: balloon.left,
                                    animationDelay: `${balloon.delay}s`,
                                }}
                            >
                                {balloon.emoji}
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 p-8 sm:p-12">
                        <DialogHeader>
                            <DialogTitle className="sr-only">
                                Happy Birthday Vannessa
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col items-center space-y-8 text-center">
                            {/* Penguin and duckling header decoration */}
                            <div className="animate-bounce-in flex items-center justify-center space-x-3 text-5xl">
                                <span className="animate-waddle">🐧</span>
                                <span className="animate-waddle animation-delay-200">
                                    🐥
                                </span>
                                <span className="animate-waddle animation-delay-400">
                                    🎂
                                </span>
                                <span className="animate-waddle animation-delay-600">
                                    🐥
                                </span>
                                <span className="animate-waddle animation-delay-800">
                                    🐧
                                </span>
                            </div>

                            {/* Animated Birthday Message */}
                            <div className="space-y-2">
                                <h2
                                    className={`birthday-text animate-bounce-in text-5xl font-bold sm:text-6xl ${pacifico.className}`}
                                >
                                    Happy Birthday
                                </h2>
                                <h3
                                    className={`birthday-text-name animate-fade-in text-6xl font-bold sm:text-7xl ${pacifico.className}`}
                                >
                                    twi twi twi
                                </h3>
                            </div>

                            {/* Sparkles, penguin, and duckling decoration */}
                            <div className="flex space-x-2 text-4xl">
                                <span className="animate-twinkle">🐧</span>
                                <span className="animate-twinkle animation-delay-200">
                                    ✨
                                </span>
                                <span className="animate-twinkle animation-delay-400">
                                    💖
                                </span>
                                <span className="animate-twinkle animation-delay-600">
                                    ✨
                                </span>
                                <span className="animate-twinkle animation-delay-800">
                                    🐥
                                </span>
                            </div>

                            {/* Gift Box Button */}
                            <button
                                type="button"
                                onClick={handleOpenPresent}
                                className="group animate-wobble relative rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                            >
                                <div className="rounded-xl bg-white px-8 py-4">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-5xl transition-transform group-hover:scale-110">
                                            🎁
                                        </span>
                                        <span
                                            className={`bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent ${pacifico.className}`}
                                        >
                                            What&apos;s Inside?
                                        </span>
                                    </div>
                                </div>
                                {/* Pulsing glow effect */}
                                <div className="absolute inset-0 -z-10 animate-pulse rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 opacity-75 blur-lg" />
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
                .birthday-text {
                    background: linear-gradient(
                        135deg,
                        #1E88E5 0%,
                        #42A5F5 25%,
                        #64B5F6 50%,
                        #1E88E5 75%,
                        #42A5F5 100%
                    );
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient-shift 3s ease infinite;
                    text-shadow: 0 4px 20px rgba(30, 136, 229, 0.5);
                }

                .birthday-text-name {
                    background: linear-gradient(
                        135deg,
                        #0D47A1 0%,
                        #1976D2 25%,
                        #42A5F5 50%,
                        #64B5F6 75%,
                        #0D47A1 100%
                    );
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient-shift 3s ease infinite;
                    text-shadow: 0 4px 20px rgba(30, 136, 229, 0.5);
                }

                @keyframes gradient-shift {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                @keyframes bounce-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) translateY(-20px);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.95);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                @keyframes fade-in {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes twinkle {
                    0%,
                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.2) rotate(180deg);
                    }
                }

                @keyframes wobble {
                    0%,
                    100% {
                        transform: rotate(0deg);
                    }
                    25% {
                        transform: rotate(-3deg);
                    }
                    75% {
                        transform: rotate(3deg);
                    }
                }

                @keyframes waddle {
                    0%,
                    100% {
                        transform: rotate(0deg) translateX(0);
                    }
                    25% {
                        transform: rotate(-8deg) translateX(-3px);
                    }
                    75% {
                        transform: rotate(8deg) translateX(3px);
                    }
                }

                @keyframes float-up {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-120vh) translateX(20px) rotate(360deg);
                        opacity: 0;
                    }
                }

                .animate-bounce-in {
                    animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out 0.4s both;
                }

                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
                }

                .animate-wobble {
                    animation: wobble 2s ease-in-out infinite;
                }

                .animate-waddle {
                    animation: waddle 1.5s ease-in-out infinite;
                    display: inline-block;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s;
                }

                .animation-delay-800 {
                    animation-delay: 0.8s;
                }

                .balloon {
                    position: absolute;
                    bottom: -50px;
                    font-size: 2.5rem;
                    animation: float-up 8s ease-out forwards;
                }
            `}</style>
        </>
    );
}
