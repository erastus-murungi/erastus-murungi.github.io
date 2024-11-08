"use client";

import * as React from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/image-utils";
import { BiMath } from "react-icons/bi";
import { GiPenguin } from "react-icons/gi";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

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
        <source src={getImageUrl("pingu.m4a")} type="audio/x-m4a" />
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
      <Link
        href="/memories"
        className={`h-12 w-48 text-4xl rounded-3xl ${buttonVariants({
          variant: "outline",
        })}`}
      >
        <GiPenguin />
        Memories
      </Link>
      <Link
        href="/sudoku"
        className={`h-12 w-48 rounded-3xl ${buttonVariants({
          variant: "outline",
        })}`}
      >
        <BiMath />
        Sudoku
      </Link>
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
