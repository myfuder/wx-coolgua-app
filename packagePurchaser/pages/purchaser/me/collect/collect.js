import {ajax} from "../../../../../utils/util";
import {API_URL} from "../../../../../utils/constant";

let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    staticImageUrl: constant.STATIC_IMAGE_URL,
    statOverview: {},
    getZs_total: {
      zan: 0,
      collect: 0,
      collected: 0,
    },
    getZp_total: {
      zan: 0,
      collect: 0,
      collected: 0,
    },
    userInfo: {}
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    _self = this
    this.getCount()
    _self.initData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // this.getGuanZhong_total()
    // this.getDemand_total()
  },
  /*我点赞的观众*/
  async getGuanZhong_total() {
    var zan = {
      "projectId": storage.getActivityDetail().id,
      "type": 0, //1观众
      "passive": 0,
      "operation": 0,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var collect = {
      "projectId": storage.getActivityDetail().id,
      "type": 0, //1观众
      "passive": 0,
      "operation": 1,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var collected = {
      "projectId": storage.getActivityDetail().id,
      "type": 0, //1观众
      "passive": 1,
      "operation": 1,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var result1 = await ajax.get(`${API_URL}/livecollect/list`, zan)
    this.data.getZs_total.zan = result1.result.total;
    var result2 = await ajax.get(`${API_URL}/livecollect/list`, collect)
    this.data.getZs_total.collect = result2.result.total;
    var result3 = await ajax.get(`${API_URL}/livecollect/list`, collected)
    this.data.getZs_total.collected = result3.result.total;
    this.setData({
      getZs_total: this.data.getZs_total
    })

  },
  async getDemand_total() {
    var zan = {
      "projectId": storage.getActivityDetail().id,
      "type": 2, //1观众
      "passive": 0,
      "operation": 0,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var collect = {
      "projectId": storage.getActivityDetail().id,
      "type": 2, //1观众
      "passive": 0,
      "operation": 1,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var collected = {
      "projectId": storage.getActivityDetail().id,
      "type": 2, //1观众
      "passive": 1,
      "operation": 1,
      "userId": storage.getUserInfo().id,
      "pageNum": 1,
      "pageSize": 20
    }
    var result1 = await ajax.get(`${API_URL}/livecollect/list`, zan)
    this.data.getZp_total.zan = result1.result.total;
    var result2 = await ajax.get(`${API_URL}/livecollect/list`, collect)
    this.data.getZp_total.collect = result2.result.total;
    var result3 = await ajax.get(`${API_URL}/livecollect/list`, collected)
    this.data.getZp_total.collected = result3.result.total;
    this.setData({
      getZp_total: this.data.getZp_total
    })
  },
  // 初始化数据
  initData: function () {
    (0, api.getStatOverview)({
      query: {
        participant: storage.getUserInfo().id,
        sponsor: 1
      },
      success: function (res) {
        _self.setData({
          statOverview: res.data.result,
        })
      }
    });
  },
  goPage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/me/collectList/collectList?role=${e.currentTarget.dataset.page}&type=${e.currentTarget.dataset.type}&operation=${e.currentTarget.dataset.operation}&passive=${e.currentTarget.dataset.passive}`,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  async getCount() {
    var userInfo = storage.getUserInfo()
    var result = await ajax.get(`${API_URL}/purchaser/detail/${userInfo.id}`)
    var result1 = result.result

    this.setData({
      userInfo: result1
    })
    /* getZs_total: {
       zan: 0,
         collect: 0,
         collected: 0,
     },
     getZp_total: {
       zan: 0,
         collect: 0,
         collected: 0,
     },*/

  }
})