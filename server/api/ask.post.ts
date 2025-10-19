import OpenAI from "openai";
const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

const MAX_RETRIES = 3; 
const RETRY_DELAY = 1000; 

async function callOpenAI(question: string, attempt = 0): Promise<string> {
  const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful financial assistant. Provide clear, professional, detailed answers to finance questions.",
        },
        { role: "user", content: question },
      ],
    });

    return response.choices[0].message.content;
  } catch (err: any) {
    if (err.status === 429 && attempt < MAX_RETRIES) {
      // Exponential backoff
      const delay = RETRY_DELAY * Math.pow(2, attempt);
      await new Promise((res) => setTimeout(res, delay));
      return callOpenAI(question, attempt + 1);
    }
    throw err;
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { question } = body;

    if (!question) {
      return { reply: null, error: "No question provided." };
    }

    const reply = await callOpenAI(question);
    return { reply };
  } catch (err: any) {
    if (err.status === 429) {
      return {
        reply: null,
        error: "Too many requests! Please wait a few seconds and try again.",
      };
    }
    return { reply: null, error: err.message || "An error occurred." };
  }
});
