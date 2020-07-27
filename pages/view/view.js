//view.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    url:''
  },
  onLoad: function (options) {
    var officialUrl=wx.getStorageSync('official')
    console.log(officialUrl)
    var that = this
    that.setData({
      url: officialUrl,
    })
  },
  onShareAppMessage: function () {

  },
})

