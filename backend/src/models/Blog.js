import mongoose from 'mongoose'
import slugify from 'slugify'

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/1200x630'
  },
  imagePublicId: {
    type: String
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Create slug from title before saving
blogSchema.pre('save', async function () {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    })
  }

  // Auto-generate excerpt if not provided
  if (!this.excerpt && this.content) {
    const plainText = this.content.replace(/<[^>]*>/g, '')
    this.excerpt = plainText.substring(0, 200) + '...'
  }
})

// Index for better search performance
blogSchema.index({ title: 'text', content: 'text', tags: 'text' })

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
