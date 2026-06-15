const { getSettings } = require('./storage')

function getServerUrl() {
  const app = getApp()
  return app.globalData.serverUrl || 'http://localhost:3456'
}

/**
 * 生成物理/数学模拟
 */
function generateSimulation({ prompt, subject, knowledgePoint }) {
  const settings = getSettings()
  const serverUrl = getServerUrl()

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${serverUrl}/api/generate`,
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: {
        prompt,
        subject: subject || 'physics',
        knowledgePoint: knowledgePoint || '',
        apiKey: settings.apiKey,
        baseUrl: settings.baseUrl,
        model: settings.model
      },
      success(res) {
        if (res.statusCode === 200 && res.data) {
          resolve(res.data)
        } else {
          reject(new Error(res.data?.error || `请求失败 (${res.statusCode})`))
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
}

/**
 * OCR 图片识别
 */
function ocrImage(filePath) {
  const settings = getSettings()
  const serverUrl = getServerUrl()

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${serverUrl}/api/ocr`,
      filePath,
      name: 'image',
      formData: {
        apiKey: settings.apiKey,
        baseUrl: settings.baseUrl,
        model: settings.model
      },
      success(res) {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch (e) {
            reject(new Error('解析响应失败'))
          }
        } else {
          reject(new Error(`OCR 请求失败 (${res.statusCode})`))
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '上传失败'))
      }
    })
  })
}

/**
 * 获取历史记录列表
 */
function getSavedList() {
  const serverUrl = getServerUrl()
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${serverUrl}/api/saved`,
      method: 'GET',
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败 (${res.statusCode})`))
        }
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
}

module.exports = {
  getServerUrl,
  generateSimulation,
  ocrImage,
  getSavedList
}
