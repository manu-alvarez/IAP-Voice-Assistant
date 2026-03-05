import { create } from 'zustand'
import { chatWithGroq, type Message } from '../services/groqService'
import { searchWithTavily, type SearchResult } from '../services/tavilyService'
import { getVoiceAssistant, VoiceAssistant } from '../services/voiceService'
import { getConfig, isConfigured, saveConfig } from '../services/configService'

export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'calm'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: SearchResult[]
  isSearching?: boolean
}

interface OrbState {
  isConnected: boolean
  isListening: boolean
  isSpeaking: boolean
  emotion: Emotion
  audioLevel: number
  latency: number
}

interface ChatState {
  messages: ChatMessage[]
  inputText: string
  isLoading: boolean
  useWebSearch: boolean
  searchResults: SearchResult[]
}

interface OrbActions {
  connect: () => Promise<void>
  disconnect: () => void
  startListening: () => void
  stopListening: () => void
  setEmotion: (emotion: Emotion) => void
  setAudioLevel: (level: number) => void
  setLatency: (latency: number) => void
  setIsSpeaking: (speaking: boolean) => void
}

interface ChatActions {
  setInputText: (text: string) => void
  sendMessage: () => Promise<void>
  clearChat: () => void
  toggleWebSearch: () => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
}

type VoiceStore = OrbState & ChatState & OrbActions & ChatActions & {
  voiceAssistant: VoiceAssistant | null
}

export const useVoiceStore = create<VoiceStore>((set, get) => ({
  // Orb State
  isConnected: false,
  isListening: false,
  isSpeaking: false,
  emotion: 'neutral',
  audioLevel: 0,
  latency: 0,

  // Chat State
  messages: [],
  inputText: '',
  isLoading: false,
  useWebSearch: getConfig().useWebSearch && getConfig().tavilyApiKey.trim().length > 0,
  searchResults: [],

  // Voice Assistant
  voiceAssistant: null,

  // Orb Actions
  connect: async () => {
    try {
      set({ isLoading: true })

      // Check if API is configured
      if (!isConfigured()) {
        set({ isLoading: false })
        alert('Primero debes configurar tu API key de Groq. Haz clic en el botón "Cambiar LLM y Motor de Búsqueda" para configurar.')
        return
      }

      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (err) {
        console.error('Microphone permission denied:', err)
        set({ isLoading: false })
        alert('Se necesita permiso de micrófono para usar el asistente de voz. Por favor, permite el acceso al micrófono en tu navegador.')
        return
      }

      // Initialize voice assistant
      const voiceAssistant = getVoiceAssistant({
        onSpeechStart: () => {
          set({ isListening: true, emotion: 'excited' })
        },
        onSpeechEnd: () => {
          set({ isListening: false, emotion: 'neutral' })
        },
        onTranscript: async (text) => {
          set({ inputText: text })
          // Auto-send after speech
          setTimeout(() => {
            get().sendMessage()
          }, 500)
        },
        onError: (error) => {
          console.error('Voice error:', error)
          set({ emotion: 'sad' })
        }
      })

      // Load voices
      window.speechSynthesis.getVoices()

      set({
        voiceAssistant,
        isConnected: true,
        isLoading: false,
        latency: Math.floor(Math.random() * 50) + 150
      })
    } catch (error) {
      set({
        isConnected: false,
        isLoading: false
      })
    }
  },

  disconnect: () => {
    const { voiceAssistant } = get()
    voiceAssistant?.stopSpeaking()
    
    set({
      isConnected: false,
      isListening: false,
      isSpeaking: false,
      voiceAssistant: null
    })
  },

  startListening: async () => {
    const { isConnected, voiceAssistant } = get()
    if (!isConnected || !voiceAssistant) return

    await voiceAssistant.startListening()
    set({ isListening: true, emotion: 'excited' })
  },

  stopListening: () => {
    const { voiceAssistant } = get()
    voiceAssistant?.stopListening()
    set({ isListening: false, emotion: 'neutral' })
  },

  setEmotion: (emotion) => set({ emotion }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  setLatency: (latency) => set({ latency }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),

  // Chat Actions
  setInputText: (inputText) => set({ inputText }),

  sendMessage: async () => {
    const { inputText, messages, useWebSearch, voiceAssistant } = get()

    if (!inputText.trim() || get().isLoading) return

    // Save the text before clearing
    const textToSend = inputText.trim()

    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      role: 'user',
      content: textToSend
    }

    set({
      inputText: '',
      isLoading: true,
      messages: [...messages, { ...userMessage, id: Date.now().toString(), timestamp: new Date() }]
    })

    try {
      let context = ''
      let searchResults: SearchResult[] = []

      // Web search if enabled
      if (useWebSearch) {
        set({ 
          messages: [...get().messages, {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '🔍 Buscando información actualizada...',
            timestamp: new Date(),
            isSearching: true
          }]
        })

        try {
          const searchResponse = await searchWithTavily(textToSend, 5)
          searchResults = searchResponse.results
          context = searchResponse.answer 
            ? `Información actual encontrada: ${searchResponse.answer}\n\nFuentes:\n${searchResults.map((r, i) => `[${i + 1}] ${r.title}: ${r.content}`).join('\n\n')}`
            : searchResults.length > 0 
              ? `Resultados de búsqueda:\n${searchResults.map((r, i) => `[${i + 1}] ${r.title}: ${r.content}`).join('\n\n')}`
              : ''
        } catch (err) {
          console.error('Search error:', err)
          context = ''
        }

        // Remove searching message
        set({
          messages: get().messages.filter(m => !m.isSearching)
        })
      }

      // Build conversation history
      const conversationHistory: Message[] = messages
        .slice(-10)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

      // Add context if available
      if (context) {
        conversationHistory.unshift({
          role: 'system',
          content: `Usa la siguiente información actualizada para responder de forma útil y concisa:\n\n${context}`
        })
      }

      // Get response from Groq
      const response = await chatWithGroq(conversationHistory)

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        sources: searchResults
      }

      set({
        messages: [...get().messages, assistantMessage],
        isLoading: false,
        searchResults
      })

      // Speak response if connected
      if (voiceAssistant && get().isConnected) {
        set({ isSpeaking: true, emotion: 'happy' })
        voiceAssistant.speak(response, () => {
          set({ isSpeaking: false, emotion: 'neutral' })
        })
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'No pude procesar tu solicitud'}`,
        timestamp: new Date()
      }

      set({
        messages: [...get().messages, errorMessage],
        isLoading: false
      })
    }
  },

  clearChat: () => set({ messages: [], searchResults: [] }),

  toggleWebSearch: () => {
    const newValue = !get().useWebSearch;
    saveConfig({ useWebSearch: newValue });
    set({ useWebSearch: newValue });
  },

  addMessage: (message) => {
    set({
      messages: [...get().messages, { ...message, id: Date.now().toString(), timestamp: new Date() }]
    })
  }
}))
