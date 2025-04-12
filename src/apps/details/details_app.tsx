import React from "react";
import WindowStructure from "@/components/window";

interface DetailsAppProps {
  id: number;
}

export default function DetailsApp({ id }: DetailsAppProps) {
  return (
    <WindowStructure windowId={id}>
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">✨ arweave OS</h1>
        <p className="text-lg mb-6 italic">Your personal space for using any and every arweave apps! All at one place.</p>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2">🚀 What is arweave OS?</h2>
          <p>
            arweaveOS is a decentralized operating system built on the Arweave blockchain, 
            providing a familiar interface for accessing and using decentralized applications.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">🔍 Proof of Concept</h2>
          <p className="mb-2">
            This OS demonstrates how two different types of apps can coexist:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <span className="font-medium">🔄 Shared Elements App:</span> Interacts with the shared elements of AO, 
              accessible by multiple users
            </li>
            <li>
              <span className="font-medium">🔐 Personal Data App:</span> Contains information only accessible by the owner, 
              ensuring privacy and security
            </li>
          </ul>
        </div>
        
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
          <h2 className="text-xl font-semibold mb-2">🎯 Our Goal</h2>
          <p>
            The goal of arweaveOS is to create a platform where developers can easily deploy their 
            applications and users can comfortably access and use them all from one place.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">💡 Key Features</h2>
          <ul className="grid grid-cols-2 gap-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> Decentralized Storage
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> Familiar UI/UX
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> App Ecosystem
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> Permaweb Integration
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> Data Ownership
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> Easy Deployment
            </li>
          </ul>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500 font-mono border-t pt-4">
          <p>Built with 💙 for the Arweave ecosystem by HOPE</p>
          <p className="mt-1">v0.1.0 | © 2025 arweaveOS</p>
        </div>
      </div>
    </WindowStructure>
  );
}
