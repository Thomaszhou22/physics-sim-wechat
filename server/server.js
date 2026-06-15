const express = require('express')
const path = require('path')
const cors = require('cors')
const fs = require('fs')

const generateRoute = require('./routes/generate')
const ocrRoute = require('./routes/ocr')
const savedRoute = require('./routes/saved')

const app = express()
const PORT = process.env.PORT || 3456

// 确保 sims 目录存在
const simsDir = path.join(__dirname, 'public', 'sims')
if (!fs.existsSync(simsDir)) {
  fs.mkdirSync(simsDir, { recursive: true })
}

// 中间件
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 静态文件服务 - 生成的 HTML 模拟文件
app.use('/sims', express.static(path.join(__dirname, 'public', 'sims')))

// 路由
app.use('/api/generate', generateRoute)
app.use('/api/ocr', ocrRoute)
app.use('/api/saved', savedRoute)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

// 启动
app.listen(PORT, () => {
  console.log(`🚀 物理模拟服务器运行在 http://localhost:${PORT}`)
  console.log(`📁 模拟文件目录: ${simsDir}`)
})
