// packageExhibitor/pages/zEdition1/ExhibitorsService/activity/index.js
import {
	getString
} from "../../../../../../locals/lang.js";
const util = require("../../../../../../utils/util.js"); //根据自己项目的位置而定
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: '',
		dataList: [],
		language: '',
		time: '', //当前时间戳

		// 进入会议所需参数
		roomID: '',
		userID: 'user1',
		template: 'grid',
		cloudenv: 'PRO',
		scene: 'rtc',
		localVideo: true,
		localAudio: true,
		enableEarMonitor: false,
		enableAutoFocus: true,
		localMirror: 'auto',
		enableAgc: true,
		enableAns: true,
		encsmall: false,
		frontCamera: 'front',
		resolution: 'SD',
		debugMode: false,
		isHide: true, //暂无更多数据
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var timestamp = Date.parse(new Date());


		// 调用函数时，传入new Date()参数，返回值是日期和时间
		// var time = util.formatTime('1587124800000');
		// console.log(time,'获取时间')
		// 再通过setData更改Page()里面的data，动态更新页面的数据
		this.setData({
			time: timestamp
		});
		// console.log(formatTime(''))
		console.log(this.data.time, '当前时间戳')
		// 设置标题
		wx.setNavigationBarTitle({
			title: getString('exhibitors_index', 'app.activity.top2'),
		})
		var supplierId = wx.getStorageSync('userInfo').id
		// var supplierId = '0840bbaadefd415cbb5b8373053eb15a'
		console.log(supplierId, '====supplierId===')
		// 判断语言类型
		var language = wx.getStorageSync('lang')

		this.setData({
			language: language,
			activity: {
				rule: getString('exhibitors_index', 'app.activity.rule'),
				city: getString('exhibitors_index', 'app.activity.city'),
				kind: getString('exhibitors_index', 'app.activity.kind'),
				name: getString('exhibitors_index', 'app.activity.name'),
				num: getString('exhibitors_index', 'app.activity.num'),
				price: getString('exhibitors_index', 'app.activity.price'),
				texture: getString('exhibitors_index', 'app.activity.texture'),
			
				status1: getString('exhibitors_index', 'app.activity.status1'),
				status2: getString('exhibitors_index', 'app.activity.status2'),
				
				hint: getString('exhibitors_index', 'app.activity.hint'),
			}
		})
		var url = app.globalData.host
		wx.request({
			url: url + '/api3/activitypair/inviteslist/' + supplierId + '/' + options.id,
			method: "GET",
			data: {
				// supplierId:supplierId
			},
			success: res => {
				console.log(res, 'api3/activitypair/inviteslist')
				if (res.data.code == '0') {
					if (res.data.result == 0) {
						this.setData({
							isHide: false
						})

					} else {
						this.setData({
							dataList: res.data.result
						})
						this.setData({
							isHide: true
						})
					}

				}
			}
		})

	},
	enterRoom: function (e) {
		// var that = this
		var Url = app.globalData.host
		console.log(e.currentTarget.dataset.item)
		var that = this
		wx.request({
			url: Url + '/api3/activitypair/intermeetingsupplier/' + e.currentTarget.dataset.item.activityPairId,
			method: "GET",
			data: {},
			success: res => {

				if (res.data.code == '0') {
					const nowTime = new Date()
					if (nowTime - that.tapTime < 1000) {
						return
					}
					that.setData({
						roomID: res.data.result
					})
					
					const url = `/packageTencentCloud/pages/meeting/meeting?id=${res.data.result}&toID=${e.currentTarget.dataset.item.purchaserId}`
					// const url = `/im/room/room?roomID=${res.data.result}` +
					// 	`&template=${that.data.template}` +
					// 	`&debugMode=${that.data.debugMode}` +
					// 	`&cloudenv=${that.data.cloudenv}` +
					// 	`&localVideo=${that.data.localVideo}` +
					// 	`&localAudio=${that.data.localAudio}` +
					// 	`&enableEarMonitor=${that.data.enableEarMonitor}` +
					// 	`&enableAutoFocus=${that.data.enableAutoFocus}` +
					// 	`&localMirror=${that.data.localMirror}` +
					// 	`&enableAgc=${that.data.enableAgc}` +
					// 	`&enableAns=${that.data.enableAns}` +
					// 	`&encsmall=${that.data.encsmall}` +
					// 	`&frontCamera=${that.data.frontCamera}` +
					// 	`&videoWidth=${that.data.videoWidth}` +
					// 	`&videoHeight=${that.data.videoHeight}` +
					// 	`&scene=${that.data.scene}` +
					// 	`&minBitrate=${that.data.minBitrate}` +
					// 	`&maxBitrate=${that.data.maxBitrate}`
					// const reg = /^[0-9a-zA-Z]*$/
					wx.navigateTo({
						url: url,
					})
					that.setData({
						'tapTime': nowTime
					})
				}
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

	}
})