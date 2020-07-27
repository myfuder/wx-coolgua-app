// packageExhibitor/pages/zEdition1/me/msg/index.js
import {getString} from "../../../../../locals/lang.js";
// import TIM from "../../../../../utils/tim-wx";
import TIM from 'tim-wx-sdk'
import storage from "../../../../../utils/storage";
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msglist: [],
    systemmsglist: [],
    system: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: getString('exhibitors_index', 'app.title.msg')
    })
    this.setData({
      system: getString('exhibitors_index', 'app.im.system'),
    })
    this.monitorImSDK() // im监听
    this.getmsg()
  },

  msgClick(event) {
    // if(event.currentTarget.dataset.idx==0){

    // }
  },
  msgClick1() {
    console.log('系统消息')
    wx.navigateTo({
      url: '/packageExhibitor/pages/zEdition1/me/msg/systemmsg/index'
    })
  },
  // 跳转到聊天室
  goChat({currentTarget}) {
    let item = currentTarget.dataset.item
    let data = {
      conversationID: item.conversationID,
      type: item.type
    }
    if (item.type === 'GROUP') {
      data.toId = item.groupProfile.groupID
      data.toName = item.groupProfile.name
    } else if (item.type === 'C2C') {
      data.toId = item.userProfile.userID
      data.toName = item.userProfile.nick
      data.avatar = item.userProfile.avatar
      data.nick = item.userProfile.nick
    } else {
      console.log('xitngtongzhi')
      data.toName = '系统通知'
    }
    wx.navigateTo({
      url: '/packageExhibitor/pages/zEdition1/im/chat/chat?data=' + JSON.stringify(data),
    })
  },
  //获取消息列表
  getmsg() {
    var that = this
    var userId = wx.getStorageSync('userInfo').id
    var url = app.globalData.host + '/api3/message/newmessage/list/' + userId;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          that.setData({
            // systemmsglist:res.data.result
          })
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })

    //对话消息
    wx.request({
      url: app.globalData.host + '/api3/trtcorim/getUsgSign',
      method: 'POST',
      data: {
        UserId: wx.getStorageSync('userInfo').id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {

      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  // 监听im消息
  monitorImSDK() {
    let _this = this
    let onMessageReceived = function (e) {
      console.log('新消息', e.data);
    };
    let convListUpdate = function (e) {
      // e.data.forEach(item=>{
      // 	item = _this.getProfile(item)
      // })
      _this.setData({
        msglist: e.data
      })
    }
    wx.$app.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, convListUpdate) // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
    wx.$app.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived); //监听SDK收到新消息
  },

  // 获取用户头像昵称
  getProfile(item) {
    if (item.type === 'C2C') {
      let promise = wx.$app.getUserProfile({
        userIDList: [item.userProfile.userID] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
      });
      promise.then(function (imResponse) {
        item.userProfile.avatar = imResponse.data[0].avatar
        item.userProfile.nick = imResponse.data[0].nick
        return item
      }).catch(function () {
        return item
      });
    } else if (item.type === 'GROUP') {
      let promise = wx.$app.getGroupProfile({
        groupID: item.groupProfile.groupID
      });
      promise.then(function (imResponse) {
        item.groupProfile.name = imResponse.data.group.name
        item.groupProfile.avatar = imResponse.data.group.avatar
        return item
      }).catch(function () {
        return item
      });
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
    let _this = this
    if (app.globalData.isSDKReady) {
      wx.$app.getConversationList().then(res => {
        if (res.code == 0) {
          // res.data.conversationList.forEach(item => {
          // 	item = _this.getProfile(item)
          // })
          var user = storage.getUserInfo()
          //把自己过滤掉
          var conversationsList = res.data.conversationList.filter(item => {
            return `C2C${user.id}` != item.conversationID
          })
          this.setData({
            msglist: conversationsList
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
    this.getmsg()
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