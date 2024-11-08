"use client";

import * as React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function WelcomeTitle() {
  return <div className="text-4xl mb-4">Pepi Pepi 💕</div>;
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

function WelcomeMessage() {
  return (
    <p className="mb-8">
      Welcome to your playground! 🎉
      <br />I hope you enjoy your stay! 🏡
    </p>
  );
}

function Navigation() {
  return (
    <div className="flex flex-row space-x-4">
      <Button>
        <Link href="/memories" className="text-2xl">
          Memories
        </Link>
      </Button>
      <Button>
        <Link href="/sudoku" className="text-2xl">
          Sudoku
        </Link>
      </Button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="items-center justify-center flex h-screen flex-col">
      <WelcomeTitle />
      <WelcomeMessage />
      <WelcomeImage />
      <WelcomeAudio />
      <Navigation />
    </div>
  );
}
