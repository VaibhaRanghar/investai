# 🤖 InvestAI - AI-Powered Stock Analysis for Indian Markets

> An intelligent AI assistant helping 150M+ Indian retail investors make informed decisions using plain language queries.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3-green)](https://langchain.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 The Problem

Over 150 million retail investors in India struggle with:

- Complex stock market dashboards requiring technical knowledge
- Need to know exact ticker symbols (RELIANCE vs RELIANCE.NS)
- No simple way to ask questions in plain language

## 💡 The Solution

InvestAI lets users ask questions in natural language:

- ❌ "What's the ticker symbol for HCL Technologies stock on NSE?"
- ✅ "What's HCL stock price?"

**InvestAI understands and responds instantly.**

## ✨ Features

- 🗣️ **Natural Language Processing**: Ask about stocks using company names, not symbols
- 📊 **Real-Time NSE Data**: Live prices from National Stock Exchange via Yahoo Finance API
- 🤖 **AI-Powered**: LangChain agents with Llama3 for intelligent query understanding
- ⚡ **Fast Responses**: < 5 second response time
- 🛡️ **Rate Limited**: Built-in protection against API abuse
- 📱 **Responsive UI**: Works seamlessly on mobile and desktop

## 🚀 Live Demo

🔗 **Coming Soon**

## 🏗️ Architecture

User Query -> Next.js 15 Frontend -> LangChain Agent (Llama3) -> Stock Symbol Mapping -> Yahoo Finance API (.NS stocks) -> Formatted Response


## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **AI**: LangChain, Llama3 (via Ollama)
- **Data**: Yahoo Finance API
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites

- Node.js 18+
- Ollama (for local LLM)

### Setup

1. **Clone the repository**
   
    ```
    git clone https://github.com/VaibhaRanghar/InvestAI.git
    cd InvestAI
    ```

2. **Install dependencies**
   
   ```
   npm install
   ```

3. **Install and run Ollama**
   
- **Install Ollama from [https://ollama.ai](https://ollama.ai)**
   ```
    ollama pull llama3.2:3b
   
    ollama serve
    ```
4. **Run development server**
   ```
    npm run dev
   ```

5. **Open http://localhost:3000**

## 🧪 Testing

Try these queries:

- "What's the price of Reliance stock?"
- "How much is TCS trading at?"
- "Show me HCLTECH current price"
- "What's Tata Motors share price?"

## 🗺️ Roadmap

- [x] Basic stock price queries
- [x] NSE data integration
- [x] Rate limiting
- [ ] Stock comparison ("Compare TCS vs Infosys")
- [ ] Historical data analysis
- [ ] Sentiment analysis from news
- [ ] Web3 integration for crypto alternatives
- [ ] User authentication & portfolio tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Vaibhav Ranghar**

- Portfolio: [portfolio-website-uzzd.vercel.app](https://portfolio-website-uzzd.vercel.app/)
- LinkedIn: [linkedin.com/in/vaibhavranghar](https://linkedin.com/in/vaibhavranghar)
- GitHub: [@VaibhaRanghar](https://github.com/VaibhaRanghar)

---

Built with ❤️ for Indian retail investors
