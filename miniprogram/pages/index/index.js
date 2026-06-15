Page({
  data: {
    title: '物理模拟实验室'
  },
  goToText() {
    wx.navigateTo({ url: '/pages/text-input/text-input' })
  },
  goToPhoto() {
    wx.navigateTo({ url: '/pages/photo-input/photo-input' })
  },
  goToFile() {
    // 复用拍照页面，但默认从相册选
    wx.navigateTo({ url: '/pages/photo-input/photo-input?source=album' })
  }
})
