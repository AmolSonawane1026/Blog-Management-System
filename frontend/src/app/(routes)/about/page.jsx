'use client'

import Link from 'next/link'
import { BookOpen, Target, Users, Heart, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
     

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-center mb-6">About ModernBlog</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            We are passionate about sharing knowledge, inspiring creativity, and building a community of learners and thinkers.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                At ModernBlog, our mission is to provide a platform where ideas flourish and knowledge is shared freely. We believe in the power of words to inspire, educate, and transform lives.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you're here to learn something new, share your expertise, or simply enjoy great content, we're committed to delivering quality articles that matter.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-2">Our Vision</h3>
                <p className="text-gray-600">To be the leading platform for quality content.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-2">Community</h3>
                <p className="text-gray-600">Building connections through shared knowledge.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <Heart className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-2">Passion</h3>
                <p className="text-gray-600">Driven by love for writing and learning.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-2">Quality</h3>
                <p className="text-gray-600">Committed to excellence in every article.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Our Story</h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              ModernBlog was founded in 2025 with a simple idea: to create a space where writers and readers can connect over meaningful content. What started as a small project has grown into a thriving community of knowledge seekers and sharers.
            </p>
            <p>
              Today, we publish hundreds of articles covering technology, lifestyle, business, and more. Our contributors include industry experts, passionate writers, and thought leaders who share their insights to help our readers grow.
            </p>
            <p>
              We're proud to have built a platform that values quality over quantity, authenticity over trends, and community over competition. Thank you for being part of our journey.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 ModernBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
