import { motion } from 'framer-motion'

interface ControlPanelProps {
  onClose: () => void
  isConnected: boolean
  isListening: boolean
  onConnect: () => void
  onMicToggle: () => void
}

export default function ControlPanel({ 
  onClose, 
  isConnected, 
  isListening,
  onConnect,
  onMicToggle 
}: ControlPanelProps) {
  return (
    <motion.div 
      className="control-panel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="control-panel"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="control-panel-header">
          <h2 className="control-panel-title">Voice Settings</h2>
          <button className="control-panel-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="control-group">
          <label className="control-label">Connection</label>
          <button 
            className={`control-button ${isConnected ? 'danger' : ''}`}
            onClick={onConnect}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
        
        <div className="control-group">
          <label className="control-label">Microphone</label>
          <button 
            className={`control-button ${isListening ? 'secondary' : ''}`}
            onClick={onMicToggle}
            disabled={!isConnected}
          >
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>
        
        <div className="control-group">
          <label className="control-label">Voice Settings</label>
          <div className="control-toggle">
            <span className="control-toggle-label">Echo Cancellation</span>
            <div className="toggle-switch active" />
          </div>
        </div>
        
        <div className="control-group">
          <div className="control-toggle">
            <span className="control-toggle-label">Noise Suppression</span>
            <div className="toggle-switch active" />
          </div>
        </div>
        
        <div className="control-group">
          <div className="control-toggle">
            <span className="control-toggle-label">Emotion Detection</span>
            <div className="toggle-switch active" />
          </div>
        </div>
        
        <div className="control-group">
          <label className="control-label">Keyboard Shortcuts</label>
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--color-text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div><kbd style={{ 
              background: 'var(--glass-bg)',
              padding: '2px 6px',
              borderRadius: '4px',
              marginRight: '8px'
            }}>Space</kbd> Push to talk</div>
            <div><kbd style={{ 
              background: 'var(--glass-bg)',
              padding: '2px 6px',
              borderRadius: '4px',
              marginRight: '8px'
            }}>C</kbd> Connect/Disconnect</div>
            <div><kbd style={{ 
              background: 'var(--glass-bg)',
              padding: '2px 6px',
              borderRadius: '4px',
              marginRight: '8px'
            }}>H</kbd> Toggle help</div>
            <div><kbd style={{ 
              background: 'var(--glass-bg)',
              padding: '2px 6px',
              borderRadius: '4px',
              marginRight: '8px'
            }}>Esc</kbd> Close panel</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
