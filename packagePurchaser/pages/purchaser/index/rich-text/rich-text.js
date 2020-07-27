//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: {
    richText: '',
    id: null,
    title: '',
    bannerList: []
  },
  getDetailInfo: function() {
    (0, api.getRotations)({
      success: function (res) {
        _self.setData({
          bannerList: res.data.result
        })
      }
    });
    if (!util.isNullStr(_self.data.id)) {
      (0, api.getColumnById)({
        query: {
          id: _self.data.id
        },
        success: function (res) {
          _self.setData({
            richText: res.data.result.column.content
          })
        }
      })
    }
    
  },
  onLoad: function (options) {
    _self = this
    this.setData({
      id: options.id,
      title: options.title
    })
    _self.getDetailInfo()
  },
  onShow:function(){
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
