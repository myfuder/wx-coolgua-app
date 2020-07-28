// packageExhibitor/pages/newedition/buyersList/buyersList.js
const app = getApp();
import {demand_fire,filter_btn,search_btn,
  messageActiveButton,messageActiveButton_disbaled,
  likeButton,likeButton_active,
  collect_button_active,collect_button
} from "../../../../common/staticImageContants";
import {getString} from "../../../../locals/lang.js";
import {getCurrentPage1} from "../../../../utils/util";
let i18n = require("../../../../i18n/i18n");
let langTranslate = i18n.langTranslate();
const util = require('../../../../utils/util');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    demand_fire,filter_btn,search_btn,
    messageActiveButton,messageActiveButton_disbaled,
    likeButton,likeButton_active,
    collect_button_active,collect_button,
    isShowSearch:false,
    pages: 1,
    pageNumber: 1,
    list1: [],
    filterViewVisible: true,
    filterData: null,
    dialogShow: false,
    isProgressing: false,
    tags: "",
    isMore: true,
    key: "",
    height: wx.getSystemInfoSync().screenHeight,
    loading:langTranslate["数据加载中"],
    totalCount:0,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar1();
    wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.nav.buyers'),
    })
    this.loadData();
  },
  subDate:function (val, start, stop) {
    if (val) {
      return val.substring(start, stop)
    } else {
      return ''
    }
  },
  changeKeyTap(e) {
    var key = e.detail.value;
    this.setData({
      key
    })
    getCurrentPage1().setData({
      key
    })
  },
  bindconfirm() {
    util.getCurrentPage1().filterTagsTriggerData && util.getCurrentPage1().filterTagsTriggerData()
  },
  attached:function(e) {
    this.value = {
      detail: {
        tags: '',
        key: ''
      }
    }
    var tag = wx.getStorageSync('userInfo').tags
    this.setData({
      isEn: wx.getStorageSync('lang') == 'en',
      str: {
        placeholder: getString('wp', 'app.search.placeholder'),
        filter: getString('wp', 'app.search.filter'),
      },
      loading: getString('exhibitors_index', 'app.home.loading'),
      tags: tag,
    })
    this.searchData();
  },
  preClick() {
    if (this.data.pageNumber > 1) {
      this.loadData(-1)
    }
  },
  nextClick() {
    if (this.data.pageNumber < this.data.pages) {
      this.loadData(1)
    }
  },
  reachBottom(e) {
    this.searchData(e)
  },
  filterTagsTriggerData() {
    this.setData({
      list1: [],
      pageNumber: 1,
      isMore: true,
    }, () => {
      this.loadData()
    })
  },
  triggerSearch(e) {
    var tags = getCurrentPage1().data.tags || ""
    var key = getCurrentPage1().data.key || ''
    this.setData({
      tags,
      key,
      pageNumber: 1,
      isMore: true,
    }, () => {

      this.searchData()
    })

  },
  searchData() {
    this.loadData()
  },
  detailClick:function(e) {
    let id=e.currentTarget.dataset.id
    // var projectId = wx.getStorageSync('activityDetail').id
    // wx.navigateTo({
    //   // url: `/packageExhibitor/pages/zEdition1/purchaser/detail/index?id=${item.id}&purchaserId=${item.purchaserId}&projectId=${item.projectId}`,
    //   url: `/packageExhibitor/pages/zEdition1/purchaser/detail/index?purchaserId=${id}&projectId=${projectId}`,
    // })
  },
  loadData(direction = 0) {
    var that = this;
    this.setData({
      isProgressing: true
    })
    var projectId = wx.getStorageSync('activityDetail').id
    var tags = util.getCurrentPage1().data.tags || ""
    var key = util.getCurrentPage1().data.key || ""
    if (tags && tags[0] == '[') {
      tags = tags.slice(1, tags.length - 1)
      tags = tags.split(',').map(item => item.trim())
      tags = tags.join(",")
    }
    let url = app.globalData.host + `/api3/purchaser/getSupplierPurchasers?pageNum=${this.data.pageNumber}&pageSize=${10}&projectId=${projectId}&tags=${that.data.tags}&key=${that.data.key}`

    if (!this.data.isMore) {
      return false
    }
    wx.showLoading({
      title: this.data.loading,
    })
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

        console.log('banner:', res)
        if (res.data.code == '0') {
          // let ar = [...that.data.list1, ...res.data.result.data]
          let ar = res.data.result.data
          let num = that.data.pageNumber
          var isMore = true
          if (ar.length < 10) {
            isMore = false
          } else {
            num++
            isMore = true
          }
          var list1 = util.mergeArray(that.data.list1, ar)
          that.setData({
            list1,
            isMore,
            pages: res.data.result.pages,
            pageNumber: num,
          })
          getCurrentPage1().setData({
            list1,
            isMore,
            pages: res.data.result.pages,
            pageNumber: num,
            totalCount:res.data.result.total
          })
        } else {
          console.log(res.data.message)
        }
        that.setData({
          isProgressing: false
        })
        wx.hideLoading()
      },
      fail: function (error) {
        console.log(error)
        that.setData({
          isProgressing: false
        })
        wx.hideLoading()
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    langTranslate = i18n.langTranslate();
    this.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    })
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
    // if (
    //   !this.data.loading &&
    //   (this.data.list1.length < this.data.totalCount ||
    //     this.data.totalCount < 0)
    // ) {
      this.loadData()
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //打开筛选
  openFilter:function(e){
    this.setData({
      isShowSearch:true
    })
  },
  //关闭筛选
  close:function(tags){
    this.setData({
      isShowSearch:false,
    })
  },
  //关闭筛选
  comfire(tags){
    this.setData({
      isShowSearch:false,
      tags:tags.detail
    })
    this.filterTagsTriggerData();
  }
})