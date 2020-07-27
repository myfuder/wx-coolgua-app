// packageExhibitor/pages/zEdition1/me/msg/index.js
import { getString } from "../../../../../../locals/lang.js";
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	systemmsglist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	wx.setNavigationBarTitle({
      title: getString('exhibitors_index', 'app.title.msg')
    })
	this.getmsg()
  },
  getmsg(){
  	console.log('111')
  	var that = this
  	var userId = wx.getStorageSync('userInfo').id
  	var url = app.globalData.host +'/api3/message/newmessage/list/'+userId;
  	wx.request({
  	  url: url,
  	  method: 'GET',
  	  header: {
  	    'Content-Type': 'application/json'
  	  },
  	  success: function (res) {
  		  console.log(res)
  	    if (res.data.code=='0') {
  	      that.setData({
  	       systemmsglist:res.data.result
  	      })
  	    } else {
  	     
  	    }
  	  },
  	  fail: function (error) {
  	    console.log(error)
  	  }
  	})
	
	//设为已读
    /*	wx.request({
        url: app.globalData.host +'/api3/message/newmessage/hadread/'+userId,
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.data.code=='0') {

          } else {

          }
        },
        fail: function (error) {
          console.log(error)
        }
      })*/
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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