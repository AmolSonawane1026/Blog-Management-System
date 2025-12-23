'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Dropcursor from '@tiptap/extension-dropcursor'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2, 
  Quote, 
  Undo, 
  Redo,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Upload,
  Loader2
} from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from '@/redux/features/auth/authSlice'
import toast from 'react-hot-toast'

export default function TiptapEditor({ content, onChange }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const token = useSelector(selectCurrentToken)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog content here...',
      }),
      Dropcursor.configure({
        color: '#0ea5e9',
        width: 2,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 max-w-none',
      },
      // Handle image paste
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || [])
        const imageItem = items.find(item => item.type.indexOf('image') === 0)
        
        if (imageItem) {
          event.preventDefault()
          const file = imageItem.getAsFile()
          if (file) {
            uploadImage(file)
          }
          return true
        }
        return false
      },
      // Handle image drop
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const files = Array.from(event.dataTransfer.files)
          const imageFiles = files.filter(file => file.type.startsWith('image/'))
          
          if (imageFiles.length > 0) {
            event.preventDefault()
            imageFiles.forEach(file => uploadImage(file))
            return true
          }
        }
        return false
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])

  // Upload image to backend (Cloudinary)
  const uploadImage = async (file) => {
    if (!file) return

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        editor?.chain().focus().setImage({ src: data.url }).run()
        toast.success('Image uploaded successfully!')
      } else {
        toast.error(data.message || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // Handle file input change
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  // Open file picker
  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  // Add image from URL
  const addImageFromUrl = () => {
    const url = window.prompt('Enter image URL')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="bg-gray-50 border-b border-gray-300 p-2 h-12 animate-pulse"></div>
        <div className="min-h-[300px] p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Uploading overlay */}
      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <p className="text-gray-700 font-medium">Uploading image...</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-300 text-blue-600' : ''}`}
          type="button"
          title="Bold"
        >
          <Bold size={18} />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-300 text-blue-600' : ''}`}
          type="button"
          title="Italic"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 text-blue-600' : ''}`}
          type="button"
          title="Heading"
        >
          <Heading2 size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-300 text-blue-600' : ''}`}
          type="button"
          title="Bullet List"
        >
          <List size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-300 text-blue-600' : ''}`}
          type="button"
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-300 text-blue-600' : ''}`}
          type="button"
          title="Quote"
        >
          <Quote size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-300 text-blue-600' : ''}`}
          type="button"
          title="Code Block"
        >
          <Code size={18} />
        </button>

        <div className="border-l border-gray-300 mx-2"></div>

        <button
          onClick={addLink}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          type="button"
          title="Add Link"
        >
          <LinkIcon size={18} />
        </button>

        {/* Image Upload Button */}
        <button
          onClick={openFilePicker}
          disabled={uploading}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
          title="Upload Image"
        >
          <Upload size={18} />
        </button>

        {/* Image URL Button */}
        <button
          onClick={addImageFromUrl}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          type="button"
          title="Add Image URL"
        >
          <ImageIcon size={18} />
        </button>

        <div className="border-l border-gray-300 mx-2"></div>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
          title="Undo"
        >
          <Undo size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          type="button"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="bg-white" />

      {/* Image upload hint */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-500">
        💡 Tip: You can drag & drop images, paste from clipboard, or click the upload button
      </div>
    </div>
  )
}
