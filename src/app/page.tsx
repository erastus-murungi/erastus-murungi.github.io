"use client";

import * as React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";

function WelcomeMessage() {
  return (
    <div className="text-4xl">Pepi Pepi, Welcome to my playground! 🎉</div>
  );
}

function WelcomeImage() {
  return (
    <Image
      src={getImageUrl("pingu.gif")}
      alt="Pingu Pingu"
      width={400}
      height={400}
      className="border-black border-4 shadow-lg mb-8"
    />
  );
}

function WelcomeAudio() {
  return (
    <div className="inline-flex flex-row items-center justify-center">
      <audio controls className="mb-8">
        <source src={getImageUrl("pingu.m4a")} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default function Home() {
  return (
    <div className="items-center justify-center flex h-screen flex-col">
      <WelcomeImage />
      <WelcomeAudio />
      <WelcomeMessage />
    </div>
  );
}
