// packageExhibitor/pages/zEdition1/demand/detail/index.js
import {getString} from "../../../../../locals/lang.js";

const i18n = require('../../../../../i18n/i18n')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    demandDetail: null,
    dialogShow: false,
    height: wx.getSystemInfoSync().screenHeight,
    langIsEn: i18n.isEn(),
    langTranslate: i18n.langTranslate()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: getString('exhibitors_index', 'app.demand.title')
    })
    this.setData({
      label: {
        pic: getString('wp', 'com.label.pic')
      }
    })
    let id = options.id;
    this.loadData(id);
  },
  handleHide() {
    this.setData({
      dialogShow: false
    })
  },
  handleShow(param) {
    console.log('参数是：', param)
    this.setData({
      dialogShow: true,
      dialogParam: param.detail
    })
  },
  loadData(id) {
    let url = app.globalData.host + `/api3/demand/${id}`
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('banner:', res)
        if (res.data.code == '0') {
          that.setData({
            demandDetail: res.data.result
          })
          console.log("详情是：", res.data)
        } else {
          console.log(res.data.message)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  previewImage(e) {
    console.log(e.currentTarget.dataset.index)
    var arr = []
    var index = e.currentTarget.dataset.index
    if (this.data.demandDetail.image1 != '') {
      arr.push(this.data.demandDetail.image1)
    }
    if (this.data.demandDetail.image2 != '') {
      arr.push(this.data.demandDetail.image2)
    }
    if (this.data.demandDetail.image3 != '') {
      arr.push(this.data.demandDetail.image3)
    }
    if (this.data.demandDetail.image4 != '') {
      arr.push(this.data.demandDetail.image4)
    }
    console.log(arr)
    if (this.data.demandDetail.image3 == '' && this.data.demandDetail.image4 != '') {
      index--
    }
    wx.previewImage({
      current: arr[index],
      urls: arr
    })
  },
  //点击图片查看大图
  wxParseImgTap: function (event) {
    var that = this;
    //点击详情页图片查看大图，列表页跳转详情页
    var nowImgUrl = event.target.dataset.src;
    var imageUrls = []
    imageUrls.push(nowImgUrl)
    var tagFrom = event.target.dataset.from;
    console.log(nowImgUrl, imageUrls)
    if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
      wx.previewImage({
        current: nowImgUrl, // 当前显示图片的http链接
        urls: imageUrls // 需要预览的图片http链接列表
      })
    }
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