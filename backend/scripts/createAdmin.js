import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import connectDB from '../config/db.js'

dotenv.config()
connectDB()

const createAdmin = async () => {
  try {
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@modernblog.com',
      password: 'admin123',
      role: 'admin'
    })

    console.log('✅ Admin user created:', adminUser.email)
    process.exit()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createAdmin()
