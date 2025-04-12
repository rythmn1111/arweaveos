import MedicalRecordsApp from "@/apps/medical_records/medical_records_app";
import React from "react";
import TestingApp from "@/apps/testingapp/testingapp";
// import TestingApp1 from "@/apps/temp/temp";
// import AOMessenger from "@/apps/temp/temp";
import AOVoiceRecorder from "@/apps/temp/temp";
import NotesApp from "@/apps/temp/temp2";
import DetailsApp from "@/apps/details/details_app";
import DeployApp from "@/apps/deploy/deploy_app";

export interface AppDetails {
    id: number;
  tempId: number;
    name: string;
  icon: string;
  multipleWindowsAllowed: boolean;
  shortWindow: boolean;
  isHidden: boolean;
  appCode: React.ComponentType<{ id: number }>;
}

export interface AppCollection {
  [appKey: number]: Omit<AppDetails, "id">;  // Exclude `id` here
}

// Registry without `id` - it will be added dynamically
export const apps: AppCollection = {
  // 1: {
  //   tempId:1,
  //   name: "Annon Voices",
  //   icon: "/report_upload.svg",
  //   multipleWindowsAllowed: true,
  //   shortWindow: false,
  //   isHidden: false,
  //   appCode: TestingApp
  // },
  2: {
    tempId:2,
    name: "Annon Voices",
    icon: "/eye.svg",
    multipleWindowsAllowed: true,
    shortWindow: false,
    isHidden: false,
    appCode: AOVoiceRecorder
  },
  3: {
    tempId:3,
    name: "AO Notes",
    icon: "/notes.svg",
    multipleWindowsAllowed: true,
    shortWindow: false,
    isHidden: false,
    appCode: NotesApp
  },
  4: {
    tempId: 4,
    name: "details.txt",
    icon: "/aoicon.png",
    multipleWindowsAllowed: false,
    shortWindow: false,
    isHidden: false,
    appCode: DetailsApp
  },
  5: {
    tempId: 5,
    name: "deploy.txt",
    icon: "/deployao.png", // You'll need to add this icon to your public folder
    multipleWindowsAllowed: false,
    shortWindow: false,
    isHidden: false,
    appCode: DeployApp
  }
};
