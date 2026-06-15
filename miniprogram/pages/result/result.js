Page({
  data: {
    url: '',
    simId: ''
  },

  onLoad(options) {
    if (options.url) {
      this.setData({
        url: decodeURIComponent(options.url),
        simId: options.id || ''
      })
    }
  },

  onSave() {
    if (!this.data.simId) return
    wx.showToast({
      title: '已保存',
      icon: 'success'
    })
  },

  onShareAppMessage() {
    return {
      title: '看看这个物理模拟',
      path: `/pages/result/result?id=${this.data.simId}&url=${encodeURIComponent(this.data.url)}`
    }
  }
})
