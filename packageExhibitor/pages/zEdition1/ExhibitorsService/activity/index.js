// packageExhibitor/pages/zEdition1/ExhibitorsService/activity/index.js
import { getString } from "../../../../../locals/lang.js";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
	// activity:{
	// 	time: getString('exhibitors_index', 'app.activity.time'),
	// 	roomNum: getString('exhibitors_index', 'app.activity.roomNum'),
	// 	taking: getString('exhibitors_index', 'app.activity.taking'),
	// 	btnL: getString('exhibitors_index', 'app.activity.btn1'),
	// 	btnR: getString('exhibitors_index', 'app.activity.btn2'),
	// 	activity: getString('exhibitors_index', 'app.activity.activity'),
	// },
	dataList:[],
	language:'',
	isHide:true,	//暂无更多数据
  },
	
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  
	  wx.setNavigationBarTitle({
	  	title: getString('exhibitors_index', 'app.activity.top'),
	   })
	var url = app.globalData.host
	// 判断语言类型
	var lang = wx.getStorageSync('lang')
	this.setData({
		language:lang
	})
	console.log(this.data.language)
	
	this.setData({
		activity:{
			time: getString('exhibitors_index', 'app.activity.time'),
			roomNum: getString('exhibitors_index', 'app.activity.roomNum'),
			taking: getString('exhibitors_index', 'app.activity.taking'),
			btnL: getString('exhibitors_index', 'app.activity.btn1'),
			btnR: getString('exhibitors_index', 'app.activity.btn2'),
			activity: getString('exhibitors_index', 'app.activity.activity'),
		},
	})
	
	// 获取供应商id
	var supplierId = wx.getStorageSync('userInfo').id
	wx.request({
		url:url + '/api3/activitypair/slist/'+supplierId,
		method:'GET',
		data:{},
		success:res=>{
			console.log(res,'==========')
			var that = this
			if(res.data.code=='0'){
				if(res.data.result == 0){
					that.setData({
						isHide:false
					})
					
				}else{
					that.setData({
						dataList:res.data.result
					})
					that.setData({
						isHide:true
					})
				}
			}
		},
		fail:res=>{
			console.log(res,'')
		}
	})
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

  },
  // 我的预约
  appoint:function(e){
	console.log(e)
	var id = e.currentTarget.dataset.id;
  	wx.navigateTo({
  		url:'./self/index?id=' + id
  	})
  },
  // 立即预约
  goin:(e)=>{
	console.log(e)
	console.log(JSON.stringify(e.currentTarget.dataset.id))
	wx.navigateTo({
		url:'./goIn/index?arr=' + JSON.stringify(e.currentTarget.dataset.id)
	})
  }
})