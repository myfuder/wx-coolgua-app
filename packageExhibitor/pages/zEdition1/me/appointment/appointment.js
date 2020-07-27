//invitationList.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"),
  constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'),
  storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
Page({
  data: { 
    exhibitorId:'',
    exhibitorConfirmed:'',
    exhibitorTobeconfirmed:'',
    exhibitorRefuse:'',
    exhibitorCancel:'',
    purchaserConfirmed:'',
    purchaserTobeconfirmed:'',
    purchaserRefuse:'',
    purchaserCancel:'',
    schedule:'',
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn()
  },
  onLoad: function () {
    app.editTabBar1();    //显示自定义的底部导航
    this.getScheduleStat(storage.getUserInfo().id)
  },
  // 邀约统计
  getScheduleStat:function(id){
    var that = this
    var url = app.globalData.host + '/api3/schedule/getScheduleStat/'+id;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code=='0') {
          console.log(res.data.result)
          that.setData({
            exhibitorConfirmed:res.data.result.invite[0].confirmed? res.data.result.invite[0].confirmed : '0',
            exhibitorTobeconfirmed:res.data.result.invite[0].tobeconfirmed? res.data.result.invite[0].tobeconfirmed : '0',
            exhibitorRefuse:res.data.result.invite[0].refuse? res.data.result.invite[0].refuse : '0',
            exhibitorCancel:res.data.result.invite[0].cancel? res.data.result.invite[0].cancel : '0',
            purchaserConfirmed:res.data.result.invite[1].confirmed? res.data.result.invite[1].confirmed : '0',
            purchaserTobeconfirmed:res.data.result.invite[1].tobeconfirmed? res.data.result.invite[1].tobeconfirmed : '0',
            purchaserRefuse:res.data.result.invite[1].refuse? res.data.result.invite[1].refuse : '0',
            purchaserCancel:res.data.result.invite[1].cancel? res.data.result.invite[1].cancel : '0',
            schedule:res.data.result.schedule
          })
        } else {
          console.log(res.data.message)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  switchConfirmed:function(event){
    var status = event.currentTarget.dataset.status;
    console.log(status)
    wx.redirectTo({
      url: '/packageExhibitor/pages/zEdition1/me/sponsored/sponsored?status='+status
    })
  },
  switchReceived:function(event){
    var status = event.currentTarget.dataset.status;
    console.log(status)
    wx.redirectTo({
      url: '/packageExhibitor/pages/zEdition1/me/received/received?status='+status
    })
  },
  switchSchedule:function(){
    wx.redirectTo({
      url: '/packageExhibitor/pages/zEdition1/me/my-schedule/my-schedule'
    })
  },
  onshow:function(){
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
