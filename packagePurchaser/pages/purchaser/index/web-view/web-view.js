//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: {
    webviewSrc: ''
  },
  onLoad: function (options) {
    _self = this
    this.setData({
      webviewSrc: options.src
    })
  },
  onShow:function(){
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
