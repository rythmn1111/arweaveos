import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import WindowStructure from "@/components/window";
import Desktop, {Playground} from "@/components/desktop";
import dynamic from 'next/dynamic';
import AppDirectory from "@/app_directory/app_directory";
import AppList from "@/apps/apps";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store' 
import { openWindow, closeWindow, toggleWindow } from "@/redux/windowOpen/windowOpen";
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import MedicalRecordsApp from "@/apps/medical_records/medical_records_app";
import {WindowDeliver, A, TaskBarDeliver} from "@/kernel/kernel";
import {AppCollection, AppDetails, apps}from "@/kernel/kernelregistery";
import TestingApp from "@/apps/testingapp/testingapp";
import React, { useState, useRef } from "react";
import { addProcess } from "@/redux/kernel/kernel";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

const TaskBar = dynamic(() => import('@/components/desktop').then(mod => mod.TaskBar), {
  ssr: false
});

export default function Home() {
  const isOpen = useSelector((state: RootState) => state.windowOpen.value)
  const dispatch = useDispatch()
  const arr = [1, 2, 3, 4, 5]
  const [iconPosition, setIconPosition] = useState({ x: 20, y: 20 });
  const [deployIconPosition, setDeployIconPosition] = useState({ x: 20, y: 140 }); // New position for deploy icon
  const nodeRef = React.useRef(null);
  const deployNodeRef = React.useRef(null); // New ref for deploy icon
  const isDraggingRef = useRef(false);
  const deployIsDraggingRef = useRef(false); // New dragging ref for deploy icon
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const deployDragStartPosRef = useRef({ x: 0, y: 0 }); // New drag start pos ref for deploy icon
  
  const processes = useSelector((state: RootState) => state.process.process);
  const hasOpenWindows = processes.length > 0;
  
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = false;
    dragStartPosRef.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleClick = (e: React.MouseEvent) => {
    // Only open window if it wasn't a drag
    if (!isDraggingRef.current) {
      dispatch(addProcess({ appKey: 4 }));
    }
  };
  
  const handleDragStart = () => {
    isDraggingRef.current = false;
  };
  
  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    // Consider it a drag if moved more than 5px
    const moveX = Math.abs(data.x - iconPosition.x);
    const moveY = Math.abs(data.y - iconPosition.y);
    if (moveX > 5 || moveY > 5) {
      isDraggingRef.current = true;
    }
  };
  
  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    setIconPosition({ x: data.x, y: data.y });
    
    // If moved less than 5px, consider it a click not a drag
    const moveX = Math.abs(data.x - iconPosition.x);
    const moveY = Math.abs(data.y - iconPosition.y);
    if (moveX < 5 && moveY < 5) {
      isDraggingRef.current = false;
    }
    
    // Wait to determine if it's a click or end of drag
    setTimeout(() => {
      if (!isDraggingRef.current) {
        // It's a click, not handled separately
      }
    }, 10);
  };
  
  // Event handlers for deploy icon
  const handleDeployMouseDown = (e: React.MouseEvent) => {
    deployIsDraggingRef.current = false;
    deployDragStartPosRef.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleDeployClick = (e: React.MouseEvent) => {
    if (!deployIsDraggingRef.current) {
      dispatch(addProcess({ appKey: 5 })); // Launch deploy app (app key 5)
    }
  };
  
  const handleDeployDragStart = () => {
    deployIsDraggingRef.current = false;
  };
  
  const handleDeployDrag = (e: DraggableEvent, data: DraggableData) => {
    const moveX = Math.abs(data.x - deployIconPosition.x);
    const moveY = Math.abs(data.y - deployIconPosition.y);
    if (moveX > 5 || moveY > 5) {
      deployIsDraggingRef.current = true;
    }
  };
  
  const handleDeployDragStop = (e: DraggableEvent, data: DraggableData) => {
    setDeployIconPosition({ x: data.x, y: data.y });
    
    const moveX = Math.abs(data.x - deployIconPosition.x);
    const moveY = Math.abs(data.y - deployIconPosition.y);
    if (moveX < 5 && moveY < 5) {
      deployIsDraggingRef.current = false;
    }
    
    setTimeout(() => {
      if (!deployIsDraggingRef.current) {
        // It's a click, not handled separately
      }
    }, 10);
  };
  
  return (  
    <Desktop>
      <Playground>        
        {/* Details icon */}
        <Draggable
          nodeRef={nodeRef}
          bounds="parent"
          defaultPosition={{ x: 20, y: 20 }}
          grid={[1, 1]}
          scale={1}
          onStart={handleDragStart}
          onDrag={handleDrag}
          onStop={handleDragStop}
        >
          <div 
            ref={nodeRef}
            className="flex flex-col items-center justify-center absolute cursor-pointer"
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            style={{ 
              touchAction: 'none',
              zIndex: hasOpenWindows ? 1 : 10 // Lower z-index when windows are open
            }}
          >
            <Image
              src="/aoicon.png" 
              alt="Application Icon"
              width={90}
              height={90}
              priority
              draggable={false}
              className="select-none"
            />
            <h1 className="text-[8px] text-white select-none">details.txt</h1>
          </div>
        </Draggable>
        
        {/* Deploy icon */}
        <Draggable
          nodeRef={deployNodeRef}
          bounds="parent"
          defaultPosition={{ x: 20, y: 140 }}
          grid={[1, 1]}
          scale={1}
          onStart={handleDeployDragStart}
          onDrag={handleDeployDrag}
          onStop={handleDeployDragStop}
        >
          <div 
            ref={deployNodeRef}
            className="flex flex-col items-center justify-center absolute cursor-pointer"
            onMouseDown={handleDeployMouseDown}
            onClick={handleDeployClick}
            style={{ 
              touchAction: 'none',
              zIndex: hasOpenWindows ? 1 : 10 // Lower z-index when windows are open
            }}
          >
            <Image
              src="/deployao.png" 
              alt="Deploy Icon"
              width={90}
              height={90}
              priority
              draggable={false}
              className="select-none"
            />
            <h1 className="text-[8px] text-white select-none">deploy.txt</h1>
          </div>
        </Draggable>
        
        <WindowDeliver></WindowDeliver>
        {/* <TestingApp></TestingApp> */}
      </Playground>
      <TaskBar>
        <AppDirectory />
        <AppList></AppList>
        <TaskBarDeliver></TaskBarDeliver>
      </TaskBar>
    </Desktop>
  );
}


