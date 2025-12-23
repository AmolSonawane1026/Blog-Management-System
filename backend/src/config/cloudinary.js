import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'blog-images',
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },
        { quality: 'auto' }
      ]
    })

    return {
      url: result.secure_url,
      publicId: result.public_id
    }
  } catch (error) {
    throw new Error('Image upload failed')
  }
}

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Cloudinary deletion error:', error)
  }
}

export default cloudinary
