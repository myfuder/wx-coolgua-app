//invitation.js
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
    audience:'',
    date:'',
    name: '',
    job:'',
    company:'',
    portrait:'',
    start:'',
    end:'',
    array:['上午', '下午'],
    index:'',
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn()
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    const date = e.detail.value.replace('-', '/')
    //如果选中的是今天 开始时间不能过现在
    if(new Date(date).getDate()==new Date().getDate()){
      var limitStartTime=util.formatNumberTime(new Date().getTime(), 'H:i')
    }else{
      var limitStartTime="00:00"
    }

    this.setData({
      limitStartTime,
      date: e.detail.value
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit:function(e){
    var status = true
    var that=this
    if (that.data.date== ''){
      wx.showToast({
        title: '请选择时间',
        icon: 'none',
        duration: 2000,
        success: function () {
          status = false
          return false
        }
      })
      status = false
      return false
    }else if (that.data.index== ''){
      wx.showToast({
        title: '请选择时间段',
        icon: 'none',
        duration: 2000,
        success: function () {
          status = false
          return false
        }
      })
      status = false
      return false
    }
    
  },
  onLoad: function (options) {
    var that = this
    that.getSchedulePurchasers();
  },
  getSchedulePurchasers:function(){
    var that = this
    that.setData({
      name: wx.getStorageSync('audienceDetail').contact,
      job:wx.getStorageSync('audienceDetail').job,
      company:wx.getStorageSync('audienceDetail').company,
      portrait:wx.getStorageSync('audienceDetail').portrait,
      start:wx.getStorageSync('activityDetail').startTime,
      end:wx.getStorageSync('activityDetail').endTime
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
