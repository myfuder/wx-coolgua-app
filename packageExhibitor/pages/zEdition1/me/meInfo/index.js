// packageExhibitor/pages/zEdition1/me/meInfo/index.js
import {getString} from "../../../../../locals/lang.js";
import {defaultUserImage, edit_icon_image} from "../../../../../common/staticImageContants";
//获取应用实例
const app = getApp()
const i18n = require('../../../../../i18n/i18n')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTabIndex: 0,
    info: '',
    list: [],
    language: '',
    product: '',
    height: wx.getSystemInfoSync().screenHeight,
    defaultUserImage,
    edit_icon_image,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.product) {
      this.setData({
        currentTabIndex: 1
      })
      this.currentTabIndex = 1
    }
    // 判断语言类型
    var language = wx.getStorageSync('lang')
    this.setData({
      language: language,
      switchTabStr: [
        getString('exhibitors_index', 'app.home.menus1'),
        getString('exhibitors_index', 'app.mine.menu3')
      ],
      str: {
        editInfo: getString('wp', 'app.btn.editInfo')
      },
      label: {
        roomNum: getString('wp', 'app.meinfo.room.roomNum'),
        doorNum: getString('wp', 'app.meinfo.room.doorNum'),
        link: getString('wp', 'app.meinfo.room.link'),
        productType: getString('wp', 'app.meinfo.room.productType'),
        companyPic: getString('wp', 'app.company.logo'),
        liveVideo: getString('wp', 'app.liveVideo'),
        companyIntroll: getString('wp', 'app.company.introll'),
      },
    })
    // this.initinfo()
  },
  switchTabClick(event) {
    this.setData({
      currentTabIndex: event.currentTarget.dataset.idx
    })
    if (event.currentTarget.dataset.idx == 1) {
      this.zhanpinlist()
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.mine.menu3')
      })
    } else {
      this.initinfo()
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.home.menus1')
      })
    }
  },
  seeZoomImage() {
    wx.previewImage({
      current: 0,
      urls: [this.data.info.portrait]
    })
  },
  gotoEdit() {
    wx.navigateTo({
      url: '/packageExhibitor/pages/zEdition1/me/meInfo/edit/index?id=' + wx.getStorageSync('userInfo').id,
    })
  },
  go2editInfo() {
  },
  initinfo() {
    var that = this
    var id = wx.getStorageSync('userInfo').id // 展商id
    var url = app.globalData.host + '/api3/supplier/detail/' + id;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          var info = res.data.result
          info.introduction = info.introduction && info.introduction.substr(0, 250);
          info.introductionEn = info.introductionEn && info.introductionEn.substr(0, 250)
          that.setData({
            info: info
          })
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  zhanpinlist() {
    var that = this
    var supplierId = wx.getStorageSync('userInfo').id // 展商id
    var url = app.globalData.host + '/api3/exhibit/getExhibits/' + supplierId;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          that.setData({
            list: res.data.result
          })
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  //添加展品
  addproduct() {
    wx.navigateTo({
      url: '/packageExhibitor/pages/zEdition1/product/edit/index',
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
    if (this.data.currentTabIndex == 0) {
      this.initinfo()
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.home.menus1')
      })
    } else {
      this.zhanpinlist()
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.mine.menu3')
      })
    }

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