// packageExhibitor/pages/zEdition1/purchaser/detail/index.js
import {getString} from "../../../../../locals/lang.js";

var app = getApp();
const i18n=require('../../../../../i18n/i18n');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    purchasetDetail: null,
    list: null,
    dialogShow: false,
    height: wx.getSystemInfoSync().screenHeight,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: getString('exhibitors_index', 'app.purchaser.title')
    })
    this.setData({
      label: {
        productName: getString('wp', 'app.purchase.product.name'),
        num: getString('wp', 'app.purchase.product.num'),
        priceRang: getString('wp', 'app.purchase.product.priceRang'),
        properties: getString('wp', 'app.purchase.product.properties'),
        view: getString('exhibitors_index', 'app.mine.view'),
        publishdemand: getString('exhibitors_index', 'app.home.publishdemand'),
        Industr: getString('wp', 'app.purchase.product.Industr'),
        detail: getString('wp', 'app.purchase.product.detail'),
        kind: getString('wp', 'app.purchase.product.kind'),
        intrest: getString('wp', 'app.intrest.kind'),
      }
    })
    let id = options.id
    let purchaserId = options.purchaserId
    let projectId = options.projectId
    this.loadDetail(id, purchaserId, projectId)
  },
  loadDetail(id, purchaserId, projectId) {
    let url = app.globalData.host + `/api3/purchaser/detail/${purchaserId}`
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
            purchasetDetail: res.data.result
          })
        } else {
          console.log(res.data.message)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
    url = app.globalData.host + `/api3/demand/list?pageNum=${1}&pageSize=${20}&id=${purchaserId}`
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
            list: res.data.result.data
          })
          console.log("详情：", res.data.result.data)
        } else {
          console.log(res.data.message)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  viewDemandDetail(option) {
    let item = option.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/packageExhibitor/pages/zEdition1/demand/detail/index?id=' + item.id,
    })
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