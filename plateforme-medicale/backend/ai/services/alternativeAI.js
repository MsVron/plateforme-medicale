const axios = require('axios');

class AlternativeAIService {
  constructor() {
    this.services = [
      {
        name: 'Together AI',
        url: 'https://api.together.xyz/v1/chat/completions',
        model: 'meta-llama/Llama-2-7b-chat-hf',
        free: true,
        apiKey: process.env.TOGETHER_API_KEY
      },
      {
        name: 'Groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'llama3-8b-8192',
        free: true,
        apiKey: process.env.GROQ_API_KEY
      },
      {
        name: 'Perplexity',
        url: 'https://api.perplexity.ai/chat/completions',
        model: 'llama-3.1-sonar-small-128k-online',
        free: true,
        apiKey: process.env.PERPLEXITY_API_KEY
      }
    ];
  }

  async generateMedicalResponse(message, context = {}) {
    const systemPrompt = this.buildMedicalSystemPrompt();
    const userPrompt = this.buildUserPrompt(message, context);

    for (const service of this.services) {
      if (!service.apiKey) continue;

      try {
        console.log(`Trying ${service.name}...`);
        
        const response = await axios.post(service.url, {
          model: service.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 500,
          temperature: 0.3
        }, {
          headers: {
            'Authorization': `Bearer ${service.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });

        if (response.data?.choices?.[0]?.message?.content) {
          console.log(`✅ ${service.name} responded successfully`);
          return this.formatMedicalResponse(response.data.choices[0].message.content);
        }
      } catch (error) {
        console.warn(`${service.name} failed:`, error.message);
        continue;
      }
    }

    throw new Error('All alternative AI services failed');
  }

  buildMedicalSystemPrompt() {
    return `Tu es un assistant médical intelligent qui aide les patients à comprendre leurs symptômes.

RÈGLES IMPORTANTES:
- Réponds toujours en français
- Fournis des informations médicales précises et utiles
- Recommande toujours de consulter un professionnel de santé
- Utilise un langage clair et empathique
- Structure tes réponses avec des sections
- Inclus des conseils de soins immédiats quand approprié
- Mentionne les signaux d'alarme nécessitant une consultation urgente

STRUCTURE DE RÉPONSE:
- Commence par reconnaître leur préoccupation
- Analyse des symptômes
- Suggestions de soins immédiats
- Signaux d'alarme pour consultation urgente
- Recommandation de suivi approprié

CONNAISSANCES MÉDICALES:
- Utilise des informations basées sur des preuves
- Considère d'abord les conditions communes
- Mentionne quand les symptômes pourraient indiquer des conditions sérieuses
- Fournis des conseils pratiques et réalisables

Rappel: Tu fournis des informations, pas de diagnostic. Insiste toujours sur l'importance d'une évaluation médicale professionnelle.`;
  }

  buildUserPrompt(message, context) {
    let prompt = message;
    
    if (context.painLevel) {
      prompt += ` (Intensité douleur: ${context.painLevel}/10)`;
    }
    
    if (context.duration) {
      prompt += ` (Durée: ${context.duration.value} ${context.duration.unit})`;
    }
    
    if (context.bodyParts && context.bodyParts.length > 0) {
      const parts = context.bodyParts.map(bp => bp.french).join(', ');
      prompt += ` (Localisation: ${parts})`;
    }
    
    return prompt;
  }

  formatMedicalResponse(response) {
    let formatted = response.trim();
    
    // Remove potentially harmful advice
    const harmfulPatterns = [
      /take \d+.*pills?/gi,
      /inject.*yourself/gi,
      /perform.*surgery/gi
    ];
    
    harmfulPatterns.forEach(pattern => {
      formatted = formatted.replace(pattern, '[Consultez un professionnel de santé]');
    });
    
    // Add medical disclaimer if not present
    if (!formatted.includes('professionnel de santé') && !formatted.includes('médecin')) {
      formatted += '\n\n⚠️ Rappel: Cette information est à titre éducatif. Consultez un professionnel de santé pour un diagnostic et traitement appropriés.';
    }
    
    return formatted;
  }

  // Get free API keys instructions
  static getSetupInstructions() {
    return {
      'Together AI': {
        url: 'https://api.together.xyz',
        steps: [
          '1. Sign up at https://api.together.xyz',
          '2. Get free $25 credit',
          '3. Copy API key to TOGETHER_API_KEY in .env'
        ],
        freeCredits: '$25'
      },
      'Groq': {
        url: 'https://console.groq.com',
        steps: [
          '1. Sign up at https://console.groq.com',
          '2. Get free API access',
          '3. Copy API key to GROQ_API_KEY in .env'
        ],
        freeCredits: 'Free tier available'
      },
      'Perplexity': {
        url: 'https://www.perplexity.ai/settings/api',
        steps: [
          '1. Sign up at https://www.perplexity.ai',
          '2. Go to API settings',
          '3. Copy API key to PERPLEXITY_API_KEY in .env'
        ],
        freeCredits: 'Free tier available'
      }
    };
  }
}

module.exports = new AlternativeAIService(); 