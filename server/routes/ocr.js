const express = require('express')
const multer = require('multer')
const fs = require('fs')
const https = require('https')
const http = require('http')

const router = express.Router()

// multer 配置 - 内存存储，不落盘
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
})

/**
 * 调用 LLM Vision API 识别图片中的文字
 */
async function ocrWithLLM({ imageBuffer, mimeType, apiKey, baseUrl, model }) {
  const base64Image = imageBuffer.toString('base64')

  // Gemini API 格式
  if (baseUrl.includes('generativelanguage.googleapis.com')) {
    const url = `${baseUrl}/models/${model || 'gemini-2.5-flash'}:generateContent?key=${apiKey}`

    const body = JSON.stringify({
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            },
            {
              text: '请识别图片中的物理或数学题目文字，完整准确地输出题目内容。如果有多个小题，全部识别。只输出识别到的文字内容，不要添加额外解释。'
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4000
      }
    })

    return new Promise((resolve, reject) => {
      const urlObj = new URL(url)
      const options = {
        method: 'POST',
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      }

      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`Gemini Vision API 返回 ${res.statusCode}: ${data.substring(0, 500)}`))
            return
          }
          try {
            const json = JSON.parse(data)
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
            resolve(text)
          } catch (e) {
            reject(new Error(`解析 OCR 响应失败: ${e.message}`))
          }
        })
      })

      req.on('error', reject)
      req.write(body)
      req.end()
    })
  }

  // OpenAI 兼容格式（DeepSeek, GLM-4V, Qwen-VL 等）
  const url = `${baseUrl}/chat/completions`
  const body = JSON.stringify({
    model: model || 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '请识别图片中的物理或数学题目文字，完整准确地输出题目内容。只输出识别到的文字内容，不要添加额外解释。'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          }
        ]
      }
    ],
    temperature: 0.1,
    max_tokens: 4000
  })

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    const options = {
      method: 'POST',
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }

    const req = client.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Vision API 返回 ${res.statusCode}: ${data.substring(0, 500)}`))
          return
        }
        try {
          const json = JSON.parse(data)
          const text = json.choices?.[0]?.message?.content || ''
          resolve(text)
        } catch (e) {
          reject(new Error(`解析 OCR 响应失败: ${e.message}`))
        }
      })
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

/**
 * POST /api/ocr
 * 接收图片，返回识别文字
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片' })
    }

    const { apiKey, baseUrl, model } = req.body

    if (!apiKey) {
      return res.status(400).json({ error: '请在设置中配置 API Key' })
    }

    const actualBaseUrl = baseUrl || 'https://generativelanguage.googleapis.com/v1beta'
    const actualModel = model || 'gemini-2.5-flash'

    const text = await ocrWithLLM({
      imageBuffer: req.file.buffer,
      mimeType: req.file.mimetype,
      apiKey,
      baseUrl: actualBaseUrl,
      model: actualModel
    })

    res.json({ text: text.trim() })
  } catch (err) {
    console.error('OCR 失败:', err)
    res.status(500).json({ error: err.message || 'OCR 识别失败' })
  }
})

module.exports = router
