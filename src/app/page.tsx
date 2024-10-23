import Image from "next/image";
import { getImageUrl } from "../lib/image-utils";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex justify-center items-center">
      <Carousel className="w-full max-w-xl">
        <CarouselContent>
          <CarouselItem key={0}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-6">
                <div className="h-screen items-center justify-center inline-flex flex-col">
                  <h1 className="text-4xl font-bold text-center p-8">
                    Look at my Pepi Pepi ❤️ 👉🏾
                  </h1>
                  <Image
                    src={getImageUrl("pic.jpg")}
                    alt="Pepi"
                    width={500}
                    height={500}
                    className="border-black border-4 p-8"
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem key={1}>
            <div className="border-orange-300 border-4 p-8">
              <p>Chama!</p>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
