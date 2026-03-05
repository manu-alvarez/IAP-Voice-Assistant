import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  getConfig, 
  saveConfig, 
  validateGroqKey, 
  validateTavilyKey,
  LLM_PROVIDERS
} from '@/services/configService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import './LLMSelector.css'

interface LLMSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export default function LLMSelector({ isOpen, onClose }: LLMSelectorProps) {
  const config = getConfig()
  
  const [groqApiKey, setGroqApiKey] = useState(config.groqApiKey)
  const [groqModel, setGroqModel] = useState(config.groqModel)
  const [tavilyApiKey, setTavilyApiKey] = useState(config.tavilyApiKey)
  const [useWebSearch, setUseWebSearch] = useState(config.useWebSearch)
  
  const [validatingGroq, setValidatingGroq] = useState(false)
  const [validatingTavily, setValidatingTavily] = useState(false)
  const [groqValid, setGroqValid] = useState<boolean | null>(null)
  const [tavilyValid, setTavilyValid] = useState<boolean | null>(null)
  const [groqError, setGroqError] = useState('')
  const [tavilyError, setTavilyError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setGroqApiKey(config.groqApiKey)
      setGroqModel(config.groqModel)
      setTavilyApiKey(config.tavilyApiKey)
      setUseWebSearch(config.useWebSearch)
      setGroqValid(config.groqApiKey ? true : null)
      setTavilyValid(config.tavilyApiKey ? true : null)
    }
  }, [isOpen, config])

  const handleValidateGroq = async () => {
    if (!groqApiKey.trim()) {
      setGroqValid(false)
      setGroqError('Introduce una API key')
      return
    }

    setValidatingGroq(true)
    setGroqError('')
    
    const result = await validateGroqKey(groqApiKey.trim())
    setValidatingGroq(false)
    setGroqValid(result.valid)
    setGroqError(result.error || '')
  }

  const handleValidateTavily = async () => {
    if (!tavilyApiKey.trim()) {
      setTavilyValid(false)
      setTavilyError('Introduce una API key')
      return
    }

    setValidatingTavily(true)
    setTavilyError('')
    
    const result = await validateTavilyKey(tavilyApiKey.trim())
    setValidatingTavily(false)
    setTavilyValid(result.valid)
    setTavilyError(result.error || '')
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    saveConfig({
      groqApiKey: groqApiKey.trim(),
      groqModel,
      tavilyApiKey: tavilyApiKey.trim(),
      useWebSearch
    })
    
    setIsSaving(false)
    onClose()
  }

  const handleNewGroqKey = () => {
    window.open('https://console.groq.com/keys', '_blank')
  }

  const handleNewTavilyKey = () => {
    window.open('https://app.tavily.com/home', '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="llm-selector-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal with scale animation */}
          <motion.div
            className="llm-selector-modal"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="llm-selector-header">
              <div>
                <motion.h2 
                  className="llm-selector-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Configurar LLM y Búsqueda
                </motion.h2>
                <motion.p 
                  className="llm-selector-subtitle"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  Introduce tus API keys para comenzar
                </motion.p>
              </div>
              <motion.button 
                className="llm-selector-close"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Bento Grid Content */}
            <div className="llm-selector-content">
              <div className="bento-grid">
                {/* Groq Card - Main */}
                <motion.div
                  className="bento-card bento-card-large"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="card-icon-wrapper">
                        <div className="card-icon-groq">⚡</div>
                      </div>
                      <div>
                        <CardTitle>Groq API</CardTitle>
                        <CardDescription>Modelo: {groqModel}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="card-description">
                        Groq proporciona LLMs ultrarrápidos con latencia casi instantánea.
                      </p>

                      <div className="api-key-input">
                        <label>API Key de Groq</label>
                        <div className="input-with-button">
                          <Input
                            type="password"
                            value={groqApiKey}
                            onChange={(e) => setGroqApiKey(e.target.value)}
                            placeholder="gsk_..."
                            className={cn(
                              groqValid === false && 'input-error',
                              groqValid === true && 'input-success'
                            )}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleValidateGroq}
                            disabled={validatingGroq || !groqApiKey.trim()}
                            className="validate-btn"
                          >
                            {validatingGroq ? (
                              <span className="spinner"></span>
                            ) : groqValid === true ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                              </svg>
                            ) : groqValid === false ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                            ) : (
                              'Validar'
                            )}
                          </Button>
                        </div>
                        {groqError && <p className="error-text">{groqError}</p>}
                        {groqValid === true && (
                          <motion.p 
                            className="success-text"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            ✓ API key válida
                          </motion.p>
                        )}
                      </div>

                      <div className="model-select">
                        <label>Modelo</label>
                        <select value={groqModel} onChange={(e) => setGroqModel(e.target.value)}>
                          {LLM_PROVIDERS[0]?.models?.map((model) => (
                            <option key={model} value={model}>{model}</option>
                          ))}
                        </select>
                      </div>

                      <Button 
                        variant="secondary" 
                        onClick={handleNewGroqKey}
                        className="w-full"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Obtener API Key
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tavily Card */}
                <motion.div
                  className="bento-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="card-icon-wrapper">
                        <div className="card-icon-tavily">🔍</div>
                      </div>
                      <div>
                        <CardTitle>Tavily Search</CardTitle>
                        <CardDescription>
                          {useWebSearch ? 'Activado' : 'Desactivado'}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="toggle-row">
                        <p className="toggle-label">Búsqueda web</p>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={useWebSearch}
                            onChange={(e) => setUseWebSearch(e.target.checked)}
                          />
                          <span className={`toggle-slider ${useWebSearch ? 'active' : ''}`}></span>
                        </label>
                      </div>

                      {useWebSearch && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="api-key-input">
                            <label>API Key de Tavily</label>
                            <div className="input-with-button">
                              <Input
                                type="password"
                                value={tavilyApiKey}
                                onChange={(e) => setTavilyApiKey(e.target.value)}
                                placeholder="tvly-..."
                                className={cn(
                                  tavilyValid === false && 'input-error',
                                  tavilyValid === true && 'input-success'
                                )}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleValidateTavily}
                                disabled={validatingTavily || !tavilyApiKey.trim()}
                                className="validate-btn"
                              >
                                {validatingTavily ? (
                                  <span className="spinner"></span>
                                ) : tavilyValid === true ? (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                  </svg>
                                ) : (
                                  'Validar'
                                )}
                              </Button>
                            </div>
                            {tavilyError && <p className="error-text">{tavilyError}</p>}
                            {tavilyValid === true && (
                              <motion.p 
                                className="success-text"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                ✓ API key válida
                              </motion.p>
                            )}
                          </div>

                          <Button 
                            variant="secondary" 
                            onClick={handleNewTavilyKey}
                            className="w-full"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            Obtener API Key
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Info Card */}
                <motion.div
                  className="bento-card bento-card-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="glass-card info-card">
                    <CardContent className="info-content">
                      <div className="info-icon">💡</div>
                      <div className="info-text">
                        <p className="info-title">¿Sin API Keys?</p>
                        <p className="info-description">
                          Groq y Tavily son gratuitos para desarrollo. Consigue tus keys en segundos.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <motion.div 
              className="llm-selector-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving || !groqApiKey.trim()}
                variant="glow"
              >
                {isSaving ? 'Guardando...' : 'Guardar Configuración'}
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
