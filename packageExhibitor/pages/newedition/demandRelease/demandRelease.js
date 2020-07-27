// packageExhibitor/pages/newedition/demandRelease/demandRelease.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:500,
    price:'5000-10000',
    buyerName:"",
    imgList:[{
      name:"图片1",
      url:""
    },{
      name:"图片2",
      url:""
    },{
      name:"图片3",
      url:""
    },{
      name:"图片4",
      url:""
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  chooseImg:function(e){
    let index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        let url = res?res.tempFilePaths:"";
        let imgList = this.data.imgList;
        imgList[index].url = url;
        this.setData({
          imgList: imgList
        })
      }
    })
  }
})