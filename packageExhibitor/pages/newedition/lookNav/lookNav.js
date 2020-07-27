// packageExhibitor/pages/newedition/lookNav/lookNav.js
let i18n = require("../../../../i18n/i18n");
let storage = require("../../../../utils/storage.js");
let api = require("../../../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEn: i18n.isEn(),
    stadiumNavigation:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    (0, api.getColumns)({
      data: {
        pageNum: 1,
        pageSize: 999,
        types: 1,
        projectId: storage.getActivityDetail().id,
      },
      success: function (res) {
        res && res.data &&
        res.data.result &&
        res.data.result.data.map((item, index) => {
          if (item.link === "cgzn") {
            _self.setData({
              stadiumNavigation: item,
            });
          }
        });
      },
    });

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