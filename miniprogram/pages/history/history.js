const { getHistory } = require('../../utils/storage')

Page({
  data: {
    history: [],
    isEmpty: false
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const list = getHistory()
    this.setData({
      history: list.map(item => ({
        ...item,
        timeStr: this.formatTime(item.time)
      })),
      isEmpty: list.length === 0
    })
  },

  formatTime(ts) {
    const d = new Date(ts)
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    const hour = d.getHours().toString().padStart(2, '0')
    const min = d.getMinutes().toString().padStart(2, '0')
    return `${month}-${day} ${hour}:${min}`
  },

  onTap(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/result/result?id=${item.id}&url=${encodeURIComponent(item.url)}`
    })
  }
})
