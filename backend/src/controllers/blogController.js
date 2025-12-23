import Blog from '../models/Blog.js'
import cloudinary from '../config/cloudinary.js'
import mongoose from 'mongoose'

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search, personal } = req.query

    let query = {}

    // Personal blogs for dashboard
    if (personal === 'true' && req.user) {
      query.author = req.user.id
      
      // If searching for personal blogs, we can show all statuses unless one is specified
      if (status) {
        query.status = status
      }
    } else {
      // Public view - only published blogs
      query.status = 'published'
      
      if (category) {
        query.category = category
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Blog.countDocuments(query)

    res.status(200).json({
      success: true,
      count: blogs.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      blogs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get current user's blogs
// @route   GET /api/blogs/me/all
// @access  Private
export const getMyBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, email } = req.query
    
    let query = {}
    
    // If email is provided, use it to find the user (as per user request)
    // Otherwise use req.user.id from the token
    if (email) {
      const user = await mongoose.model('User').findOne({ email })
      if (!user) {
        return res.status(200).json({ success: true, count: 0, blogs: [] })
      }
      query.author = user._id
    } else if (req.user) {
      query.author = req.user.id
    } else {
      return res.status(401).json({ success: false, message: 'Not authorized' })
    }

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Blog.countDocuments(query)

    res.status(200).json({
      success: true,
      count: blogs.length,
      total: count,
      blogs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name email avatar')

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      })
    }

    blog.views += 1
    await blog.save()

    res.status(200).json({
      success: true,
      blog
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private (Admin/Editor)
export const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, image, status } = req.body

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      category,
      tags,
      image,
      status,
      author: req.user.id
    })

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    })
  } catch (error) {
    console.error('Create blog error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create blog'
    })
  }
}

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Admin/Editor)
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      })
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      })
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Admin/Editor)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      })
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      })
    }

    // Delete image from Cloudinary if exists
    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId)
      } catch (err) {
        console.error('Cloudinary delete error:', err)
      }
    }

    await blog.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Upload blog image
// @route   POST /api/blogs/upload-image
// @access  Private
export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      })
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    const dataURI = `data:${req.file.mimetype};base64,${b64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'blog-images',
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    })

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed'
    })
  }
}

// @desc    Get uploaded images from Cloudinary
// @route   GET /api/blogs/images
// @access  Private
export const getCloudinaryImages = async (req, res) => {
  try {
    const { next_cursor } = req.query;

    // Handle "null" or "undefined" string from frontend
    const cursor = (next_cursor === 'null' || next_cursor === 'undefined') ? undefined : next_cursor;

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'blog-images/',
      max_results: 100,
      next_cursor: cursor,
      direction: 'desc'
    });

    res.status(200).json({
      success: true,
      images: result.resources.map(img => ({
        url: img.secure_url,
        public_id: img.public_id,
        created_at: img.created_at
      })),
      next_cursor: result.next_cursor
    })
  } catch (error) {
    console.error('Fetch images error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch images'
    })
  }
}

// @desc    Delete image from Cloudinary
// @route   DELETE /api/blogs/images/:public_id
// @access  Private
export const deleteCloudinaryImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      })
    }

    // Decode explicitly because params might be URL-encoded (e.g. blog-images/xyz)
    const decodedPublicId = decodeURIComponent(public_id);

    const result = await cloudinary.uploader.destroy(decodedPublicId);

    if (result.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary')
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    })
  } catch (error) {
    console.error('Delete image error:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image'
    })
  }
}

// @desc    Get blog stats
// @route   GET /api/blogs/admin/stats
// @access  Private
export const getBlogStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments({ author: req.user.id })
    const publishedBlogs = await Blog.countDocuments({
      author: req.user.id,
      status: 'published'
    })
    const draftBlogs = await Blog.countDocuments({
      author: req.user.id,
      status: 'draft'
    })

    const totalViews = await Blog.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ])

    res.status(200).json({
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalViews: totalViews[0]?.total || 0
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
