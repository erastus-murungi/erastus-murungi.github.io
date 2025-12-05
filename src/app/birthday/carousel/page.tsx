'use client';

import * as React from 'react';
import { Pacifico } from 'next/font/google';
import Header from '../../header';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { BirthdayCarousel } from '@/components/birthday-carousel';

const pacifico = Pacifico({ weight: '400', subsets: ['latin'] });

export default function CarouselPage() {
    const [scrollY, setScrollY] = React.useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100">
            <Header titleHeading="Our Memories" />

            <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-12">
                <div className="w-full max-w-6xl px-4">
                    {/* Photo Carousel */}
                    <div className="mb-12">
                        <BirthdayCarousel />
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-center">
                        <Link
                            href="/birthday"
                            className={`inline-flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl ${buttonVariants()} ${pacifico.className}`}
                        >
                            <span>← Back to Birthday</span>
                        </Link>
                    </div>
                </div>

                {/* Floating elements with parallax */}
                <div className="pointer-events-none fixed inset-0 overflow-hidden">
                    <div
                        className="float-element float-1"
                        style={{
                            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`,
                        }}
                    >
                        🐧
                    </div>
                    <div
                        className="float-element float-2"
                        style={{
                            transform: `translate(${scrollY * -0.08}px, ${scrollY * 0.12}px)`,
                        }}
                    >
                        💙
                    </div>
                    <div
                        className="float-element float-3"
                        style={{
                            transform: `translate(${scrollY * 0.12}px, ${scrollY * 0.2}px)`,
                        }}
                    >
                        🐥
                    </div>
                    <div
                        className="float-element float-4"
                        style={{
                            transform: `translate(${scrollY * -0.15}px, ${scrollY * 0.1}px)`,
                        }}
                    >
                        📸
                    </div>
                    <div
                        className="float-element float-5"
                        style={{
                            transform: `translate(${scrollY * 0.18}px, ${scrollY * 0.14}px)`,
                        }}
                    >
                        🐧
                    </div>
                    <div
                        className="float-element float-6"
                        style={{
                            transform: `translate(${scrollY * -0.1}px, ${scrollY * 0.16}px)`,
                        }}
                    >
                        ✨
                    </div>
                    <div
                        className="float-element float-7"
                        style={{
                            transform: `translate(${scrollY * 0.14}px, ${scrollY * 0.18}px)`,
                        }}
                    >
                        🐥
                    </div>
                    <div
                        className="float-element float-8"
                        style={{
                            transform: `translate(${scrollY * -0.12}px, ${scrollY * 0.13}px)`,
                        }}
                    >
                        💕
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%,
                    100% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    25% {
                        transform: translate(10px, -10px) rotate(5deg);
                    }
                    50% {
                        transform: translate(-5px, -20px) rotate(-5deg);
                    }
                    75% {
                        transform: translate(-10px, -10px) rotate(3deg);
                    }
                }

                .float-element {
                    position: absolute;
                    font-size: 3rem;
                    opacity: 0.6;
                    animation: float 6s ease-in-out infinite;
                }

                .float-1 {
                    top: 10%;
                    left: 5%;
                    animation-duration: 7s;
                }

                .float-2 {
                    top: 20%;
                    right: 10%;
                    animation-duration: 8s;
                    animation-delay: 1s;
                }

                .float-3 {
                    top: 60%;
                    left: 8%;
                    animation-duration: 9s;
                    animation-delay: 0.5s;
                }

                .float-4 {
                    top: 70%;
                    right: 15%;
                    animation-duration: 7.5s;
                    animation-delay: 1.5s;
                }

                .float-5 {
                    top: 40%;
                    left: 15%;
                    animation-duration: 8.5s;
                    animation-delay: 2s;
                }

                .float-6 {
                    top: 30%;
                    right: 5%;
                    animation-duration: 9.5s;
                    animation-delay: 0.8s;
                }

                .float-7 {
                    top: 80%;
                    left: 20%;
                    animation-duration: 7.2s;
                    animation-delay: 1.2s;
                }

                .float-8 {
                    top: 50%;
                    right: 20%;
                    animation-duration: 8.8s;
                    animation-delay: 1.8s;
                }
            `}</style>
        </div>
    );
}
