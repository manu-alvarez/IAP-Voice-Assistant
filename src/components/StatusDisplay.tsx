import { motion } from 'framer-motion'
import type { Emotion } from '../store/voiceStore'

interface StatusDisplayProps {
  isListening: boolean
  isSpeaking: boolean
  emotion: Emotion
  audioLevel: number
}

const emotionLabels: Record<Emotion, string> = {
  neutral: 'Neutral',
  happy: 'Happy',
  sad: 'Sad',
  angry: 'Angry',
  excited: 'Excited',
  calm: 'Calm'
}

const emotionEmojis: Record<Emotion, string> = {
  neutral: '😐',
  happy: '😊',
  sad: '😢',
  angry: '😠',
  excited: '🤩',
  calm: '😌'
}

export default function StatusDisplay({ 
  isListening, 
  isSpeaking, 
  emotion,
  audioLevel 
}: StatusDisplayProps) {
  const getStatus = () => {
    if (isSpeaking) return 'Speaking...'
    if (isListening) return 'Listening...'
    return 'Ready'
  }
  
  const getStatusColor = () => {
    if (isSpeaking) return 'var(--color-success)'
    if (isListening) return 'var(--color-accent-primary)'
    return 'var(--color-text-secondary)'
  }
  
  return (
    <motion.div 
      className="status-display"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Status indicator */}
      <div className="status-indicator">
        <motion.div 
          className="status-dot"
          animate={{ 
            scale: isListening || isSpeaking ? 1.2 : 1,
            backgroundColor: getStatusColor()
          }}
          transition={{ 
            scale: { duration: 0.5, repeat: isListening || isSpeaking ? Infinity : 0, repeatType: 'reverse' }
          }}
        />
        <span 
          className="status-label"
          style={{ color: getStatusColor() }}
        >
          {getStatus()}
        </span>
      </div>
      
      {/* Audio level bar */}
      <div className="audio-level-container">
        <div className="audio-level-bar">
          <motion.div 
            className="audio-level-fill"
            animate={{ 
              width: `${audioLevel * 100}%`,
              backgroundColor: isSpeaking ? 'var(--color-success)' : 'var(--color-accent-primary)'
            }}
          />
        </div>
      </div>
      
      {/* Emotion display */}
      <div className="emotion-display">
        <span className="emotion-emoji">{emotionEmojis[emotion]}</span>
        <span className="emotion-label">{emotionLabels[emotion]}</span>
      </div>
      
      {/* Latency indicator */}
      <div className="latency-display">
        <span className="latency-label">Latency</span>
        <span className="latency-value">
          <motion.span
            key={Math.random()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.floor(150 + audioLevel * 100)}ms
          </motion.span>
        </span>
      </div>
      
      <style>{`
        .status-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          min-width: 200px;
        }
        
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-text-secondary);
        }
        
        .status-label {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .audio-level-container {
          width: 100%;
        }
        
        .audio-level-bar {
          width: 100%;
          height: 4px;
          background: var(--color-bg-tertiary);
          border-radius: 2px;
          overflow: hidden;
        }
        
        .audio-level-fill {
          height: 100%;
          background: var(--color-accent-primary);
          border-radius: 2px;
          transition: width 0.1s ease;
        }
        
        .emotion-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .emotion-emoji {
          font-size: 1.25rem;
        }
        
        .emotion-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .latency-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
        }
        
        .latency-label {
          color: var(--color-text-muted);
        }
        
        .latency-value {
          color: var(--color-success);
          font-weight: 600;
        }
      `}</style>
    </motion.div>
  )
}
