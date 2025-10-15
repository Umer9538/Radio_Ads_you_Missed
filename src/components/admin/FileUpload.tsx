'use client'

import { useState, useRef, ChangeEvent, DragEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiX, FiFile, FiImage, FiMusic, FiCheck } from 'react-icons/fi'

interface FileUploadProps {
  type: 'audio' | 'image'
  label: string
  accept?: string
  maxSize?: number // in MB
  currentFile?: string
  onUploadSuccess: (url: string, filename: string) => void
  onRemove?: () => void
  className?: string
}

export default function FileUpload({
  type,
  label,
  accept,
  maxSize = type === 'audio' ? 50 : 5,
  currentFile,
  onUploadSuccess,
  onRemove,
  className = '',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(currentFile || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const defaultAccept = type === 'audio'
    ? 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac,audio/m4a'
    : 'image/jpeg,image/jpg,image/png,image/webp,image/gif'

  const handleFileSelect = async (file: File) => {
    setError(null)

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    const acceptTypes = (accept || defaultAccept).split(',')
    if (!acceptTypes.some(t => file.type.includes(t.trim()))) {
      setError(`Invalid file type. Please upload a ${type} file.`)
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', file)

      // Simulate upload progress (real implementation would track actual progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(`/api/upload/${type}`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadedFile(data.url)
      onUploadSuccess(data.url, data.filename)

      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload file')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    setUploadedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove?.()
  }

  const getIcon = () => {
    if (type === 'audio') return <FiMusic className="text-4xl" />
    if (type === 'image') return <FiImage className="text-4xl" />
    return <FiFile className="text-4xl" />
  }

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-white mb-2">
        {label}
      </label>

      {uploadedFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1a1f2e] rounded-xl p-6 border border-[#2a2f3e]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#00ff88]/20">
                <FiCheck className="text-2xl text-[#00ff88]" />
              </div>
              <div>
                <p className="text-white font-medium">File uploaded successfully</p>
                {type === 'image' && (
                  <div className="mt-2">
                    <img
                      src={uploadedFile}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                {type === 'audio' && (
                  <p className="text-sm text-[#94a3b8] mt-1">
                    {uploadedFile.split('/').pop()}
                  </p>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="p-2 rounded-lg bg-[#ff1b6b]/20 text-[#ff1b6b] hover:bg-[#ff1b6b]/30"
            >
              <FiX className="text-xl" />
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative bg-[#1a1f2e] rounded-xl p-8 border-2 border-dashed
            transition-all cursor-pointer
            ${isDragging
              ? 'border-[#00d4ff] bg-[#00d4ff]/10'
              : 'border-[#2a2f3e] hover:border-[#00d4ff]/50'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept || defaultAccept}
            onChange={handleInputChange}
            className="hidden"
          />

          <AnimatePresence>
            {uploading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FiUpload className="text-3xl text-[#00d4ff]" />
                    </motion.div>
                  </div>
                </div>
                <p className="text-white font-medium mb-2">Uploading...</p>
                <div className="w-full bg-[#2a2f3e] rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88]"
                  />
                </div>
                <p className="text-sm text-[#94a3b8] mt-2">{uploadProgress}%</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#00d4ff]/20 flex items-center justify-center text-[#00d4ff]">
                    {getIcon()}
                  </div>
                </div>
                <p className="text-white font-medium mb-2">
                  {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-[#94a3b8]">
                  {type === 'audio'
                    ? 'MP3, WAV, OGG, AAC, M4A (max 50MB)'
                    : 'JPEG, PNG, WebP, GIF (max 5MB)'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 rounded-lg bg-[#ff1b6b]/20 border border-[#ff1b6b]/50"
        >
          <p className="text-sm text-[#ff1b6b]">{error}</p>
        </motion.div>
      )}
    </div>
  )
}
