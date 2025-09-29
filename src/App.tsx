import { Suspense, useState, useEffect, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import BaseModel from './components/BaseModel';
import Loader from './components/Loader';
const LazyModelController = lazy(() => import('./components/ModelController'));
import CameraUpdater from './components/CameraUpdater';

export default function App() {
  const USER_MODEL_URL = '/models/oiiaioooooiai_cat.glb';
  const MOBILE_WIDTH_THRESHOLD = 640;
  // --- State for Model/Camera ---
  const [modelScale, setModelScale] = useState<number[]>([10, 10, 10]);
  const [modelRotation, setModelRotation] = useState<number[]>([0, 1.4, 0]);
  const [modelPosition, setModelPosition] = useState<number[]>([-0.5, -1, 0]);
  const [cameraPosition, setCameraPosition] = useState<number[]>([7, 2, 5]);
  const getInitialFov = () => {
    return (typeof window !== 'undefined' && window.innerWidth < MOBILE_WIDTH_THRESHOLD) ? 70 : 50;
  };
  const [cameraFov, setCameraFov] = useState<number>(getInitialFov());
  useEffect(() => {
    const handleResize = () => {
      const newFov = getInitialFov();
      if (newFov !== cameraFov) setCameraFov(newFov);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [cameraFov]);
  // --- State for Controller Visibility ---
  const [isControllerOpen, setIsControllerOpen] = useState(false);
  return (
    // Main container (now covering the full viewport)
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-start font-sans relative overflow-hidden">
      {/* 3D Canvas Container - Takes up full space */}
      <div className="w-full h-full relative">
        <Canvas dpr={[1, 2]}>
          <Suspense fallback={<Loader />}>
            <CameraUpdater position={cameraPosition} fov={cameraFov} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
            <Environment preset="forest" files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_sunset_02_1k.hdr" />
            <BaseModel modelPath={USER_MODEL_URL} scale={modelScale} rotation={modelRotation} position={modelPosition} />
            <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={1} maxDistance={15} />
          </Suspense>
        </Canvas>
      </div>
      {/* FLOATING TRIGGER BUTTON */}
      <button onClick={() => setIsControllerOpen(!isControllerOpen)} className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-indigo-600 shadow-2xl hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300/50 hover:cursor-pointer" aria-label="Toggle Model Controls">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {/* Icon changes based on state: Cog for closed, X for open */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isControllerOpen ? "M6 18L18 6M6 6l12 12" : "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.331.83 2.805 2.378a1.724 1.724 0 00.043 2.267c1.5.834 1.5 3.137 0 3.97a1.724 1.724 0 00-.043 2.267c.526 1.548-1.264 3.321-2.805 2.379a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.331-.83-2.805-2.378a1.724 1.724 0 00-.043-2.267c-1.5-.834-1.5-3.137 0-3.97a1.724 1.724 0 00.043-2.267c-.526-1.548 1.264-3.321 2.805-2.379a1.724 1.724 0 002.573-1.066z"} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isControllerOpen ? "" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z"} />
        </svg>
      </button>
      {/* FLOATING MODEL CONTROLLER PANEL */}
      {isControllerOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none md:items-center">
          <div className="w-full pointer-events-auto transition-transform duration-300 transform translate-y-0 md:translate-y-0" style={{ fontFamily: 'Overpass, sans-serif' }}>
            <LazyModelController modelScale={modelScale} setModelScale={setModelScale} modelRotation={modelRotation} setModelRotation={setModelRotation} modelPosition={modelPosition} setModelPosition={setModelPosition} cameraPosition={cameraPosition} setCameraPosition={setCameraPosition} cameraFov={cameraFov} setCameraFov={setCameraFov} />
          </div>
        </div>
      )}
    </div>
  );
}