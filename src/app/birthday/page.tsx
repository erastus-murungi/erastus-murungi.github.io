'use client';

import * as React from 'react';
import { Pacifico } from 'next/font/google';
import Header from '../header';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { ScratchCard } from '@/components/scratch-card';

const pacifico = Pacifico({ weight: '400', subsets: ['latin'] });

export default function BirthdayPage() {
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
            <Header titleHeading="Birthday Celebration" />

            <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center p-4">
                <div className="max-w-4xl text-center">
                    {/* Main Birthday Message */}
                    <div className="mb-8 space-y-4">
                        <h1
                            className={`birthday-heading animate-bounce-in text-6xl font-bold sm:text-7xl md:text-8xl ${pacifico.className}`}
                        >
                            🎉 Surprise! 🎉
                        </h1>
                        <p
                            className={`animate-fade-in text-2xl text-gray-700 sm:text-3xl md:text-4xl ${pacifico.className}`}
                        >
                            Wishing you the most amazing birthday, love!
                        </p>
                    </div>

                    {/* Birthday Message Card */}
                    <div className="animate-slide-up mx-auto mb-8 max-w-2xl rounded-3xl border-4 border-blue-400 bg-white/90 p-8 shadow-2xl backdrop-blur-sm">
                        <ScratchCard
                            brushSize={50}
                            completeThreshold={60}
                            storageKey="birthday-message-revealed"
                        >
                            <div className="space-y-6">
                                <div className="flex justify-center space-x-2 text-6xl">
                                    <span>🐧</span>
                                    <span>🎂</span>
                                    <span>🐥</span>
                                </div>
                                <p
                                    className={`text-xl leading-relaxed text-gray-800 sm:text-2xl ${pacifico.className}`}
                                >
                                    Happy happy birthday to you my dear.
                                    I&apos;m blessed that you&apos;re my
                                    partner, and blessed to watch you continue
                                    to grow into the amazing woman you are
                                    today. I&apos;m excited to see the wonderful
                                    things you&apos;ll continue to accomplish in
                                    the upcoming year. I&apos;m sorry that we
                                    couldn&apos;t spend more time together
                                    today, but I&apos;m happy that you crossed
                                    over into your twenty-🤐 years while we were
                                    together. I pray that I&apos;ll be present
                                    in your life for more birthdays to come.
                                    Happiest of birthdays 💕
                                </p>
                                <div className="flex justify-center space-x-2 text-3xl">
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
                            </div>
                        </ScratchCard>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/"
                            className={`inline-flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl ${buttonVariants()} ${pacifico.className}`}
                        >
                            <span>Back to Home</span>
                        </Link>
                        <Link
                            href="/birthday/carousel"
                            className={`inline-flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-xl font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl ${buttonVariants()} ${pacifico.className}`}
                        >
                            <span>What&apos;s Next? 💙</span>
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
                        🎊
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
                        🎁
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
                        🎈
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
                        🌟
                    </div>
                </div>
            </div>

            <style>{`
                .birthday-heading {
                    background: linear-gradient(
                        135deg,
                        #1E88E5 0%,
                        #42A5F5 25%,
                        #64B5F6 50%,
                        #90CAF9 75%,
                        #1E88E5 100%
                    );
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient-shift 4s ease infinite;
                    filter: drop-shadow(0 4px 20px rgba(30, 136, 229, 0.4));
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
                        transform: scale(0.3) translateY(-40px);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.1);
                    }
                    70% {
                        transform: scale(0.9);
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

                @keyframes slide-up {
                    0% {
                        opacity: 0;
                        transform: translateY(40px);
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
                        opacity: 0.4;
                        transform: scale(1.3) rotate(180deg);
                    }
                }

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

                .animate-bounce-in {
                    animation: bounce-in 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                }

                .animate-fade-in {
                    animation: fade-in 1s ease-out 0.5s both;
                }

                .animate-slide-up {
                    animation: slide-up 1s ease-out 0.8s both;
                }

                .animate-twinkle {
                    animation: twinkle 2s ease-in-out infinite;
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
