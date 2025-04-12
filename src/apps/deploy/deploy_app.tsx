import React from "react";
import WindowStructure from "@/components/window";

interface DeployAppProps {
  id: number;
}

export default function DeployApp({ id }: DeployAppProps) {
  return (
    <WindowStructure windowId={id}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-3">Deploying apps on arweave os is just 4 simple steps</h2>
        <br />
        <br />
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">Step 1</h3>
          <p>Create any next.js (for now) application with ao functionality.</p>
        </div>
        <br />
        <br />
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">Step 2</h3>
          <p>Fork this repo and put your file in apps folder.</p>
          <p className="mt-1 text-cyan-500">
            <a 
              href="https://github.com/rythmn1111/arweaveos" 
              className=" text-blue-500 underline hover:text-blue-700"
              target="_blank" 
              rel="noopener noreferrer"
            >
              /repo link/
            </a>
          </p>
        </div>
        <br />
        <br />
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">Step 3</h3>
          <p>Simply put your app logo and default function in kernel/kernelregistry.tsx</p>
        </div>
        <br />
        <br />
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">Step 4</h3>
          <p>Enjoy as your app automatically comes in os, also put a pull request if you want to see your app on the main os.</p>
        </div>
        
      </div>
    </WindowStructure>
  );
}
