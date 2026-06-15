const express = require('express')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')

const router = express.Router()
const PHYSICS_PROMPT = require('../prompts/physics')
const MATH_PROMPT = require('../prompts/math')

// 加载模板库
function loadTemplates() {
  const templates = {}
  const tplBase = path.join(__dirname, '..', 'templates')
  const categories = ['mechanics', 'electromagnetism', 'waves', 'optics', 'thermodynamics']

  for (const cat of categories) {
    const catPath = path.join(tplBase, cat)
    if (!fs.existsSync(catPath)) continue
    const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'))
    for (const file of files) {
      try {
        const mod = require(path.join(catPath, file))
        const name = file.replace('.js', '')
        templates[`${cat}/${name}`] = mod
      } catch (e) {
        console.warn(`加载模板失败: ${cat}/${file}`, e.message)
      }
    }
  }
  return templates
}

// 根据知识点选择相关模板
function selectTemplate(knowledgePoint, subject) {
  const templates = loadTemplates()
  if (!knowledgePoint) return null

  const kp = knowledgePoint.toLowerCase()
  const allTemplates = Object.entries(templates)

  // 关键词匹配
  const keywordMap = {
    '抛体': ['projectile-motion'],
    '自由落体': ['free-fall'],
    '单摆': ['pendulum'],
    '弹簧': ['spring-oscillator'],
    '简谐': ['spring-oscillator', 'pendulum'],
    '碰撞': ['collision'],
    '动量': ['collision'],
    '斜面': ['incline'],
    '摩擦': ['incline'],
    '电路': ['circuit'],
    '电流': ['circuit'],
    '波': ['wave-interference'],
    '干涉': ['wave-interference'],
    '透镜': ['lens'],
    '光学': ['lens'],
    '圆周': ['circular-motion'],
    '向心力': ['circular-motion'],
  }

  for (const [keyword, names] of Object.entries(keywordMap)) {
    if (kp.includes(keyword)) {
      for (const name of names) {
        const key = allTemplates.find(([k]) => k.includes(name))
        if (key) return key[1]
      }
    }
  }
  return null
}

/**
 * 调用 LLM API
 */
async function callLLM({ prompt, systemPrompt, apiKey, baseUrl, model }) {
  const url = `${baseUrl}/chat/completions`
  const body = JSON.stringify({
    model: model || 'gemini-2.5-flash',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 16000
  })

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
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

    const client = urlObj.protocol === 'https:' ? https : http
    const req = client.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`LLM API 返回 ${res.statusCode}: ${data.substring(0, 500)}`))
          return
        }
        try {
          const json = JSON.parse(data)
          const content = json.choices?.[0]?.message?.content || json.candidates?.[0]?.content?.parts?.[0]?.text || ''
          resolve(content)
        } catch (e) {
          reject(new Error(`解析 LLM 响应失败: ${e.message}`))
        }
      })
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

/**
 * 调用 Gemini API（特殊格式）
 */
async function callGemini({ prompt, systemPrompt, apiKey, baseUrl, model }) {
  // Gemini 使用不同的 API 格式
  if (baseUrl.includes('generativelanguage.googleapis.com')) {
    const url = `${baseUrl}/models/${model || 'gemini-2.5-flash'}:generateContent?key=${apiKey}`

    const body = JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        { parts: [{ text: prompt }] }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 16000
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
            reject(new Error(`Gemini API 返回 ${res.statusCode}: ${data.substring(0, 500)}`))
            return
          }
          try {
            const json = JSON.parse(data)
            const content = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
            resolve(content)
          } catch (e) {
            reject(new Error(`解析 Gemini 响应失败: ${e.message}`))
          }
        })
      })

      req.on('error', reject)
      req.write(body)
      req.end()
    })
  }

  // 非 Gemini，使用标准 OpenAI 格式
  return callLLM({ prompt, systemPrompt, apiKey, baseUrl, model })
}

/**
 * POST /api/generate
 */
router.post('/', async (req, res) => {
  try {
    const { prompt, subject, knowledgePoint, apiKey, baseUrl, model } = req.body

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: '请提供描述内容' })
    }
    if (!apiKey) {
      return res.status(400).json({ error: '请在设置中配置 API Key' })
    }

    // 选择 system prompt
    const systemPrompt = subject === 'math' ? MATH_PROMPT : PHYSICS_PROMPT

    // 构建用户 prompt，附加模板参考
    let userPrompt = prompt
    const template = selectTemplate(knowledgePoint, subject)
    if (template) {
      const templateHtml = typeof template === 'function' ? template() : template
      // 截取部分作为参考
      const refSnippet = templateHtml.substring(0, 2000)
      userPrompt += '\n\n参考以下模板风格（但不要直接复制，要根据题目定制）：\n' + refSnippet + '\n...'
    }

    // 调用 LLM
    const actualBaseUrl = baseUrl || 'https://generativelanguage.googleapis.com/v1beta'
    const actualModel = model || 'gemini-2.5-flash'

    let html
    try {
      html = await callGemini({
        prompt: userPrompt,
        systemPrompt,
        apiKey,
        baseUrl: actualBaseUrl,
        model: actualModel
      })
    } catch (apiErr) {
      console.error('LLM 调用失败:', apiErr.message)
      return res.status(500).json({ error: `AI 生成失败: ${apiErr.message}` })
    }

    if (!html || html.length < 100) {
      return res.status(500).json({ error: '生成的内容为空或过短' })
    }

    // 清理 markdown 包裹
    html = html.replace(/^```html\s*/i, '').replace(/\s*```$/i, '')
    html = html.replace(/^```\s*/i, '').replace(/\s*```$/i, '')

    // 生成 ID 并保存
    const id = `sim_${Date.now()}`
    const filePath = path.join(__dirname, '..', 'public', 'sims', `${id}.html`)
    fs.writeFileSync(filePath, html, 'utf-8')

    // 构建访问 URL
    const host = req.get('host') || `localhost:${process.env.PORT || 3456}`
    const protocol = req.protocol || 'http'
    const url = `${protocol}://${host}/sims/${id}.html`

    console.log(`✅ 生成成功: ${id} (${html.length} chars)`)

    res.json({ id, url, html })
  } catch (err) {
    console.error('生成失败:', err)
    res.status(500).json({ error: err.message || '服务器内部错误' })
  }
})

module.exports = router
