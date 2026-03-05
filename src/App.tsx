import { useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import VoiceOrb from './components/VoiceOrb'
import AudioVisualizer from './components/AudioVisualizer'
import StatusDisplay from './components/StatusDisplay'
import ChatPanel from './components/ChatPanel'
import LLMSelector from './components/LLMSelector'
import { useVoiceStore } from './store/voiceStore'
import './App.css'

function App() {
  const {
    isConnected,
    isListening,
    isSpeaking,
    emotion,
    audioLevel,
    connect,
    disconnect,
    startListening,
    stopListening,
  } = useVoiceStore()

  const [showLLMSelector, setShowLLMSelector] = useState(false)

  const handleConnect = useCallback(async () => {
    if (isConnected) {
      disconnect()
    } else {
      await connect()
    }
  }, [isConnected, connect, disconnect])

  const handleMouseDown = useCallback(() => {
    if (isConnected && !isListening) {
      startListening()
    }
  }, [isConnected, isListening, startListening])

  const handleMouseUp = useCallback(() => {
    if (isListening) {
      stopListening()
    }
  }, [isListening, stopListening])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (isConnected && !isListening) {
      startListening()
    }
  }, [isConnected, isListening, startListening])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    if (isListening) {
      stopListening()
    }
  }, [isListening, stopListening])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && isConnected) {
        e.preventDefault()
        if (!isListening) startListening()
      }
      if (e.code === 'KeyC') {
        handleConnect()
      }
      if (e.code === 'Escape') {
        setShowLLMSelector(false)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isConnected && isListening) {
        e.preventDefault()
        stopListening()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleConnect, isConnected, isListening, startListening, stopListening])

  return (
    <div className="app-container aurora-bg">
      <div className="bg-gradient-animated spatial-glow" />

      <div className="ambient-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -500],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              borderRadius: '50%',
              background: `rgba(139, 92, 246, ${Math.random() * 0.5})`,
              filter: 'blur(2px)',
            }}
          />
        ))}
      </div>

      <div className="main-content">
        <motion.header
          className="app-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="app-title text-glow">
            IAP Voice Assistant - Sistema MultiAgéntico con Asistente de Voz
          </h1>
        </motion.header>

        <div className="orb-section">
          <AnimatePresence mode="wait">
            {!isConnected ? (
              <motion.div
                key="disconnected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="connection-prompt"
              >
                <div className="voice-orb" onClick={handleConnect}>
                  <div className="voice-orb-rings">
                    <div className="voice-orb-ring" />
                    <div className="voice-orb-ring" />
                    <div className="voice-orb-ring" />
                  </div>
                </div>
                <p className="status-text">Click para conectar</p>
              </motion.div>
            ) : (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="orb-container"
              >
                <div className="orb-3d">
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <VoiceOrb
                      isListening={isListening}
                      isSpeaking={isSpeaking}
                      emotion={emotion}
                      audioLevel={audioLevel}
                    />
                    <OrbitControls enableZoom={false} enablePan={false} />
                  </Canvas>
                </div>

                <StatusDisplay
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  emotion={emotion}
                  audioLevel={audioLevel}
                />

                <AudioVisualizer
                  isActive={isListening || isSpeaking}
                  audioLevel={audioLevel}
                />

                <motion.button
                  className="push-to-talk-btn"
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={isListening ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                  <span>
                    {isListening ? 'Escuchando...' : 'Mantén pulsado para hablar'}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        className="llm-selector-btn"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => setShowLLMSelector(!showLLMSelector)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span>Cambiar LLM y Motor de Búsqueda</span>
      </motion.button>

      <ChatPanel />
      <LLMSelector isOpen={showLLMSelector} onClose={() => setShowLLMSelector(false)} />
    </div>
  )
}

export default App
