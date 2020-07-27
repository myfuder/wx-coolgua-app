import {getString} from "../../../locals/lang.js";
import {ajax, getCollectListAll, getCurrentPage1, getLikeListAll} from "../../../utils/util";
import {
  tab_image_audience_active,
  tab_image_audience_default, tab_image_business_active, tab_image_business_default,
  tab_image_home_active,
  tab_image_home_default, tab_image_myself_active, tab_image_myself_default
} from "../../../common/staticImageContants";
import {API_URL, API_URL_V2} from "../../../utils/constant";

const storage = require('../../../utils/storage')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingPage: false,
    tabIndex: 0,
    tab_image_home_default,
    tab_image_home_active,
    tab_image_audience_default,
    tab_image_audience_active,
    tab_image_business_default,
    tab_image_business_active,
    tab_image_myself_default,
    tab_image_myself_active,
    statOverview:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.loginim()
    this.setData({
      tab: {
        tab1: getString('exhibitors_index', 'app.footer.menu1'),
        tab2: getString('exhibitors_index', 'app.footer.menu2'),
        tab3: getString('exhibitors_index', 'app.footer.menu3'),
        tab4: getString('exhibitors_index', 'app.footer.menu4')
      }
    })
    if (wx.getStorageSync('lang') == 'en') {
      wx.setNavigationBarTitle({
        title: wx.getStorageSync('activityDetail').nameEn
      })
    } else {
      wx.setNavigationBarTitle({
        title: wx.getStorageSync('activityDetail').name
      })
    }
  },

  selectTab: function (target) {
    console.log("点击的栏目是：", target.currentTarget.dataset.index)
    if (target.currentTarget.dataset.index == 1 || target.currentTarget.dataset.index == 2) {
      getCurrentPage1().setData({
        tags: "",
        key: ""
      })
    }
    this.setData({
      tabIndex: target.currentTarget.dataset.index
    })
    let title = ''
    if (target.currentTarget.dataset.index == 3) {
      title = getString('exhibitors_index', 'app.title.mine')
    } else if (target.currentTarget.dataset.index == 0) {
      if (wx.getStorageSync('lang') == 'en') {
        title = wx.getStorageSync('activityDetail').nameEn
      } else {
        title = wx.getStorageSync('activityDetail').name
      }
    } else if (target.currentTarget.dataset.index == 1) {
      title = getString('exhibitors_index', 'app.footer.menu2')
    } else if (target.currentTarget.dataset.index == 2) {
      title = getString('exhibitors_index', 'app.footer.menu3')

    }
    wx.setNavigationBarTitle({
      title: title
    })
    wx.pageScrollTo({
      scrollTop: 0
    })

    //
    if (target.currentTarget.dataset.index == '3') {
      var a = this.selectComponent("#mychild4")
      a.getinfo && a.getinfo()
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
    var currentUser=storage.getUserInfo()
    if(!currentUser.id){
      //登陆失效跳转首页
      wx.reLaunch({url:'/pages/indexExhibitor/indexExhibitor'})
      return false
    }
    this.getStatOverview()
    getCollectListAll()
    getLikeListAll()

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
    var child1 = this.selectComponent('#mychild1')
    var child2 = this.selectComponent('#mychild2')
    var child3 = this.selectComponent('#mychild3')
    var child4 = this.selectComponent('#mychild4')
    if (child1) {
      child1.reachBottom();
    } else if (child2) {
      child2.reachBottom && child2.reachBottom();
    } else if (child3) {
      child3.reachBottom&&child3.reachBottom();
    } else if (child4) {
      child4 && child4.reachBottom && child4.reachBottom();
    }
  },
  filterTagsTriggerData() {
    var child1 = this.selectComponent('#mychild1')
    var child2 = this.selectComponent('#mychild2')
    var child3 = this.selectComponent('#mychild3')
    var child4 = this.selectComponent('#mychild4')
    if (child1) {
      child1.filterTagsTriggerData();
    } else if (child2) {
      child2&&child2.filterTagsTriggerData && child2.filterTagsTriggerData();
    } else if (child3) {
      console.log("===child3=====>",child3)
      console.log("===filterTagsTriggerData=====>",child3.filterTagsTriggerData)
      child3&&child3.filterTagsTriggerData && child3.filterTagsTriggerData();
    } else if (child4) {
      child4 && child4.filterTagsTriggerData && child4.filterTagsTriggerData();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  async getStatOverview() {
    var userInfo = storage.getUserInfo()
    var statOverview = await ajax.get(`${API_URL}/index/getStatOverview/${userInfo.id}/0`).then(res=>{
      return res.data
    })
    this.setData({
      statOverview
    })
    getCurrentPage1().setData({
      statOverview
    })
  }

})