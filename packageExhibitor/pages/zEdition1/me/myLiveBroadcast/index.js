import { getString } from "../../../../../locals/lang";
var app = getApp()
// packageExhibitor/pages/zEdition1/me/myLiveBroadcast/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visibleDialog:false,
    list: null,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      label: {
        publishLive: getString('wp', 'app.live.btnstart'),
        startTime: getString('wp', 'app.live.label.startTime'),
        endTime: getString('wp', 'app.live.label.endTime'),
        duration: getString('wp', 'app.live.label.duration'),
        liveStatus: getString('wp', 'app.live.label.liveStatus'),
        judgeStatus: getString('wp', 'app.live.label.judgeStatus'),
        num: getString('wp', 'app.live.label.num'),
        conversionOfInvitaion: getString('wp', 'app.live.label.conversionOfInvitaion'),
        sure: getString('wp', 'app.live.label.sure'),
        waitSure: getString('wp', 'app.live.label.waitSure'),
        reject: getString('wp', 'app.live.label.reject'),
        cancel: getString('wp', 'app.live.label.cancel'),
      }
    })
    wx.setNavigationBarTitle({
      title: getString('exhibitors_index', 'app.mine.menu5')
    })
    var supplierId = wx.getStorageSync('userInfo').id
    let url = app.globalData.host + `/api3/live/mylives/${supplierId}`
      var that = this;
      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          if (res.data.code == '0') {
            that.setData({
              list: res.data.result
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
  formatSeconds(value) {
    console.log("开始格式化时间：")
    let result = parseInt(value)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
 
    let res = '';
    if(h !== '00') res += `${h}h`;
    if(m !== '00') res += `${m}min`;
    res += `${s}s`;
    return res;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  handleDialog() {
    this.setData({
      visibleDialog:false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  startLive() {
    this.setData({
      visibleDialog: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})