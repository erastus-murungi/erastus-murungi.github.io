import * as React from "react";
import Image from "next/image";
import { getImageUrl } from "../lib/image-utils";
import { satisfy } from "../styles/fonts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Letter() {
  return (
    <div className={`${satisfy.className} border-blue-300 border-4 p-8`}>
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
        But for now, this is what I've come up with 💕 I hope you like It!
        <br />
        <br />
        ❤️
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex justify-center items-center bg-contain">
      <Carousel className="w-full max-w-xl">
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
            <Letter />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
