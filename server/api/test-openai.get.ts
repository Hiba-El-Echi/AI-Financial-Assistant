import OpenAI from "openai";

export default defineEventHandler(async () => {
  try {
    const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello in one sentence." }],
    });

    return {
      success: true,
      reply: response.choices[0].message.content,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
});
