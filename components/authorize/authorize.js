// components/authorize/authorize.js
const api = require("../../utils/api"),
i18n = require('../../i18n/i18n.js')
import storage from '../../utils/storage'
Component({
  externalClasses: ['wxpopup','popupcontainer'],
  /**
   * 组件的属性列表
   */
  properties: {
    loadLoginPop: {
      type: Boolean, value: true}
  },

  /**
   * 组件的初始数据
   */
  data: {
    role: "purchaser",
    load_login_pop: false,
    inputValue:'',
    getVerCodeTitle: i18n.translateTxt("发送验证码"),
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    toggleactive: function (e) {
      console.log(e)
      this.setData({
        role: e.target.dataset.role
      })
    },
    startCountDown: function () {
      var _self = this;
      _self.setData({
        countDown: 5,
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
    sendSMS:function(){
      let _self = this;
      // this.startCountDown()
      api.getMobileCode({
        method: "GET",
        data: { mobile: _self.data.inputValue},
        success: function (e) {
          0 === e.data.code ? (console.log("已发送"), _self.startCountDown()) : (wx.showModal({
            title: '提示',
            content: e.data.message,
          }))
        },
        fail: function (e) {
          _self.setData({
            banCodeBtn: !1
          })
        }
      });
    },
    formSubmit: function (e) {
      let _self = this;
      let { username, password} = e.detail.value
        api.login({
          method: "POST",
          data: {
            projectId: storage.getActivityDetail().id,
            userName: username,
            password: password,
            src: 1,
            type: 'mobile',
          },
          header: {
            'cookie': storage.getSessionId()
          },
          success: function (e) {
            // _self.formReset()
            0 === e.data.code ? (
              storage.setUserInfo(e.data.data),
              storage.setToken(e.data.data.token),
              storage.setRoleType(constant.ROLE_TYPE.PURCHASER)) : 
              _self.formReset()
            (wx.showModal({
              title: '提示',
              content: e.data.message,
            }))
            
            // api.getTrtcOrImSign({
            //   method: 'POST',
            //   data: {
            //     UserId: storage.getUserInfo().id
            //   },
            //   success: res => {
            //     var liveId = _self.properties.liveId
            //     wx.$app.login({
            //       userID: wx.getStorageSync('userInfo').id,
            //       userSig: res.data.result,
            //       dialogShow: true
            //     }).then(imResponse => {
            //       console.log('采购商登录成功')
            //       console.log(imResponse)
            //     })

            //     wx.reLaunch({
            //       url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?type=1&id=${liveId}`,
            //     });

            //   }
            // })
          },
          complete: function () {
           
          }
        });
    },
    formReset: function (e) {
      this.setData({
        loadLoginPop: true
      })
    },
  }
})
