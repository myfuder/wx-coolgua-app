// packageExhibitor/pages/zEdition1/me/myLiveBroadcast/live/index.js
// 那你直播的时候调一下这个接口
// /api3/live/pushbacks/{liveId}
// 结束直播的时候调一下这个
// /api3/live/truncatebacks/{liveId}
import {
  getString
} from "../../../../../../locals/lang";

var storage = require("../../../../../../utils/storage.js");
var app = getApp();
// import TIM from '../../../../../../utils/tim-wx'
import TIM from 'tim-wx-sdk'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pushStatus: '',
    duration: '00:00:00',
    num: 0,
    liveUrl: '',
    screenHeight: wx.getSystemInfoSync().screenHeight,
    cameraDiraction: 'front',
    userInfo: null,

    liveId: null,
    imMsgList: [],
    scrollTop: 0.01,
    // scrollTop: 55*40,
    messageContent: '', // 消息
    inputFocus: false,
    inputInfo: "",
    coverViewHeight: 0,
    maxMessageListCount: 8,
  },
  LivePusherContext: null,
  count: 0,
  createLiveParam: {
    theme: null,
    imageSrc: null
  },
  backClick() {
    this.stopLivePusher();
    wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('lang') == 'en') {
      wx.setNavigationBarTitle({
        title: wx.getStorageSync('activityDetail').nameEn
      })
    } else {
      wx.setNavigationBarTitle({
        title: wx.getStorageSync('activityDetail').name
      })
    }
    this.monitorImSDK()
    this.setData({
      label: {
        label1: getString('wp', 'app.live.room.yuyue'), //'我的预约'
        label2: getString('wp', 'app.live.room.num'), //'在线人数'
        label3: getString('wp', 'app.live.room.duration'), //'直播时长'
        send: getString('exhibitors_index', 'app.im.send'), //'直播时长'
      }
    })
    if (!options.scene) {
      this.createLiveParam = JSON.parse(decodeURIComponent(options.param))
      // this.createLiveParam = {
      //     "liveUrl": "rtmp://88749.livepush.myqcloud.com/live?09b3ec84240843ae9bc4858664230b3c?txSecret=fd9c7ea04d8e6eaf0d8bc8dd3d4feff9&txTime=5EC774BC",
      //     "liveId": 1096
      // }
      let userInfo = wx.getStorageSync('userInfo')
      console.log("用户信息：", userInfo)
      this.setData({
        screenHeight: wx.getSystemInfoSync().screenHeight,
        userInfo: userInfo
      })
      this.startLive()
    } else {
      this.setData({
        liveId: options.scene
      })
      this.startLiveShowFromPc()   // pc发起直播的二维码路径 只有个 scene=liveId
    }

  },
  startLiveShowFromPc() {
    var self = this
    var liveId = this.data.liveId
    var user = wx.getStorageSync('userInfo')
    // 获取直播推流地址
    // POST /api3/live/getPushUrl /api3/live/{id}
    wx.request({
      url: getApp().globalData.host + `/api3/live/${liveId}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        "id": liveId,
        "projectId": wx.getStorageSync('activityDetail').id,
        "supplierId": user.id,
        "companyId": user.companyId,
        "contact": user.contact,
        "conversion": user.conversion,
        "createTime": user.createTime,
        "duration": user.duration,
        "endTime": user.endTime,
        "number": user.number,
        "startTime": user.startTime,
        "status": user.status,
        "streamName": user.streamName,
        "tags": user.tags,
        "telephone": user.telephone,
        // theme: "",
        // coverImage: ""
      },
      success: function (res) {
        var live = res.data.result
        self.createLiveParam.liveUrl = live.pushUrl
        self.createLiveParam.liveId = live.id
        self.startLive()
      },
      fail: function (error) {
        console.error('error', error);
      }
    })
  },
  startLive() {
    this.setData({
      liveUrl: this.createLiveParam.liveUrl
    })
    this.liveId = this.createLiveParam.liveId
    setTimeout(() => {
      this.LivePusherContext.start({
        success: () => {
          console.log("开启直播成功")
          this.startRecordPushStart(true);
        },
        fail: () => {
          console.log("开启直播失败")
        }
      })
    }, 500);
    this.setData({
      liveId: this.createLiveParam.liveId
    })

    // 创建聊天室
    let promise = wx.$app.createGroup({
      type: TIM.TYPES.GRP_CHATROOM,
      name: 'group_zhibo_' + this.data.liveId,
      groupID: 'group_zhibo_' + this.data.liveId,
      avatar: this.data && this.data.userInfo && this.data.userInfo.portrait || "https://ywmatch.coolgua.com/api3/live/createLiveQRCode/1"
    });
    promise && promise.then && promise.then(function (imResponse) { // 创建成功
      console.log(imResponse.data.group); // 创建的群的资料
    }).catch(function (imError) {
      console.warn('createGroup error:', imError); // 创建群组失败的相关信息
    });
    //加入聊天室
    let promise1 = wx.$app.joinGroup({
      groupID: 'group_zhibo_' + this.data.liveId,
      type: TIM.TYPES.GRP_CHATROOM
    });
    promise1 && promise1.then && promise1.then(function (imResponse) { // 创建成功
      console.log(imResponse.data.group); // 创建的群的资料
    }).catch(function (imError) {
      console.warn('joinGroup error:', imError); // 创建群组失败的相关信息
    });

    this.isLiving = true
    this.startLoadLiveRoom();
    this.startLoadLiveRoom_setInterval = setInterval(() => {
      this.startLoadLiveRoom();
    }, 1000 * 60)
    this.startCountTime()
  },
  gotoMyInter() {
    let url = '/packageExhibitor/pages/zEdition1/me/myInvitation/myGetInvitation/index?liveid=' + this.data.liveId
    wx.navigateTo({
      url: url,
      // url: '../../myInvitation/myGetInvitation/index?liveid=' + this.data.liveId,
    })
  },
  startRecordPushStart(startOrStop) {
    let url = startOrStop ? '/api3/live/pushbacks' : '/api3/live/truncatebacks'
    url = app.globalData.host + `${url}/${this.liveId}`
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
    })
  },
  startCountTime() {
    this.startCountTime_setInterval = setInterval(() => {
      this.count++
      this.setData({
        duration: this.formatSeconds(this.count)
      })
      /*  if (this.isLiving) {
            this.startCountTime()
        }*/
    }, 1000)
  },
  formatSeconds(value) {
    let result = parseInt(value)
    let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
    let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
    let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

    let res = '';
    if (h !== '00') res += `${h}h`;
    if (m !== '00') res += `${m}min`;
    res += `${s}s`;
    return `${h}:${m}:${s}`;
  },
  changeCamera() {
    this.LivePusherContext.switchCamera()
    if (this.data.cameraDiraction == 'front') {
      this.setData({
        cameraDiraction: 'back'
      })
    } else {
      this.setData({
        cameraDiraction: 'front'
      })
    }
  },
  startLoadLiveRoom() {
    let url = app.globalData.host + `/api3/live/latestonlinenumber/${this.liveId}`
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == '0') {
          that.setData({
            num: res.data.result
          })
          console.log("直播间信息：", res.data)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.LivePusherContext = wx.createLivePusherContext()
  },
  statechange(e) {
    let code = e.detail.code
    let str = ''
    if (code == 1001) {
      str = '已经连接推流服务器'
    } else if (code == 1002) {
      str = '已经与服务器握手完毕,开始推流'
    } else if (code == 1003) {
      str = '打开摄像头成功'
    } else if (code == 1004) {
      str = '录屏启动成功'
    } else if (code == 1005) {
      str = '推流动态调整分辨率'
    } else if (code == 1006) {
      str = '推流动态调整码率'
    } else if (code == 1007) {
      str = '首帧画面采集完成'
    } else if (code == 1008) {
      str = '编码器启动'
    } else if (code == -1301) {
      str = '打开摄像头失败'
    } else if (code == -1307) {
      str = '网络断连，且经多次重连抢救无效，更多重试请自行重启推流'
    } else if (code == -1101) {
      str = '网络状况不佳：上行带宽太小，上传数据受阻'
    } else if (code == -1102) {
      str = '网络断连, 已启动自动重连'
    } else if (code == -3001) {
      str = 'RTMP -DNS解析失败'
    } else if (code == -3002) {
      str = 'RTMP服务器连接失败'
    } else if (code == -3003) {
      str = 'RTMP服务器握手失败'
    }
    this.setData({
      pushStatus: str
    })
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  bindErrorChange(e) {
    // this.stopLivePusher()
    this.setData({
      pushStatus: '错误码是：' + e.detail.code
    })
  },
  stopLivePusher() {
    this.isLiving = false;
    this.startRecordPushStart(false);
    this.LivePusherContext.stop({
      success: () => {
        console.log("关闭直播成功")
      },
      fail: () => {
        console.log("关闭直播失败")
      }
    })
  },

  //限制array大小
  limitArrayList(array) {
    if (array.length > this.data.maxMessageListCount) {
      return array.splice(array.length - this.data.maxMessageListCount, array.length)
    } else {
      return array
    }
  },
  // 发送text message 包含 emoji
  sendMessage() {
    console.log('发送')
    var _this = this;
    var messageText = this.data.inputInfo.trim()
    if (messageText.length) {
      var message = wx.$app.createTextMessage({
        to: 'group_zhibo_' + _this.data.liveId, // 群id 'group_zhibo_' + _this.data.liveId @TGS#2EMRRHGGM
        conversationType: 'GROUP',
        payload: {
          text: messageText
        }
      });
      wx.$app.sendMessage(message)
        .then(res => {
          console.log(res)
          if (res.code == 0) {
            let messageList = [..._this.data.imMsgList]
            console.log(_this.data.messageContent)
            var user = storage.getUserInfo()
            messageList.push({
              name: user && user.contact || user && user.company || '匿名',
              news: messageText,
              system: false
            })
            console.log(messageList)
            _this.setData({
              inputModel: "",
              inputInfo: "",
              messageContent: '',
              imMsgList: _this.limitArrayList(messageList),
            })
            _this.scroll2bottom()
          }
        })
        .catch(err => {
          // var that = this
          console.log(err)
          _this.setData({
            messageContent: ''
          })
        })
    } else {
      wx.showToast({
        title: '消息不能为空',
        icon: 'none'
      })
    }
  },

  msgInputChange({
                   detail
                 }) {
    this.setData({
      messageContent: detail.value
    })
  },

  // 消息处理（系统消息）
  messageType(item) {
    let obj = {
      name: item.from === '@TIM#SYSTEM' ? '系统' : (item.contact || item.nick || item.from),
      news: '',
      system: item.from === '@TIM#SYSTEM' ? true : false
    };
    switch (item.payload.operationType) {
      case TIM.TYPES.GRP_TIP_MBR_PROFILE_UPDATED: // 群成员资料变更，例如：群成员被禁言
        const memberList = item.payload.memberList;
        for (let member of memberList) {
          if (member.muteTime == 0) {
            obj.news = `${member.userID} 被解除禁言`
          } else {
            let minute = member.muteTime / 60
            let second = member.muteTime % 60
            obj.news = `${member.userID} 被禁言${minute > 0 ? minute + '分钟' : ''}${second > 0 ? second + '秒' : ''}`
          }
        }
        break;
      case TIM.TYPES.GRP_TIP_MBR_JOIN: // 有成员加群
        obj.news = `${item.payload.userIDList[0]}加入直播`
        break;
      case TIM.TYPES.GRP_TIP_MBR_QUIT: // 有群成员退群
        obj.news = `${item.payload.userIDList[0]}退出直播`
        break;
      case TIM.TYPES.GRP_TIP_MBR_KICKED_OUT: // 有群成员被踢出群
        obj.news = `${item.payload.userIDList[0]}被踢出直播`
        break;
      default:
        break;
    }
    if (item.type == 'TIMTextElem') { // 文本消息
      obj.news = item.payload.text
    }
    // 消息超长换行
    let list = [];
    let n = 20;
    for (let i = 0, l = obj.news.length; i < l / n; i++) {
      let a = obj.news.slice(n * i, n * (i + 1));
      list.push(a);
    }
    return obj;
  },

  // 监听im消息
  monitorImSDK() {
    let _this = this
    let onMessageReceived = function (e) {
      // console.log('新消息', e.data);
      e.data.forEach(item => {
        if (item.to == `group_zhibo_${_this.data.liveId}`) { // 群id `group_zhibo_${_this.data.liveId}`
          let messageList = [..._this.data.imMsgList]
          messageList.push(_this.messageType(item))
          _this.setData({
            imMsgList: messageList.splice(messageList.length - _this.data.maxMessageListCount, messageList.length)
          })
          _this.scroll2bottom()
        }
      })
    };
    let onReadyStateUpdate = function ({
                                         name
                                       }) {
      var self = this
      const isSDKReady = (name === TIM.EVENT.SDK_READY);
      if (isSDKReady) {
        // 获取消息列表 会话 ID 组成方式：GROUP+groupID（群聊）
        let conversationID = 'GROUPgroup_zhibo_' + _this.data.liveId // 'GROUPgroup_zhibo_' + _this.data.liveId
        wx.$app.getMessageList({
          conversationID,
          count: self.data.maxMessageListCount
        })
          .then(res => {
            let imMsgList = []
            res.data.messageList.forEach(item => {
              imMsgList.push(_this.messageType(item))
            })
            _this.setData({
              imMsgList: _this.limitArrayList(imMsgList),
            })
            _this.scroll2bottom()
            wx.$app.setMessageRead({
              conversationID
            }); // 已读上报
          })
          .catch(() => {
          })
      }
    }
    wx.$app.on(TIM.EVENT.SDK_READY, onReadyStateUpdate, this) // 监听是否进入 ready 状态
    wx.$app.on(TIM.EVENT.MESSAGE_RECEIVED, onMessageReceived, this); //监听SDK收到新消息
  },
  substr1(str) {
    return str.substring(0, 6) + "***"
  },
  closeClick() {
    wx.showModal({
      content: getString('wp', 'app.pop.title.exitlive'),
      cancelColor: '#406FC1',
      confirmColor: "#DF1C48",
      cancelText: getString('wp', 'app.btn.cancel'),
      confirmText: getString('wp', 'app.info.end'),
      success: (res) => {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          this.stopLivePusher();
          wx.navigateBack();
        }
      },
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setKeepScreenOn({
      keepScreenOn: true
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
    // this.isLiving = false
    clearInterval(this.startLoadLiveRoom_setInterval)
    clearInterval(this.startCountTime_setInterval)
    this.stopLivePusher()
    //禁止取消群
    /*  var id = 'group_zhibo_' + this.data.liveId
    let promise = wx.$app.dismissGroup(id);
     promise.then(function (imResponse) { // 解散成功
       console.log(imResponse.data.groupID); // 被解散的群组 ID
     }).catch(function (imError) {
       console.warn('dismissGroup error:', imError); // 解散群组失败的相关信息
     });*/
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

  },
  /**
   * 将焦点给到 input（在真机上不能获取input焦点）
   */
  tapInput() {
    this.setData({
      //在真机上将焦点给input
      inputFocus: true,
      //初始占位清空
      inputInfo: ''
    });
  },

  /**
   * input 失去焦点后将 input 的输入内容给到cover-view
   */
  bindinput(e) {
    this.setData({
      inputInfo: e.detail.value
    });
  },
  scroll2bottom() {
    let _this = this
    wx.createSelectorQuery().select('#coverScrollBox')
      .boundingClientRect(
        function (rect) {
          var max = _this.data.imMsgList.length * 20
          if (_this.data.imMsgList.length <= 5) {
            return false
          }
          if (rect) {
            _this.setData({
              // coverViewHeight:_this.data.imMsgList.length * 55,
              // scrollTop: parseInt(_this.data.imMsgList.length * 55)
              // scrollTop:rect.height
              scrollTop: max
            }, () => {
              // setTimeout(()=>{
              //     _this.setData({
              //         // coverViewHeight:_this.data.imMsgList.length * 55,
              //         // scrollTop: parseInt(_this.data.imMsgList.length * 55)
              //         scrollTop:rect.height+10
              //     })
              // },1000)
            })
          }
        }).exec()
  },

})