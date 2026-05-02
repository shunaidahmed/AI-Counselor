import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile, Language } from './types';

function getAiClient() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY');
  }
  return new GoogleGenAI({ apiKey });
}

const MODEL = 'gemini-2.0-flash';

export async function fetchHomeContents(lang: Language) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Generate a JSON response for a Pakistani student career app in ${lang}. 
    Include:
    1. 'quote': A short motivational quote (max 2 sentences) for a Pakistani student.
    2. 'fact': One surprising fact about Pakistan's job market or economy (under 30 words).
    3. 'trending': A list of 10 currently trending career fields in Pakistan in 2025-2026.
    Return ONLY valid JSON.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          quote: { type: Type.STRING },
          fact: { type: Type.STRING },
          trending: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['quote', 'fact', 'trending'],
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function generateCareerReport(profile: UserProfile, lang: Language) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `You are Rahnuma, a friendly AI career counselor specializing in Pakistani students. 
    A student has provided the following profile: ${JSON.stringify(profile)}.
    Respond in ${lang}.
    Generate a detailed career counseling report. Return JSON strictly following the schema.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          topCareers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                emoji: { type: Type.STRING },
                whyItFits: { type: Type.STRING },
                pakistanDemand: { type: Type.STRING },
                avgSalaryPKR: { type: Type.STRING },
                topCities: { type: Type.ARRAY, items: { type: Type.STRING } },
                requiredDegree: { type: Type.STRING },
                topUniversitiesPak: { type: Type.ARRAY, items: { type: Type.STRING } },
                scholarships: { type: Type.STRING },
                roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
                freelancePotential: { type: Type.STRING },
                onlineCourses: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            }
          },
          careerToAvoid: {
            type: Type.OBJECT,
            properties: { title: { type: Type.STRING }, reason: { type: Type.STRING } }
          },
          personalityInsight: { type: Type.STRING },
          motivationalMessage: { type: Type.STRING },
        },
        required: ['summary', 'topCareers', 'careerToAvoid', 'personalityInsight', 'motivationalMessage']
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function getCareerDetails(careerTitle: string, lang: Language) {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Give me detailed information about ${careerTitle} specifically for Pakistan.
    Respond in ${lang} and return JSON data using the schema.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: { type: Type.STRING },
          dailyLife: { type: Type.STRING },
          salaryRange: { type: Type.STRING },
          demandInPakistan: { type: Type.STRING },
          topEmployers: { type: Type.ARRAY, items: { type: Type.STRING } },
          requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          educationPath: { type: Type.STRING },
          topUniversities: { type: Type.ARRAY, items: { type: Type.STRING } },
          govtVsPrivate: { type: Type.STRING },
          freelanceScope: { type: Type.STRING },
          challenges: { type: Type.STRING },
          futureOutlook: { type: Type.STRING },
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function chatCounselor(history: {role: 'user'|'model', parts: {text: string}[]}[], currentMessage: string, profile: UserProfile | null, lang: Language) {
  const ai = getAiClient();
  
  const systemInstruction = `You are Rahnuma, a warm, encouraging, and knowledgeable AI career counselor for 
  Pakistani students. You understand Pakistan's education system, job market, universities, 
  scholarships, freelancing landscape, and cultural family dynamics around careers. 
  You always respond in ${lang}. Keep responses concise but helpful. 
  If the student seems confused or stressed, show empathy first. 
  Never give generic advice — always relate it to Pakistan's context.
  Student profile: ${profile ? JSON.stringify(profile) : 'No profile yet'}`;

  // Use ai.chats.create for stateful history
  const chat = ai.chats.create({
      model: MODEL,
      config: {
          systemInstruction,
      },
      history: history
  });

  const response = await chat.sendMessage({ message: currentMessage });
  return response.text || '';
}

export async function getChatSuggestions(lastResponse: string, lang: Language) {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `Based on this counselor response: "${lastResponse}".
        Suggest 3 short follow-up questions a student might ask in ${lang}.
        Return ONLY a JSON array of 3 strings.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });
    return JSON.parse(response.text || '[]');
}

export async function compareCareersAI(careerA: string, careerB: string, lang: Language) {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: `Compare ${careerA} and ${careerB} for a Pakistani student. 
        Respond in ${lang}. Return ONLY JSON matching schema.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    winner: { type: Type.STRING },
                    comparisonTable: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                aspect: { type: Type.STRING },
                                careerA: { type: Type.STRING },
                                careerB: { type: Type.STRING },
                            }
                        }
                    },
                    finalAdvice: { type: Type.STRING }
                }
            }
        }
    });
    return JSON.parse(response.text || '{}');
}
