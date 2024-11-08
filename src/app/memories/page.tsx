"use client";

import * as React from "react";
import Image from "next/image";
import { getImageUrl } from "../../lib/image-utils";
import { satisfy, indie_flower, reenie_beanie } from "../../styles/fonts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

function Letter0() {
  return (
    <div
      className={`${satisfy.className} border-blue-300 border-4 p-8 items-center justify-center inline-flex flex-col`}
    >
      <p className="text-4xl">
        Dear Pepi Pepi!
        <br />
        <br /> I was playing around with code, as you know I do pretty often,
        and I was thinking of you.
        <br />
        <br />I am much happier with you in my life, and coding has been much
        more fun as I was thinking about you today. This little page will grow,
        as I try to get more creative with my emotions towards you.
        <br />
        <br />
        But for now, this is what I have come up with 💕 I hope you like it!
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
      className={`${indie_flower.className} border-blue-900 border-4 p-8 items-center justify-center inline-flex flex-col`}
    >
      <p className="text-4xl">
        My love,
        <br />
        <br />
        Sorry that we are having an eetsy bitsy &quot;bad mood&quot; moment
        right now. And, we&apos;ll have many of them but I am sure we&apos;ll
        get through them all.
        <br />
        <br />
        As long as we remember we got each other, we&apos;ll be fine.✌🏾
        <br />
        <br />I love you so much and I am so grateful to have you in my life. ❤️
      </p>
    </div>
  );
}

function Letter2() {
  return (
    <div
      className={`${reenie_beanie.className} border-blue-900 border-4 p-8 items-center justify-center inline-flex flex-col`}
    >
      <div className="items-center inline-flex flex-row">
        <Image
          src={getImageUrl("penguin.jpg")}
          alt="Pepi"
          width={100}
          height={100}
          className="rotate-45 m-4"
        />

        <Image
          src={getImageUrl("penguin.jpg")}
          alt="Pepi"
          width={100}
          height={100}
          className="-rotate-45"
        />
      </div>
      <p className="text-2xl font-bold">
        hey there, I hope you are having a great day.
        <br />
        <br />I love you so much and I am so grateful to have you in my life. ❤️
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

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex justify-center items-center flex-col">
      <Carousel className="w-full max-w-xl" setApi={setApi}>
        <CarouselContent className="h-3/4">
          <CarouselItem key={0}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <div className="h-screen items-center justify-center inline-flex flex-col">
                  <h1 className="text-4xl font-bold text-center p-8">
                    Follow the ducks to the next page 🐣 🐣 🐣 👉🏾
                  </h1>
                  <Image
                    src={getImageUrl("pic.jpg")}
                    alt="Pepi"
                    width={400}
                    height={400}
                    className="border-black border-4 p-8"
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
                <div className="h-screen items-center justify-center inline-flex flex-col">
                  <h1 className="text-4xl font-bold text-center p-8">
                    My view sometimes 👀
                  </h1>
                  <Image
                    src={getImageUrl("pic1.jpg")}
                    alt="Pepi"
                    width={400}
                    height={400}
                    className="border-black border-4 p-8"
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
                <div className="h-screen items-center justify-center inline-flex flex-col">
                  <Image
                    src={getImageUrl("pic3.jpg")}
                    alt="Chama"
                    width={600}
                    height={600}
                    className="border-black border-4 p-8"
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
                <div className="h-screen items-center justify-center inline-flex flex-col">
                  <Image
                    src={getImageUrl("chama.gif")}
                    alt="Chama"
                    width={600}
                    height={600}
                    className="border-black border-4 p-8"
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <div
          className={`${satisfy.className} py-2 text-center text-sm text-muted-foreground`}
        >
          Memory {current} of {count}
        </div>
      </Carousel>
    </div>
  );
}
