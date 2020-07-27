//index.js
//获取应用实例
const app = getApp();
let TIME = 60;
let _self = null;
let api = require("../../utils/api"),
  constant = require("../../utils/constant"),
  i18n = require("../../i18n/i18n.js"),
  storage = require("../../utils/storage.js"),
  util = require("../../utils/util");
const {
  defaultUserImage
} = require('../.././common/staticImageContants')
Page({
  data: {
    canClick: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openId: '',
    phoneNumber: '',
    staticImageUrl: constant.STATIC_IMAGE_URL,
    defaultUserImage,
  },
  // 页面加载
  onLoad: function () {
    _self = this;
    //获取对应组织下的活动列表
    _self.getProjects();
    _self.setData({
      openId: wx.getStorageSync('user').openId,
      phoneNumber: wx.getStorageSync('phoneNumber')
    });
    wx.setNavigationBarTitle({
      title: i18n.langTranslate()[storage.getActivityDetail().name],
    });
  },
  // 获取该组织下所有激活状态的活动列表
  getProjects: function () {
    (0, api.getProjectList)({
      success: function (res) {
        _self.getAcvitity(res.data.result[0].id);
      },
    });
  },
  // 获取激活状态下的第一个活动详情
  getAcvitity: function (id) {
    (0, api.getProjectDetail)({
      query: {
        id: id,
      },
      success: function (res) {
        storage.setActivityDetail(res.data.result);
        var phoneNumber = wx.getStorageSync('phoneNumber')
        var openId = wx.getStorageSync('user').openId
        if (phoneNumber && openId) {
          //观众或者展商已经授权了，绑定展商和观众
          _self.contacts(openId, phoneNumber, res.data.result.id)
          return false
        } else {
          //观众或者展商没有授权了，切换对应角色
          _self.initRole();
          return false
        }
      },
    });
  },
  // 查询展商联系人
  contacts: function (openId, phoneNumber, activityId) {
    var that = this;
    var role = wx.getStorageSync("role");
    if (role == "exhibitor") {
      var url = app.globalData.host + "/api3/suppliercontact/getSupplierContact?projectId=" + activityId + "&weixinId=" + openId + "&mobile=" + phoneNumber;
    } else {
      var url = app.globalData.host + "/api3/purchaser/getPurchaserByWxId?projectId=" + activityId + "&weixinId=" + openId + "&mobilePhone=" + phoneNumber;
    }
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
      success: function (res) {
        if (res.data.code == "0") {
          if (role == "exhibitor") {
            storage.setUserInfo(res.data.result);
            storage.setRoleType(constant.ROLE_TYPE.EXHIBITOR);
          } else {
            storage.setUserInfo(res.data.result);
            storage.setRoleType(constant.ROLE_TYPE.PURCHASER);
          }
          that.initRole();
        } else if (res.data.code == "1" && res.data.message == "数据不存在") {
          that.initRole();
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000,
            success: function () {
              return false;
            },
          });
          return false;
        }
      },
      fail: function (error) {
        console.log(error);
      },
    });
  },
  // 角色判断
  // 判断用户之前是否授权，以什么身份登录
  initRole() {
    /*  wx.showLoading({
        title: '加载中',
        mask: true
      })*/
    var role = wx.getStorageSync("role");
    var authorization = wx.getStorageSync("authorization");
    var phone = wx.getStorageSync("phone");
    if (storage.getUserInfo() != '' && storage.getUserInfo() != null && storage.getUserInfo() != undefined) {
      var userInfo = true
    } else {
      var userInfo = false
    }
    if (authorization && phone && role == 'exhibitor' && userInfo) {
      wx.reLaunch({
        url: "/packageExhibitor/pages/zEdition1/index",
      });
    } else if (authorization && phone && role == 'exhibitor' && !userInfo) {
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/register/register'
      });
    } else if ((!authorization && role == 'exhibitor') || (!phone && role == 'exhibitor')) {
      wx.reLaunch({
        url: '/packageExhibitor/pages/zEdition1/authorize/authorize'
      });
    } else if (authorization && phone && role == 'purchaser' && userInfo) {
      wx.reLaunch({
        url: "/packagePurchaser/pages/purchaser/tabbar/index/index",
      });

    } else if (authorization && phone && role == 'purchaser' && !userInfo) {
      wx.reLaunch({
        url: "/packagePurchaser/pages/purchaser/register/register",
      });
    } else if ((!authorization && role == 'purchaser') || (!phone && role == 'purchaser')) {
      wx.reLaunch({
        url: "/packagePurchaser/pages/purchaser/tabbar/index/index",
      });
    } else {
      wx.hideLoading()
    }
  },
  // 点击我是参展商按钮
  exhibitorAutoLogin: function () {
    wx.setStorageSync('role', 'exhibitor')
    wx.navigateTo({
      url: "/packageExhibitor/pages/zEdition1/authorize/authorize",
    })
  },
  // 点击我是观众按钮
  visitorAutoLogin: function () {
    wx.setStorageSync('role', 'purchaser')
    wx.navigateTo({
      url: "/packagePurchaser/pages/purchaser/tabbar/index/index",
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})