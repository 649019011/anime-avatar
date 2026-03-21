import { NextRequest, NextResponse } from 'next/server'

const STYLE_PROMPTS: Record<string, string> = {
  anime_standard: 'anime style, high quality, detailed anime artwork, vibrant colors, sharp focus',
  manga: 'manga style, black and white, cel shaded, manga art, high contrast, ink lines',
  ghibli: 'ghibli studio style anime, Hayao Miyazaki inspired, soft colors, gentle lighting, Studio Ghibli artwork, watercolor feel',
  cyberpunk: 'cyberpunk anime style, neon colors, futuristic anime, glowing neon lights, dark background, synthwave',
  soft_cel: 'soft cel shading anime, pastel colors, gentle gradients, kawaii style, smooth outlines, light background',
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

    const apiToken = process.env.REPLICATE_API_TOKEN
    if (!apiToken) {
      return NextResponse.json(
        { success: false, error: 'AI service not configured' },
        { status: 500 }
      )
    }

    const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.anime_standard

    // Remove data:image/...;base64, prefix if present
    const imageData = image.includes(',') ? image.split(',')[1] : image

    // Call Replicate API directly
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '7ba1dbd03fd54f8e7f8b74eb399e7c24ef8cb2481a6a7a4befa4a6e9a2c1d29e',
        input: {
          prompt: `${prompt}, portrait, face focus, avatar style`,
          image: `data:image/jpeg;base64,${imageData}`,
          num_inference_steps: 25,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Replicate error:', errorText)
      return NextResponse.json(
        { success: false, error: 'AI generation failed' },
        { status: 500 }
      )
    }

    const prediction = await response.json()
    const predictionId = prediction.id

    // Poll for result
    let result = null
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${apiToken}`,
          },
        }
      )

      const statusData = await statusResponse.json()

      if (statusData.status === 'succeeded') {
        result = statusData.output
        break
      } else if (statusData.status === 'failed') {
        console.error('Prediction failed:', statusData.error)
        return NextResponse.json(
          { success: false, error: 'AI generation failed' },
          { status: 500 }
        )
      }
    }

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Generation timeout' },
        { status: 500 }
      )
    }

    // Result is an array, get the first image
    const imageUrl = Array.isArray(result) ? result[result.length - 1] : result

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
