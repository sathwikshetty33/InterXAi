import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function AvatarModel({ isTalking }) {
  const { scene } = useGLTF("/person.glb");
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;

    // check for "MouthOpen" or "jawOpen" morph target
    const morphDict = meshRef.current.morphTargetDictionary;
    if (!morphDict) return;

    const mouthKey =
      morphDict.MouthOpen !== undefined
        ? "MouthOpen"
        : morphDict.jawOpen !== undefined
        ? "jawOpen"
        : Object.keys(morphDict)[0]; // fallback to first morph target

    const mouthIndex = morphDict[mouthKey];
    if (mouthIndex !== undefined) {
      meshRef.current.morphTargetInfluences[mouthIndex] = isTalking
        ? Math.abs(Math.sin(Date.now() * 0.015)) * 0.8
        : 0;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={2} position={[0, -2, 0]} />;
}

export default function TalkingAvatar({ text }) {
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onstart = () => setIsTalking(true);
    utterance.onend = () => setIsTalking(false);
    window.speechSynthesis.speak(utterance);
  }, [text]);

  return (
    <div className="w-full h-80 bg-black rounded-lg overflow-hidden mb-6">
      <Canvas camera={{ position: [0, 1, 5], fov: 40 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <AvatarModel isTalking={isTalking} />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
