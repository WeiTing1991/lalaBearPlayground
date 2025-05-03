// import Image from "next/image";
import ModelViewer from "./components/Viewer";

export default function Home() {
  return (
    <div
      className=" flex items-center justify-center
			w-screen h-screen overflow-hidden
			font-[family-name:var(--font-geist-sans)]"
    >
      <div className="flex flex-col w-full h-full">
        {/* 3D canvas */}
        <div className="flex-grow">
          <ModelViewer />
          {/* <DashBoard /> */}
        </div>
      </div>
    </div>
  );
}
