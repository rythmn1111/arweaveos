import React from "react";
import WindowStructure from "@/components/window";

interface DetailsAppProps {
  id: number;
}

export default function DetailsApp({ id }: DetailsAppProps) {
  return (
    <WindowStructure windowId={id}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">ArweaveOS Details</h2>
        <p>This is a details window for the ArweaveOS system.</p>
        <p className="mt-2">ArweaveOS provides a decentralized operating system experience on the Arweave blockchain.</p>
        <p className="mt-2">Features include:</p>
        <ul className="list-disc ml-5 mt-1">
          <li>Permanent storage on Arweave</li>
          <li>Decentralized application ecosystem</li>
          <li>Browser-based access</li>
          <li>Permission management</li>
        </ul>
      </div>
    </WindowStructure>
  );
}
