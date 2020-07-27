//index.js
//获取应用实例
import {getAgreePromise, getRoleType, getUserInfo, setAgreePromiseTrue} from "../../utils/storage";
import {agreePromiseTrueApi} from "../../utils/api";

const app = getApp();
let TIME = 60;
let _self = null;
let api = require("../../utils/api"),
  constant = require("../../utils/constant"),
  i18n = require("../../i18n/i18n.js"),
  storage = require("../../utils/storage.js"),
  util = require("../../utils/util");
Page({
  data: {
    options: {},
    canClick: true,
    codeNum: "",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    openId: "",
    canShowTab: false,
    phoneNumber: "",
    dialogHide: true,
    role: "",
    concurrentEvents: [],
    exhibitList: [],
    currentRole: 1,
    isRememberPwd: false,
    isAutoLogin: false,
    langTranslate: {},
    lang: null,
    bannerList: [],
    friendLinkList: [],
    supportingActivityList: [],
    demandList: [],
    liveList: [],
    // 短信验证码
    getVerCodeTitle: i18n.translateTxt("发送验证码"),
    cellNumber: "",
    countDown: "",
    verCode: "",
    banCodeBtn: !1,
    imageFile: null,
    // 图形验证码
    vcode: "",
    // 短信验证码
    mobileCode: "",
    // 登录提交标识，是否正在提交
    submitting: false,
    staticImageUrl: constant.STATIC_IMAGE_URL,
    supplierList: [],
    scrollId: "",
    // 参展商登录部分
    userName: "",
    password: "",
    imageCode: "",
    videoList: [],
    // 栏目id
    zhjsId: null,
    cgznId: null,
    jtznId: null,
    // 滚动位置
    supplierScrollTop: 0,
    demandScrollTop: 0,
    wxpayShow: false,
    //承诺弹出框
    showAgreementPromise: false,
  },
  // 判断用户之前是否授权，以什么身份登录
  role: function () {
    var that = this;
    var role = wx.getStorageSync("role");
    var authorization = wx.getStorageSync("authorization");
    var phone = wx.getStorageSync("phone");
    var exhibitor = wx.getStorageSync("exhibitor");
    var visitor = wx.getStorageSync("visitor");
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    if (role == "exhibitor" && authorization && phone && exhibitor) {
      wx.redirectTo({
        url: "../exhibitor/home/index/index",
      });
    } else if (role == "exhibitor" && !authorization && phone && exhibitor) {
      wx.redirectTo({
        url: "../exhibitor/authorize/authorize",
      });
    } else if (role == "exhibitor" && authorization && !phone && exhibitor) {
      wx.redirectTo({
        url: "../exhibitor/authorize/authorize",
      });
    } else if (role == "exhibitor" && !authorization && !phone && !exhibitor) {
      wx.redirectTo({
        url: "../exhibitor/authorize/authorize",
      });
    } else if (role == "exhibitor" && authorization && phone && !exhibitor) {
      wx.redirectTo({
        url: "../exhibitor/register/register",
      });
    } else if (role == "visitor" && authorization && phone && visitor) {
      wx.redirectTo({
        url: "../visitor/home/index/index",
      });
    } else if (role == "visitor" && !authorization && phone && visitor) {
      wx.redirectTo({
        url: "../visitor/authorize/authorize",
      });
    } else if (role == "visitor" && authorization && !phone && visitor) {
      wx.redirectTo({
        url: "../visitor/authorize/authorize",
      });
    } else if (role == "visitor" && !authorization && !phone && !visitor) {
      wx.redirectTo({
        url: "../visitor/authorize/authorize",
      });
    } else if (role == "visitor" && authorization && phone && !visitor) {
      console.log(333);
      wx.redirectTo({
        url: "../visitor/register/register",
      });
    } else {
      this.setData({
        canShowTab: true,
      });
      wx.hideLoading();
    }
  },
  scrollPublish: function () {
    const scrollNum = _self.data.demandScrollTop,
      oneHeight = (135 / 750) * wx.getSystemInfoSync().windowWidth,
      demandList = _self.data.demandList;
    if (
      scrollNum === oneHeight * demandList.length ||
      scrollNum > oneHeight * demandList.length
    ) {
      _self.setData({
        demandScrollTop: 0,
      });
    } else {
      _self.setData({
        demandScrollTop: _self.data.demandScrollTop + 10,
      });
    }
  },
  // 获取该组织下所以激活状态的活动列表
  getProjects: function () {
    (0, api.getProjectList)({
      success: function (res) {
        _self.getAcvitity(res.data.result[0].id);
      },
    });
  },
  // 获取活动详情
  getAcvitity: function (id) {
    (0, api.getProjectDetail)({
      query: {
        id: id,
      },
      success: function (res) {
        storage.setActivityDetail(res.data.result);
        if (i18n.getLanguage() == 'en') {
          wx.setNavigationBarTitle({
            title: res.data.result.nameEn,
          });
        } else {
          wx.setNavigationBarTitle({
            title: res.data.result.name,
          });
        }
        _self.initData();
        _self.activityList();
        var phoneNumber = wx.getStorageSync('phoneNumber')
        var openId = wx.getStorageSync('user').openId
        if (phoneNumber && openId) {
          console.log(3344)
          _self.contacts(openId, phoneNumber, res.data.result.id)
        } else {
          _self.initRole();
        }
      },
    });
  },
  // 查询展商联系人
  contacts: function (openId, phoneNumber, activityId) {
    var that = this;
    var role = wx.getStorageSync("role");
    if (role == "exhibitor") {
      var url =
        app.globalData.host +
        "/api3/suppliercontact/getSupplierContact?projectId=" +
        activityId +
        "&weixinId=" +
        openId +
        "&mobile=" +
        phoneNumber;
    } else {
      console.log(444)
      var url =
        app.globalData.host +
        "/api3/purchaser/getPurchaserByWxId?projectId=" +
        activityId +
        "&weixinId=" +
        openId +
        "&mobilePhone=" +
        phoneNumber;
    }
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "application/json",
      },
      success: function (res) {
        console.log(res, 1);
        if (res.data.code == "0") {
          if (role == "exhibitor") {
            storage.setUserInfo(res.data.result);
            storage.setRoleType(constant.ROLE_TYPE.EXHIBITOR);
          } else {
            storage.setUserInfo(res.data.result);
            storage.setRoleType(constant.ROLE_TYPE.PURCHASER);
          }
          that.initRole();
        } else if (res.data.code == "1" && res.data.message == "数据不存在") {
          that.initRole();
        } else {
          wx.showToast({
            title: res.data.message,
            icon: "none",
            duration: 1000,
            success: function () {
              return false;
            },
          });
          return false;
        }
      },
      fail: function (error) {
        console.log(error);
      },
    });
  },
  payWX: function () {
    wx.login({
      success(data) {
        if (data.code) {
          console.log(data.code)
          var that = this
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;
          var url = 'https://pay.coolgua.net/pay/wxminiprogrampay?code=' + data.code + '&orderNo=' + timestamp + '13436372908' + '&subject=' + '支付' + '&orgId=' + '269' + '&money=' + '0.01';
          wx.request({
            url: url,
            method: 'GET',
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              var preData = res.data.result
              console.log(res)
              wx.requestPayment({
                "timeStamp": preData.timeStamp,
                "nonceStr": preData.nonceStr,
                "package": preData.package,
                "signType": preData.signType,
                "paySign": preData.paySign,
                "success": function (res) {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                      setTimeout(() => {
                        console.log(res)
                      }, 2000)
                    }
                  })
                },
                "fail": function (res) {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none',
                    duration: 2000,
                    success: function () {
                      console.log(res)
                    }
                  })
                }
              })
            },
            fail: function (error) {
              console.log(error)
            }
          })
        }
      }
    })
  },

  // 点击我是参展商按钮
  exhibitorAutoLogin: function (event) {
    var that = this;
    that.setData({
      dialogShow: false,
      role: event.currentTarget.dataset.role,
    });
    wx.setStorageSync("role", event.currentTarget.dataset.role);
  },
  // 切换语言
  switchLanguage: function (event) {
    wx.setStorageSync("lang", event.currentTarget.dataset.name);
    if (i18n.getLanguage() == 'en') {
      wx.setNavigationBarTitle({
        title: storage.getActivityDetail().nameEn,
      });
    } else {
      wx.setNavigationBarTitle({
        title: storage.getActivityDetail().name,
      });
    }
    _self.initData();
  },
  // 点击我是观众按钮
  visitorAutoLogin: function () {
    wx.redirectTo({
      url: "../visitor/home/index/index",
    });
    wx.setStorageSync("role", "visitor");
  },
  scrollToTap: function () {
    _self.setData({
      scrollId: "activity",
    });
  },
  // 初始化数据
  initData: function () {
    const exhibitList = [],
      livingList = [];
    (0, api.getRotations)({
      success: function (res) {
        _self.setData({
          bannerList: res.data.result,
        });
      },
    });
    (0, api.getPurchaserSuppliers)({
      query: {
        pageNum: 1,
        pageSize: 50,
        key: "",
        projectId: storage.getActivityDetail().id,
        tags: "",
      },
      isNullToken: true,
      method: "POST",
      success: function (res) {
        // res.data.result.data.map(item => {
        //   util.isNullStr(item.portrait) ? item.portrait = constant.STATIC_DEFAULT_IMAGE_NAME.exhibitor : ''
        // });
        _self.setData({
          supplierList: res.data.result.data,
        });
      },
    });
    (0, api.getColumns)({
      data: {
        pageNum: 1,
        pageSize: 30,
        type: constant.COLUMN_TYPE.WEBVIEW,
        projectId: storage.getActivityDetail().id,
      },
      success: function (res) {
        res.data.result.data.map((item) => {
          if (item.link === "zhjs") {
            _self.setData({
              zhjsId: item.id,
            });
          } else if (item.link === "cgzn") {
            _self.setData({
              cgznId: item.id,
            });
          } else if (item.link === "jtzn") {
            _self.setData({
              jtznId: item.id,
            });
          } else if (item.link === "wxpay") {
            _self.setData({
              wxpayShow: true,
            });
          }
        });
      },
    });
    (0, api.getColumns)({
      data: {
        pageNum: 1,
        pageSize: 10,
        type: constant.COLUMN_TYPE.FRIENDSHIP_LINKS,
        projectId: storage.getActivityDetail().id,
      },
      success: function (res) {
        res.data.result.data.map((item) => {
          if (item.link === "yqlj") {
            _self.setData({
              friendLinkList: item.detailList,
            });
          }
        });
      },
    });
    (0, api.getColumns)({
      data: {
        pageNum: 1,
        pageSize: 3,
        type: constant.COLUMN_TYPE.SUPPORTING_ACTIVITY,
        projectId: storage.getActivityDetail().id,
      },
      success: function (res) {
        const list = [];
        res.data.result.data.map((item, index) => {
          if (util.isNullArray(item.detailList)) {
            item.detailList[0] = {
              images: `${constant.STATIC_IMAGE_URL}/img/link/act${
                index + 1
              }.png`,
            };
          }
          if (item.link === "zhibo") {
            list[0] = item;
          } else if (item.link === "zxsmpdhd") {
            list[1] = item;
          } else if (item.link === "rqzs") {
            list[2] = item;
          }
        });
        _self.setData({
          supportingActivityList: list,
        });
      },
    });
    // 查询已审核通过的需求
    (0, api.getDemandList)({
      data: {
        pageNum: 1,
        pageSize: 50,
        projectId: storage.getActivityDetail().id,
        status: 1,
      },
      success: function (res) {
        // res.data.result.data.map(item => {
        //   util.isNullStr(item.image1) ? item.image1 = constant.STATIC_DEFAULT_IMAGE_NAME.demand : ''
        // });
        _self.setData({
          demandList: res.data.result.data,
        });
        // setTimeout(() => {
        //   _self.scrollPublish();
        // }, 3000)
      },
    });
    (0, api.getLiveList)({
      query: {
        id: storage.getActivityDetail().id,
      },
      success: function (res) {
        if (res.data.result.data.length < 9) {
          _self.getVideoList();
        }
        _self.setData({
          liveList: res.data.result.data,
        });
      },
    });
    // for(let i = 0; i < 5;i++) {
    //   exhibitList.push({
    //     id: i
    //   })
    // }
    _self.setData({
      exhibitList: exhibitList,
      lang: i18n.getLanguage(),
      langTranslate: i18n.langTranslate(),
    });
  },
  goDetailTap: function (e) {
    let id = null;
    util.isNullStr(e.currentTarget.dataset.id)
      ? (id = "")
      : (id = e.currentTarget.dataset.id);
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/rich-text/rich-text?id=${id}&title=${e.currentTarget.dataset.title}`,
    });
  },
  getVideoList: function () {
    (0, api.getVideoList)({
      data: {
        pageNum: 1,
        pageSize: 9 - _self.data.liveList.length,
      },
      query: {
        id: storage.getActivityDetail().id,
      },
      success: function (res) {
        _self.setData({
          videoList: res.data.result.data,
        });
      },
    });
  },
  changeRoleTap: function (e) {
    _self.getGifCode();
    _self.setData({
      currentRole: parseInt(e.currentTarget.dataset.type),
    });
  },
  cancelPopupTap: function () {
    _self.setData({
      dialogHide: true,
    });
  },
  //未登录时热门展商查看更多进行跳转
  goHotExhibitor: function () {
    wx.reLaunch({
      url: "/packagePurchaser/pages/purchaser/tabbar/exhibition/exhibition",
    });
  },
  //未登录时视频直播查看更多进行跳转
  goVideoMorePage: function () {
    wx.navigateTo({
      url: "/packagePurchaser/pages/purchaser/index/hot-video/hot-video",
    });
  },
  //未登录时单个视频进行跳转
  goVideoPage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?type=2&id=${e.currentTarget.dataset.id}`,
    });
  },
  //未登录时单个直播进行跳转
  goLivePage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?type=1&id=${e.currentTarget.dataset.id}`,
    });
  },
  goPage: function (event) {
    var role = event.currentTarget.dataset.role
    if (role == '2') {
      wx.setStorageSync('role', 'exhibitor')
      wx.navigateTo({
        url: "/packageExhibitor/pages/zEdition1/authorize/authorize",
      })
    } else if (role == '3') {
      wx.setStorageSync('role', 'purchaser')
      wx.navigateTo({
        url: "/packagePurchaser/pages/purchaser/authorize/authorize",
      })
    } else if (role == '4') {
      wx.navigateTo({
        url: "/pages/role/role",
      });
    }
    // if (
    //   util.isNullStr(storage.getToken()) ||
    //   (storage.getRoleType() === constant.ROLE_TYPE.EXHIBITOR &&
    //     storage.getAutoLogin() === false)
    // ) {
    //   _self.setData({
    //     dialogHide: false,
    //   });
    //   return false;
    // }
    // if (_self.data.currentRole === 2) {
    //   wx.reLaunch({
    //     url: "/packagePurchaser/pages/purchaser/tabbar/index/index",
    //   });
    // } else {
    //   wx.reLaunch({
    //     url: "/packageExhibitor/pages/zEdition1/index",
    //   });
    // }
  },
  remeberPwdTap() {
    _self.setData({
      isRememberPwd: !_self.data.isRememberPwd,
    });
  },
  autoLoginTap() {
    _self.setData({
      isAutoLogin: !_self.data.isAutoLogin,
    });
  },
  getVerCode: function () {
    if (this.data.banCodeBtn) {
      return false;
    }
    var i = _self.data.cellNumber;
    if (util.checkMobile(i)) {
      var params = {
        mobile: i,
      };
      _self.setData({
        banCodeBtn: !0,
      });
      (0, api.getMobileCode)({
        method: "GET",
        data: params,
        success: function (e) {
          0 === e.data.code
            ? (console.log("已发送"), _self.startCountDown())
            : (wx.showModal({
              title: "提示",
              content: e.data.message,
            }),
              _self.setData({
                banCodeBtn: !1,
              }));
        },
        fail: function (e) {
          _self.setData({
            banCodeBtn: !1,
          });
        },
      });
    } else {
      wx.showToast({
        title: "请输入正确的手机号码",
        icon: "none",
      });
    }
  },
  setCellNumber: function (t) {
    var e = t.detail.value;
    this.setData({
      cellNumber: e,
    });
  },
  setImageCode: function (t) {
    var e = t.detail.value;
    this.setData({
      imageCode: e,
    });
  },
  // 短信倒计时
  startCountDown: function () {
    this.setData({
      countDown: 60,
      getVerCodeTitle: "s",
    }),
      this.countdown();
  },
  countdown: function () {
    var t = this.data.countDown,
      e = this.data.getVerCodeTitle;
    t >= 1
      ? ((t -= 1),
        this.setData({
          countDown: t,
        }),
        setTimeout(this.countdown, 1e3))
      : ((t = ""),
        (e = "重新获取"),
        this.setData({
          countDown: t,
          getVerCodeTitle: e,
          banCodeBtn: !1,
        }));
  },
  // 获取图形验证码
  getGifCode: function () {
    storage.removeSessionId();
    (0, api.getGifCode)({
      method: "GET",
      responseType: "arraybuffer",
      isSkipIntercept: true,
      success: function (e) {
        console.log(e);
        _self.setData({
          imageFile: wx.arrayBufferToBase64(e.data),
        });
        storage.setSessionId(e.header["Set-Cookie"]); //保存Cookie到Storage
      },
    });
  },
  setVcode: function (t) {
    var e = t.detail.value;
    this.setData({
      vcode: e,
    });
  },
  setUserName: function (t) {
    var e = t.detail.value;
    this.setData({
      userName: e,
    });
  },
  setPassword: function (t) {
    var e = t.detail.value;
    this.setData({
      password: e,
    });
  },
  /*
* 进入界面监听 如果是供应商+没有同意 弹出框
* return boolean false不能继续走其他方法
* */
  watchAgreePromise() {
    var user = storage.getUserInfo()
    var userType = storage.getRoleType()
    var isAgree = user && user.agree == 1 || storage.getAgreePromise()
    if (user && user.id && userType == "2"
      && !isAgree) {
      this.setData({
        showAgreementPromise: true
      })
      return false
    } else {
      this.setData({
        showAgreementPromise: false
      })
      return true
    }
    return true
  },
  /*
  *点击确定承诺书
  *  1.关闭弹出框
* 2.localstore isAgreement true
* 2.1 请求ajax
* 3.跳转 供应商 首页
  * */
  confirmAgreePromise() {
    var user = getUserInfo()
    this.setData({
      showAgreementPromise: false,
    })
    agreePromiseTrueApi({
      query: {
        userId: user.id
      }
    })
    setAgreePromiseTrue()
    this.afterExhibitorLogin()
  },
  afterExhibitorLogin() {
    let _self = this
    //如果scene有东西 跳转直播界面，如果 是发起直播扫码进来的
    if (_self.options.scene) {
      var scene = decodeURIComponent(_self.options.scene); //liveId_160
      var paramsArray = scene.split("_");
      var params = {
        [paramsArray[0]]: paramsArray[1],
      };
      // 扫码直播
      if (paramsArray[0] == "liveId") {
        _self.setData({
          dialogHide: true,
        })
        wx.navigateTo({
          url: `/packageExhibitor/pages/zEdition1/me/myLiveBroadcast/live/index?scene=${paramsArray[1]}`,
        });
        return false;
      }
    }
    setTimeout(() => {
      wx.reLaunch({
        url: "/packageExhibitor/pages/zEdition1/index",
      });
      return false
    })
  },
  exhibitorLogin: function () {
    const userName = this.data.userName,
      password = this.data.password,
      imageCode = this.data.imageCode,
      submitting = this.data.submitting;
    if (submitting) {
      return false;
    }
    if (
      util.isNullStr(userName) ||
      util.isNullStr(password) ||
      util.isNullStr(imageCode)
    ) {
      wx.showToast({
        title: "请完善信息再提交",
        icon: "none",
      });
      return false;
    }
    this.setData({
      submitting: !0,
    });
    (0, api.login)({
      method: "POST",
      data: {
        projectId: storage.getActivityDetail().id,
        userName: userName,
        password: password,
        src: 0,
        vcode: imageCode,
      },
      header: {
        cookie: storage.getSessionId(),
      },
      success: function (e) {
        storage.setRememberPwd(_self.data.isRememberPwd);
        storage.setAutoLogin(_self.data.isAutoLogin);
        storage.setUserInfo(e.data.data);
        storage.setToken(e.data.data.token);
        storage.setPassword(_self.data.password);
        storage.setRoleType(constant.ROLE_TYPE.EXHIBITOR);
        //承诺书
        _self.setData({
          dialogHide: true
        })
        var result = _self.watchAgreePromise()
        if (result) {
          _self.afterExhibitorLogin()
        }
        return false
      },
      complete: function () {
        _self.setData({
          submitting: !1,
        });
        // _self.getGifCode();
      },
    });
  },
  loginTap: function () {
    if (_self.data.currentRole === 1) {
      _self.exhibitorLogin();
      return false;
    }
    const phone = this.data.cellNumber,
      mobileCode = this.data.mobileCode,
      vcode = this.data.vcode,
      submitting = this.data.submitting;
    if (submitting) {
      return false;
    }
    if (
      util.isNullStr(phone) ||
      util.isNullStr(mobileCode) ||
      util.isNullStr(vcode)
    ) {
      wx.showToast({
        title: "请完善信息再提交",
        icon: "none",
      });
      return false;
    }
    if (!util.checkMobile(phone)) {
      wx.showToast({
        title: "请输入正确的手机号码",
        icon: "none",
      });
      return false;
    }
    this.setData({
      submitting: !0,
    });
    (0, api.login)({
      method: "POST",
      data: {
        projectId: storage.getActivityDetail().id,
        userName: phone,
        password: mobileCode,
        src: 1,
        type: "mobile",
        vcode: vcode,
      },
      header: {
        cookie: storage.getSessionId(),
      },
      success: function (e) {
        storage.setUserInfo(e.data.data);
        storage.setToken(e.data.data.token);
        storage.setRoleType(constant.ROLE_TYPE.PURCHASER);
        _self.goPage();
        api.getTrtcOrImSign({
          method: "POST",
          data: {
            UserId: storage.getUserInfo().id,
          },
          success: (res) => {
            wx.$app
              .login({
                userID: wx.getStorageSync("userInfo").id,
                userSig: res.data.result,
              })
              .then((imResponse) => {
                console.log("采购商登录成功");
                console.log(imResponse);
              });
          },
        });
      },
      complete: function () {
        _self.setData({
          submitting: !1,
        });
        // _self.getGifCode();
      },
    });
  },
  setMobileCode: function (t) {
    var e = t.detail.value;
    this.setData({
      mobileCode: e,
    });
  },
  // 角色判断
  initRole() {
    console.log(storage.getAutoLogin() === true)
    console.log(constant.ROLE_TYPE.PURCHASER)
    var role = wx.getStorageSync("role");
    var authorization = wx.getStorageSync("authorization");
    var phone = wx.getStorageSync("phone");
    if (storage.getUserInfo() != '' && storage.getUserInfo() != null && storage.getUserInfo() != null) {
      var userInfo = true
    } else {
      var userInfo = false
    }
    console.log(userInfo)
    // var exhibitor = wx.getStorageSync("exhibitor");
    // var visitor = wx.getStorageSync("visitor");
    if (authorization && phone && role == 'exhibitor' && userInfo) {
      console.log(334)
      wx.reLaunch({
        url: "/packageExhibitor/pages/zEdition1/index",
      });
    } else if (authorization && phone && role == 'exhibitor' && !userInfo) {
      wx.reLaunch({
        url: '/packageExhibitor/pages/zEdition1/register/register'
      });
    } else if (authorization && phone && role == 'purchaser' && userInfo) {
      wx.reLaunch({
        url: "/packagePurchaser/pages/purchaser/tabbar/index/index",
      });
    } else if (authorization && phone && role == 'purchaser' && !userInfo) {
      wx.reLaunch({
        url: "/packagePurchaser/pages/purchaser/register/register",
      });
    }
    // if (!util.isNullStr(storage.getToken()) && storage.getRoleType() === constant.ROLE_TYPE.PURCHASER) {
    //   wx.reLaunch({
    //     url: "/packagePurchaser/pages/purchaser/tabbar/index/index",
    //   });
    // } else if (!util.isNullStr(storage.getToken()) && storage.getRoleType() === constant.ROLE_TYPE.EXHIBITOR) {
    //   // 直播扫码进来的 跳转界面
    //   if (this.options.scene) {
    //     var scene = decodeURIComponent(this.options.scene); //liveId_160
    //     var paramsArray = scene.split("_");
    //     var params = {
    //       [paramsArray[0]]: paramsArray[1],
    //     };
    //     // 扫码直播
    //     if (paramsArray[0] == "liveId") {
    //       wx.navigateTo({
    //         url: `/packageExhibitor/pages/zEdition1/me/myLiveBroadcast/live/index?scene=${paramsArray[1]}`,
    //       });
    //       return false;
    //     }
    //   }
    //   wx.reLaunch({
    //     url: "/packageExhibitor/pages/zEdition1/index",
    //   });
    // } else if (storage.getRememberPwd() === true) {
    //   _self.setData({
    //     password: storage.getPassword(),
    //   });
    // } else {
    //   _self.getProjects();
    //   _self.getGifCode();
    // }
  },
  // 页面加载
  onLoad: function (options) {
    _self = this;
    _self.setData({
      options,
    });
    wx.setNavigationBarTitle({
      title: i18n.langTranslate()["义乌五金展在线平台"],
    });
    _self.getProjects();
    // _self.getGifCode();
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
    });

    // this.data.openId = wx.getStorageSync('user').openId
    // this.data.phoneNumber = wx.getStorageSync('phoneNumber')
  },
  onShow: function () {
    // this.initData()

  },
  //注册跳转
  registerTap: function (event) {
    //console.log(event)
    var src = event.currentTarget.dataset.url;
    wx.setStorageSync("official", src);
    wx.navigateTo({
      url: "../view/view?url=" + src,
    });
  },
  //同期活动列表
  activityList: function () {
    (0, api.getActivityList)({
      query: {
        projectId: storage.getActivityDetail().companyId,
        activityId: storage.getActivityDetail().id
      },
      success: function (res) {
        var concurrentEvents = []
        var activity = res.data.result[0]
        _self.setData({
          concurrentEvents: concurrentEvents.concat(activity),
        });
      },
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
});
