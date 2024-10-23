import { Lora, Satisfy } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
});
const satisfy = Satisfy({
  weight: "400",
  subsets: ["latin"],
});

export { lora, satisfy };
