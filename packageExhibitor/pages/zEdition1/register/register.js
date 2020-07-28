//register.js
//获取应用实例
const app = getApp()
let api = require("../../../../utils/api"),
  constant = require("../../../../utils/constant"),
  i18n = require("../../../../i18n/i18n.js"),
  storage = require("../../../../utils/storage.js"),
  util = require("../../../../utils/util");
let TIME = 60
Page({
  data: { 
    userInfo: {},
    hasUserInfo: false,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openId:'',
    name:'',
    job:'',
    code:'',
    exhibitorName:'',
    activityId:'',
    phoneNumber:''
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
  bindNameInput:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindJobInput: function (e) {
    this.setData({
      job: e.detail.value
    })
  },
  bindCodeyInput:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  bindEnameInput: function (e) {
    this.setData({
      exhibitorName: e.detail.value
    })
  },
  formSubmit:function(e){
    var status = true
    var that=this
    if (that.data.name== ''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000,
        success: function () {
          status = false
          return false
        }
      })
      status = false
      return false
    }else if (that.data.job== ''){
      wx.showToast({
        title: '请输入职务',
        icon: 'none',
        duration: 2000,
        success: function () {
          status = false
          return false
        }
      })
      status = false
      return false
    }else if(that.data.code== ''){
      wx.showToast({
        title: '请输入展商确认码/展商手册用户',
        icon: 'none',
        duration: 2000,
        success: function () {
          status = false
          return false
        }
      })
      status = false
      return false
    }else if(that.data.exhibitorName== ''){
      wx.showToast({
        title: '请输入展商名称',
        icon: 'none',
        duration: 2000,
        success: function () {
          status = false
          return false
        }
      })
      status = false
      return false
    }
    that.boundExhibitors();
  },
  // 绑定展商
  boundExhibitors:function(){
    var that = this
    var activityId=that.data.activityId
    //重新获取code,以前的code会失效
    wx.login({
      success: res => {
        var url = app.globalData.host + '/api3/suppliercontact/bindSupplier?name='+that.data.name+'&job='+that.data.job+'&confirmCode='+that.data.code+'&company='+that.data.exhibitorName+'&weixinId='+that.data.openId+'&mobile='+that.data.phoneNumber+'&projectId='+activityId;
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
              storage.setUserInfo( res.data.result);
              //storage.setToken(e.data.data.token);
              //storage.setPassword(_self.data.password);
              storage.setRoleType(constant.ROLE_TYPE.EXHIBITOR);
              wx.redirectTo({
                url: "/pages/indexExhibitor/indexExhibitor",
              })
              return false
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
      }
    })
  },
  onLoad: function () {
    this.setData({
      openId: wx.getStorageSync('user').openId,
      phoneNumber:wx.getStorageSync('phoneNumber'),
      activityId:wx.getStorageSync('activityDetail').id,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    },()=>{
      wx.setNavigationBarTitle({
        title: this.data.langTranslate["展商联系人注册"],
      });
    })
    
  },
  switchRole:function(){
    wx.$app.logout()
    wx.navigateTo({
      url: "/packagePurchaser/pages/purchaser/authorize/authorize",
    })
    wx.setStorageSync('role', 'purchaser')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
