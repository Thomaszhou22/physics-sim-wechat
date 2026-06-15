const { generateSimulation } = require('../../utils/api')
const { addToHistory } = require('../../utils/storage')

const KNOWLEDGE_POINTS = [
  '自由落体', '抛体运动', '圆周运动', '简谐运动',
  '碰撞', '动量守恒', '电磁感应', '光学',
  '波动', '热力学', '电学', '力学综合'
]

const MATH_POINTS = [
  '函数图像', '几何变换', '概率统计', '微积分',
  '线性代数', '三角函数', '解析几何', '数列'
]

Page({
  data: {
    prompt: '',
    subject: 'physics',
    knowledgePoint: '',
    tags: [],
    loading: false,
    loadingText: '正在生成模拟...'
  },

  onLoad() {
    this.updateTags()
  },

  onSubjectChange(e) {
    this.setData({ subject: e.currentTarget.dataset.subject, knowledgePoint: '' })
    this.updateTags()
  },

  updateTags() {
    this.setData({
      tags: this.data.subject === 'physics' ? KNOWLEDGE_POINTS : MATH_POINTS
    })
  },

  onTagTap(e) {
    const tag = e.currentTarget.dataset.tag
    this.setData({
      knowledgePoint: this.data.knowledgePoint === tag ? '' : tag
    })
  },

  onInput(e) {
    this.setData({ prompt: e.detail.value })
  },

  async onGenerate() {
    const { prompt, subject, knowledgePoint } = this.data
    if (!prompt.trim()) {
      wx.showToast({ title: '请输入描述', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      const result = await generateSimulation({
        prompt,
        subject,
        knowledgePoint
      })

      // 保存到历史
      addToHistory({
        id: result.id,
        prompt,
        subject,
        knowledgePoint,
        url: result.url
      })

      // 跳转到结果页
      wx.navigateTo({
        url: `/pages/result/result?id=${result.id}&url=${encodeURIComponent(result.url)}`
      })
    } catch (err) {
      wx.showModal({
        title: '生成失败',
        content: err.message || '请检查网络和 API 配置',
        showCancel: false
      })
    } finally {
      this.setData({ loading: false })
    }
  }
})
