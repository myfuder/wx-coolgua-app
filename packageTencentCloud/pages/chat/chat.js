// index.js
// const app = getApp()
// import TIM from "../../../../../utils/tim-wx";
import TIM from 'tim-wx-sdk'
const storage=require('../../../utils/storage');
const {uploadProfileIm_guanz,uploadProfileIm_exhibitor} = require("../../../utils/util");
const constant=require('../../../utils/constant')
//获取应用实例
const app = getApp()
import {
  imEmojiUrl,
  emoji,
  emojiIndex
} from '../../../utils/imEmoji'
// const __WEBPACK_IMPORTED_MODULE_3__utils_emojiMap__ = __webpack_require__(73);
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    myUserImage: wx.getStorageSync('userInfo').portrait || 'https://www.coolgua.net/match_img/img/avatar.png',
    roomID: '',
    template: '1v1',
    debugMode: false,
    cloudenv: 'PRO',
    evnArray: [{
      value: 'PRO',
      title: 'PRO'
    },
      {
        value: 'CCC',
        title: 'CCC'
      },
      {
        value: 'DEV',
        title: 'DEV'
      },
      {
        value: 'UAT',
        title: 'UAT'
      },
    ],
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    messageContent: '',
    modalVisible: false,
    messageList: [],
    revokeModal: false,
    isEmojiOpen: false,
    isRecord: false,
    isFocus: false,
    isMoreOpen: false,
    faceUrl: 'https://webim-1252463788.file.myqcloud.com/assets/face-elem/',
    emojiShow: true,
    bigEmojiShow: false,
    bigEmoji: ['tt01', 'tt02', 'tt03', 'tt04', 'tt05', 'tt06', 'tt07', 'tt08', 'tt09', 'tt10', 'tt11', 'tt12', 'tt13',
      'tt14', 'tt15', 'tt16'
    ],
    emojiName: emojiIndex,
    emojiMap: emoji,
    emojiUrl: imEmojiUrl,
    currentConversationType: ['C2C', 'GROUP'], //当前聊天对话的Type
    toAccount: '10002', //当前聊天对象的id
    toName: '张三', //当前聊天对象的昵称

    // 04-17
    currentMessageList: [], // 当前聊天消息列表
    nextReqMessageID: '', // 用于续拉消息列表的id
    nextIndex: 0, //拉取消息次数
    isCompleted: false, //是否拉完所有消息
    conversationData: '', //会话信息
    scrollTop: 0, //滚动条位置
    isxitong: true,
    data1: null
  },
  onShow() {
    if (this.data.data1.toName == '系统通知') {
      this.setData({
        isxitong: false
      })
    } else {
      this.setData({
        isxitong: true
      })
    }
    var userType=storage.getRoleType()
    if(userType==constant.ROLE_TYPE.EXHIBITOR){
      uploadProfileIm_exhibitor()
    }else{
      uploadProfileIm_guanz()
    }
  },
  onLoad: function (options) {

    this.monitorImSDK()
    if (options.data) {
      let data = JSON.parse(options.data)
      this.setData({
        data1: data
      })
      if (this.data.data1.toName == '系统通知') {
        this.setData({
          isxitong: false
        })
      } else {
        this.setData({
          isxitong: true
        })
      }
      this.setData({
        conversationData: data
      })
      wx.setNavigationBarTitle({
        title: data.toName
      })
      // this.getmessagelist()
      // 获取消息列表 根据会话id
      // let onReadyStateUpdate1 = function({
      // 	name
      // }) {
      // const isSDKReady1 = (name === TIM.EVENT.SDK_READY)
      // if (isSDKReady1) {
      wx.$app.getMessageList({
        conversationID: data.conversationID,
        count: 15
      })
        .then(res => {
          res.data.messageList.forEach(item => {
            if (item.conversationType === 'C2C' && item.from === data.toId) {
              item.nick = data.toName
              item.avatar = data.avatar
            } else if (item.from === app.globalData.imProfile.userID) {
              item.nick = app.globalData.imProfile.nick
              item.avatar = app.globalData.imProfile.avatar
            }
            item = this.getTextEmoji(item, this)
          })


          this.setData({
            currentMessageList: res.data.messageList,
            nextReqMessageID: res.data.nextReqMessageID,
            isCompleted: res.data.isCompleted,
            scrollTop: res.data.messageList.length * 999,
            nextIndex: 1
          })
          wx.$app.setMessageRead({
            conversationID: data.conversationID
          }).then(imResponse => {
            if (getApp().globalData.unreadCountChange) {
              getApp().globalData.unreadCountChange()
            }
          }); // 已读上报
        })
        .catch(() => {
          console.log('444444')
        })
      // }

      // }
      // wx.$app.on(TIM.EVENT.SDK_READY, onReadyStateUpdate1, this) // 监听是否进入 ready 状态


    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none',
        duration: 1500
      })
      wx.navigateBack()
      console.log('555555555')
    }
    console.log('6666666666')

    //设置房间号
    var that = this
    this.setData({
      roomID: that.getroomid(),
      // roomID: 1234567,
    })
  },
  getmessagelist() {

    // let onReadyStateUpdate = function({name}){
    //   const isSDKReady = (name === TIM.EVENT.SDK_READY)
    //   if(isSDKReady){
    //
    //   }
    // }
    // wx.$app.on(TIM.EVENT.SDK_READY, onReadyStateUpdate, this) // 监听是否进入 ready 状态
  },
  getroomid() {
    var len = 9;
    var chars = '0123456789';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    console.log(pwd)
    return pwd
  },

  // 监听im消息
  monitorImSDK() {
    let _this = this
    let onMessageReceived = function (e) {
      console.log('新消息', e.data);
      e.data.forEach(item => {
        if (item.conversationID === _this.data.conversationData.conversationID) {
          let currentMessageList = [..._this.data.currentMessageList]
          if (item.conversationType === 'C2C' && item.from === _this.data.conversationData.toId) {
            item.nick = _this.data.conversationData.nick
            item.avatar = _this.data.conversationData.avatar
          }
          item = _this.getTextEmoji(item, _this)
          currentMessageList.push(item)
          _this.setData({
            currentMessageList,
            scrollTop: currentMessageList.length * 999
          })
          wx.$app.setMessageRead({
            conversationID: item.conversationID
          }); // 已读上报
        }
      })
    };
    wx.$app.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived); //监听SDK收到新消息
  },

  // 发送图片消息
  handleProxy({
                currentTarget
              }) {
    let _this = this
    let eventid = currentTarget.dataset.eventid
    if (eventid.startsWith('25_')) {
      let messageContent = this.data.messageContent
      messageContent += this.data.emojiName[eventid.split('_')[1]]
      this.setData({
        messageContent
      })
    }
    if (eventid.startsWith('26_')) {
      console.log('大表情')
      let index = Number(eventid.split('_')[1])
      let message = wx.$app.createFaceMessage({
        to: this.data.conversationData.toId,
        conversationType: this.data.conversationData.type,
        payload: {
          index: index,
          data: this.data.bigEmoji[index]
        }
      });
      wx.$app.sendMessage(message).then(res => {
        if (res.code == 0) {
          res.data.message.nick = app.globalData.imProfile.nick // 将个人昵称赋值给message
          res.data.message.avatar = app.globalData.imProfile.avatar // 将个人头像赋值给message
          let currentMessageList = [...this.data.currentMessageList]
          currentMessageList.push(res.data.message)
          this.setData({
            currentMessageList,
            scrollTop: currentMessageList.length * 999
          })
        }
      }).catch(err => {
        console.log(err)
      })
      this.setData({
        isFocus: false,
        isEmojiOpen: false,
        isMoreOpen: false
      })
    }
    if (eventid == '18') {
      _this.handleClose()
    }
    if (eventid == '27' || eventid == '28') {
      let to = this.data.conversationData.toId
      let conversationType = this.data.conversationData.type
      let sourceType = ['camera']
      if (eventid == '28') {
        sourceType = ['album']
      }
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType,
        success(res) {
          let message = wx.$app.createImageMessage({
            to,
            conversationType,
            payload: {
              file: res
            },
            onProgress: function (event) {
              console.log('file uploading:', event)
            }
          })
          wx.$app.sendMessage(message).then(res => {
            console.log(res)
            if (res.code == 0) {
              _this.handleClose()
              res.data.message.nick = app.globalData.imProfile.nick // 将个人昵称赋值给message
              res.data.message.avatar = app.globalData.imProfile.avatar // 将个人头像赋值给message
              let currentMessageList = [..._this.data.currentMessageList]
              currentMessageList.push(res.data.message)
              _this.setData({
                currentMessageList,
                scrollTop: currentMessageList.length * 999
              })
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    }
  },

  // 表情转换
  getTextEmoji(item, _this) {
    if (item.type === 'TIMTextElem') {
      item.virtualDom = []
      let templist = item.payload.text.split(/(\[[^[\]]+\])/)
      templist.forEach(bItem => {
        let obj = {}
        if (_this.data.emojiName.includes(bItem)) {
          obj.name = 'img'
          obj.src = _this.data.emojiUrl + _this.data.emojiMap[bItem]
        } else {
          obj.name = 'span'
          obj.text = bItem
        }
        item.virtualDom.push(obj)
      })
    }
    return item
  },

  // 触顶触发加载更多消息
  scrolltoupper() {
    if (this.data.isCompleted) {
      return
    }
    wx.$app.getMessageList({
      conversationID: this.data.conversationData.conversationID,
      nextReqMessageID: this.data.nextReqMessageID,
      count: 15
    })
      .then(res => {
        if (res.code === 0) {
          let nextIndex = this.data.nextIndex + 1
          let templist = [...res.data.messageList, ...this.data.currentMessageList]
          templist.forEach(item => {
            if (item.conversationType === 'C2C' && item.from === this.data.conversationData.toId) {
              item.nick = this.data.conversationData.nick
              item.avatar = this.data.conversationData.avatar
            } else if (item.from === app.globalData.imProfile.userID) {
              item.nick = app.globalData.imProfile.nick
              item.avatar = app.globalData.imProfile.avatar
            }
            item = this.getTextEmoji(item, this)
          })
          this.setData({
            currentMessageList: templist,
            nextReqMessageID: res.data.nextReqMessageID,
            isCompleted: res.data.isCompleted,
            scrollTop: (templist.length / nextIndex) * 999,
            nextIndex: nextIndex
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  },

  enterRoomID: function (event) {
    // console.log('index enterRoomID', event)
    this.setData({
      roomID: event.detail.value,
    })
  },
  selectTemplate: function (event) {
    console.log('index selectTemplate', event)
    this.setData({
      template: event.detail.value,
    })
  },
  switchDebugMode: function (event) {
    console.log('index switchDebugMode', event)
    this.setData({
      debugMode: event.detail.value,
    })
  },
  selectEnv: function (event) {
    console.log('index switchDebugMode', event)
    this.setData({
      cloudenv: event.detail.value,
    })
  },
  enterRoom: function () {
    const roomID = this.data.roomID
    const nowTime = new Date()
    if (nowTime - this.tapTime < 1000) {
      return
    }
    console.log(roomID, '========roomID=======')
    if (!roomID) {
      wx.showToast({
        title: '请输入房间号',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    if (/^\d*$/.test(roomID) === false) {
      wx.showToast({
        title: '房间号只能为数字',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    if (roomID > 4294967295 || roomID < 1) {
      wx.showToast({
        title: '房间号取值范围为 1~4294967295',
        icon: 'none',
        duration: 2000,
      })
      return
    }

    const _this = this
    const url = `/packageTencentCloud/pages/meeting/meeting?id=${this.data.roomID}&toID=${this.data.conversationData.toId}`
    wx.navigateTo({
      url,
      events: {
        invited: function (message) {
          console.log(message)
          let currentMessageList = [..._this.data.currentMessageList]
          currentMessageList.push(message)
          _this.setData({
            currentMessageList,
            scrollTop: currentMessageList.length * 999
          })
        }
      }
    })
    this.setData({
      'tapTime': nowTime
    })
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1,
    })
  },
  //会话页面点击加号,处理更多选项卡
  clickjiahao: function () {
    if (this.data.isFocus) {
      this.setData({
        isFocus: false,
        isMoreOpen: true
      })
    } else {
      var isMoreOpen = !this.data.isMoreOpen
      this.setData({
        isEmojiOpen: false,
        isMoreOpen: isMoreOpen
      })
    }
  },
  // 选项卡关闭
  handleClose: function () {
    this.setData({
      isFocus: false,
      isMoreOpen: false,
      isEmojiOpen: false
    })
  },
  // 处理emoji选项卡
  handleEmoji: function handleEmoji() {
    if (this.data.isFocus) {
      this.setData({
        isFocus: false,
        isEmojiOpen: true
      })
    } else {
      var isEmojiOpen = !this.data.isEmojiOpen
      this.setData({
        isEmojiOpen: isEmojiOpen,
        isMoreOpen: false
      })
    }
  },
  handleEmojiShow: function () {
    this.setData({
      emojiShow: true,
      bigEmojiShow: false
    })
  },
  handleBigEmojiShow: function () {
    this.setData({
      emojiShow: false,
      bigEmojiShow: true
    })
  },
  //处理输入框
  inputconfirm: function () {
    this.sendMessage()
  },
  inputblur: function () {
    this.setData({
      isFocus: false
    })
  },
  inputfocus: function () {
    this.setData({
      isFocus: true
    })
  },
  iuputinput: function ({
                          detail
                        }) {
    var that = this
    if (detail.composing) {
      return;
    }
    this.setData({
      messageContent: detail.value
    })
  },
  // 发送text message 包含 emoji
  sendMessage: function () {
    var _this4 = this;
    if (!this.isnull(this.data.messageContent)) {
      let to = this.data.conversationData.toId
      let conversationType = this.data.conversationData.type
      var message = wx.$app.createTextMessage({
        to,
        conversationType,
        payload: {
          text: _this4.data.messageContent
        }
      });
      // var index = this.data.currentMessageList.length;
      wx.showLoading({title: "发送中", duration: 5000})
      wx.$app.sendMessage(message).then(res => {
        wx.hideLoading({title: "发送中", duration: 5000})
        if (res.code == 0) {
          res.data.message.nick = app.globalData.imProfile.nick // 将个人昵称赋值给message
          res.data.message.avatar = app.globalData.imProfile.avatar // 将个人头像赋值给message
          let currentMessageList = [..._this4.data.currentMessageList]
          let item = this.getTextEmoji(res.data.message, _this4)
          currentMessageList.push(item)
          _this4.setData({
            currentMessageList,
            scrollTop: currentMessageList.length * 999
          })
        }
      }).catch(err => {
        console.log(err)
      })
      _this4.setData({
        messageContent: ''
      })
      // this.messageContent = '';
    } else {
      wx.showToast({
        title: '消息不能为空',
        icon: 'none'
      })
    }
    this.setData({
      isFocus: false,
      isEmojiOpen: false,
      isMoreOpen: false
    })
  },
  isnull: function (content) {
    if (content === '') {
      return true;
    }
    var reg = '^[ ]+$';
    var re = new RegExp(reg);
    return re.test(content);
  },
  changeMessageStatus: function (state, index) {
    this.data.currentMessageList[index].status = 'fail';
  }
})
