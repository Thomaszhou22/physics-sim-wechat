const express = require('express')
const fs = require('fs')
const path = require('path')

const router = express.Router()

/**
 * GET /api/saved
 * 返回已保存的模拟列表
 */
router.get('/', (req, res) => {
  try {
    const simsDir = path.join(__dirname, '..', 'public', 'sims')
    const files = fs.existsSync(simsDir)
      ? fs.readdirSync(simsDir).filter(f => f.endsWith('.html'))
      : []

    const host = req.get('host') || `localhost:${process.env.PORT || 3456}`
    const protocol = req.protocol || 'http'

    const list = files.map(file => {
      const id = file.replace('.html', '')
      const stat = fs.statSync(path.join(simsDir, file))

      // 尝试从 HTML 中提取标题
      let title = id
      try {
        const content = fs.readFileSync(path.join(simsDir, file), 'utf-8')
        const titleMatch = content.match(/<title>(.*?)<\/title>/i)
        if (titleMatch) title = titleMatch[1]
        // 也尝试从 h1 提取
        const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i)
        if (h1Match) title = h1Match[1].replace(/<[^>]*>/g, '').trim()
      } catch (e) {
        // 忽略
      }

      return {
        id,
        title,
        url: `${protocol}://${host}/sims/${file}`,
        size: stat.size,
        createTime: stat.birthtimeMs,
        modifyTime: stat.mtimeMs
      }
    }).sort((a, b) => b.createTime - a.createTime)

    res.json({ list, total: list.length })
  } catch (err) {
    console.error('获取列表失败:', err)
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
