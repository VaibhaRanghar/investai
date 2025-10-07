import StockQueryForm from "./StockQueryForm";
import FeatureCard from "./FeatureCard";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Title */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-800 to-purple-600 bg-clip-text text-transparent mb-2">
              InvestAI 🤖
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <p className="text-2xl text-gray-700 font-medium mb-4">
            Your AI-powered stock analysis assistant for Indian markets
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Ask questions in plain language. Get real-time NSE/BSE data
            instantly.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-16">
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">150M+</p>
              <p className="text-sm text-gray-600 font-medium">
                Indian Investors
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">1000+</p>
              <p className="text-sm text-gray-600 font-medium">
                NSE/BSE Stocks
              </p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-indigo-600">Real-time</p>
              <p className="text-sm text-gray-600 font-medium">Market Data</p>
            </div>
          </div>

          {/* Query Form */}
          <StockQueryForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
          How It Works
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          InvestAI combines artificial intelligence with real-time market data
          to give you instant stock insights
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon="💬"
            title="Ask in Plain Language"
            description="No need to know ticker symbols. Just ask 'What's Reliance stock price?'"
          />
          <FeatureCard
            icon="🧠"
            title="AI-Powered Analysis"
            description="LangChain agents understand your query and fetch accurate data"
          />
          <FeatureCard
            icon="📈"
            title="Real-Time NSE Data"
            description="Get current prices, changes, and market insights instantly"
          />
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Built With Modern Tech
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Next.js 15",
              "TypeScript",
              "LangChain",
              "Groq API",
              "Tailwind CSS",
              "Yahoo Finance",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-white rounded-lg shadow-md text-gray-700 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of Indian investors making smarter decisions with AI
          </p>
          <a
            href="#top"
            className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Try InvestAI Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>
          Built with ❤️ by{" "}
          <a
            href="https://portfolio-website-uzzd.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-medium hover:underline"
          >
            Vaibhav Ranghar
          </a>
        </p>
        <p className="text-sm mt-2">
          <a
            href="https://github.com/VaibhaRanghar/InvestAI"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600"
          >
            GitHub
          </a>
          {" • "}
          <a
            href="https://linkedin.com/in/vaibhavranghar"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}
