//sponsored.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"),
  constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'),
  storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
Page({
  data: { 
    scrollHeight:0,
    scrollTop : 0,
    openId:'',
    pageNum:1,
    pageSize:'10',
    status:'',
    searchInput:'',
    exhibitorId:'',
    sponsoredList:[],
    supplierLayout:[],
    cascades:[],
    timer:'',
    sponsoredArray:[]
  },
  onLoad: function (options) {
    var that = this
    app.editTabBar();    //显示自定义的底部导航
    wx.getSystemInfo({
      success:function(res){
        that.setData({
          scrollHeight:res.windowHeight
        });
      }
    })
    that.setData({
      status: options.status,
      exhibitorId:storage.getUserInfo().id
    })
    that.getSchedulePurchasers(options.status);
    that.cascades()
  },
  cascades:function(){
    var that = this
    var supplierLayout=wx.getStorageSync('activityDetail').supplierLayout
    that.setData({
      supplierLayout : JSON.parse(supplierLayout)
    })
    for(var index in that.data.supplierLayout){
      if(that.data.supplierLayout[index].nameKey =='tags'){
        for(var f in that.data.supplierLayout[index].cascades){
          var cascadesList=that.data.cascades
          var data=that.data.supplierLayout[index].cascades[f].parent
          that.setData({
            cascades:cascadesList.concat(data)
          })
        }
      }
    }
    console.log(that.data.cascades)
  },
  onshow:function(){
    
  },
  remindInvitation:function(e){
    var that=this
    const id = e.currentTarget.dataset.id;
    (0, api.reminder)({
      query: {
        id: id
      },
      isNullToken: true,
      success: function (res) {
        wx.showToast({
          title: '提醒成功',
        })
        setTimeout(() => {
          that.getSchedulePurchasers()
        }, 1000)
      }
    });
  },
  countDown:function(){
    var that = this;
    that.data.timer = setInterval(function () {
      var orders = that.data.sponsoredList;
      for (var i = 0; i < orders.length; i++) {
        var create_time = orders[i].updateTime;
        //计算剩余时间差值
        var leftTime = (new Date(create_time).getTime() + 1000*60*60*2) - (new Date().getTime());
        if (leftTime > 0) {
          //计算剩余的小时
          //计算剩余的分钟
          var hours = parseInt((leftTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = parseInt((leftTime % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = util.formatNumber(parseInt(leftTime / 1000 % 60, 10));
          console.log(minutes)
          if(hours>0){
            var left_time = hours + "时" + minutes+"分";
          }else{
            var left_time = minutes + "分" + seconds+"秒";
          }
          orders[i].countDown=left_time
          orders[i].time=true
        }else{
          //移除超时未支付的订单
          orders[i].time=false
        }
      }
      that.setData({
        sponsoredArray:orders
      });
    }, 1000);
  },
  searchExhibitorList:function(){
    var that = this;
    var search=that.data.searchInput
    var pageNum=1
    var pageSize=that.data.pageSize
    var exhibitorId=that.data.exhibitorId
    var status=that.data.status
    var url = app.globalData.host + '/api3/schedule/getSchedulePurchasers?pageNum='+pageNum+'&pageSize='+ pageSize + '&key='+ search +'&status='+status+'&supplierId='+exhibitorId+'&purchaserId='+''+'&yearMonth='+''+'&day='+''+'&sponsor='+'0';
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code=='0') {
          var sponsored=res.data.result.data
          for(var index in sponsored){
            if(sponsored[index].tags!=null&&sponsored[index].tags!=null&&sponsored[index].tags!=undefined){
              sponsored[index].tags=sponsored[index].tags.split(',')
            }
            if((new Date(sponsored[index].updateTime).getTime()+1000*60*60*2)-new Date().getTime()> 0){
              sponsored[index].time=true
            }else{
              sponsored[index].time=false
              var time=new Date(sponsored[index].updateTime).getTime()+1000*60*60*2
            }
          }
          that.setData({
            pageNum:pageNum+1,
            pageSize:res.data.result.pageSize,
            sponsoredList:sponsored
          })
          if(that.data.status=='5'||that.data.status=='6'){
            that.countDown()
          }else{
            that.setData({
              sponsoredArray:sponsored
            })
          }
        } else {
          console.log(res.data.message)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  getSchedulePurchasers:function(){
    var that = this;
    var search=that.data.searchInput
    var pageNum=that.data.pageNum
    var pageSize=that.data.pageSize
    var sponsoredList=that.data.sponsoredList
    var exhibitorId=that.data.exhibitorId
    var status=that.data.status
    var url = app.globalData.host + '/api3/schedule/getSchedulePurchasers?pageNum='+pageNum+'&pageSize='+ pageSize + '&key='+ search +'&status='+status+'&supplierId='+exhibitorId+'&purchaserId='+''+'&yearMonth='+''+'&day='+''+'&sponsor='+'0';
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code=='0') {
          var sponsored=res.data.result.data
          for(var index in sponsored){
            if(sponsored[index].tags!=null&&sponsored[index].tags!=null&&sponsored[index].tags!=undefined){
              sponsored[index].tags=sponsored[index].tags.split(',')
            }
            if((new Date(sponsored[index].updateTime).getTime()+1000*60*60*2)-new Date().getTime()> 0){
              sponsored[index].time=true
            }else{
              sponsored[index].time=false
              var time=new Date(sponsored[index].updateTime).getTime()+1000*60*60*2
            }
          }
          that.setData({
            pageNum:pageNum+1,
            pageSize:res.data.result.pageSize,
            sponsoredList:sponsoredList.concat(sponsored)
          })
          if(that.data.status=='5'||that.data.status=='6'){
            that.countDown()
          }else{
            that.setData({
              sponsoredArray:sponsoredList.concat(sponsored)
            })
          }
          console.log(that.data.sponsoredList)
        } else {
          console.log(res.data.message)
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  bindKeyInput:function(e){
	  this.setData({
		  searchInput:e.detail.value
	  })
  },
  // 重新发起邀约
  afreshInvitation:function(event){
    var id = event.currentTarget.dataset.id;
    var that = this
    var url = app.globalData.host + '/api3/schedule/readd/'+id+'/'+'0';
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code=='0') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../sponsored/sponsored?status='+'2'
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            success: function () {
              
            }
          })
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  cancelInvitation:function(event){
    var id = event.currentTarget.dataset.id;
    var that = this
    var url = app.globalData.host + '/api3/schedule/cancel/'+id;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code=='0') {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: '../sponsored/sponsored?status='+'6'
              })
            }
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
