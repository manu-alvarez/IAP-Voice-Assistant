// Configuración de APIs - Se guarda en localStorage para persistencia

export interface APIConfig {
  groqApiKey: string;
  groqModel: string;
  tavilyApiKey: string;
  useWebSearch: boolean;
}

export interface ProviderOption {
  id: string;
  name: string;
  type: 'llm' | 'search';
  models?: string[];
  defaultModel?: string;
  apiKeyUrl: string;
  description: string;
}

// Configuración por defecto
const DEFAULT_CONFIG: APIConfig = {
  groqApiKey: '',
  groqModel: 'llama-3.1-70b-versatile',
  tavilyApiKey: '',
  useWebSearch: true
};

// Proveedores disponibles
export const LLM_PROVIDERS: ProviderOption[] = [
  {
    id: 'groq',
    name: 'Groq',
    type: 'llm',
    models: [
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'llama-3.2-90b-vision-preview',
      'llama-3.2-11b-vision-preview',
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
    ],
    defaultModel: 'llama-3.1-70b-versatile',
    apiKeyUrl: 'https://console.groq.com/keys',
    description: 'LLM ultrarrápido con Llama 3.1'
  }
];

export const SEARCH_PROVIDERS: ProviderOption[] = [
  {
    id: 'tavily',
    name: 'Tavily',
    type: 'search',
    defaultModel: 'search',
    apiKeyUrl: 'https://app.tavily.com/home',
    description: 'Búsqueda web en tiempo real optimizada para IA'
  }
];

const CONFIG_KEY = 'orbsearch_api_config';

// Obtener configuración guardada
export function getConfig(): APIConfig {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
  return DEFAULT_CONFIG;
}

// Guardar configuración
export function saveConfig(config: Partial<APIConfig>): APIConfig {
  try {
    const current = getConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving config:', error);
    return DEFAULT_CONFIG;
  }
}

// Verificar si la configuración está completa
export function isConfigured(): boolean {
  const config = getConfig();
  return config.groqApiKey.trim().length > 0;
}

// Validar API key de Groq
export async function validateGroqKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.ok) {
      return { valid: true };
    }

    const error = await response.json();
    return { 
      valid: false, 
      error: error.message || 'API key inválida' 
    };
  } catch (err) {
    return { 
      valid: false, 
      error: 'No se pudo conectar con Groq API' 
    };
  }
}

// Validar API key de Tavily
export async function validateTavilyKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: 'test',
        max_results: 1
      })
    });

    if (response.ok) {
      return { valid: true };
    }

    const error = await response.json();
    return { 
      valid: false, 
      error: error.message || 'API key inválida' 
    };
  } catch (err) {
    return { 
      valid: false, 
      error: 'No se pudo conectar con Tavily API' 
    };
  }
}

// Resetear configuración
export function resetConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}
