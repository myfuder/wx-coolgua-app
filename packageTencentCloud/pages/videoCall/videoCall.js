// packageTencentCloud/pages/videoCall/videoCall.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomID: '',
    fromNick: '',
    fromID: '',
  },
  receive() {
    let url = `/packageTencentCloud/pages/meeting/meeting?id=${this.data.roomID}`
	console.log(url)
    wx.redirectTo({
      url: url,
    })
  },
  reject() {
    var message = wx.$app.createCustomMessage({
      to: this.data.fromID,
      conversationType: 'C2C',
      payload: {
        data: JSON.stringify({
          type: 'TRTC_EVENT_MEETING_REJECT'
        }), // 用于标识该消息是骰子类型消息
        description: '拒绝视频邀请', // 获取骰子点数
      }
    });
    wx.$app.sendMessage(message).then(res => {
      if (res.code !== 0) {
        wx.showToast({
          title: '拒绝视频邀请失败',
        })
      }
    }).catch(err => {
      if (res.code !== 0) {
        wx.showToast({
          title: '拒绝视频邀请失败',
        })
      }
    })
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const data = JSON.parse(options.data)
    this.setData({
      fromID: data.fromID,
      fromNick: data.fromNick,
      roomID: data.roomID,
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