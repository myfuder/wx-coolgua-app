// packagePurchaser/pages/purchaser/index/hot-video/classification-video/index.js

let api = require("../../../../../../utils/api"), constant = require("../../../../../../utils/constant"), i18n = require('../../../../../../i18n/i18n.js'), storage = require("../../../../../../utils/storage.js"), util = require("../../../../../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_active: 0,
    pageNum:1,
    live_list:[],
    currentPage:1,
    totalPage:0,
    dakalist:[
    ],
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
  },
  goDetailPage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?id=${e.currentTarget.dataset.id}&type=${e.currentTarget.dataset.type}&live_type=${e.target.dataset.live_type}`,
    })
  },
  changePageTap(e){
    let _self = this;
    console.log(e)
    _self.setData({
      currentPage: e.detail
    });
    toggle(null, _self.data.currentPage)
    wx.pageScrollTo({ scrollTop: 0 })
  },
  getLiveList(type){
    let _self = this
    return new Promise((resolve, reject)=>{
      api.sponsorLiveList({
        method: 'post',
        data: {
          projectId: storage.getActivityDetail().id,
          type: type,
          pageNum: _self.data.currentPage,
          pageSize: 10
        },
        success(res) {
          console.log(res)
          resolve(res.data.result);
        }
      })
    })
  },
  toggle:  function (e, currentPage){
    let _self = this
    this.setData({
      tab_active: e ? e.target.dataset.tab : _self.data.tab_active,
      currentPage: currentPage||1,
    }, async () => {
      if (currentPage || (e && e.target.dataset.tab == "zhanshang")) {
        (0, api.getLiveList)({
          query: {
            id: storage.getActivityDetail().id
          },
          data: {
            pageNum: _self.data.currentPage,
            pageSize: 10
          },
          success: function (res) {
            _self.setData({
              live_list: res.data.result.data,
              currentPage: res.pageNum,
              totalPage: res.data.result.pages,
            })
          }
        });
      } else if (currentPage || (e && e.target.dataset.tab == "daka")) {
        _self.setData({
          live_list: []
        })
        let templist = [];
        for (let item of [{ type: 3, value: '亚洲', data: [] },
          { type: 4, value: '欧洲', data: [] },
          { type: 5, value: '美洲', data: [] },
          { type: 6, value: '大洋洲', data: [] },
          { type: 7, value: '非洲', data: [] }]) {
          console.log(item)
          let res = await this.getLiveList(item.type)
          templist.push({ ...item, data:res.data})
        }
        _self.setData({
          dakalist: templist
        })
      } else if (currentPage || e) {
        let res = await this.getLiveList(_self.data.tab_active)
        _self.setData({
          live_list: res.data,
          currentPage: res.pageNum,
          totalPage: res.pages,
        })
      }

      console.log(_self.data.live_list)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this
    this.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    })
    wx.setNavigationBarTitle({
      title: this.data.isEn ? storage.getActivityDetail().nameEn : storage.getActivityDetail().name,
    });
    _self.toggle({ target: { dataset: { tab: options.type||0}}})
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