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
  { id: 'anime_standard', name: 'Anime Standard', emoji: '🎌', prompt: 'anime style, high quality, detailed anime artwork' },
  { id: 'manga', name: 'Manga', emoji: '📖', prompt: 'manga style, black and white, cel shaded, manga art' },
  { id: 'ghibli', name: 'Ghibli', emoji: '🌿', prompt: 'ghibli studio style, anime, Hayao Miyazaki inspired, soft colors' },
  { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🌃', prompt: 'cyberpunk anime style, neon colors, futuristic anime' },
  { id: 'soft_cel', name: 'Soft Cel-shading', emoji: '🌸', prompt: 'soft cel shading anime, pastel colors, gentle gradients' },
]

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<StyleKey>('anime_standard')
  const [isGenerating, setIsGenerating] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [credits, setCredits] = useState(3) // Free credits for demo
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
    setCredits(prev => prev - 1)

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
      setCredits(prev => prev + 1) // Refund
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="container">
      <header>
        <h1>✨ Anime Avatar</h1>
        <p>Transform your photo into stunning anime style</p>
      </header>

      {/* Credits Info */}
      <div className="credits-info">
        🎁 You have <strong>{credits}</strong> free credits remaining
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${previewUrl ? '' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
        />
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="upload-preview" />
        ) : (
          <>
            <div className="upload-icon">📸</div>
            <p>Click or drag your photo here</p>
            <small>JPG, PNG, WebP • Max 10MB</small>
          </>
        )}
      </div>

      {/* Style Selector */}
      <div className="style-selector">
        <h3>Choose your anime style</h3>
        <div className="style-grid">
          {STYLES.map((style) => (
            <div
              key={style.id}
              className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
              onClick={() => setSelectedStyle(style.id)}
            >
              <span style={{ fontSize: '2rem' }}>{style.emoji}</span>
              <div className="style-name">{style.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="status-box" style={{ background: '#fef2f2', color: '#991b1b', padding: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Result */}
      {resultImage && (
        <div className="result-container">
          <img src={resultImage} alt="Result" className="result-image" />
          <br />
          <a href={resultImage} download="anime-avatar.png" className="download-btn">
            ⬇️ Download Avatar
          </a>
        </div>
      )}

      {/* Status */}
      {isGenerating && (
        <div className="status-box">
          <div className="spinner"></div>
          <p className="status-text">{statusText}</p>
        </div>
      )}

      {/* Generate Button */}
      {!resultImage && !isGenerating && (
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={!selectedFile || credits <= 0}
        >
          {credits > 0 ? '🎨 Generate Anime Avatar' : 'No credits remaining'}
        </button>
      )}

      {/* Try Again */}
      {resultImage && !isGenerating && (
        <button
          className="generate-btn"
          onClick={() => {
            setResultImage(null)
            setSelectedFile(null)
            setPreviewUrl(null)
          }}
          style={{ marginTop: '16px' }}
        >
          🔄 Create Another Avatar
        </button>
      )}

      <footer>
        <p>© 2026 Anime Avatar · Made with ✨ AI</p>
      </footer>
    </main>
  )
}
