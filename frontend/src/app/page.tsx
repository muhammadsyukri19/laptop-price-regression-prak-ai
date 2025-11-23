import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="text-8xl">💻</div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900">Laptop Price Predictor</h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Prediksi harga laptop menggunakan Machine Learning dengan model Linear Regression. Bandingkan spesifikasi dan dapatkan estimasi harga real-time.</p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-lg mb-2 text-slate-900">Machine Learning</h3>
              <p className="text-sm text-slate-600">Model regresi terlatih dengan dataset 1300+ laptop</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2 text-slate-900">Real-time Prediction</h3>
              <p className="text-sm text-slate-600">Prediksi instan dengan FastAPI backend</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2 text-slate-900">Data Insights</h3>
              <p className="text-sm text-slate-600">Visualisasi interaktif untuk analisis pasar</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link href="/laptop-compare" className="px-10 py-4 bg-slate-900 text-white rounded-lg text-base font-semibold shadow-sm hover:bg-slate-800 transition-colors">
              🚀 Mulai Bandingkan Laptop
            </Link>
            <Link href="/visualizations" className="px-10 py-4 border border-slate-300 text-slate-700 rounded-lg text-base font-semibold hover:border-slate-400 hover:bg-white transition-colors">
              📊 Lihat Visualisasi Data
            </Link>
          </div>

          {/* GitHub Link */}
          <div className="flex justify-center mt-6">
            <a
              href="https://github.com/muhammadsyukri19/laptop-price-regression-prak-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Tech Stack */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">Powered by</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
              <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg">Next.js 15</span>
              <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg">FastAPI</span>
              <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg">Scikit-learn</span>
              <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
