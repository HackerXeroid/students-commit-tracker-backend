// geminiService.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run(prompt) {
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = await response.text();
  // console.log(response);
  return text;
}

export { run };
