import { type FC, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Component to manually update camera position and FOV when state changes
const CameraUpdater: FC<{ position: number[], fov: number }> = ({ position, fov }) => {
    const { camera } = useThree();
    useEffect(() => { // Update position whenever the position array changes
        camera.position.set(position[0], position[1], position[2]);
    }, [position, camera]); // The OrbitControls component automatically uses the camera's position
    useEffect(() => { // Update FOV whenever the fov number changes
        if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
            const perspectiveCamera = camera as THREE.PerspectiveCamera;
            perspectiveCamera.fov = fov;
            perspectiveCamera.updateProjectionMatrix();
        }
    }, [fov, camera]);
    return null; // This component renders nothing in the scene
};

export default CameraUpdater;