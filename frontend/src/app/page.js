'use client'

import Link from 'next/link'
import { BookOpen, Users, TrendingUp, ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[1000px] pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 blur-[120px] rounded-full" />
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-200/30 blur-[120px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-sm mb-6 animate-bounce">
              <Sparkles size={16} />
              <span>The Future of Blogging is Here</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[0.9]">
              Craft Your Story on <span className="gradient-text">ModernBlog</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              A premium space where high-level insights meet world-class design. Join a community of forward-thinkers and master storytellers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/blogs">
                <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 px-10 rounded-2xl text-lg transition-all shadow-2xl hover:shadow-slate-200 hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto">
                  <span>Start Reading</span>
                  <ArrowRight size={22} />
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-white hover:bg-slate-50 text-slate-900 font-bold py-5 px-10 rounded-2xl text-lg transition-all border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 w-full sm:w-auto">
                  Write a Story
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Total Articles', value: '1.2K+', icon: BookOpen },
              { label: 'Active Readers', value: '50K+', icon: Users },
              { label: 'Top Authors', value: '150+', icon: Sparkles },
              { label: 'Global Reach', value: '180+', icon: Globe },
            ].map((stat, index) => (
              <div key={index} className="glass-effect p-6 rounded-2xl text-center border border-white/50 shadow-sm transition-transform hover:scale-105">
                <div className="flex justify-center mb-3">
                  <stat.icon className="text-indigo-600" size={24} />
                </div>
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Designed for the <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Modern Era</span>
              </h2>
              <p className="text-lg text-slate-600">
                Forget cluttered interfaces. We've built a distraction-free environment that puts your content front and center.
              </p>
            </div>
            <Link href="/about" className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-4 transition-all pb-2 border-b-2 border-indigo-100">
              Discover Our Vision <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="premium-card p-10 group">
              <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-colors duration-500">
                <Zap className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Built on Next.js 16, our platform delivers your content at the speed of thought. Zero lag, pure performance.
              </p>
            </div>

            <div className="premium-card p-10 group md:translate-y-8">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-600 transition-colors duration-500">
                <Shield className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900">Secure by Design</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Your intellectual property is protected with state-of-the-art security and reliable content management.
              </p>
            </div>

            <div className="premium-card p-10 group">
              <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-pink-600 transition-colors duration-500">
                <TrendingUp className="h-8 w-8 text-pink-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900">Reach Millions</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Our advanced SEO tools ensure your stories find the audience they deserve, automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto gradient-bg rounded-[2rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Your Journey Starts Now</h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of creators who are already shaping the global conversation on ModernBlog.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/signup">
                <button className="bg-white text-indigo-600 hover:bg-indigo-50 font-black py-5 px-12 rounded-2xl text-lg transition-all shadow-xl hover:-translate-y-1 w-full sm:w-auto">
                  Create Account
                </button>
              </Link>
              <Link href="/blogs">
                <button className="bg-indigo-500/20 hover:bg-indigo-500/30 text-white font-black py-5 px-12 rounded-2xl text-lg transition-all border border-white/20 backdrop-blur-sm w-full sm:w-auto">
                  Explore Content
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
