//activityDetail.js
//获取应用实例
import {defaultUserImage} from "../../../../../common/staticImageContants";
import {API_URL} from "../../../../../utils/constant";

const app = getApp()
let TIME = 60
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: { 
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),

    activityId:'',
    openId:'',
    banner: defaultUserImage,
    activityName: '',
    regNum: '',
    startTime: '',
    endTime: '',
    address: '',
    activityCon:'',
    id:'',
    data:{},
    signUpShow:true,
    weixinId:''
  },
  onLoad: function (options) {
    this.setData({
      activityId:storage.getActivityDetail().id,
      weixinId:wx.getStorageSync('user').openId
    });
    this.activityDetail(options.tid||options.id)
  },
  activityDetail:function(id){
    var that = this;
    const companyId=wx.getStorageSync('activityDetail').companyId
    var url = app.globalData.host + '/api3/column/getEvent/'+ id+'/'+wx.getStorageSync('user').openId+'/'+storage.getUserInfo().id+`?companyId=${companyId}`;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          if(res.data.data.introduce!=null&&res.data.data.introduce!=undefined&&res.data.data.introduce!=''){
            var content = res.data.data.introduce.replace(/<img/gi, '<img style="max-width:100%;text-align:center;margin:0 auto;height:auto;display:block" ')
            .replace(/<section/g, '<div')
            .replace(/\/section>/g, '\div>');
          }else{
            var content=''
          }
          if(res.data.sign==null||res.data.sign==''||res.data.sign==undefined){
            var show= true
          }else{
            var show= false
          }
          that.setData({
            banner: res.data.data.banner?res.data.data.banner:defaultUserImage,
            activityName: res.data.data.name,
            regNum:res.data.data.regNum,
            startTime: res.data.data.registerStartTime,
            endTime: res.data.data.registerEndTime,
            address: res.data.data.address,
            activityCon:content,
            id:res.data.data.id,
            data:res.data.data,
            signUpShow:show
          }, () => {
            wx.hideLoading()
          }) 
        } else {
          console.log(res.data.message)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  signUp:function(event){
    var that = this;

    var url =  `${API_URL}/column/registEvent`;
    wx.showLoading()
    wx.request({
      url: url,
      data: {
        cellphone: wx.getStorageSync('phoneNumber'),
        city: storage.getUserInfo().city,
        company: storage.getUserInfo().company,
        country: storage.getUserInfo().country,
        eventId: event.currentTarget.dataset.id,
        name: storage.getUserInfo().contact,
        openId: wx.getStorageSync('user').openId,
        participant: storage.getUserInfo().id,
        position: storage.getUserInfo().job,
        province: storage.getUserInfo().province,
        sponsor: '1'
      },
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: '报名成功',
            icon: 'success',
            duration: 2000
          })
          //that.activityDetail(that.data.eventId)
          that.setData({
            signUpShow : false
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
  cancelSignUp:function(event){
    var that = this
    var eventId=event.currentTarget.dataset.id
    var weixinId=that.data.weixinId
    var participant=storage.getUserInfo().id
    var url = app.globalData.host + '/api3/column/delRegist/'+eventId+'/'+weixinId+'/'+participant;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          wx.showToast({
            title: '取消成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            signUpShow : true
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
  onshow:function(){
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
