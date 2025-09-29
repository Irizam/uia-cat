import { type FC, useState } from 'react';
import NumberInput from './NumberInput';
import AccordionSection from './AccordionSection';

// Controller Panel Component Props (Interface remains the same)
interface ControllerProps {
  // Model Props
  modelScale: number[];
  setModelScale: (scale: number[]) => void;
  modelRotation: number[];
  setModelRotation: (rotation: number[]) => void;
  modelPosition: number[];
  setModelPosition: (position: number[]) => void;
  // Camera Props
  cameraPosition: number[];
  setCameraPosition: (pos: number[]) => void;
  cameraFov: number;
  setCameraFov: (fov: number) => void;
}

const ModelController: FC<ControllerProps> = ({
  modelScale, setModelScale,
  modelRotation, setModelRotation,
  modelPosition, setModelPosition,
  cameraPosition, setCameraPosition,
  cameraFov, setCameraFov
}) => {

  const [openSection, setOpenSection] = useState<'model' | 'camera' | null>('model');

  const updateArray = (index: number, value: number, array: number[], setter: (arr: number[]) => void) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  return (
    <div className="p-2 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-xs sm:max-w-md mx-auto space-y-4 border border-gray-700 mb-20">
      {/* MODEL TRANSFORMS GROUP */}
      <AccordionSection title="Model Transform Controls" isOpen={openSection === 'model'} onClick={() => setOpenSection(openSection === 'model' ? null : 'model')}>
        <div className="space-y-4 pt-2">
          {/* Position Control */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Position (X, Y, Z)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['X', 'Y', 'Z'].map((axis, index) => (
                <NumberInput key={axis} label={`Pos ${axis}`} value={modelPosition[index]} onChange={(e) => updateArray(index, parseFloat(e.target.value), modelPosition, setModelPosition)} step={0.5} />
              ))}
            </div>
          </div>
          {/* Rotation Control */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Rotation (Radians)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['X', 'Y', 'Z'].map((axis, index) => (
                <NumberInput key={axis} label={`Rot ${axis}`} value={modelRotation[index]} onChange={(e) => updateArray(index, parseFloat(e.target.value), modelRotation, setModelRotation)} step={0.1} />
              ))}
            </div>
          </div>
          {/* Scale Control */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Scale (Factor)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['X', 'Y', 'Z'].map((axis, index) => (
                <NumberInput key={axis} label={`Scale ${axis}`} value={modelScale[index]} onChange={(e) => updateArray(index, parseFloat(e.target.value), modelScale, setModelScale)} step={1} />
              ))}
            </div>
          </div>
        </div>
      </AccordionSection>
      {/* CAMERA CONTROLS GROUP */}
      <AccordionSection title="Camera Controls" isOpen={openSection === 'camera'} onClick={() => setOpenSection(openSection === 'camera' ? null : 'camera')}>
        <div className="space-y-4 pt-2">
          {/* Camera Position Control */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Camera Position (X, Y, Z)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['X', 'Y', 'Z'].map((axis, index) => (
                <NumberInput key={`cam${axis}`} label={`Cam ${axis}`} value={cameraPosition[index]} onChange={(e) => updateArray(index, parseFloat(e.target.value), cameraPosition, setCameraPosition)} step={1} />
              ))}
            </div>
          </div>
          {/* Camera FOV Control */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Camera FOV (Degrees)</h3>
            <div className="flex justify-start">
              <NumberInput label={`FOV`} value={cameraFov} onChange={(e) => setCameraFov(parseFloat(e.target.value))} step={5} />
            </div>
          </div>
        </div>
      </AccordionSection>
    </div>
  );
};

export default ModelController;
