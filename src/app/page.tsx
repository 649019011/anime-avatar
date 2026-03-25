'use client'

import { useState, useRef, useCallback } from 'react'

type StyleKey = 'anime_standard' | 'manga' | 'ghibli' | 'cyberpunk' | 'soft_cel'

interface Style {
  id: StyleKey
  name: string
  emoji: string
  prompt: string
  desc: string
}

const STYLES: Style[] = [
  { id: 'anime_standard', name: 'Anime', emoji: '🎌', prompt: 'anime style, high quality', desc: 'Classic anime' },
  { id: 'manga', name: 'Manga', emoji: '📖', prompt: 'manga style, black and white', desc: 'Black & white' },
  { id: 'ghibli', name: 'Ghibli', emoji: '🌿', prompt: 'ghibli studio style, Hayao Miyazaki', desc: 'Studio Ghibli' },
  { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🌃', prompt: 'cyberpunk anime, neon lights', desc: 'Neon vibes' },
  { id: 'soft_cel', name: 'Soft', emoji: '🌸', prompt: 'soft cel shading, pastel colors', desc: 'Gentle pastels' },
]

const PLANS = [
  { name: 'Free', price: '$0', credits: 3, desc: 'Try it out', highlight: false },
  { name: 'Basic', price: '$4.99', credits: 20, desc: 'Perfect for casual', highlight: false },
  { name: 'Standard', price: '$9.99', credits: 50, desc: 'Most popular', highlight: true },
  { name: 'Pro', price: '$19.99', credits: 120, desc: 'For power users', highlight: false },
]

const TESTIMONIALS = [
  {
    name: 'Sarah K.',
    avatar: '/demo-before.jpeg',
    result: '/demo-after.jpeg',
    text: 'My Discord avatar got so many compliments! The anime style is absolutely stunning.',
    rating: 5,
  },
  {
    name: 'Mike T.',
    avatar: '/demo-before.jpeg',
    result: '/demo-after.jpeg',
    text: 'Used it for my YouTube channel art. The Ghibli style is like magic!',
    rating: 5,
  },
  {
    name: 'Yuki M.',
    avatar: '/demo-before.jpeg',
    result: '/demo-after.jpeg',
    text: 'Finally found an AI that actually captures the anime aesthetic perfectly. Worth every penny.',
    rating: 5,
  },
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
      setError('Please select a valid image file (JPG, PNG, WebP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Please use an image under 10MB')
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

      const response = await fetch('https://anime-avatar-ai.langshi2101.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          style: selectedStyle,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Generation failed. Please try again.')
      }

      setStatusText('Done! ✨')
      setResultImage(data.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-warm-50)' }}>
      {/* Header */}
      <header className="text-center py-16 px-4">
        <h1 
          className="text-5xl font-extrabold mb-3"
          style={{ 
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Anime Avatar
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-warm-500)' }}>
          Transform your photo into stunning anime style
        </p>
        <div className="flex justify-center gap-6 mt-4 text-sm" style={{ color: 'var(--color-warm-400)' }}>
          <span>🎨 5 Anime Styles</span>
          <span>⚡ 10 Seconds</span>
          <span>💎 10K+ Happy Users</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 pb-16">

        {/* How It Works */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--color-warm-800)', fontFamily: 'var(--font-heading)' }}>
            How It Works 🔥
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '📤', title: 'Upload', desc: 'Your photo in seconds' },
              { emoji: '🎨', title: 'Choose Style', desc: '5 anime styles' },
              { emoji: '⬇️', title: 'Download', desc: 'HD quality avatar' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: '0 2px 12px -4px rgb(0 0 0 / 0.08)' }}>
                <div className="text-3xl mb-3">{step.emoji}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-warm-700)' }}>{step.title}</div>
                <div className="text-xs" style={{ color: 'var(--color-warm-400)' }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Showcase */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--color-warm-800)', fontFamily: 'var(--font-heading)' }}>
            See the Magic ✨
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-3" style={{ boxShadow: '0 2px 12px -4px rgb(0 0 0 / 0.08)' }}>
              <p className="text-xs text-center mb-2" style={{ color: 'var(--color-warm-400)' }}>Before</p>
              <img src="/demo-before.jpeg" alt="Before" className="rounded-xl w-full object-cover aspect-square" />
            </div>
            <div className="bg-white rounded-2xl p-3 border-2" style={{ borderColor: 'var(--color-brand)', boxShadow: '0 4px 16px -4px rgb(139 92 246 / 0.3)' }}>
              <p className="text-xs text-center mb-2 font-semibold" style={{ color: 'var(--color-brand)' }}>After (Anime)</p>
              <img src="/demo-after.jpeg" alt="After" className="rounded-xl w-full object-cover aspect-square" />
            </div>
          </div>
        </section>

        {/* Credits Banner */}
        {credits > 0 && (
          <div className="banner banner-warning mb-6 flex items-center justify-center gap-2">
            <span>🎁</span>
            <span>You have <strong>{credits}</strong> free credit{credits !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Upload Zone */}
        {!resultImage && (
          <div
            className={`upload-zone mb-6 ${previewUrl ? 'has-file' : ''}`}
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
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-72 mx-auto rounded-xl object-contain"
                style={{ boxShadow: '0 8px 32px -8px rgb(0 0 0 / 0.15)' }}
              />
            ) : (
              <>
                <div className="text-5xl mb-4">📸</div>
                <p className="text-base font-medium" style={{ color: 'var(--color-warm-700)' }}>
                  Drop your photo here
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-warm-400)' }}>
                  or click to browse · JPG, PNG, WebP · Max 10MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Style Selector */}
        {!resultImage && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-warm-600)' }}>
              Choose your anime style
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {STYLES.map((style) => (
                <div
                  key={style.id}
                  className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <span className="text-2xl relative z-10">{style.emoji}</span>
                  <div className="text-sm font-semibold mt-2 relative z-10" style={{ color: 'var(--color-warm-700)' }}>
                    {style.name}
                  </div>
                  <div className="text-xs mt-1 relative z-10" style={{ color: 'var(--color-warm-400)' }}>
                    {style.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="banner banner-error mb-4 flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {resultImage && (
          <div className="result-card mb-6">
            <img 
              src={resultImage} 
              alt="Generated anime avatar" 
              className="rounded-xl mb-6 max-w-full w-full"
              style={{ boxShadow: '0 12px 40px -12px rgb(0 0 0 / 0.2)' }}
            />
            <a
              href={resultImage}
              download="anime-avatar.png"
              className="btn-gradient block text-center"
            >
              <span>⬇️ Download Avatar</span>
            </a>
            <button
              onClick={() => {
                setResultImage(null)
                setSelectedFile(null)
                setPreviewUrl(null)
              }}
              className="w-full mt-4 py-3 text-sm font-medium transition-all hover:opacity-70"
              style={{ color: 'var(--color-warm-500)' }}
            >
              🔄 Create another
            </button>
          </div>
        )}

        {/* Generating Status - Skeleton Loading */}
        {isGenerating && (
          <div className="result-card mb-6">
            <div className="skeleton h-80 w-full mb-4 rounded-xl"></div>
            <div className="text-center">
              <div className="spinner mb-4"></div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-warm-600)' }}>
                {statusText}
              </p>
            </div>
          </div>
        )}

        {/* Generate Button */}
        {!resultImage && !isGenerating && (
          <button
            className="btn-gradient"
            onClick={handleGenerate}
            disabled={!selectedFile || credits <= 0}
          >
            <span>
              {credits > 0 
                ? selectedFile 
                  ? '🎨 Generate Anime Avatar' 
                  : '📸 Upload a photo to start'
                : 'No credits remaining'}
            </span>
          </button>
        )}

        {/* Testimonials */}
        <section className="mt-16 mb-8">
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--color-warm-800)', fontFamily: 'var(--font-heading)' }}>
            Loved by Users 💬
          </h2>
          <div className="space-y-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px -4px rgb(0 0 0 / 0.08)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: 'var(--color-warm-800)' }}>{t.name}</div>
                    <div className="text-xs text-amber-400">{'★'.repeat(t.rating)}</div>
                  </div>
                  <img src={t.result} alt="result" className="w-12 h-12 rounded-lg object-cover" />
                </div>
                <p className="text-sm italic" style={{ color: 'var(--color-warm-600)' }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-16 mb-8">
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: 'var(--color-warm-800)', fontFamily: 'var(--font-heading)' }}>
            Simple Pricing 💎
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-4 text-center ${
                  plan.highlight
                    ? 'text-white'
                    : 'bg-white border'
                }`}
                style={plan.highlight 
                  ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 8px 24px -8px rgb(139 92 246 / 0.4)' }
                  : { borderColor: 'var(--color-warm-200)', boxShadow: '0 2px 12px -4px rgb(0 0 0 / 0.08)' }
                }
              >
                {plan.highlight && (
                  <div className="text-xs font-bold mb-1" style={{ color: 'rgb(233 213 255)' }}>⭐ MOST POPULAR</div>
                )}
                <div className="text-2xl font-extrabold mb-1">{plan.price}</div>
                <div className="text-sm font-semibold">{plan.credits} credits</div>
                <div className="text-xs mt-1" style={plan.highlight ? { color: 'rgb(233 213 255)' } : { color: 'var(--color-warm-400)' }}>
                  {plan.desc}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-4" style={{ color: 'var(--color-warm-400)' }}>
            Credits never expire · One-time purchase · Secure payment
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12" style={{ color: 'var(--color-warm-400)' }}>
          <div className="flex justify-center gap-6 mb-3 text-sm">
            <a href="#" className="hover:opacity-70 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Terms of Service</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Contact</a>
          </div>
          <p className="text-sm">© 2026 Anime Avatar · Made with ✨ AI</p>
        </footer>
      </div>
    </main>
  )
}
