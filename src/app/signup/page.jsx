import Image from "next/image";
import "./signup.css";
import MainSection from "../../Components/SignUpPage/MainSection";

export default function () {
  return (
    <div className="h-screen bg-boardingDark flex">
      <div className={"flex-1 h-full signimg flex items-center justify-center"}>
        <div
          className="w-1/2 h-1/2 relative"
          style={{ mixBlendMode: "overlay" }}
        >
          <Image
            src={"/logo.png"}
            alt="Some abstract background"
            fill={true}
            objectFit="contain"
          />
        </div>
      </div>
      <div className="flex-1">
        <MainSection />
      </div>
    </div>
  );
}
