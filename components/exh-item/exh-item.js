import {isInLikeList} from "../../utils/util";

let api = require("../../utils/api"), constant = require("../../utils/constant"), i18n = require('../../i18n/i18n.js'),
  storage = require("../../utils/storage.js"), util = require("../../utils/util");
var app = getApp()
import phone from '../../utils/phone'
import {defaultUserImage} from "../../common/staticImageContants";

Component({
  pageLifetimes: {
    show() {
      const pages = getCurrentPages()
      const route = pages[pages.length - 1].route
      this.getGifCode()
      if (route === 'packagePurchaser/pages/purchaser/exhibits/detail/detail' || route === 'packagePurchaser/pages/purchaser/exhibition/detail/detail') {
        this.setData({
          detailPage: true
        })
      } else {
        this.setData({
          detailPage: false
        })
      }

      // exhibition
      if (this.properties.exhItemType == 'exhibits') {
        var isLike = isInLikeList('1',)
      }

    }
  },

  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    exhibitList: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changePath) {
        if (!util.isNullArray(newVal)) {
          this.setData({
            langIsEn: i18n.isEn(),
            langTranslate: i18n.langTranslate()
          })
        }
      }
    },
    // 是展商还是展品，exhibition/exhibits
    exhItemType: {
      type: String,
      value: '',
    },
    itemType: {
      type: String,
      value: '',
    },
    exhItemTypeStatus: {
      type: String,
      value: '',
    },
    // 直播id
    liveId: {
      type: Number,
      value: 0
    },
    showLike:{
      type: Boolean,
      value: true
    },
    showCollect:{
      type: Boolean,
      value: true
    },
  },
  observers: {
    'currentPage': function (currentPage) {
      // 在 currentPage 或者 totalPage 被设置时，执行这个函数
      console.log(currentPage)
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
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
    langIsEn: false,
    langTranslate: i18n.langTranslate(),
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
    hadLike: false,
    hadCollect: false,
    defaultUserImage,
  },
  methods: {
    //点击切换隐藏和显示
    openMore: function (event) {
      var that = this;
      var toggleBtnVal = that.data.uhide;
      var itemId = event.currentTarget.dataset.id;
      if (toggleBtnVal == itemId) {
        that.setData({
          uhide: 0
        })
      } else {
        that.setData({
          uhide: itemId
        })
      }
    },
    toLivePlayerList() {
      wx.navigateTo({
        url: '/packagePurchaser/pages/purchaser/index/hot-video/hot-video',
      })
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
    // 这里是一个自定义方法
    customMethod: function () {
    },
    goDetailPage: function (e) {
      if (this.data.detailPage) {
        return
      }
      console.log(`${this.properties.exhItemType}`)
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/${this.properties.exhItemType}/detail/detail?id=${e.currentTarget.dataset.id}`,
      })
    },
    lookExhibitor: function (event) {
      wx.navigateTo({
        url: `/packagePurchaser/pages/purchaser/exhibition/detail/detail?id=${event.currentTarget.dataset.id}`,
      })
    },
    call: function (e) {
      var userId = storage.getUserInfo().id
      if (userId == null || userId == undefined || userId == '') {
        wx.navigateTo({
          url: "/packagePurchaser/pages/purchaser/authorize/authorize",
        });
      } else {
        console.log(e.currentTarget.dataset)
        const user = storage.getUserInfo()
        phone.call(user.id, e.currentTarget.dataset.purchaserId)
      }
    },
    video: function (e) {
      var userId = storage.getUserInfo().id
      if (userId == null || userId == undefined || userId == '') {
        wx.navigateTo({
          url: "/packagePurchaser/pages/purchaser/authorize/authorize",
        });
      } else {
        // 统计需求
        var projectId = wx.getStorageSync('activityDetail').id
        console.log(projectId, '=======projectId======')
        console.log(e.currentTarget.dataset.item)
        const roomID = this.getroomid()
        const nowTime = new Date()
        if (nowTime - this.tapTime < 1000) {
          return
        }
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
        var template = []
        template.push(app.globalData.templateId)
        wx.requestSubscribeMessage({
          tmplIds: template,
          success(res) {
            console.log(res, 'yue')
            if (res[app.globalData.templateId] == 'accept') {
              wx.login({
                success(data) {
                  if (data.code) {
                    if (util.getChairLength(e.currentTarget.dataset.item.company) > 20) {
                      var company = e.currentTarget.dataset.item.company.substring(0, 20)
                    } else {
                      var company = e.currentTarget.dataset.item.company
                    }
                    (0, api.sendMsg)({
                      method: "POST",
                      data: {
                        page: '/packageTencentCloud/pages/meeting/meeting?id=' + roomID + '&toID=' + e.currentTarget.dataset.id,
                        applyTime: util.formatDateH(new Date()),
                        sponsor: wx.getStorageSync('userInfo').contact,
                        company: company,
                        code: data.code,
                        templateId: app.globalData.templateId,
                        miniprogramState: 'formal'
                      },
                      success: function () {

                      }
                    });
                  } else {
                    console.log('登录失败！' + res)
                  }
                }
              })
            }
          }
        })
        const url = `/packageTencentCloud/pages/meeting/meeting?id=${roomID}&toID=${e.currentTarget.dataset.id}`
        wx.navigateTo({
          url,
        })
      }
    },
    chat: function (e) {
      var that = this
      var userId = storage.getUserInfo().id
      if (userId == null || userId == undefined || userId == '') {
        wx.navigateTo({
          url: "/packagePurchaser/pages/purchaser/authorize/authorize",
        });
      } else {
        const dataset = e.currentTarget.dataset
        if (dataset.online == 0) {
          wx.showToast({
            title: that.data.langTranslate['不在线'],
            icon: 'none'
          })
        } else {
          
          let data = {
            conversationID: 'C2C' + dataset.id,
            type: 'C2C',
            toId: dataset.id,
            toName: dataset.company
          }
          wx.navigateTo({
            url: '/packageTencentCloud/pages/chat/chat?data=' + JSON.stringify(data),
          })
        }
      }
    },
    //点赞收藏
    collect: function (event) {
      var self = this
      var userId = storage.getUserInfo().id
      if (userId == null || userId == undefined || userId == '') {
        wx.navigateTo({
          url: "/packagePurchaser/pages/purchaser/authorize/authorize",
        });
      } else {
        if (this.properties.exhItemType == 'exhibition') {
          var type = '0'
        } else if (this.properties.exhItemType == 'exhibits') {
          var type = '2'
        }
        if (event.currentTarget.dataset.hadCollect == '0') {
          (0, api.addCollect)({
            method: "POST",
            data: {
              userId: storage.getUserInfo().id,
              type: type,
              src: '1',
              operation: event.currentTarget.dataset.role,
              objectId: event.currentTarget.dataset.id,
              projectId: storage.getActivityDetail().id
            },
            header: {
              'cookie': storage.getSessionId()
            },
            success: function (e) {
              if (event.currentTarget.dataset.role == '0') {
                wx.showToast({
                  title: '点赞成功',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '收藏成功',
                  icon: 'none'
                })
              }
              self.triggerEvent('changePage')
            }
          });
        } else {
          var params = {
            id: event.currentTarget.dataset.id
          };
          (0, api.delCollect)({
            method: "GET",
            header: {
              'cookie': storage.getSessionId()
            },
            query: params,
            success: function (e) {
              if (event.currentTarget.dataset.role == '0') {
                wx.showToast({
                  title: '取消点赞成功',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '取消收藏成功',
                  icon: 'none'
                })
              }
              self.triggerEvent('changePage')
            }
          });
        }
      }
    },
    // 弹窗相关事件
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
      this.setData({
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
          title: '请完善信息再提交',
          icon: 'none'
        })
        return
      }
      ;
      const params = {
        activityEnd: _self.data.endTime + ':00',
        activityStart: _self.data.startTime + ':00',
        activityTime: _self.data.date,
        projectId: storage.getActivityDetail().id,
        sponsor: 1,
        supplierId: _self.data.inviteSupplierId,
        remark: _self.data.remark,
        purchaserId: storage.getUserInfo().id,
        top: _self.data.topTheme
      }
      this.properties.liveId > 0 ? params['liveId'] = this.properties.liveId : '';
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
        }
      })
    },
    //点击图片查看大图
    wxParseImgTap: function (event) {
      var that = this;
      console.log(that.data.itemType)
      //点击详情页图片查看大图，列表页跳转详情页
      if (that.data.itemType == 'detail') {
        var nowImgUrl = event.target.dataset.src;
        var imageUrls = []
        imageUrls.push(nowImgUrl)
        var tagFrom = event.target.dataset.from;
        console.log(nowImgUrl, imageUrls)
        if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
          wx.previewImage({
            current: nowImgUrl, // 当前显示图片的http链接
            urls: imageUrls // 需要预览的图片http链接列表
          })
        }
      } else {
        if (this.data.detailPage) {
          return
        }
        wx.navigateTo({
          url: `/packagePurchaser/pages/purchaser/${this.properties.exhItemType}/detail/detail?id=${event.currentTarget.dataset.id}`,
        })
      }
    },
  }
})