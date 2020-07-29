// packageExhibitor/pages/newedition/liveRelease/liveRelease.js
var dateTimePicker = require('../../../../utils/datetimepicker.js');
const app = getApp()
let i18n = require("../../../../i18n/i18n");
import {getString} from "../../../../locals/lang.js";
let langTranslate = i18n.langTranslate();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    form:{
      title:"",
      startTime:"",
      endTime:"",
      publicFlag:0,
      imgUrl:"",
    },
    publicArr:[
      {vaule:"0",name:langTranslate["公开"]},
      {vaule:"1",name:langTranslate["不公开"]},
    ],
    imageSrc: '',
    inputTheme: '',
    dateTimeArray1:null,
    dateTime1: null,
    dateTimeArray2:null,
    dateTime2: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj2 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    this.setData({
      // dateTime: obj.dateTime,
      // dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      dateTimeArray2: obj2.dateTimeArray,
      dateTime2: obj2.dateTime
    });
    wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.nav.liveRelease'),
    })
  },
  changeDateTime1(e){
    this.setData({ dateTime1: e.detail.value });
  },
  changeDateTime2(e){
    this.setData({ dateTime2: e.detail.value });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
  
      arr[e.detail.column] = e.detail.value;
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({ 
        dateTimeArray1: dateArr,
        dateTime1: arr
      });
  },
  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2, dateArr = this.data.dateTimeArray2;
  
      arr[e.detail.column] = e.detail.value;
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    
    this.setData({ 
        dateTimeArray2: dateArr,
        dateTime2: arr
      });
  },
  startLive(theme, imageSrc) {
    let bindTimeChange1 = this.data.dateTimeArray1;
    let bindTimeChange2 = this.data.dateTimeArray2;
    let dateTime1 = this.data.dateTime1;
    let dateTime2 = this.data.dateTime2;
    let start = bindTimeChange1[0][dateTime1[0]]+'-'+bindTimeChange1[1][dateTime1[1]]+'-'+bindTimeChange1[2][dateTime1[2]]+' '+ bindTimeChange1[3][dateTime1[3]]+':'+bindTimeChange1[4][dateTime1[4]];
    let end = bindTimeChange2[0][dateTime2[0]]+'-'+bindTimeChange2[1][dateTime2[1]]+'-'+bindTimeChange2[2][dateTime2[2]]+' '+ bindTimeChange2[3][dateTime2[3]]+':'+bindTimeChange2[4][dateTime2[4]];
    let param = {
      "projectId": wx.getStorageSync('activityDetail').id,
      "supplierId": wx.getStorageSync('userInfo').id,
      "companyId": wx.getStorageSync('activityDetail').companyId,
      "theme": theme,
      "coverImage": imageSrc,
      "start_time": start,
      "end_time": end,
      "is_public":0
    }; 
    let url = app.globalData.host + `/api3/live/getPushUrl`
    wx.request({
      url: url,
      data: param,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == '0') {
          let liveUrl = res.data.result.pushUrl
          let liveId = res.data.result.liveId
          let param = {liveUrl, liveId}
          param = JSON.stringify(param)
          param = encodeURIComponent(param)
          wx.navigateTo({
            url: `/packageExhibitor/pages/zEdition1/me/myLiveBroadcast/live/index?param=${param}`,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
      fail: function (error) {
        wx.showToast({
          title: langTranslate['暂时无法开始直播'],
          icon: 'none'
        })
      }
    })
  },
  bindTimeChange:function(e){
    let type = e.currentTarget.dataset.type
    let obj = this.data.form;
    obj[type] = e.detail.value;
    this.setData({
      form: obj
    })
  },
  // chooseImg:function(e){
  //   wx.chooseImage({
  //     count: 1,
  //     sizeType: ['original', 'compressed'],
  //     sourceType: ['album', 'camera'],
  //     success: (res) => {
  //       let url = res?res.tempFilePaths:"";
  //       let obj = this.data.form;
  //       obj.imgUrl = url;
  //       this.setData({
  //         form: obj
  //       })
  //     }
  //   })
  // },
  chooseImg:function(e){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        for (let i = 0; i < res.tempFiles.length; i++) {
          wx.uploadFile({
            url: app.globalData.host + '/api3/file/upload',
            files:res.tempFiles[i],
            filePath: res.tempFilePaths[i],
            fileType: 'image',
            name: 'file',
            success: (res) => {
              console.log(JSON.parse(res.data).code)
              if (JSON.parse(res.data).code=='0') {
                var path= JSON.parse(res.data).result
                this.setData({
                  'form.imgUrl': path
                });
              } else{
                wx.showToast({
                  title: langTranslate['上传失败'],
                  icon: 'none',
                  duration: 1000
                })
              }
            },
            fail: (err) => {
              console.log('uploadImage fail', err);
              wx.showModal({
                content: err.errMsg,
                showCancel: false
              });
            }
          });
        }
      },
      fail: (err) => {
        console.log('chooseImage fail', err)
      }
    })
  },
  closeDialog() {
    this.triggerEvent('handleDialog', false)
    this.setData({
      'form.imgUrl':'',
      'form.title': ''
    })
    wx.navigateBack({
      delta: 1
    })
  },
  getInputValue(e) {
    this.setData({
      'form.title': e.detail.value
    })
  },
  formSubmit(){
    if(!this.data.form.title) {
      wx.showToast({
        title: langTranslate['请输入主题'],
        icon: 'none'
      })
      return
    } else if (!this.data.form.imgUrl) {
      wx.showToast({
        title: langTranslate['请添加封面图片'],
        icon: 'none'
      })
      return
    }
    this.triggerEvent('handleDialog', false)
    this.startLive(this.data.form.title, this.data.form.imgUrl)
    // this.setData({
    //   'from.imgUrl':'',
    //   'form.title': ''
    // })
    
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})