import Image from "next/image";
import { getImageUrl } from "../lib/image-utils";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Image
        src={getImageUrl("IMG_0018.jpg")}
        alt="Pepi"
        width={500}
        height={500}
        className="border-black border-4 p-8"
      />
    </div>
  );
}
