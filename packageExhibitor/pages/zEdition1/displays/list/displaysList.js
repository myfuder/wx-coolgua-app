const app = getApp()
const i18n=require("../../../../../i18n/i18n")
Page({
  data: {
    list: [],
    height: wx.getSystemInfoSync().screenHeight,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate()
  },
  onLoad: function (options) {

  },
  onShow() {
    this.zhanpinlist()
  },
  go2addproduct() {
    wx.navigateTo({
      url: `/packageExhibitor/pages/zEdition1/product/edit/index`
    })
  },
  zhanpinlist() {
    var that = this
    var supplierId = wx.getStorageSync('userInfo').id // 展商id
    var url = app.globalData.host + '/api3/exhibit/getExhibits/' + supplierId;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          that.setData({
            list: res.data.result
          })
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
});