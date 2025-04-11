import MedicalRecordsApp from "@/apps/medical_records/medical_records_app";
import React from "react";
import TestingApp from "@/apps/testingapp/testingapp";
// import TestingApp1 from "@/apps/temp/temp";
// import AOMessenger from "@/apps/temp/temp";
import AOVoiceRecorder from "@/apps/temp/temp";
import NotesApp from "@/apps/temp/temp2";
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
  }
};
