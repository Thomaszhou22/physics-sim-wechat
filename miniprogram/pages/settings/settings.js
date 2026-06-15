const { getSettings, saveSettings } = require('../../utils/storage')

const PROVIDERS = {
  gemini: {
    label: 'Google Gemini',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.5-flash'
  },
  deepseek: {
    label: 'DeepSeek',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat'
  },
  glm: {
    label: '智谱 GLM',
    defaultBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-4'
  },
  qwen: {
    label: '通义千问 Qwen',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModel: 'qwen-plus'
  },
  openai: {
    label: 'OpenAI',
    defaultBaseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o'
  }
}

Page({
  data: {
    provider: 'gemini',
    apiKey: '',
    baseUrl: '',
    model: '',
    serverUrl: 'http://localhost:3456',
    providers: PROVIDERS,
    providerKeys: Object.keys(PROVIDERS)
  },

  onLoad() {
    const settings = getSettings()
    this.setData({
      provider: settings.provider || 'gemini',
      apiKey: settings.apiKey || '',
      baseUrl: settings.baseUrl || '',
      model: settings.model || '',
      serverUrl: settings.serverUrl || 'http://localhost:3456'
    })
  },

  onProviderChange(e) {
    const provider = e.detail.value
    const config = PROVIDERS[provider]
    this.setData({
      provider,
      baseUrl: config.defaultBaseUrl,
      model: config.defaultModel
    })
  },

  onApiKeyInput(e) {
    this.setData({ apiKey: e.detail.value })
  },

  onBaseUrlInput(e) {
    this.setData({ baseUrl: e.detail.value })
  },

  onModelInput(e) {
    this.setData({ model: e.detail.value })
  },

  onServerUrlInput(e) {
    this.setData({ serverUrl: e.detail.value })
  },

  onSave() {
    if (!this.data.apiKey.trim()) {
      wx.showToast({ title: '请输入 API Key', icon: 'none' })
      return
    }
    saveSettings({
      provider: this.data.provider,
      apiKey: this.data.apiKey,
      baseUrl: this.data.baseUrl,
      model: this.data.model,
      serverUrl: this.data.serverUrl
    })
    wx.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 1000)
  }
})
