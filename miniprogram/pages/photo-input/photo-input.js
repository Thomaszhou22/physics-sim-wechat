const { ocrImage, generateSimulation } = require('../../utils/api')
const { addToHistory } = require('../../utils/storage')

Page({
  data: {
    imagePath: '',
    ocrText: '',
    showOcrResult: false,
    subject: 'physics',
    loading: false,
    loadingText: '',
    knowledgePoint: ''
  },

  onLoad(options) {
    if (options.source === 'album') {
      this.chooseFromAlbum()
    }
  },

  chooseCamera() {
    this.chooseMedia('camera')
  },

  chooseFromAlbum() {
    this.chooseMedia('album')
  },

  chooseMedia(sourceType) {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: [sourceType],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ imagePath: tempFilePath })
        this.doOCR(tempFilePath)
      }
    })
  },

  async doOCR(filePath) {
    this.setData({ loading: true, loadingText: '正在识别图片...' })
    try {
      const result = await ocrImage(filePath)
      this.setData({
        ocrText: result.text || '',
        showOcrResult: true
      })
    } catch (err) {
      wx.showModal({
        title: '识别失败',
        content: err.message || '请检查网络和 API 配置',
        showCancel: false
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  onOcrTextInput(e) {
    this.setData({ ocrText: e.detail.value })
  },

  onSubjectChange(e) {
    this.setData({ subject: e.currentTarget.dataset.subject })
  },

  async onGenerate() {
    const { ocrText, subject } = this.data
    if (!ocrText.trim()) {
      wx.showToast({ title: '请先识别或输入题目', icon: 'none' })
      return
    }

    this.setData({ loading: true, loadingText: '正在生成模拟...' })

    try {
      const result = await generateSimulation({
        prompt: ocrText,
        subject
      })

      addToHistory({
        id: result.id,
        prompt: ocrText,
        subject,
        knowledgePoint: '',
        url: result.url
      })

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
  },

  reChoose() {
    this.setData({ imagePath: '', ocrText: '', showOcrResult: false })
  }
})
