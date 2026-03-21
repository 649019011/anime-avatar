import { NextRequest, NextResponse } from 'next/server'

// Style prompts mapping
const STYLE_PROMPTS: Record<string, string> = {
  anime_standard: 'anime style, high quality, detailed anime artwork, vibrant colors',
  manga: 'manga style, black and white, cel shaded, manga art, high contrast',
  ghibli: 'ghibli studio style anime, Hayao Miyazaki inspired, soft colors, gentle lighting, Studio Ghibli artwork',
  cyberpunk: 'cyberpunk anime style, neon colors, futuristic anime, glowing lights, dark background',
  soft_cel: 'soft cel shading anime, pastel colors, gentle gradients, kawaii style, smooth outlines',
}

export async function POST(request: NextRequest) {
  try {
    const { image, style } = await request.json()

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      )
    }

    const replicateApiKey = process.env.REPLICATE_API_TOKEN
    if (!replicateApiKey) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.anime_standard

    // Call Replicate API - anything-v4.0 for anime generation
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '7ba1dbd03fd54f8e7f8b74eb399e7c24ef8cb2481a6a7a4befa4a6e9a2c1d29e',
        input: {
          prompt: prompt,
          image: image,
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Replicate API error:', errorText)
      return NextResponse.json(
        { success: false, error: 'AI generation failed' },
        { status: 500 }
      )
    }

    const prediction = await response.json()

    // Poll for result
    const predictionId = prediction.id
    let result = null
    let attempts = 0
    const maxAttempts = 60

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${replicateApiKey}`,
          },
        }
      )

      const statusData = await statusResponse.json()

      if (statusData.status === 'succeeded') {
        result = statusData.output
        break
      } else if (statusData.status === 'failed') {
        throw new Error('AI generation failed')
      }

      attempts++
    }

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Generation timeout' },
        { status: 500 }
      )
    }

    // Result is an array, get the first image
    const imageUrl = Array.isArray(result) ? result[0] : result

    return NextResponse.json({
      success: true,
      image: imageUrl,
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
