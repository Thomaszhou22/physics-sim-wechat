App({
  globalData: {
    serverUrl: ''
  },
  onLaunch() {
    // 从本地存储恢复配置
    const settings = wx.getStorageSync('settings') || {}
    this.globalData.serverUrl = settings.serverUrl || 'http://localhost:3456'
  }
})
