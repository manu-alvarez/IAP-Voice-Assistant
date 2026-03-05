import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface AudioVisualizerProps {
  isActive: boolean
  audioLevel: number
}

export default function AudioVisualizer({ isActive, audioLevel }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [bars] = useState(32)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    
    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)
      
      const barWidth = width / bars
      const centerY = height / 2
      
      for (let i = 0; i < bars; i++) {
        const barHeight = isActive 
          ? Math.random() * height * audioLevel * 0.8 + 5
          : 5
        
        const x = i * barWidth + barWidth / 2
        const gradient = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2)
        
        if (isActive) {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)')
          gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.9)')
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.8)')
        } else {
          gradient.addColorStop(0, 'rgba(100, 100, 120, 0.3)')
          gradient.addColorStop(0.5, 'rgba(100, 100, 120, 0.5)')
          gradient.addColorStop(1, 'rgba(100, 100, 120, 0.3)')
        }
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(
          x - barWidth / 3,
          centerY - barHeight / 2,
          barWidth / 1.5,
          barHeight,
          2
        )
        ctx.fill()
        
        // Reflection
        ctx.fillStyle = isActive 
          ? 'rgba(139, 92, 246, 0.2)'
          : 'rgba(100, 100, 120, 0.1)'
        ctx.beginPath()
        ctx.roundRect(
          x - barWidth / 3,
          centerY + barHeight / 2 + 2,
          barWidth / 1.5,
          barHeight * 0.3,
          2
        )
        ctx.fill()
      }
      
      animationId = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => cancelAnimationFrame(animationId)
  }, [bars, isActive, audioLevel])
  
  return (
    <motion.div 
      className="audio-visualizer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={80}
        className="visualizer-canvas"
      />
    </motion.div>
  )
}
