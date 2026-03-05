import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import type { Emotion } from '../store/voiceStore'

interface VoiceOrbProps {
  isListening: boolean
  isSpeaking: boolean
  emotion: Emotion
  audioLevel: number
}

const emotionColors: Record<Emotion, THREE.Color> = {
  neutral: new THREE.Color('#6b7280'),
  happy: new THREE.Color('#fbbf24'),
  sad: new THREE.Color('#3b82f6'),
  angry: new THREE.Color('#ef4444'),
  excited: new THREE.Color('#f97316'),
  calm: new THREE.Color('#22d3ee')
}

const emotionIntensity: Record<Emotion, number> = {
  neutral: 0.3,
  happy: 0.5,
  sad: 0.4,
  angry: 0.6,
  excited: 0.7,
  calm: 0.2
}

export default function VoiceOrb({
  isListening,
  isSpeaking,
  emotion,
  audioLevel
}: VoiceOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)
  
  const targetColor = useMemo(() => emotionColors[emotion], [emotion])
  const targetIntensity = useMemo(() => emotionIntensity[emotion], [emotion])
  
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return

    const time = state.clock.getElapsedTime()

    // Base rotation
    meshRef.current.rotation.x = time * 0.1
    meshRef.current.rotation.y = time * 0.15

    // Audio level influence
    const levelInfluence = isListening || isSpeaking ? audioLevel * 0.3 : 0

    // Breathing animation
    const breathe = Math.sin(time * 2) * 0.05
    const scale = 1 + breathe + levelInfluence

    meshRef.current.scale.setScalar(scale)

    // Color transition
    const currentColor = materialRef.current.color
    currentColor.lerp(targetColor, 0.05)

    // Emissive intensity based on audio
    const baseEmissive = 0.3 + targetIntensity
    const audioEmissive = isListening || isSpeaking ? audioLevel * 0.4 : 0
    materialRef.current.emissiveIntensity = baseEmissive + audioEmissive
  })

  const glowColor = useMemo(() => {
    const color = emotionColors[emotion].clone()
    return color.multiplyScalar(1.5)
  }, [emotion])

  return (
    <group>
      {/* Main orb */}
      <Sphere ref={meshRef} args={[1.2, 64, 64]}>
        <meshStandardMaterial
          ref={materialRef}
          color={emotionColors[emotion]}
          metalness={0.1}
          roughness={0.2}
          emissive={emotionColors[emotion]}
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[1.5, 32, 32]}>
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Inner glow */}
      <Sphere args={[1.3, 32, 32]}>
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Ambient light ring */}
      {isListening && (
        <Sphere args={[2, 32, 32]}>
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.05}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Speaking ring */}
      {isSpeaking && (
        <Sphere args={[2.2, 32, 32]}>
          <meshBasicMaterial
            color="#22c55e"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  )
}
