import React from "react";
import WindowStructure from "@/components/window";

interface DeployAppProps {
  id: number;
}

export default function DeployApp({ id }: DeployAppProps) {
  return (
    <WindowStructure windowId={id}>
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold mb-4 text-green-600">🚀 Deploying apps on arweave os</h1>
        <p className="text-lg mb-6 italic">Just 4 simple steps to get your app running on the permaweb!</p>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2">📱 Step 1</h2>
          <p className="text-base">
            Create any next.js (for now) application with ao functionality.
          </p>
        </div>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold mb-2">🔄 Step 2</h2>
          <p className="text-base mb-2">
            Fork this repo and put your file in apps folder.
          </p>
          <p className="flex items-center">
            <span className="mr-2">📂</span>
            <a 
              href="https://github.com/rythmn1111/arweaveos" 
              className="text-blue-500 underline hover:text-blue-700"
              target="_blank" 
              rel="noopener noreferrer"
            >
              github.com/rythmn1111/arweaveos
            </a>
          </p>
        </div>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <h2 className="text-xl font-semibold mb-2">⚙️ Step 3</h2>
          <p className="text-base">
            Simply put your app logo and default function in <span className="font-mono bg-gray-200 px-1 rounded">kernel/kernelregistry.tsx</span>
          </p>
        </div>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-2">🎉 Step 4</h2>
          <p className="text-base">
            Enjoy as your app automatically comes in the OS! Also put a pull request if you want to see your app on the main OS.
          </p>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold flex items-center mb-3">
            <span className="mr-2">💡</span> Tips for Success
          </h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Ensure your app follows the required interface structure</li>
            <li>Test thoroughly before submitting a pull request</li>
            <li>Include clear documentation for your app</li>
            <li>Design for the arweaveOS environment and ecosystem</li>
          </ul>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 font-mono border-t pt-4">
          <p>🌐 Join the decentralized application ecosystem today!</p>
          <p className="mt-1">Build • Deploy • Preserve</p>
        </div>
      </div>
    </WindowStructure>
  );
}
