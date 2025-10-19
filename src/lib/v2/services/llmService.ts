import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";

const isDevelopment = process.env.NODE_ENV === "development";

export class LLMService {
  private static instance: LLMService;
  private llm: ChatGroq | ChatOllama;

  private constructor() {
    if (isDevelopment && process.env.OLLAMA_BASE_URL) {
      this.llm = new ChatOllama({
        baseUrl: process.env.OLLAMA_BASE_URL,
        model: "llama3.2:3b",
        temperature: 0.3,
      });
    } else {
      if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured");
      }
      this.llm = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
      });
    }
  }

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  getLLM(): ChatGroq | ChatOllama {
    return this.llm;
  }
}

export const llmService = LLMService.getInstance();
