import OpenAI from "openai";
const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { question, dataSummary } = body;

  const prompt = `
You are a financial assistant. Use this data: ${dataSummary || "no data"}.
Answer this user question clearly and accurately: ${question}.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful financial assistant. Answer in detail with up-to-date finance information.",
      },
      { role: "user", content: question },
    ],
  });

  return { reply: response.choices[0].message.content };
});
