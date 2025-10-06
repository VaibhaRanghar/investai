// app/page.tsx (LANDING PAGE)
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">InvestAI 🤖</h1>
          <p className="text-xl text-gray-600 mb-4">
            Your AI-powered stock analysis assistant for Indian markets
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Ask questions in plain language. Get real-time NSE/BSE data
            instantly.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div>
              <p className="text-3xl font-bold text-indigo-600">150M+</p>
              <p className="text-sm text-gray-600">Indian Investors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">1000+</p>
              <p className="text-sm text-gray-600">NSE/BSE Stocks</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600">Real-time</p>
              <p className="text-sm text-gray-600">Market Data</p>
            </div>
          </div>

          {/* Query Form */}
          {/* <StockQueryForm /> */}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* <FeatureCard
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
          /> */}
        </div>
      </section>
    </div>
  );
}
