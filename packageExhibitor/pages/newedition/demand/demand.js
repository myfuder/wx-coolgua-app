// packageExhibitor/pages/newedition/demand/demand.js
const app = getApp();
import {demand_fire,filter_btn,search_btn,
  messageActiveButton,messageActiveButton_disbaled,
  likeButton,likeButton_active,
  collect_button_active,collect_button
} from "../../../../common/staticImageContants";
import {getString} from "../../../../locals/lang.js";
import {getCurrentPage1,
  ajax,
  isInCollectList,
  isInLikeList, merrayLikeList, pushOneInCollectList,
  pushOneInLikeList,
  removeOneInCollectList,
  removeOneInLikeList} from "../../../../utils/util";

const i18n = require('../../../../i18n/i18n')
let langTranslate = i18n.langTranslate();
const api = require('../../../../utils/api');
const storage = require('../../../../utils/storage')
import {API_URL} from "../../../../utils/constant";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    demand_fire,filter_btn,search_btn,
    messageActiveButton,messageActiveButton_disbaled,
    likeButton,likeButton_active,
    collect_button_active,collect_button,
    isShowSearch:false,
    // pageNum:1,
    // pageSize:10,
    pages: 1,
    pageNumber: 1,
    list2: [],
    dialogShow: false,
    isProgressing: false,
    tags: "",
    key: "",
    isMore: true,
    height: wx.getSystemInfoSync().screenHeight,
    loading:langTranslate["数据加载中"],
    isEn: i18n.isEn(),
    isLikedItem: false,
    isCollectedItem: false,
    language: '',
    lang: '',
    langTranslate: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabBar1();
    // 判断语言类型
    var language = wx.getStorageSync('lang')
    this.setData({
      language: language,
      lang: language,
      langTranslate: i18n.langTranslate(),
    })
    wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.nav.demand'),
    })
    this.filterTagsTriggerData();

  },
  mesgClick() {
    if (this.properties.item.online == 0) {
      wx.showToast({
        title: langTranslate['不在线'],
        icon: 'none'
      })
    } else {
      var that = this
      let data = {
        conversationID: 'C2C' + that.properties.userid,
        type: 'C2C',
        toId: that.properties.userid,
        toName: that.properties.item.company,
        nick: that.properties.item.company
      }
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/im/chat/chat?data=' + JSON.stringify(data),
      })
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
  async likeClick(e) {
    var self = this;
    let ids=e.currentTarget.dataset.id;
    let params = {
      userId: storage.getUserInfo().id,
      type: this.properties.type,
      src: this.properties.src,
      operation: 0,   //0 点赞 1 收藏,
      objectId: ids,
      projectId: storage.getActivityDetail().id,
      pageNum: 0,
      pageSize: 998,
      passive: 0,
    }
    if (this.data.isLikedItem.objectId) {
      var id = this.data.isLikedItem.id
      var isLikedItem = this.data.isLikedItem
      ajax.get(`${API_URL}/livecollect/del/${isLikedItem.id}`, params)
      removeOneInLikeList(self.properties.type, isLikedItem.objectId)
      self.setData({
        isLikedItem: {}
      })
    } else {
      var id = await ajax.post(`${API_URL}/livecollect`, params).then(res => {
        return res.result
      })
      pushOneInLikeList(self.properties.type, {
        objectId: self.properties.item.id,
        id
      })
      self.setData({
        isLikedItem: {
          objectId: self.properties.item.id,
          id: id
        }
      })
    }
  },
  async collectClick(e) {
    var self = this;
    let ids=e.currentTarget.dataset.id;
    var params = {
      userId: storage.getUserInfo().id,
      type: this.properties.type,
      src: this.properties.src,
      operation: 1,   //0 点赞 1 收藏,
      objectId: ids,
      projectId: storage.getActivityDetail().id,
      pageNum: 0,
      pageSize: 998,
      passive: 0,
    }
    if (this.data.isCollectedItem.objectId) {
      var id = this.data.isCollectedItem.id
      var isCollectedItem = this.data.isCollectedItem
      if (!id) {
        // 先获取id在删除
        var list = await ajax.get(`${API_URL}/livecollect/list`, params).then(res => {
          return res && res.result && res.result.data
        })
        var idIndex = list.findIndex(item => item.objectId == ids)
        //查询到的list合并带localstage
        if (idIndex >= 0) {
          id = list[idIndex] && list[idIndex].id
          isCollectedItem = list[idIndex]
          merrayLikeList(this.properties.type, list)
        }
      }
      ajax.get(`${API_URL}/livecollect/del/${isCollectedItem.id}`, params)
      removeOneInCollectList(self.properties.type, self.data.isCollectedItem && self.data.isCollectedItem.id || self.properties.item.objectId)
      self.setData({
        isCollectedItem: {}
      })
    } else {
      var params = {
        userId: storage.getUserInfo().id,
        type: this.properties.type,
        src: this.properties.src,
        operation: 1,   //0 点赞 1 收藏,
        objectId: this.properties.item.id,
        projectId: storage.getActivityDetail().id
      }
      self.setData({
        isCollectedItem: {objectId: self.properties.item.id}
      })
      var id = await ajax.post(`${API_URL}/livecollect`, params).then(res => res.result)
      console.log("collect return id",id)
      pushOneInCollectList(self.properties.type, {
        objectId: id || self.properties.item.id,
        id: id
      })
      self.setData({
        isCollectedItem: {
          objectId: id || self.properties.item.id,
          id: id
        }
      })
    }
  },
  // go2demandDetail:function(e) {
  //   let id=e.currentTarget.dataset.id
  //   wx.navigateTo({
  //     url: `/packageExhibitor/pages/zEdition1/demand/detail/index?id=${id}`,
  //   })
  // },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    var child1 = this.selectComponent('#needsList')
    if (child1) {
      child1.reachBottom();
    }
    this.loadData()
  },
  filterTagsTriggerData() {
      this.setData({
          list2:[],
          pageNumber: 1,
          isMore: true,
      })
      this.loadData()
  },
  toDetail:function(e){
    // let id=e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: `/packageExhibitor/pages/newedition/demandDetail/demandDetail?id=${id}`
    // })
  },
  immediateAppointment(){
    this.triggerEvent('handleShow', this.data.value)
  },
  loadData(direction = 0) {
      if (this.data.isProgressing) {
          return;
      }
      this.setData({
          isProgressing: true
      })
      var projectId = wx.getStorageSync('activityDetail').id
      let num = this.data.pageNumber
      var tags=getCurrentPage1().data.tags||""
      var key=getCurrentPage1().data.key||""
      /*  if (direction == -1) {
            num--
        } else if (direction == 1) {
            num = num + 1
        }*/
      if(!this.data.isMore)return false
      var l = `/api3/demand/list?pageNum=${num}&pageSize=${10}&projectId=${projectId}&demandType=${tags}&demandName=${key}`
      let url = app.globalData.host + l
      var that = this;
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
              if (res.data.code == '0') {
                  // that.setData({
                  //     list2: []
                  // })
                  // let ar = [...that.data.list2, ...res.data.result.data]
                  let ar = res.data.result.data;
                  let pageNumber=that.data.pageNumber
                  var isMore=true
                  if(ar.length<10){
                      pageNumber=pageNumber
                      isMore=false
                  }else{
                      pageNumber=pageNumber+1
                      isMore=true
                  }
                  ar = that.data.list2.concat(res.data.result.data);
                  // var list1 = util.mergeArray(that.data.list1, ar)
                  that.setData({
                      list2: ar,
                      pages: res.data.result.pages,
                      pageNumber:pageNumber,
                      isMore
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
  //打开筛选
  openFilter:function(e){
    this.setData({
      isShowSearch:true
    })
  },
  //确认筛选
  comfire:function(tags){
    this.setData({
      isShowSearch:false,
      tags:tags.detail
    })
    this.filterTagsTriggerData();

  },
  //关闭筛选
  close:function(tags){
    this.setData({
      isShowSearch:false,
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})