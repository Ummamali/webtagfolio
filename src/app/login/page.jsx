import Image from "next/image";
import "./login.css";

export default function LogIn() {
  return (
    <div className="h-screen bg-boardingDark">
      <div className={"w-1/2 h-full loginimg flex items-center justify-center"}>
        <div
          className="w-1/2 h-1/2 relative"
          style={{ mixBlendMode: "luminosity" }}
        >
          <Image
            src={"/logo.png"}
            alt="Some abstract background"
            fill={true}
            objectFit="contain"
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}
