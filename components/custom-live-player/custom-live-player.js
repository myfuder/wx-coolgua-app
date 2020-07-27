import api from '../../utils/api'
import storage from '../../utils/storage'
import TIM from 'tim-wx-sdk'
import COS from 'cos-wx-sdk-v5';

import {
  myself_phone,
} from "../../common/staticImageContants";


let constant = require("../../utils/constant"), i18n = require('../../i18n/i18n.js'),
     util = require("../../utils/util");
var app = getApp()
import phone from '../../utils/phone'
// components/custom-live-player/custom-live-player.js
Component({
  externalClasses: ['cust-class', 'iconfont', 'icon-xiajiantou', 'icon-shangjiantou', 'icon-left-arrow','icon-right-arrow'],
  /**
   * 组件的属性列表
   */
  properties: {
    showMask:{
      type: Boolean,
      value: true,
    },
    liveId: {
      type: Number,
      value: 0,
    },
    src: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'rtmp'
    },
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    live: '',
    myself_phone,
    messages: [],
    content: '',
    playing: true,
    showControl: false,
    showMask: true,
    
    //begin:登陆
    dialogShow:true,
    currentRole: 2,
    langTranslate: i18n.langTranslate(),
    staticImageUrl: constant.STATIC_IMAGE_URL,
    getVerCodeTitle: i18n.translateTxt("发送验证码"),
    //end:登陆
  },

  lifetimes: {
    attached: function () {
      this.initTim()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initTim: function () {
      let options = {
        SDKAppID: constant.SDKAppID // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
      };
      let tim = TIM.create(options)
      tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
      tim.registerPlugin({
        'cos-wx-sdk': COS
      });
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived.bind(this))
      this.tim = tim
    },
    onPlay: function (e) {
      console.log(e)
      if (e.detail.code == '2007'){
        wx.showLoading({
          title: '视频加载中',
        })
      } else if(e.detail.code == '2006' || e.detail.code == '-2301'){
        wx.hideLoading()
        this.triggerEvent('onFinishEvent', null)
      } else if (e.detail.code == '2103'){
        wx.showLoading({
          title: '正在重连',
        })
      } else if (e.detail.code == '2003'){
        wx.hideLoading()
      }
    },
    
    onMessageSend() {
      const user = storage.getUserInfo()
      if(!user||user&&!user.id){
        wx.navigateTo({
          url: `/packagePurchaser/pages/purchaser/authorize/authorize?redirect=${encodeURIComponent(getCurrentPageAndParams())}`,
        })
        return false
      }
      if (this.data.content) {
        wx.showLoading({
          title: '发送中...',
          mask: true
        })
        const message = this.tim.createTextMessage({
          to: 'group_zhibo_' + this.data.liveId,
          conversationType: TIM.TYPES.CONV_GROUP,
          payload: {
            text: this.data.content
          }
        })
        this.tim.sendMessage(message).then(imResponse => {
          wx.hideLoading({
            complete: (res) => {},
          })
          this.data.messages.push({nick: user.contact || user.company, payload: {text: this.data.content}})
          this.setData({
            content: '',
            messages: this.data.messages
          })
        }).catch(error => {
          wx.hideLoading({
            complete: (res) => {},
          })
          wx.showToast({
            title: '发送失败',
            icon: 'none'
          })
          console.log(error)
        })
      }
    },
    onMessageReceived(event) {
      const data = event.data.filter(e => e.type === TIM.TYPES.MSG_TEXT)
      this.data.messages.push(...data)
      this.setData({
        messages: this.data.messages
      })
    },
    onChatInput(e) {
      this.setData({
        content: e.detail.value
      })
    },
    
    onPlayOrPause() {
      this.setData({
        playing: !this.data.playing
      }, () => {
        if (this.hideTimer) {
          clearTimeout(this.hideTimer)
        }
        this.hideTimer = setTimeout(() => {
          this.setData({
            showControl: false
          })
        }, 3000)
      })
    },
    onClose() {
      wx.navigateBack()
    },
    /*begin:弹出框*/
    showPopupTap: function (e) {
      var userId=storage.getUserInfo().id
      if(userId==null||userId==undefined||userId==''){
        this.setData({
          dialogShow: false,
        })
        return false
      }else{
        this.setData({
          dialogHide: false,
          inviteSupplierId: this.properties.exhItemType === 'exhibits' ? e.currentTarget.dataset.supplierid : e.currentTarget.dataset.id
        })
      }
    },
    setVcode: function (t) {
      var e = t.detail.value;
      this.setData({
        vcode: e
      });
    },
    setUserName: function (t) {
      var e = t.detail.value;
      this.setData({
        userName: e
      });
    },
    setPassword: function (t) {
      var e = t.detail.value;
      this.setData({
        password: e
      });
    },
    setCellNumber: function (t) {
      var e = t.detail.value;
      this.setData({
        cellNumber: e
      });
    },
    setImageCode: function (t) {
      var e = t.detail.value;
      this.setData({
        imageCode: e
      });
    },
    remeberPwdTap() {
      var _self=this
      _self.setData({
        isRememberPwd: !_self.data.isRememberPwd
      })
    },
    autoLoginTap() {
      var _self=this
      _self.setData({
        isAutoLogin: !_self.data.isAutoLogin
      })
    },
    getVerCode: function () {
      var _self=this
      if (_self.data.banCodeBtn) {
        return false
      };
      var i = _self.data.cellNumber;
      if (util.checkMobile(i)) {
        var params = {
          mobile: i
        };
        _self.setData({
          banCodeBtn: !0
        });
        (0, api.getMobileCode)({
          method: "GET",
          data: params,
          success: function (e) {
            0 === e.data.code ? (console.log("已发送"), _self.startCountDown()) : (wx.showModal({
              title: '提示',
              content: e.data.message,
            }), _self.setData({
              banCodeBtn: !1
            }))
          },
          fail: function(e) {
            _self.setData({
              banCodeBtn: !1
            })
          }
        });
      } else {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
      }
    },
    // 短信倒计时
    startCountDown: function() {
      var _self=this
      _self.setData({
        countDown: 60,
        getVerCodeTitle: "s",
      }),
          _self.countdown();
    },
    countdown: function () {
      var t = this.data.countDown, e = this.data.getVerCodeTitle;
      t >= 1 ? (t -= 1, this.setData({
        countDown: t
      }), setTimeout(this.countdown.bind(this), 1e3)) : (t = "", e = "重新获取", this.setData({
        countDown: t,
        getVerCodeTitle: e,
        banCodeBtn: !1
      }));
    },
    // 获取图形验证码
    getGifCode: function() {
      var _self=this
      storage.removeSessionId();
      (0, api.getGifCode)({
        method: "GET",
        responseType: 'arraybuffer',
        isSkipIntercept: true,
        success: function (e) {
          console.log(e)
          _self.setData({
            imageFile: wx.arrayBufferToBase64(e.data)
          })
          storage.setSessionId(e.header['Set-Cookie']); //保存Cookie到Storage
        }
      });
    },
    exhibitorLogin: function() {
      var _self=this
      const userName = this.data.userName, password = this.data.password, imageCode = this.data.imageCode, submitting = this.data.submitting
      if (submitting) {
        return false
      }
      if (util.isNullStr(userName) || util.isNullStr(password) || util.isNullStr(imageCode)) {
        wx.showToast({
          title: '请完善信息再提交',
          icon: 'none'
        })
        return false
      }
      this.setData({
        submitting: !0
      });
      (0, api.login)({
        method: "POST",
        data: {
          projectId: storage.getActivityDetail().id,
          userName: userName,
          password: password,
          src: 0,
          vcode: imageCode
        },
        header: {
          'cookie': storage.getSessionId()
        },
        success: function (e) {
          storage.setRememberPwd(_self.data.isRememberPwd)
          storage.setAutoLogin(_self.data.isAutoLogin)
          storage.setUserInfo(e.data.data)
          storage.setToken(e.data.data.token)
          storage.setPassword(_self.data.password)
          storage.setRoleType(constant.ROLE_TYPE.EXHIBITOR)
          wx.reLaunch({
            url: '/packageExhibitor/pages/zEdition1/index',
          })
        },
        complete: function() {
          _self.setData({
            submitting: !1,
            dialogShow:true
          })
          _self.getGifCode()
        }
      });
    },
    loginTap: function() {
      var _self=this
      if (_self.data.currentRole === 1) {
        _self.exhibitorLogin()
        return false
      }
      const phone = this.data.cellNumber, mobileCode = this.data.mobileCode, vcode = this.data.vcode, submitting = this.data.submitting
      if (submitting) {
        return false
      }
      if (util.isNullStr(phone) || util.isNullStr(mobileCode) || util.isNullStr(vcode)) {
        wx.showToast({
          title: '请完善信息再提交',
          icon: 'none'
        })
        return false
      }
      if (!util.checkMobile(phone)) {
        wx.showToast({
          title: '请输入正确的手机号码',
          icon: 'none'
        })
        return false
      }
      this.setData({
        submitting: !0
      });
      (0, api.login)({
        method: "POST",
        data: {
          projectId: storage.getActivityDetail().id,
          userName: phone,
          password: mobileCode,
          src: 1,
          type: 'mobile',
          vcode: vcode
        },
        header: {
          'cookie': storage.getSessionId()
        },
        success: function (e) {
          storage.setUserInfo(e.data.data)
          storage.setToken(e.data.data.token)
          storage.setRoleType(constant.ROLE_TYPE.PURCHASER)
          api.getTrtcOrImSign({
            method: 'POST',
            data: {
              UserId: storage.getUserInfo().id
            },
            success: res =>  {
              var liveId= _self.properties.liveId
              wx.$app.login({
                userID: wx.getStorageSync('userInfo').id,
                userSig: res.data.result,
                dialogShow:true
              }).then(imResponse => {
                console.log('采购商登录成功')
                console.log(imResponse)
              })

              wx.reLaunch({
                url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?type=1&id=${liveId}`,
              });

            }
          })
        },
        complete: function() {
          _self.setData({
            submitting: !1,
            dialogShow:true
          })
          _self.getGifCode()
        }
      });
    },
    setMobileCode: function (t) {
      var e = t.detail.value;
      this.setData({
        mobileCode: e
      });
    },
    changeRoleTap: function(e) {
      var _self=this
      _self.getGifCode()
      _self.setData({
        currentRole: parseInt(e.currentTarget.dataset.type)
      })
    },
    cancelPopupTap: function () {
      this.setData({
        dialogHide: true,
        dialogShow:true
      })
    },
    /*end:弹出框*/
  },
  observers: {
    'liveId': function (liveId) {
      if (liveId !== 0) {
        const user = storage.getUserInfo()
        api.getLive({
          query: {
            id: this.data.liveId
          },
          success: result => {
            console.log(result.data.result)
            if (result.data.code=="1"){
              wx.showModal({
                title: this.data.langTranslate['错误']||'warning',
                content: result.data.message, showCancel:false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack()
                  }
                }
              })
            }else{
              this.setData({
                live: result.data.result
              })
            }
          }
        })
        api.getLivePullUrl({
          query: {
            id: this.data.liveId,
            type: this.data.type,
            userId: user.id
          },
          success: (result) => {
            console.log(result.data.result)
            this.setData({
              src: result.data.result
            })
          }
        })
        api.getTrtcOrImSign({
          method: 'POST',
          data: {
            UserId: user.id
          },
          success: (result) => {
            this.tim.login({
              userID: user.id,
              userSig: result.data.result
            }).then(imResponse => {
              console.log('登录成功')
              this.tim.joinGroup({
                groupID: 'group_zhibo_' + liveId,
                type: TIM.TYPES.GRP_PUBLIC
              }).then(imResponse => {
                console.log('加入群组group_zhibo_' + liveId + ' 成功')
                console.log(imResponse)
              })
            })
          }
        })

      }
    }
  }
})