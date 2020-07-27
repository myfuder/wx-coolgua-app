// miniprogram/pages/meeting.js
import TIM from 'tim-wx-sdk'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fromnick:'',
	  videoCustom:null
  },
	receive(){
		let url = `/packageExhibitor/pages/zEdition1/im/room/room?roomID=${this.data.videoCustom.roomId}&template=${this.data.videoCustom.template}&debugMode=${this.data.videoCustom.debugMode}&cloudenv=${this.data.videoCustom.cloudenv}`
		// wx.navigateTo({
		// 	url: url,
		// })
		wx.redirectTo({
			url: url,
		})
	},
	reject(){
		var that =this
		var message = wx.$app.createCustomMessage({
			to:that.data.videoCustom.fromuserid,
			conversationType:'C2C',
			payload: {
				data: '拒绝视频邀请', // 用于标识该消息是骰子类型消息
				description: '拒绝视频邀请', // 获取骰子点数
				extension: 'rejectvideoCallInvite'
			}
		});
		wx.$app.sendMessage(message).then(res=>{
		   if(res.code == 0){
				console.log('发送成功')
		   }
		}).catch(err=>{
			console.log(err)
		})
		wx.navigateBack({})
	},
 
  /**
   * 生命周期函数--监听页面加载
   * @param {Object} options 参数
   */
  onLoad: function(options) {
    const videoCustom = JSON.parse(options.data)
    this.setData({
      videoCustom:videoCustom
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})
