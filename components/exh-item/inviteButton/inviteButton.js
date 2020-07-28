/*观众的邀约*/
const storage = require('../../../utils/storage')
let api = require("../../../utils/api")
  , constant = require("../../../utils/constant"),
  i18n = require('../../../i18n/i18n.js'),
  util = require("../../../utils/util");
var app = getApp()
import phone from '../../../utils/phone'
import {
  collect_button,
  collect_button_active,
  favirButtonImage, likeButton, likeButton_active,
  likeButtonImage,
  messageActiveButton, messageActiveButton_disbaled,
  phoneCallButtonImage,
  phoneCallButtonImage_disabled
} from "../../../common/staticImageContants";
Component({
  properties: {
    liveid: {
      type: [Number, String]
    },
    userid: {
      type: [Number, String]
    },
    type: {
      type: [Number, String]
    },
    defaultText:{
      type: String,
      value:"预约"
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
    messageActiveButton, messageActiveButton_disbaled,
    staticImageUrl: constant.STATIC_IMAGE_URL,
    staticDefaultImg: constant.STATIC_DEFAULT_IMAGE_NAME,
    dialogHide: true,
    date: '',
    dayText: '',
    startTime: '',
    endTime: '',
    inviteSupplierId: null,
    remark: '',
    topTheme: '',
    template: '1v1',
    debugMode: false,
    cloudenv: 'PRO',
    // 语言判断
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    detailPage: false,
    currentRole: 1,
    getVerCodeTitle: i18n.translateTxt("发送验证码"),
    cellNumber: "",
    countDown: '',
    verCode: "",
    banCodeBtn: !1,
    imageFile: null,
    // 图形验证码
    vcode: '',
    // 短信验证码
    mobileCode: '',
    // 登录提交标识，是否正在提交
    submitting: false,
    // 参展商登录部分
    userName: '',
    password: '',
    imageCode: '',
    uhide: 0,
    // 限制开始时间
    startDate: util.formatNumberTime(new Date().getTime(), 'Y-m-d'),
    limitStartTime: util.formatNumberTime(new Date().getTime(), 'H:i'),
    exhibitListSub: [],
    contactList:[],
    popWindow: true,
    activeContact:''
  },
  methods: {
    showContacts(e){
      this.gtesSuppliercontact()
    },
    closepop() {
      this.setData({
        popWindow: true
      })
    },
    gtesSuppliercontact() {
      var that = this;
      api.suppliercontact({
        query: {
          supplierId: that.properties.userid
        },
        success(res) {
          console.log(res)
          if (res.data.code=='0'){
            that.setData({
              contactList: res.data.result.list,
              popWindow: false
            })
          }
          else{
            wx.showToast({
              title: res.daat.message,
            })
          }
        }
      })
    },
    mesgClick(e){
      this.setData({
        activeContact: e.currentTarget.dataset.item,
        popWindow: true
      })
    },
    // begin 弹窗相关事件
    showPopupTap: function (e) {
      var userId = storage.getUserInfo().id
      if (userId == null || userId == undefined || userId == '') {
        wx.navigateTo({
          url: "/packagePurchaser/pages/purchaser/authorize/authorize",
        });
      } else {
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
      var _self = this
      _self.setData({
        isRememberPwd: !_self.data.isRememberPwd
      })
    },
    autoLoginTap() {
      var _self = this
      _self.setData({
        isAutoLogin: !_self.data.isAutoLogin
      })
    },
    getVerCode: function () {
      var _self = this
      if (_self.data.banCodeBtn) {
        return false
      }
      ;
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
          fail: function (e) {
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
    startCountDown: function () {
      var _self = this
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
    getGifCode: function () {
      var _self = this
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
    exhibitorLogin: function () {
      var _self = this
      const userName = this.data.userName, password = this.data.password, imageCode = this.data.imageCode,
        submitting = this.data.submitting
      if (submitting) {
        return false
      }
      if (util.isNullStr(userName) || util.isNullStr(password) || util.isNullStr(imageCode)) {
        wx.showToast({
          title: _self.data.langTranslate['请完善信息再提交'],
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
        complete: function () {
          _self.setData({
            submitting: !1
          })
          _self.getGifCode()
        }
      });
    },
    loginTap: function () {
      var _self = this
      if (_self.data.currentRole === 1) {
        _self.exhibitorLogin()
        return false
      }
      const phone = this.data.cellNumber, mobileCode = this.data.mobileCode, vcode = this.data.vcode,
        submitting = this.data.submitting
      if (submitting) {
        return false
      }
      if (util.isNullStr(phone) || util.isNullStr(mobileCode) || util.isNullStr(vcode)) {
        wx.showToast({
          title: _self.data.langTranslate['请完善信息再提交'],
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
            success: res => {
              wx.reLaunch({
                url: '/packagePurchaser/pages/purchaser/tabbar/index/index',
              });
              wx.$app.login({
                userID: wx.getStorageSync('userInfo').id,
                userSig: res.data.result
              }).then(imResponse => {
                console.log('采购商登录成功')
                console.log(imResponse)
              })
            }
          })
        },
        complete: function () {
          _self.setData({
            submitting: !1
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
    changeRoleTap: function (e) {
      var _self = this
      _self.getGifCode()
      _self.setData({
        currentRole: parseInt(e.currentTarget.dataset.type)
      })
    },
    cancelPopupTap: function () {
      this.setData({
        dialogHide: true
      })
    },
    //注册跳转
    registerTap: function (event) {
      //console.log(event)
      var src = event.currentTarget.dataset.url;
      wx.setStorageSync('official', src)
      wx.navigateTo({
        url: '/pages/view/view?url=' + src
      })
    },
    bindDateChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      const date = e.detail.value.replace('-', '/')
      //如果选中的是今天 开始时间不能过现在
      if(new Date(date).getDate()==new Date().getDate()){
        var limitStartTime=util.formatNumberTime(new Date().getTime(), 'H:i')
      }else{
        var limitStartTime="00:00"
      }
      this.setData({
        limitStartTime,
        date: e.detail.value,
        dayText: util.setDayText(new Date(date).getDay())
      })
    },
    bindTimeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        startTime: e.detail.value
      })
    },
    bindEndChange: function (e) {
      this.setData({
        endTime: e.detail.value
      })
    },
    changeRemark: function (e) {
      this.setData({
        remark: e.detail.value
      })
    },
    changeTopTheme: function (e) {
      this.setData({
        topTheme: e.detail.value
      })
    },
    submitTap: function () {
      const _self = this
      if (util.isNullStr(_self.data.date) || util.isNullStr(_self.data.startTime) || util.isNullStr(_self.data.endTime) || util.isNullStr(_self.data.remark) || util.isNullStr(_self.data.topTheme)) {
        wx.showToast({
          title: _self.data.langTranslate['请完善信息再提交'],
          icon: 'none'
        })
        return
      }
      var roleType = storage.getRoleType()
      var userId = storage.getUserInfo().id
      var sponsor = 1
      var supplierId = ""
      var purchaserId = ""
      if (this.properties.userid == userId) {
        sponsor = 1
      } else {
        sponsor = 0
      }
      if (roleType == constant.ROLE_TYPE.EXHIBITOR) {
        supplierId = userId
        purchaserId = this.properties.userid
      } else {
        supplierId = this.properties.userid
        purchaserId = userId
      }
      const params = {
        activityEnd: _self.data.endTime + ':00',
        activityStart: _self.data.startTime + ':00',
        activityTime: _self.data.date,
        projectId: storage.getActivityDetail().id,
        sponsor,
        supplierId,
        remark: _self.data.remark,
        purchaserId,
        top: _self.data.topTheme,
        contactId: _self.data.activeContact.id
      }
      this.properties.liveid > 0 ? params['liveId'] = this.properties.liveid : '';
      (0, api.addPurchaserSchedule)({
        data: {
          ...params
        },
        method: 'POST',
        success: function () {
          wx.showToast({
            title: '邀约成功',
          })
          _self.setData({
            dialogHide: true,
            endTime: '',
            startTime: '',
            remark: '',
            topTheme: ''
          })
          _self.triggerEvent('onFinishEvent', null)
        }
      })
    },
    //        end :弹窗相关事件
  },
  attached() {
    // 判断语言类型
    var language = wx.getStorageSync('lang')
    this.setData({
      language,
      langIsEn: i18n.isEn(),
      langTranslate: i18n.langTranslate()
    })
  }
});
