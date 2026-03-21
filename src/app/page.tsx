'use client'

import { useState, useRef, useCallback } from 'react'

type StyleKey = 'anime_standard' | 'manga' | 'ghibli' | 'cyberpunk' | 'soft_cel'

interface Style {
  id: StyleKey
  name: string
  emoji: string
  prompt: string
}

const STYLES: Style[] = [
  { id: 'anime_standard', name: 'Anime', emoji: '🎌', prompt: 'anime style, high quality' },
  { id: 'manga', name: 'Manga', emoji: '📖', prompt: 'manga style, black and white' },
  { id: 'ghibli', name: 'Ghibli', emoji: '🌿', prompt: 'ghibli studio style, Hayao Miyazaki' },
  { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🌃', prompt: 'cyberpunk anime, neon lights' },
  { id: 'soft_cel', name: 'Soft', emoji: '🌸', prompt: 'soft cel shading, pastel colors' },
]

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<StyleKey>('anime_standard')
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [credits] = useState(3)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }
    setSelectedFile(file)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)
    setResultImage(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleGenerate = async () => {
    if (!selectedFile || credits <= 0) return

    setIsGenerating(true)
    setStatusText('Uploading your photo...')
    setError(null)

    try {
      const base64 = previewUrl!
      setStatusText('AI is creating your anime avatar...')
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          style: selectedStyle,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Generation failed')
      }

      setStatusText('Done! 🎉')
      setResultImage(data.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-center py-10 px-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent mb-2">
          ✨ Anime Avatar
        </h1>
        <p className="text-gray-500 text-lg">Transform your photo into stunning anime style</p>
      </header>

      <div className="max-w-xl mx-auto px-4 pb-12">
        {/* Credits Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center text-amber-800 text-sm mb-4">
          🎁 You have <span className="font-bold">{credits}</span> free credits
        </div>

        {/* Upload Zone */}
        <div
          className="upload-zone mb-6"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-xl object-contain" />
          ) : (
            <>
              <div className="text-5xl mb-3">📸</div>
              <p className="text-gray-600">Click or drag your photo here</p>
              <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP • Max 10MB</p>
            </>
          )}
        </div>

        {/* Style Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Choose your anime style</h3>
          <div className="grid grid-cols-5 gap-2">
            {STYLES.map((style) => (
              <div
                key={style.id}
                className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <span className="text-2xl">{style.emoji}</span>
                <div className="text-xs font-medium mt-1">{style.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {resultImage && (
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm mb-4">
            <img src={resultImage} alt="Result" className="rounded-xl mb-4 max-w-full" />
            <a
              href={resultImage}
              download="anime-avatar.png"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              ⬇️ Download Avatar
            </a>
            <button
              onClick={() => {
                setResultImage(null)
                setSelectedFile(null)
                setPreviewUrl(null)
              }}
              className="block w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
            >
              🔄 Create Another
            </button>
          </div>
        )}

        {/* Generating Status */}
        {isGenerating && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm mb-4">
            <div className="spinner mb-4"></div>
            <p className="text-gray-600">{statusText}</p>
          </div>
        )}

        {/* Generate Button */}
        {!resultImage && !isGenerating && (
          <button
            className="btn-gradient"
            onClick={handleGenerate}
            disabled={!selectedFile || credits <= 0}
          >
            {credits > 0 ? '🎨 Generate Anime Avatar' : 'No credits remaining'}
          </button>
        )}

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-8">
          © 2026 Anime Avatar · Made with ✨ AI
        </footer>
      </div>
    </main>
  )
}
