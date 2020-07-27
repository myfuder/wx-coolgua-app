//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: { 
    exhibitList: [{
      id: 1
    }],
    exhibits: []
  },
  // 初始化数据
  initData: function(){
    const exhibits = []
    for(let i = 0; i < 5;i++) {
      exhibits.push({
        id: i
      })
    };
    (0, api.getMessage)({
      success: function (res) {
        _self.setData({
          messageList: res.data.result
        })
        // _self.readMessage()
      }
    });
    _self.setData({
      exhibits: exhibits
    })
  },
  readMessage: function() {
    (0, api.readMessage)({
      success: function (res) {
      }
    })
  },
  goDetailPage: function() {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/appoint-detail/appoint-detail',
    })
  },
  goPublishPage: function() {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/publish-demand/publish-demand',
    })
  },
  onLoad: function () {
  },
  onShow:function(){
    _self = this
    _self.initData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
