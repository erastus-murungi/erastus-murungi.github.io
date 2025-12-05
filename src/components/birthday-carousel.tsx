'use client';

import * as React from 'react';
import Image from 'next/image';
import { Pacifico } from 'next/font/google';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const pacifico = Pacifico({ weight: '400', subsets: ['latin'] });

interface Photo {
    src: string;
    caption: string;
}

const photos: Photo[] = [
    {
        src: '/birthday/birthday_1.jpg',
        caption: 'Siku ya kwanza mlimani pale Arizona, kwenye shimo la jiwe 🤣',
    },
    {
        src: '/birthday/birthday_2.jpg',
        caption:
            'Fantastic night at Bishop Briggs even though when I made you fall 🥹',
    },
    {
        src: '/birthday/birthday_3.jpg',
        caption:
            'I do not for the life of me remember what you were celebrating here, but I love your energy!',
    },
    {
        src: '/birthday/birthday_4.jpg',
        caption: 'First time in LA',
    },
    {
        src: '/birthday/birthday_5.jpg',
        caption: 'First time in LA, this but at the beach',
    },
    {
        src: '/birthday/birthday_6.jpg',
        caption: 'Looking cute at night, at the Halsey concert',
    },
    {
        src: '/birthday/birthday_7.jpg',
        caption: 'I let you figure this one out 🤣',
    },
    {
        src: '/birthday/birthday_8.jpg',
        caption: 'I remember you making my day with this one',
    },
    {
        src: '/birthday/birthday_9.jpg',
        caption: 'Valley fair ☠️🔫',
    },
];

export function BirthdayCarousel() {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    return (
        <div className="mx-auto w-full max-w-4xl px-4">
            <div className="mb-8 text-center">
                <h3
                    className={`photo-gallery-heading text-4xl font-bold sm:text-5xl ${pacifico.className}`}
                >
                    Your Beautiful Moments
                </h3>
                <p className="mt-2 text-lg text-blue-600">
                    {currentIndex + 1} of {photos.length}
                </p>
            </div>

            <Carousel
                opts={{
                    align: 'center',
                    loop: true,
                }}
                className="w-full"
                setApi={(api) => {
                    api?.on('select', () => {
                        setCurrentIndex(api.selectedScrollSnap());
                    });
                }}
            >
                <CarouselContent>
                    {photos.map((photo, index) => (
                        <CarouselItem key={index}>
                            <div className="flex items-center justify-center p-4">
                                {/* Polaroid-style photo */}
                                <div className="polaroid-photo rotate-on-hover bg-white p-4 shadow-2xl">
                                    {/* Photo area */}
                                    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                        <Image
                                            src={photo.src}
                                            alt={`Memory ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 800px"
                                            priority={index === 0}
                                        />
                                    </div>
                                    {/* Caption area */}
                                    <div className="mt-4 pb-2">
                                        <p
                                            className={`handwritten-caption text-center text-xl text-gray-800 sm:text-2xl ${pacifico.className}`}
                                        >
                                            {photo.caption}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="border-2 border-blue-400 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-30" />
                <CarouselNext className="border-2 border-blue-400 bg-white text-blue-600 hover:bg-blue-50 disabled:opacity-30" />
            </Carousel>

            {/* Navigation dots */}
            <div className="mt-6 flex justify-center space-x-2">
                {photos.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'w-8 bg-blue-500'
                                : 'bg-blue-300 hover:bg-blue-400'
                        }`}
                        onClick={() => {
                            // This would need API access to jump to slide
                        }}
                        aria-label={`Go to photo ${index + 1}`}
                    />
                ))}
            </div>

            <style>{`
                .photo-gallery-heading {
                    background: linear-gradient(
                        135deg,
                        #1e88e5 0%,
                        #42a5f5 50%,
                        #64b5f6 100%
                    );
                    background-size: 200% 200%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient-shift 3s ease infinite;
                }

                .polaroid-photo {
                    max-width: 600px;
                    width: 100%;
                    border-radius: 3px;
                    transform: rotate(-1deg);
                    transition: all 0.3s ease;
                    box-shadow:
                        0 4px 6px rgba(0, 0, 0, 0.1),
                        0 10px 20px rgba(0, 0, 0, 0.15),
                        0 20px 40px rgba(0, 0, 0, 0.1);
                }

                .polaroid-photo:hover {
                    transform: rotate(0deg) scale(1.02);
                    box-shadow:
                        0 6px 12px rgba(0, 0, 0, 0.15),
                        0 15px 30px rgba(0, 0, 0, 0.2),
                        0 25px 50px rgba(0, 0, 0, 0.15);
                }

                .polaroid-photo:nth-child(even) {
                    transform: rotate(1deg);
                }

                .polaroid-photo:nth-child(even):hover {
                    transform: rotate(0deg) scale(1.02);
                }

                .handwritten-caption {
                    line-height: 1.4;
                    letter-spacing: 0.02em;
                    color: #2c3e50;
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
            `}</style>
        </div>
    );
}
