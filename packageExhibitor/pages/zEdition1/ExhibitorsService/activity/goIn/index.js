// packageExhibitor/pages/zEdition1/ExhibitorsService/activity/index.js
import {
	getString
} from "../../../../../../locals/lang.js";
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		supplierId: '', //参展商id
		url: '', //路径
		language:'',	//语言
		dataList: [],
		array: [], //活动规则
		idArr: [], //选择的id组
		pageNum: 1, //页码
		pageSize: 10, //大小
		num: 0,
		item: {}, //要传的数组中对象
		body: [], //要传的数组
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		wx.setNavigationBarTitle({
			title: getString('exhibitors_index', 'app.activity.top'),
			
		  })
		
		// 判断语言类型
		var language = wx.getStorageSync('lang')
		this.setData({
			language:language,
			activity: {
				back: getString('exhibitors_index', 'app.activity.back'),
				confirm: getString('exhibitors_index', 'app.activity.confirm'),
				
				rule: getString('exhibitors_index', 'app.activity.rule'),
				city: getString('exhibitors_index', 'app.activity.city'),
				kind: getString('exhibitors_index', 'app.activity.kind'),
				name: getString('exhibitors_index', 'app.activity.name'),
				num: getString('exhibitors_index', 'app.activity.num'),
				price: getString('exhibitors_index', 'app.activity.price'),
				texture: getString('exhibitors_index', 'app.activity.texture'),
				
			},
		})
		this.setData({
			array: JSON.parse(options.arr)
		})

		console.log(this.data.array,'6565656565565')


		this.setData({
			supplierId: wx.getStorageSync('userInfo').id
		})
		this.setData({
			url: app.globalData.host
		})

		this.getInfo()
	},

	// https://live.signchinashow.com/api3/activitypair/79



	// 获取信息
	getInfo: function() {
		var that = this
		wx.request({
			url: that.data.url + '/api3/demand/list',
			method: "GET",
			data: {
				pageNum: that.data.pageNum, //页码
				pageSize: that.data.pageSize, //大小
				activityid: that.data.array.id
			},
			success: res => {
				console.log(res,'/api3/demand/list')
				if (res.data.code == 0) {
					if(res.data.result.data.length == 0){
						if(that.data.language != 'en'){
							wx.showToast({
								title:'暂无配对活动',
								icon:"none",
								duration:2000
							})
						}else{
							wx.showToast({
								title:'No activity',
								icon:"none",
								duration:2000
							})
						}
						
						return false
					}
					for (var i = 0; i < res.data.result.data.length; i++) {
						res.data.result.data[i].checked = false;
						that.data.dataList.push(res.data.result.data[i])
					}
					that.setData({
						dataList: that.data.dataList
					})

					that.data.dataList = [...that.data.dataList];
					console.log(that.data.dataList, 'that.data.dataList')
					if (that.data.dataList.length >= that.data.pageSize) {
						that.data.pageNum++
					} else {
						if(that.data.pageNum == 1 && that.data.dataList.length <= that.data.pageSize){
							return false
						}
						if(that.data.language != 'en'){
							wx.showToast({
								title:'暂无更多数据',
								icon:"none",
								duration:2000
							})
						}else{
							wx.showToast({
								title:'No more data available',
								icon:"none",
								duration:2000
							})
						}
					}

				}

			}

		})
	},
	// 返回
	back: () => {
		wx.navigateBack({
			delta: 1
		})
	},

	// 选择采购商
	change: function(e) {

		var that = this
		var index = e.currentTarget.dataset.index

		for (var i = 0; i < that.data.dataList.length; i++) {
			if (i == index) {
				if (that.data.dataList[index].checked == true) {
					that.data.dataList[index].checked = false
					that.data.num = that.data.num - 1
				} else {
					if (that.data.num < 3) {
						that.data.dataList[index].checked = true
						that.data.num = that.data.num + 1
					} else {
						
						if(that.data.language != 'en'){
							wx.showToast({
								title: '最多只能选三个',
								icon: "none",
								duration: 2000
							})
						}else{
							wx.showToast({
								title:'Choose three at most',
								icon:"none",
								duration:2000
							})
						}
					}

				}

			}

		}

		that.data.dataList = [...that.data.dataList];
		that.setData({
			dataList: that.data.dataList
		})
		
	},
	
	// 确认
	comfirm:function() {
		var that = this
		that.data.body = []
		
		for (var j = 0; j < that.data.dataList.length; j++) {
			if (that.data.dataList[j].checked == true) {
				that.data.item = {}
				that.data.item.demandId	= that.data.dataList[j].id	//需求id
				that.data.item.purchaserId = that.data.dataList[j].purchaserId		//采购商管id
				that.data.item.sponsor = 0		//0 -- 供应商发起
				that.data.item.supplierId = that.data.supplierId	//供应商id
				
				that.data.body.push(that.data.item)
			}
			
		}
		console.log(that.data.body,'that.data.body')
		var supplierId = wx.getStorageSync('userInfo').id

		var url = app.globalData.host
		wx.request({
			url:url + '/api3/activitypair/invite/'+ that.data.array.id + '/'+that.data.supplierId,
			method:'POST',
			data:that.data.body,
			success:res=>{
				console.log(res,'/api3/activitypair/invite')
				if(res.data.code == 0){
					
					if(that.data.language != 'en'){
						wx.showToast({
							title:'配对成功',
							icon:"none",
							duration:2000,
							success:()=>{
								setTimeout(function(){
									wx.navigateBack({
										delta:1
									})
								},2500)
							}
						})
					}else{
						wx.showToast({
							title:'Matching success',
							icon:"none",
							duration:2000,
							success:()=>{
								setTimeout(function(){
									wx.navigateBack({
										delta:1
									})
								},2500)
							}
						})
					}
				}else{
					wx.showToast({
						title:res.data.message,
						icon:"none",
						duration:3000,
						success:()=>{
						}
					})
				}
			}
		})

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		if (this.data.pageNum > 1) {
			this.getInfo()
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
