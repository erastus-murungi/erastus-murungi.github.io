import { Lora, Satisfy, Indie_Flower } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
});
const satisfy = Satisfy({
  weight: "400",
  subsets: ["latin"],
});

const indie_flower = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
});

export { lora, satisfy, indie_flower };
