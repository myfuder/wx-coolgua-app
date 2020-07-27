//activityDetail.js
//获取应用实例
import {API_URL} from "../../../../utils/constant";

const app = getApp()
let TIME = 60
let api = require("../../../../utils/api"), constant = require("../../../../utils/constant"),
  i18n = require('../../../../i18n/i18n.js'), storage = require("../../../../utils/storage.js"),
  util = require("../../../../utils/util");
Page({
  data: {
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    activityId: '',
    openId: '',
    banner: '',
    activityName: '',
    regNum: '',
    startTime: '',
    endTime: '',
    address: '',
    activityCon: '',
    id: '',
    data: {},
    signUpShow: true,
    weixinId: ''
  },
  onLoad: function (options) {
    this.setData({
      activityId: storage.getActivityDetail().id,
      weixinId: wx.getStorageSync('user').openId
    });
    this.inviteslist(options.tid);
  },
  inviteslist:function(id){
    wx.request({
      url: app.globalData.host + '/api3/activitypair/invite/'+ id +'/'+ storage.getUserInfo().id,
      method: 'POST',
      data:{},
      success: res => {
        console.log(res,'616161616')

      }
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
