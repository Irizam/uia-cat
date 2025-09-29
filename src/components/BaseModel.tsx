import { type FC, useEffect, useState, useRef } from 'react';
import { useThree, useLoader } from '@react-three/fiber'; // Added useLoader
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
    modelPath: string;
    scale: number[];
    rotation: number[];
    position: number[];
}

const BaseModel: FC<ModelProps> = ({ modelPath, scale, rotation, position }) => {
    // --- 3D Model Setup ---
    const { scene, animations } = useGLTF(modelPath);
    const { actions, names } = useAnimations(animations, scene);
    const { controls, camera } = useThree();
    // --- Audio Setup ---
    const AUDIO_URL = '/sounds/oia.mp3';
    const listener = useRef(new THREE.AudioListener()).current;
    const soundBuffer = useLoader(THREE.AudioLoader, AUDIO_URL);
    const soundRef = useRef<THREE.PositionalAudio | null>(null);
    // --- Ref for animation state ---
    const primaryAction = useRef<THREE.AnimationAction | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (camera) camera.add(listener);
        return () => {
            if (camera) camera.remove(listener);
        }
    }, [camera, listener]);

    // Load animation and set loop
    useEffect(() => {
        if (names.length > 0) {
            primaryAction.current = actions[names[0]];
            if (primaryAction.current) {
                primaryAction.current.setLoop(THREE.LoopOnce, 1); // Play only once
                primaryAction.current.clampWhenFinished = true; // Holds on the last frame
                primaryAction.current.stop();
            }
        }
    }, [actions, names]);

    // Set the audio buffer outside of render
    useEffect(() => {
        if (soundRef.current && soundBuffer) {
            soundRef.current.setBuffer(soundBuffer);
        }
    }, [soundBuffer]); // Run when the buffer is loaded

    // Event listener to stop audio when animation finishes
    useEffect(() => {
        const action = primaryAction.current;
        if (action) {
            const onAnimationFinished = () => {
                if (soundRef.current && soundRef.current.isPlaying) {
                    soundRef.current.stop(); // Stop Audio
                }
                setIsPlaying(false); // Update state
                if (controls) (controls as any).enabled = true; // Re-enable controls
            };
            action.getMixer().addEventListener('finished', onAnimationFinished);
            return () => {
                action.getMixer().removeEventListener('finished', onAnimationFinished);
            };
        }
    }, [primaryAction.current, controls]); // Run if action or controls change

    const { gl } = useThree();

    // Handler to change cursor when mouse enters the model area
    const handlePointerOver = () => {
        gl.domElement.style.cursor = 'grab';
    };

    // Handler to reset cursor when mouse leaves the model area
    const handlePointerOut = () => {
        gl.domElement.style.cursor = 'auto';
    };

    // Handler to start animation and audio
    const handlePointerDown = (event: any) => {
        event.stopPropagation();
        if (controls) (controls as any).enabled = false;

        if (primaryAction.current && !isPlaying) {
            primaryAction.current.reset(); // Reset the animation to ensure clean start
            primaryAction.current.time = 1.0; // Set the animation time to 1.0 second to skip the initial static pose
            primaryAction.current.play(); // Start the animation
            setIsPlaying(true);
            if (soundRef.current && !soundRef.current.isPlaying) { // Start playing audio indefinitely
                soundRef.current.setLoop(true);
                soundRef.current.play();
            }
        }
    };

    // Handler to stop animation and audio
    const handlePointerUp = () => {
        if (controls) (controls as any).enabled = true;
        if (primaryAction.current && isPlaying) {
            primaryAction.current.fadeOut(0.3);
            setIsPlaying(false);
            if (soundRef.current && soundRef.current.isPlaying) { // Stop audio
                soundRef.current.stop();
            }
            setTimeout(() => {
                if (primaryAction.current) {
                    primaryAction.current.stop();
                    primaryAction.current.time = 0;
                }
            }, 300);
        }
    };

    // Handler for basic click
    const handleClick = (event: any) => {
        if (!isPlaying) {
            event.stopPropagation();
        }
    };

    const finalScale: [number, number, number] = [scale[0], scale[1], scale[2]];
    const finalPosition: [number, number, number] = [position[0], position[1] - 0.5, position[2]];
    const finalRotation: [number, number, number] = [rotation[0], rotation[1], rotation[2]];

    return (
        <primitive object={scene} scale={finalScale} position={finalPosition} rotation={finalRotation} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onClick={handleClick} >
            <positionalAudio ref={soundRef} args={[listener]} autoplay={false} />
        </primitive>
    );
};

useGLTF.preload('/models/oiiaioooooiai_cat.glb');

export default BaseModel;