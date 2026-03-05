import type { SpeechRecognition } from '@/types/speech'

export interface VoiceConfig {
  onSpeechStart?: () => void
  onSpeechEnd?: () => void
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
}

export class VoiceAssistant {
  private recognition: SpeechRecognition | null = null
  private isListening = false
  private synth = window.speechSynthesis
  private config: VoiceConfig = {}
  private permissionGranted = false

  constructor(config: VoiceConfig = {}) {
    this.config = config
    this.initRecognition()
  }

  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      this.permissionGranted = true
      return true
    } catch {
      this.config.onError?.('Permiso de micrófono denegado')
      return false
    }
  }

  private initRecognition() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = 'es-ES'

      this.recognition.onstart = () => {
        this.isListening = true
        this.config.onSpeechStart?.()
      }

      this.recognition.onresult = (event) => {
        let finalTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result) {
            const transcript = result[0]?.transcript
            if (transcript && event.results[i].isFinal) {
              finalTranscript += transcript
            }
          }
        }
        if (finalTranscript) {
          this.config.onTranscript?.(finalTranscript)
        }
      }

      this.recognition.onend = () => {
        this.isListening = false
        this.config.onSpeechEnd?.()
      }

      this.recognition.onerror = (event) => {
        const errorMessage =
          event.error === 'not-allowed'
            ? 'Permiso de micrófono denegado'
            : event.error === 'no-speech'
              ? 'No se detectó voz'
              : event.error
        this.config.onError?.(errorMessage)
        this.isListening = false
      }
    }
  }

  async startListening(): Promise<void> {
    if (!this.recognition) {
      this.config.onError?.('Reconocimiento de voz no disponible')
      return
    }

    if (!this.permissionGranted) {
      const granted = await this.requestPermission()
      if (!granted) return
    }

    if (!this.isListening) {
      try {
        this.recognition.start()
      } catch {
        this.config.onError?.('Error al iniciar el micrófono')
      }
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
    }
  }

  isSupported(): boolean {
    return !!this.recognition
  }

  speak(text: string, onEnd?: () => void): void {
    this.synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = this.synth.getVoices()
    const spanishVoice = voices.find((v) => v.lang.includes('es'))
    if (spanishVoice) {
      utterance.voice = spanishVoice
    }

    utterance.onend = () => onEnd?.()
    utterance.onerror = () => onEnd?.()

    this.synth.speak(utterance)
  }

  stopSpeaking(): void {
    this.synth.cancel()
  }

  isSpeaking(): boolean {
    return this.synth.speaking
  }
}

let voiceAssistant: VoiceAssistant | null = null

export function getVoiceAssistant(config?: VoiceConfig): VoiceAssistant {
  if (!voiceAssistant) {
    voiceAssistant = new VoiceAssistant(config)
  }
  if (config) {
    voiceAssistant = new VoiceAssistant(config)
  }
  return voiceAssistant
}
