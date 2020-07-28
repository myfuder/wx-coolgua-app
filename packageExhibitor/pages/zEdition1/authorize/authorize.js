//index.js
//获取应用实例
const app = getApp()
let api = require("../../../../utils/api"),
  constant = require("../../../../utils/constant"),
  i18n = require("../../../../i18n/i18n.js"),
  storage = require("../../../../utils/storage.js"),
  util = require("../../../../utils/util");
let TIME = 60
import  {defaultUserImage} from "../../../../common/staticImageContants"
Page({
  data: {
    canClick:true,
    codeNum:'',
    userInfo: {},
    hasUserInfo: false,
    langTranslate: i18n.langTranslate(),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openId:'',
    session_key:'',
    autoLogin:null,
    buttons: [{text: '取消'}, {text: '授权'}],
    dialogShow:true,
    activityId:'',
    staticImageUrl: constant.STATIC_IMAGE_URL,
    defaultUserImage:defaultUserImage,
    redirect:"",
  },
  //事件处理函数
  userLogin: function(e) {
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
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
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
  getData: function (){
    var that = this
    wx.showLoading({title:that.data. langTranslate["授权中"],duration:5000})
    wx.login({
      success: res => {
        console.log(res)
        var url = app.globalData.host + '/api3/wx/code2Session/'+ app.globalData.companyId +'/'+res.code;
        wx.request({
          url: url,
          method: 'GET',
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            wx.hideLoading({title:that.data. langTranslate["授权中"]})
            console.log(res)
            wx.setStorageSync('user', {
              openId: res.data.result.openid,
              session_key: res.data.result.session_key
            })
            that.setData({
              openId:res.data.result.openid,
              session_key: res.data.result.session_key,
              dialogShow:false
            })
          }
        })
      }
    })
  },
  //   获取授权手机号
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e)
    console.error("手机授权中",e)
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      var data={}
      wx.request({
        url: app.globalData.host + '/api3/wx/decryptData',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          sessionKey: that.data.session_key
        },
        method: "post",
        success: function (res) {
          console.error("拿到手机号码========>",res)
          that.setData({
            dialogShow:true
          })
          wx.setStorageSync('phoneNumber', res.data.result.phoneNumber)
          wx.setStorageSync('phone', true)
          that.contacts(that.data.openId,res.data.result.phoneNumber)
        },
        fail(e){
          console.error("手机授权失败",e)
        }
      })
    }else{
      that.setData({
        dialogShow:true
      })
    }
  },
  // 查询展商联系人
  contacts:function(openId,phoneNumber){
    var that = this;
    var activityId=that.data.activityId;
    var url = app.globalData.host + '/api3/suppliercontact/getSupplierContact?projectId='+activityId+'&weixinId='+ openId + '&mobile='+ phoneNumber;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
		  console.log(res)
        if (res.data.code=='0') {
          //storage.setRememberPwd(_self.data.isRememberPwd);
          //storage.setAutoLogin(_self.data.isAutoLogin);
          storage.setUserInfo(res.data.result);
          //storage.setToken(e.data.data.token);
          //storage.setPassword(_self.data.password);
          storage.setRoleType(constant.ROLE_TYPE.EXHIBITOR);
          var  redirect=that.data.redirect|| "/pages/indexExhibitor/indexExhibitor";
          wx.redirectTo({
            url:redirect,
          })
          return false
        }else if(res.data.code=='1'&& res.data.message=="数据不存在"){
          wx.redirectTo({
            url: '/packageExhibitor/pages/zEdition1/register/register'
          })
          return false
        }else {
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
        wx.redirectTo({
          url: '/packageExhibitor/pages/zEdition1/register/register'
        })
        return false
      }
    })
  },
  //   拨打电话
  callTelephone:function(){
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
  cancel:function(){
    var that = this;
    that.setData({
      dialogShow:true
    })
  },
  switchRole:function(){
    wx.navigateTo({
      url: "/packagePurchaser/pages/purchaser/authorize/authorize",
    })
    wx.setStorageSync('role', 'purchaser')
  },
  onLoad: function (options) {
    this.data.activityId = wx.getStorageSync('activityDetail').id
    this.setData({
      langTranslate: i18n.langTranslate(),
      redirect:decodeURIComponent(options.redirect||'')||''
    })
    this.authorization();
  },
  onshow:function(){

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
