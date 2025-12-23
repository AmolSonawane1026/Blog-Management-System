import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-white text-2xl font-bold mb-4">ModernBlog</h3>
                        <p className="text-gray-400 leading-relaxed">
                            A modern blog platform where ideas come to life. Share your stories, inspire others.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><Link href="/blogs" className="hover:text-blue-400 transition-colors">Blogs</Link></li>
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                            <li><Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Want to post blogs?</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <p className="text-gray-400">Email: pro.amolsonawane@gmail.com</p>
                        <p className="text-gray-400">Phone: +91 7558379918</p>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-sm">
                    <p>&copy; 2025 ModernBlog. All rights reserved. Built with Next.js 16 & Redux Toolkit.</p>
                </div>
            </div>
        </footer>
    )
}
