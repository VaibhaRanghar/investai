"use client";
import LandingPage from "@/components/LandingPage";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    console.info("\nData:", data);
    setAnswer(data.answer);
  };

  return (
    <>
      <main className="min-h-screen p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">InvestAI</h1>

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about a stock (e.g., 'RELIANCE.BSE price')"
            className="w-full p-3 border rounded mb-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ask AI
          </button>
        </form>

        {answer && (
          <div className="p-4 bg-gray-600 rounded">
            <p>{answer}</p>
          </div>
        )}
      </main>
      <LandingPage />
    </>
  );
}
