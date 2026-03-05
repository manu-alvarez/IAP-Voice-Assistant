import { getConfig } from './configService';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function chatWithGroq(messages: Message[], overrideApiKey?: string): Promise<string> {
  const config = getConfig();
  const apiKey = overrideApiKey || config.groqApiKey;
  const model = config.groqModel;

  if (!apiKey) {
    throw new Error('API key de Groq no configurada. Por favor, configúrala en el panel de configuración.');
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente útil y amigable. Responde de forma concisa pero informativa.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en Groq API');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No pude generar una respuesta';
  } catch (error) {
    console.error('Groq error:', error);
    throw error;
  }
}
