"use client";

import * as REACT from "react";
import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  CameraShake,
  useAnimations,
  Stage,
} from "@react-three/drei";

import * as THREE from "three";
import DashBoard from "./DashBoard";

// Handling controls in Threejs is hard bc 3rd party components that change the camera need to know
// about controls, or else all changes are overwritten. That is the case for both <Stage and <CameraShake.
// In latest R3F controls can be set as the default so that other parts of the app may react to it.
// By setting <OrbitControls makeDefault <Stage and <CameraShake are aware of the controls being used.
// Should your own components rely on default controls, throughout the three they're available as:
//   const controls = useThree(state => state.controls)

useGLTF.preload("//20250316_lalaBearDraft.gltf");

function Model(props: REACT.PropsWithChildren) {
  const { scene, animations } = useGLTF("/20250316_lalaBearDraft.glb");
  const { actions } = useAnimations(animations, scene);
  useEffect(() => {
    // actions.Idle.play();
    scene.traverse((obj) => {
      const meshObj = obj as THREE.Mesh;
      if (meshObj.isMesh) {
        meshObj.castShadow = true;
        meshObj.receiveShadow = true;
      }
    });
  }, [actions, scene]);
  return <primitive object={scene} {...props} />;
}

interface BackgroundProps {
  imagePath: string;
}

interface BackgroundProps {
  imagePath: string;
  fitType?: "cover" | "contain" | "stretch";
}

function Background({ imagePath, fitType = "cover" }: BackgroundProps) {
  const { scene, size } = useThree();
  const texture = useLoader(THREE.TextureLoader, imagePath);

  useEffect(() => {
    if (!texture.image) return;

    const imageAspect = texture.image.width / texture.image.height;
    const canvasAspect = size.width / size.height;

    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    if (fitType === "cover") {
      // Cover: ensure image covers the entire canvas (may crop image)
      if (imageAspect > canvasAspect) {
        texture.repeat.set(canvasAspect / imageAspect, 1);
        texture.offset.set((1 - canvasAspect / imageAspect) / 2, 0);
      } else {
        texture.repeat.set(1, imageAspect / canvasAspect);
        texture.offset.set(0, (1 - imageAspect / canvasAspect) / 2);
      }
    } else if (fitType === "contain") {
      // Contain: ensure entire image is visible (may show background color)
      if (imageAspect > canvasAspect) {
        texture.repeat.set(1, imageAspect / canvasAspect);
        texture.offset.set(0, (1 - imageAspect / canvasAspect) / 2);
      } else {
        texture.repeat.set(canvasAspect / imageAspect, 1);
        texture.offset.set((1 - canvasAspect / imageAspect) / 2, 0);
      }
    } else {
      // Stretch: stretch image to fill canvas (may distort image)
      texture.repeat.set(1, 1);
      texture.offset.set(0, 0);
    }

    scene.background = texture;
  }, [texture, scene, size, fitType]);

  return null;
}

function Light() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_state) => {
    if (ref.current) {
      ref.current.rotation.x = _state.clock.elapsedTime;
    }
  });
  return (
    <group ref={ref}>
      <rectAreaLight
        width={15}
        height={100}
        position={[30, 30, -10]}
        intensity={5}
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />
    </group>
  );
}

export default function ModelViwer() {
  return (
    <Canvas shadows camera={{ fov: 50 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <Background imagePath="/temp_background.jpg" fitType="contain" />
        <Stage
          adjustCamera
          intensity={0.5}
          shadows="contact"
          environment="city"
        >
          <Model scale={0.1} />
          <Light />
        </Stage>
      </Suspense>
      <OrbitControls makeDefault />
      <CameraShake
        maxYaw={0.1} // Max amount camera can yaw in either direction
        maxPitch={0.1} // Max amount camera can pitch in either direction
        maxRoll={0.1} // Max amount camera can roll in either direction
        yawFrequency={0.1} // Frequency of the the yaw rotation
        pitchFrequency={0.1} // Frequency of the pitch rotation
        rollFrequency={0.1} // Frequency of the roll rotation
        intensity={1} // initial intensity of the shake
        decayRate={0.65} // if decay = true this is the rate at which intensity will reduce at />
      />
    </Canvas>
  );
}
