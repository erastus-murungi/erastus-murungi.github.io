'use client';

import * as React from 'react';
import Image from 'next/image';
import { getImageUrl } from '../../lib/image-utils';
import { satisfy, indie_flower, reenie_beanie } from '../../styles/fonts';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Header from '../header';

function Letter0() {
    return (
        <div
            className={`${satisfy.className} inline-flex flex-col items-center justify-center border-4 border-blue-300 p-8`}
        >
            <p className="text-4xl">
                Dear Pepi Pepi!
                <br />
                <br /> I was playing around with code, as you know I do pretty
                often, and I was thinking of you.
                <br />
                <br />I am much happier with you in my life, and coding has been
                much more fun as I was thinking about you today. This little
                page will grow, as I try to get more creative with my emotions
                towards you.
                <br />
                <br />
                But for now, this is what I have come up with 💕 I hope you like
                it!
                <br />
                <br />
                ❤️
            </p>
        </div>
    );
}

function Letter1() {
    return (
        <div
            className={`${indie_flower.className} inline-flex flex-col items-center justify-center border-4 border-blue-900 p-8`}
        >
            <p className="text-4xl">
                My love,
                <br />
                <br />
                Sorry that we are having an eetsy bitsy &quot;bad mood&quot;
                moment right now. And, we&apos;ll have many of them but I am
                sure we&apos;ll get through them all.
                <br />
                <br />
                As long as we remember we got each other, we&apos;ll be fine.✌🏾
                <br />
                <br />I love you so much and I am so grateful to have you in my
                life. ❤️
            </p>
        </div>
    );
}

function Letter2() {
    return (
        <div
            className={`${reenie_beanie.className} inline-flex flex-col items-center justify-center border-4 border-blue-900 p-8`}
        >
            <div className="inline-flex flex-row items-center">
                <Image
                    src={getImageUrl('penguin.jpg')}
                    alt="Pepi"
                    width={100}
                    height={100}
                    className="m-4 rotate-45"
                />

                <Image
                    src={getImageUrl('penguin.jpg')}
                    alt="Pepi"
                    width={100}
                    height={100}
                    className="-rotate-45"
                />
            </div>
            <p className="text-2xl font-bold">
                hey there, I hope you are having a great day.
                <br />
                <br />I love you so much and I am so grateful to have you in my
                life. ❤️
            </p>
        </div>
    );
}

export default function MemoriesCarousel() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div>
            <Header />
            <div className="flex flex-col items-center justify-center bg-slate-50">
                <Carousel className="w-full max-w-xl" setApi={setApi}>
                    <CarouselContent className="h-3/4">
                        <CarouselItem key={0}>
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <div className="inline-flex h-screen flex-col items-center justify-center">
                                        <h1 className="p-8 text-center text-4xl font-bold">
                                            Follow the ducks to the next page 🐣
                                            🐣 🐣 👉🏾
                                        </h1>
                                        <Image
                                            src={getImageUrl('pic.jpg')}
                                            alt="Pepi"
                                            width={400}
                                            height={400}
                                            className="border-4 border-black p-8"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem key={1}>
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <Letter0 />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem key={2}>
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <div className="inline-flex h-screen flex-col items-center justify-center">
                                        <h1 className="p-8 text-center text-4xl font-bold">
                                            My view sometimes 👀
                                        </h1>
                                        <Image
                                            src={getImageUrl('pic1.jpg')}
                                            alt="Pepi"
                                            width={400}
                                            height={400}
                                            className="border-4 border-black p-8"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem key={3}>
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <Letter1 />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem key={4}>
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <div className="inline-flex h-screen flex-col items-center justify-center">
                                        <Image
                                            src={getImageUrl('pic3.jpg')}
                                            alt="Chama"
                                            width={600}
                                            height={600}
                                            className="border-4 border-black p-8"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem key={5}>
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <Letter2 />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem key={6}>
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <div className="inline-flex h-screen flex-col items-center justify-center">
                                        <Image
                                            src={getImageUrl('chama.gif')}
                                            alt="Chama"
                                            width={600}
                                            height={600}
                                            className="border-4 border-black p-8"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                    <div
                        className={`${satisfy.className} text-muted-foreground py-2 text-center text-sm`}
                    >
                        Memory {current} of {count}
                    </div>
                </Carousel>
            </div>
        </div>
    );
}
