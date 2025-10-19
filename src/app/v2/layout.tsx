import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "InvestAI V2",
  description: "Free Investment Tips to get some edge",
};

export default function V2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                  <span className="text-4xl">🤖</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  InvestAI
                </h1>
              </div>
              <nav className="flex items-center space-x-6">
                <Link
                  href="/v2"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/v2/compare"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Compare
                </Link>
                <Link
                  href="/v2/news"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  News
                </Link>
              </nav>
            </div>
          </div>
        </header>
        {children}
      </div>
    </>
  );
}
