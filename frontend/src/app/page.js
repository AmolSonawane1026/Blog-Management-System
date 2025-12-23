'use client'

import Link from 'next/link'
import { BookOpen, Users, TrendingUp, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">ModernBlog</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover insightful articles, expert opinions, and inspiring stories from our community of writers. Join us on a journey of knowledge and creativity.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/blogs">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center space-x-2">
                  <span>Explore Blogs</span>
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            {[
              { label: 'Articles Published', value: '500+' },
              { label: 'Active Readers', value: '10K+' },
              { label: 'Expert Writers', value: '50+' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Why Choose ModernBlog?</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Experience the best blogging platform with powerful features designed for both writers and readers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Quality Content</h3>
              <p className="text-gray-600 leading-relaxed">
                Expertly crafted articles covering various topics to keep you informed and inspired every day.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Community Driven</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a vibrant community of readers and writers sharing knowledge and experiences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Fresh Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Stay updated with the latest trends and insights published regularly by our expert writers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Reading?</h2>
          <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of readers who trust ModernBlog for quality content and insightful articles.
          </p>
          <Link href="/blogs">
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-all shadow-xl inline-flex items-center space-x-2">
              <span>Browse All Blogs</span>
              <ArrowRight size={20} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
