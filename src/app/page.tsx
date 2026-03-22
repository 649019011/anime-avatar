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

const PLANS = [
  { name: 'Free', price: '$0', credits: 3, desc: 'Try it out', highlight: false },
  { name: 'Basic', price: '$4.99', credits: 20, desc: 'Perfect for casual', highlight: false },
  { name: 'Standard', price: '$9.99', credits: 50, desc: 'Most popular choice', highlight: true },
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
        <div className="flex justify-center gap-6 mt-3 text-sm text-gray-400">
          <span>🎨 5 Anime Styles</span>
          <span>⚡ 10 Seconds</span>
          <span>💎 10K+ Happy Users</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 pb-12">

        {/* How It Works */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">How It Works 🔥</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl mb-2">📤</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Upload</div>
              <div className="text-xs text-gray-400">Your photo in seconds</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl mb-2">🎨</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Choose Style</div>
              <div className="text-xs text-gray-400">5 anime styles</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-3xl mb-2">⬇️</div>
              <div className="text-sm font-semibold text-gray-700 mb-1">Download</div>
              <div className="text-xs text-gray-400">HD quality avatar</div>
            </div>
          </div>
        </section>

        {/* Showcase - Before/After Comparison */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">See the Magic ✨</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <p className="text-xs text-gray-400 text-center mb-2">Before</p>
              <img src="/demo-before.jpeg" alt="Before" className="rounded-xl w-full object-cover aspect-square" />
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm border-2 border-purple-400">
              <p className="text-xs text-purple-600 text-center mb-2 font-semibold">After (Anime)</p>
              <img src="/demo-after.jpeg" alt="After" className="rounded-xl w-full object-cover aspect-square" />
            </div>
          </div>
        </section>

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

        {/* Social Proof / Testimonials */}
        <section className="mt-16 mb-8">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Loved by Users 💬</h2>
          <div className="space-y-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-800">{t.name}</div>
                    <div className="text-xs text-amber-400">{'★'.repeat(t.rating)}</div>
                  </div>
                  <img src={t.result} alt="result" className="w-12 h-12 rounded-lg object-cover" />
                </div>
                <p className="text-sm text-gray-600 italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mt-16 mb-8">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Simple Pricing 💎</h2>
          <div className="grid grid-cols-2 gap-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-4 text-center ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg scale-105'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold text-purple-200 mb-1">⭐ MOST POPULAR</div>
                )}
                <div className="text-2xl font-extrabold mb-1">{plan.price}</div>
                <div className="text-sm font-semibold">{plan.credits} credits</div>
                <div className={`text-xs mt-1 ${plan.highlight ? 'text-purple-200' : 'text-gray-400'}`}>
                  {plan.desc}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-400 text-xs mt-4">
            Credits never expire · One-time purchase · Secure payment
          </p>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 text-sm mt-8">
          <div className="flex justify-center gap-4 mb-2">
            <a href="#" className="hover:text-gray-600">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600">Terms of Service</a>
            <a href="#" className="hover:text-gray-600">Contact</a>
          </div>
          © 2026 Anime Avatar · Made with ✨ AI
        </footer>
      </div>
    </main>
  )
}
