const STORAGE_KEYS = {
  SETTINGS: 'settings',
  HISTORY: 'history'
}

function getSettings() {
  return wx.getStorageSync(STORAGE_KEYS.SETTINGS) || {
    provider: 'gemini',
    apiKey: '',
    baseUrl: '',
    model: '',
    serverUrl: 'http://localhost:3456'
  }
}

function saveSettings(settings) {
  wx.setStorageSync(STORAGE_KEYS.SETTINGS, settings)
  const app = getApp()
  app.globalData.serverUrl = settings.serverUrl || 'http://localhost:3456'
}

function getHistory() {
  return wx.getStorageSync(STORAGE_KEYS.HISTORY) || []
}

function addToHistory(item) {
  const list = getHistory()
  list.unshift({
    ...item,
    time: Date.now()
  })
  // 最多保留 100 条
  if (list.length > 100) list.length = 100
  wx.setStorageSync(STORAGE_KEYS.HISTORY, list)
}

function removeFromHistory(id) {
  const list = getHistory().filter(item => item.id !== id)
  wx.setStorageSync(STORAGE_KEYS.HISTORY, list)
}

function clearHistory() {
  wx.setStorageSync(STORAGE_KEYS.HISTORY, [])
}

module.exports = {
  STORAGE_KEYS,
  getSettings,
  saveSettings,
  getHistory,
  addToHistory,
  removeFromHistory,
  clearHistory
}
