//index.js
//获取应用实例
import {ajax} from "../../../../utils/util";
import {API_URL_V2} from "../../../../utils/constant";
import {defaultUserImage} from "../../../../common/staticImageContants";

const app = getApp()
let api = require("../../../../utils/api"),
  constant = require("../../../../utils/constant"),
  i18n = require("../../../../i18n/i18n.js"),
  storage = require("../../../../utils/storage.js"),
  util = require("../../../../utils/util");
let TIME = 60
Page({
  data: {
    defaultUserImage,
    canClick: true,
    codeNum: '',
    userInfo: {},
    langTranslate: i18n.langTranslate(),
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openId: '',
    session_key: '',
    autoLogin: null,
    buttons: [{text: '取消'}, {text: '授权'}],
    dialogShow: true,
    activityId: '',
    staticImageUrl: constant.STATIC_IMAGE_URL,
    redirect:"",
  },
  //事件处理函数
  userLogin: function (e) {
    var that = this;
    //检查用户是否授权
    if (!e.detail.userInfo) {
      return
    }
    app.globalData.userInfo = e.detail.userInfo;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
      that.getData()
      //wx.setStorageSync('userInfo', e.detail.userInfo);
      wx.setStorageSync('authorization', true)
    } else if (that.data.canIUse) {
      wx.showLoading({ title: that.data. langTranslate["授权中"]})
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        that.getData()
        wx.setStorageSync('authorization', true)
        //wx.setStorageSync('userInfo', res.userInfo)
      }
    }
  },
  authorization: function () {
    wx.getSetting({
      success: res => {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          return
        } else {
          if (app.globalData.userInfo) {
            this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
            })
          } else if (this.data.canIUse) {
            app.userInfoReadyCallback = res => {
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          }
        }
      }
    })
  },
  getData: function () {
    var that = this
    wx.showLoading({ title: that.data. langTranslate["授权中"]})
    wx.login({
      success: res => {
        var url = app.globalData.host + '/api3/wx/code2Session/' + app.globalData.companyId + '/' + res.code;

        wx.request({
          url: url,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            wx.hideLoading({ title: that.data. langTranslate["授权中"]})
            console.log(res)
            wx.setStorageSync('user', {
              openId: res.data.result.openid,
              session_key: res.data.result.session_key
            })
            that.setData({
              openId: res.data.result.openid,
              session_key: res.data.result.session_key,
              dialogShow: false
            })
          },
          fail(res) {
            wx.hideLoading({ title: that.data. langTranslate["授权中"]})
          }
        })
      }
    })
  },
  //   获取授权手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      var data = {}
      wx.request({
        url: app.globalData.host + '/api3/wx/decryptData',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: that.data.session_key
        },
        method: "post",
        success: function (res) {
          that.setData({
            dialogShow: true
          })
          wx.setStorageSync('phoneNumber', res.data.result.phoneNumber)
          wx.setStorageSync('phone', true)
          that.contacts(that.data.openId, res.data.result.phoneNumber)
        }
      })
    } else {
      that.setData({
        dialogShow: true
      })
    }
  },
  // 查询展商联系人
  contacts: function (openId, phoneNumber) {
    var that = this
    var activityId = that.data.activityId
    var url = app.globalData.host + '/api3/purchaser/getPurchaserByWxId?projectId=' + activityId + '&weixinId=' + openId + '&mobilePhone=' + phoneNumber;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == '0') {
          storage.setUserInfo(res.data.result);
          storage.setRoleType(constant.ROLE_TYPE.PURCHASER);
          var redirect=that.data.redirect|| "/pages/indexnew/index"
          wx.redirectTo({
            url:redirect,
          })
        } else if (res.data.code == '1' && res.data.message == "数据不存在") {
          wx.redirectTo({
            url: "/packagePurchaser/pages/purchaser/register/register",
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            success: function () {
              return false
            }
          })
          return false
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  //   拨打电话
  callTelephone: function () {
    wx.makePhoneCall({
      phoneNumber: wx.getStorageSync('activityDetail').hotLine, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  // 取消授权手机号
  cancel: function () {
    var that = this;
    that.setData({
      dialogShow: true
    })
  },
  switchRole: function () {
    var self = this
    //退出观众 进入展商
    wx.showModal({
      title: self.data.langTranslate['提示'],
      content: self.data.langTranslate['确定要切换吗']+'?',
      confirmText: self.data.langTranslate["确定"],
      cancelText: self.data.langTranslate["取消"],
      success: function (sm) {
        if (sm.confirm) {
          self.triggerUnline()
          wx.navigateTo({
            url: "/packageExhibitor/pages/zEdition1/authorize/authorize",
          })
          wx.setStorageSync('role', 'exhibitor')
        }
      }
    })
  },
  onLoad: function (options) {
    this.setData({ langTranslate: i18n.langTranslate(), redirect: options.redirect&&decodeURIComponent(options.redirect)||null })
    this.data.activityId = wx.getStorageSync('activityDetail').id
    this.authorization();
  },
  onShow: function () {

  },
  //  触发下线
  triggerUnline() {
    var projectId = wx.getStorageSync('activityDetail').id
    var purchaserId = storage.getUserInfo().id
    ajax.get(`${API_URL_V2}/backend/v1/statistics/reduceAudienceNum/${projectId}/${purchaserId}`)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
