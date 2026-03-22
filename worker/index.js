const STYLE_PROMPTS = {
  anime_standard: 'anime style, high quality, detailed anime artwork, vibrant colors, portrait avatar',
  manga: 'manga style, black and white, cel shaded, manga art, portrait avatar',
  ghibli: 'ghibli studio style anime, Hayao Miyazaki inspired, soft colors, gentle lighting, portrait avatar',
  cyberpunk: 'cyberpunk anime style, neon colors, futuristic anime, glowing neon lights, portrait avatar',
  soft_cel: 'soft cel shading anime, pastel colors, gentle gradients, kawaii style, portrait avatar',
}

const NEGATIVE = 'blurry, low quality, distorted face, deformed hands, extra fingers, watermark'

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const { image, style } = await request.json()
      if (!image) {
        return Response.json({ success: false, error: 'No image provided' }, { status: 400 })
      }

      const prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.anime_standard

      // Parse base64
      const imageData = image.includes(',') ? image.split(',')[1] : image
      let imageBytes
      try {
        const binaryString = atob(imageData)
        imageBytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          imageBytes[i] = binaryString.charCodeAt(i)
        }
      } catch (e) {
        return Response.json({ success: false, error: 'Invalid image data' }, { status: 400 })
      }

      // Workers AI returns a ReadableStream (PNG bytes) for img2img
      // We need to wait for it and convert to base64
      const aiStream = await env.AI.run(
        '@cf/runwayml/stable-diffusion-v1-5-img2img',
        {
          prompt: prompt,
          negative_prompt: NEGATIVE,
          image: Array.from(imageBytes),
          num_steps: 20,
          guidance: 7.5,
        }
      )

      // Collect stream chunks
      const reader = aiStream.getReader()
      const chunks = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
      }

      // Combine all chunks into a single Uint8Array
      const totalLen = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
      const resultBytes = new Uint8Array(totalLen)
      let offset = 0
      for (const chunk of chunks) {
        resultBytes.set(chunk, offset)
        offset += chunk.length
      }

      // Convert to base64
      let binary = ''
      for (let i = 0; i < resultBytes.length; i++) {
        binary += String.fromCharCode(resultBytes[i])
      }
      const base64 = btoa(binary)

      return Response.json({
        success: true,
        image: `data:image/png;base64,${base64}`,
      }, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      })

    } catch (error) {
      console.error('Worker error:', error)
      return Response.json({
        success: false,
        error: error.message || 'Generation failed',
      }, { status: 500 })
    }
  },
}
