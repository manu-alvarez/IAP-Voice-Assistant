import { getConfig } from './configService';

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  answer?: string;
}

export async function searchWithTavily(query: string, maxResults = 5, overrideApiKey?: string): Promise<SearchResponse> {
  const config = getConfig();
  const apiKey = overrideApiKey || config.tavilyApiKey;

  if (!apiKey) {
    throw new Error('API key de Tavily no configurada. Por favor, configúrala en el panel de configuración.');
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
        include_answer: true,
        include_raw_content: false,
        search_depth: 'basic'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en Tavily API');
    }

    const data = await response.json();
    return {
      query: data.query,
      results: data.results || [],
      answer: data.answer
    };
  } catch (error) {
    console.error('Tavily error:', error);
    throw error;
  }
}

export async function getWebContext(query: string): Promise<string> {
  try {
    const searchResults = await searchWithTavily(query, 3);

    // Format search results for LLM context
    const context = searchResults.results
      .map((r, i) => `[${i + 1}] ${r.title}: ${r.content}`)
      .join('\n\n');

    return searchResults.answer
      ? `Respuesta web: ${searchResults.answer}\n\nFuentes:\n${context}`
      : `Información encontrada:\n${context}`;
  } catch (error) {
    console.error('Error getting web context:', error);
    return '';
  }
}
