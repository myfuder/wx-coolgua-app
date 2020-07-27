//register.js
//获取应用实例
import {
  default_checkbox_checked,
  default_checkbox_no_chekced,
  defaultUserImage
} from "../../../../common/staticImageContants";
import {ajax} from "../../../../utils/api";
import {API_URL} from "../../../../utils/constant";
import {flowSetAddDialogShow, isDisplayInFields, validateEmail, validateMobile} from "../../../../utils/util";

const app = getApp()
let _self = null;
let api = require("../../../../utils/api"),
  constant = require("../../../../utils/constant"),
  i18n = require("../../../../i18n/i18n.js"),
  storage = require("../../../../utils/storage.js"),
  util = require("../../../../utils/util");
let TIME = 60;
const {default_user_image} = require("../../../../common/staticImageContants");
Page({
  data: {
    staticImageUrl: constant.STATIC_IMAGE_URL,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    openId: '',
    name: '',
    job: '',
    code: '',
    exhibitorName: '',
    phoneNumber: '',
    purchaserLayout: [],
    portrait: "",
    tags: [],
    // 源数据
    countryCodes: [],
    countryCodeIndex: 0,
    headFile: null,
    // 省数据
    provinceCodes: [],
    provinceCodeIndex: 0,
    // 市数据
    cityCodes: [],
    cityCodeIndex: 0,
    fieldList: [],
    // 单行文本框nameKey类型
    inputNameKey: ['company', 'companyEn', 'contactEn', 'email', 'website', 'contact', 'boothNumber', 'mobilePhone', 'job', 'jobEn'],
    params: {
      tags: ''
    },
    defaultUserImage,
    uploadingImage: false,
    default_user_image,
    default_checkbox_checked, default_checkbox_no_chekced
  },
  //选择图片
  uploadPic: function (e) {
    var self = this;
    const index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        self.data.params.portrait = tempFilePaths[0]
        _self.setData({
          headFile: tempFilePaths[0],
          params: self.data.params
        });
        self.uploadTap()
      }
    })
  },
  //上传图片
  uploadTap: function () {
    if (this.headFile === null) {
      wx.showToast({
        title: '请选择图片再进行上传',
        icon: 'none'
      })
      return
    }
    wx.showLoading();
    wx.uploadFile({
      url: app.globalData.host + '/api3/file/upload', //仅为示例，非真实的接口地址
      filePath: _self.data.headFile,
      name: 'file',
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        var data = res.data
        var file = JSON.parse(data)
        if (file.code !== 0 && file.code !== '0') {
          wx.showToast({
            title: '上传失败，请联系管理员',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '上传成功'
          })
          var path = app.globalData.host + '/' + file.result
          _self.setData({
            'params.portrait': path
          })
        }
      },
      fail(e) {
        wx.hideLoading();
        wx.showToast({"icon": "none", title: "上传失败"})
      }
    })
  },
  changeInput: function (e) {
    console.log(e)
    let params = _self.data.params;
    params[e.currentTarget.dataset.key] = e.detail.value;
    _self.setData({
      params: params
    })
  },
  chooseTap: function (e) {
    console.log(e)
    let list = _self.data.exhibitList
    let item = list[e.currentTarget.dataset.index]
    item.isChecked = !item.isChecked
    item.childList.map(childItem => {
      childItem.isChecked = item.isChecked
    })
    _self.setData({
      exhibitList: list
    })
  },
  chooseChildTap: function (e) {
    let list = _self.data.exhibitList
    let item = list[e.currentTarget.dataset.pindex]
    let childItem = item.childList[e.currentTarget.dataset.index]
    let isAllChecked = true
    childItem.isChecked = !childItem.isChecked
    item.childList.map(cItem => {
      if (!cItem.isChecked) {
        isAllChecked = false
      }
    })
    item.isChecked = isAllChecked
    _self.setData({
      exhibitList: list
    })
  },
  // 获取城市数据
  getCityData() {
    let city = _self.data.params.city, cityIndex = 0, isEn = _self.data.isEn;
    (0, api.getCity)({
      method: 'POST',
      query: {
        name: _self.data.provinceCodes[_self.data.provinceCodeIndex]
      },
      isSkipIntercept: true,
      success: function (res) {
        console.log(res.data.datas)
        const list = []
        res.data.datas.map(item => {
          isEn ? list.push(item.english) : list.push(item.name)
        });
        if (!util.isNullStr(city)) {
          cityIndex = list.findIndex(item => {
            return item === _self.data.params.city
          })
        }
        _self.setData({
          cityCodes: list,
          cityCodeIndex: cityIndex === -1 ? 0 : cityIndex
        });
      }
    });
  },
  setTags: function (t) {
    var e = t.detail.value;
    this.setData({
      'params.tags': e
    });
  },
  bindCountryCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      countryCodeIndex: e.detail.value,
      'params.country': _self.data.countryCodes[e.detail.value]
    });
  },
  bindProvinceCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      provinceCodeIndex: e.detail.value,
      cityCodeIndex: 0,
      'params.province': _self.data.provinceCodes[e.detail.value]
    });
    this.getCityData()
  },
  bindCityCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      cityCodeIndex: e.detail.value,
      'params.city': _self.data.cityCodes[e.detail.value]
    });
  },
  returnPage: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  formSubmit: function (e) {
    var status = true
    var that = this
    let data = e.detail.value
    for (var index in that.data.purchaserLayout) {
      if (that.data.purchaserLayout[index].mandatory == '1' && that.data.purchaserLayout[index].show) {
        var nameKey = that.data.purchaserLayout[index].nameKey
        if (data[nameKey] == '' || data[nameKey] == undefined || data[nameKey] == null) {
          wx.showToast({
            title: that.data.purchaserLayout[index].nameZh + '不能为空',
            icon: 'none',
            duration: 2000,
            success: function () {
              status = false
              return false
            }
          })
          status = false
          return false
        }
      }
    }
    if (that.data.tags.length == 0 || that.data.tags == '' || that.data.tags == undefined) {
      wx.showToast({
        title: '产品类型不能为空',
        icon: 'none',
        duration: 2000,
        success: function () {
          status = false
          return false
        }
      })
      status = false
      return false
    }
    that.boundExhibitors(data);
  },
  submitTap: function () {
    var self = this;
    var activityId = this.data.activityId
    let exhibitList = this.data.exhibitList, list = [], fieldList = this.data.fieldList, isHasNull = false;
    exhibitList && exhibitList.map(item => {
      item.childList.map(childItem => {
        childItem.isChecked ? list.push(childItem.id) : ''
      })
    });
    const params = {
      ..._self.data.params,
      tags: list.join(',')
    };
    console.log("==params['mobilePhone']=====>", params, params['mobilePhone']);
    if (!util.isNullStr(this.data['mobilePhone']) && !util.checkMobile(params['mobilePhone'])) {
      wx.showToast({
        title: '请输入正确格式的手机号码',
        icon: 'none'
      })
      return
    }
    var errorKey = ""
    fieldList.map(item => {
      if (item.mandatory === '1' &&
        util.isNullStr(params[item.nameKey]) &&
        item.display.indexOf("mini") >= 0
      ) {
        console.log(item.nameKey)
        isHasNull = true;
        errorKey = item.nameZh
      }
    })
    if (isHasNull) {
      wx.showToast({
        title: '请输入必填项' + errorKey,
        icon: 'none'
      })
      return
    }

    //1.需要显示2.验证手机
    if (isDisplayInFields('mobilePhone', this.data.fieldList) &&
      _self.data.params.mobilePhone &&
      !validateMobile(_self.data.params.mobilePhone)) {
      wx.showToast({
        title: '不是手机号格式',
        icon: 'none',
      })
      return false
    }
    //1.需要显示2.验证邮箱
    if (isDisplayInFields('email', this.data.fieldList) &&
      _self.data.params.email &&
      !validateEmail(_self.data.params.email)) {
      wx.showToast({
        title: '不是邮箱格式',
        icon: 'none',
      })
      return false
    }


    wx.showLoading();
    var url = app.globalData.host + '/api3/purchaser/addPurchaser/' + activityId
    wx.request({
      url: url,
      data: {
        ...params
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          wx.showToast({
            title: '注册成功'
          })
          storage.setUserInfo(res.data.result);
          //storage.setToken(e.data.data.token);
          storage.setRoleType(constant.ROLE_TYPE.PURCHASER);
          wx.redirectTo({
            url: "/pages/index/index",
          })
          // self.loginGuanzhong()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            success: function () {
              return false
            }
          })
          return false
        }
      },
      fail: function (error) {
        wx.hideLoading();
        console.log(error)
      }
    })
  },
  //观众登陆
  async loginGuanzhong() {
    wx.hideLoading();
    const phone = this.data.phoneNumber;
    if (
      util.isNullStr(phone)
    ) {
      wx.showToast({
        title: "请授权手机号",
        icon: "none",
      });
      return false;
    }

    /*  var result = await ajax.post(`${constant.API_URL_V1}/purchaserLogin/`, {
        projectId: storage.getActivityDetail().id,
        mobile: phone,
      });
      console.log("api purchaserLogin=======>", result)
      //如果登陆 跳转授权注册
      if (result.code != 0) {
        wx.showToast({
          title: result.message,
          icon: 'none'
        })
        return false
      }
      var user = result.data
      var token = user.token
      storage.setUserInfo(user);
      storage.setToken(token);
      storage.setRoleType(constant.ROLE_TYPE.PURCHASER);
      ajax.post(`${API_URL}/trtcorim/getUsgSign`, {
        header: {
          Authorization: token,
        },
        UserId: user.id,
      }).then(res => {
        wx.$app
          .login({
            userID: user.id,
            userSig: res.result,
          })
          .then((imResponse) => {
            console.log("采购商登录成功");
            console.log(imResponse);
            wx.redirectTo({
              url: "/packagePurchaser/pages/purchaser/tabbar/index/index",
            })
          });
      })
     */
  },
  // 注册观众
  boundExhibitors: function (data) {
    var that = this
    var activityId = that.data.activityId
    var tags = []
    for (var index in that.data.tags) {
      tags.push(that.data.tags[index].id)
    }
    data.tags = tags.join(',')
    if (data.nature != null && data.nature != undefined && data.nature != '') {
      data.nature = data.nature.join(',')
    }
    console.log(data)
    // 重新获取code,以前的code会失效
    wx.login({
      success: res => {
        var url = app.globalData.host + '/api3/purchaser/addPurchaser/' + activityId
        wx.request({
          url: url,
          data: data,
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == '0') {
              storage.setUserInfo(res.data.result);
              //storage.setToken(e.data.data.token);
              storage.setRoleType(constant.ROLE_TYPE.PURCHASER);
              flowSetAddDialogShow()
              setTimeout(() => {
                wx.redirectTo({
                  url: "/pages/index/index",
                })
              }, 500)
              return false
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 1000,
                success: function () {
                  return false
                }
              })
              return false
            }
          },
          fail: function (error) {
            console.log(error)
          }
        })
      }
    })
  },
  onLoad: function () {
    _self = this;
    var purchaserLayout = null;
    try {
      purchaserLayout = JSON.parse(wx.getStorageSync('activityDetail').purchaserLayout)
    } catch (e) {
      console.log("=====e===>", e)
      this.setData({isWrong: true})
    }
    for (var index in purchaserLayout) {
      if (purchaserLayout[index].display.indexOf("mini") >= 0) {
        purchaserLayout[index].show = true
        purchaserLayout[index].isShow = 1
      } else {
        purchaserLayout[index].show = false
        purchaserLayout[index].isShow = 0
      }
    }
    this.setData({
      openId: wx.getStorageSync('user').openId,
      phoneNumber: wx.getStorageSync('phoneNumber'),
      activityId: wx.getStorageSync('activityDetail').id,
      purchaserLayout: purchaserLayout
    })
    _self.initData();
    //给 params填入一些默认的value
    this.setDefaultParams()

  },
  //把tags放在后面
  putTagsItemLast(key, array) {
    var index = array.findIndex(item => item.nameKey == 'tags')
    var one = array.splice(index, 1)
    array.push(one[0])
    return array
  },
  // 初始化数据
  initData: function () {
    let self = this;
    let exhibits = [], country = _self.data.params.country, countryIndex = 0, province = _self.data.params.province,
      provinceIndex = 0, isEn = _self.data.isEn;
    for (let i = 0; i < 5; i++) {
      exhibits.push({
        id: i
      })
    }
    ;
    (0, api.getCountry)({
      method: 'POST',
      isSkipIntercept: true,
      success: function (res) {
        console.log(res)
        let list = [];
        res.data.datas.map(item => {
          isEn ? list.push(item.english) : list.push(item.name)
        });
        if (!util.isNullStr(country)) {
          countryIndex = list.findIndex(item => {
            return item === _self.data.params.country
          })
        }
        list = ['中国大陆', '中国香港', '中国澳门', '中国台湾', ...list]
        _self.setData({
          countryCodes: list,
          countryCodeIndex: countryIndex === -1 ? 0 : countryIndex
        });
      }
    });
    (0, api.getProvince)({
      method: 'POST',
      isSkipIntercept: true,
      success: function (res) {
        const list = []
        res.data.datas.map(item => {
          isEn ? list.push(item.english) : list.push(item.name)
        });
        if (!util.isNullStr(province)) {
          provinceIndex = list.findIndex(item => {
            return item === _self.data.params.province
          })
        }
        _self.setData({
          provinceCodes: list,
          provinceCodeIndex: provinceIndex === -1 ? 0 : provinceIndex
        });
        _self.getCityData()
      }
    });
    (0, api.getProductType)({
      data: {
        src: 1,
        projectId: storage.getActivityDetail().id
      },
      method: 'POST',
      success: function (res) {
        const list = []
        res.data.result.map(item => {
          item.id = item.parent.id
          item.chinese = item.parent.chinese;
          item.english = item.parent.english;
          let isChecked = true
          // console.log(res.data.result)
          item.subclass.map(childItem => {
            if (_self.data.params.tags.indexOf(childItem.id) !== -1) {
              childItem.isChecked = false;
            } else {
              isChecked = false
              childItem.isChecked = false;
            }
          });
          item.isChecked = false;
          item.childList = item.subclass;
        });
        _self.setData({
          exhibitList: res.data.result,
        })
      }
    });
    var params = {
      accessToken: storage.getToken(),
      timeStamp: new Date().getTime(),
      src: 1,
      projectId: storage.getActivityDetail().id //活动id
    };
    (0, api.queryRegistration)({
      data: params,
      method: 'POST',
      isNullToken: true,
      success: function (res) {
        const bodyList = res.data.data.body
        let defaults = res.data.data.defaults
        if (util.isNullArray(bodyList)) {
          let list = []
          defaults.map((item, index) => {
            if ((util.isNullStr(item.type) && _self.data.inputNameKey.indexOf(item.nameKey) !== -1) || item.type == 1) {
              item.isInput = true
            } else {
              item.isInput = false
            }
            // 单选框/多选框且值为空，隐藏不显示
            if ((item.type === 3 || item.type === 4)) {
              if (item.defaults.indexOf(',') >= 0) {
                item.defaultArr = item.defaults.split(',')
              } else {
                item.defaultArr = item.defaults.split('\n')
              }
            } else if (item.nameKey === 'portrait') {
            } else {
            }
            if ((item.type === 3 || item.type === 4) && !util.isNullStr(item.defaults)) {
              if (item.defaults.indexOf(',') >= 0) {
                item.defaultArr = item.defaults.split(',')
              } else {
                item.defaultArr = item.defaults.split('\n')
              }
            }
            if ((item.type === 6 || item.nameKey === 'cpc') && item.isAdd !== true) {
              list.push({
                nameKey: 'country',
                nameZh: '国家',
                isShow: 1,
                nameEn: 'Country',
                type: 6,
                isAdd: true,
                isInput: false,
                mandatory: item.mandatory
              });
              list.push({
                nameKey: 'province',
                nameZh: '省份',
                nameEn: 'Province',
                isShow: 1,
                type: 6,
                isAdd: true,
                isInput: false,
                mandatory: item.mandatory
              });
              list.push({
                nameKey: 'city',
                nameZh: '城市',
                nameEn: 'City',
                isShow: 1,
                isAdd: true,
                type: 6,
                isInput: false,
                mandatory: item.mandatory
              })
            }
            list.push(item)
          });
          list = _self.setDisplayForAllFields(list)
          _self.setData({
            fieldList: list
          })
        } else {
          let list = [];
          bodyList.map(item => {
            if ((util.isNullStr(item.type) && _self.data.inputNameKey.indexOf(item.nameKey) !== -1) || item.type === 1) {
              item.isInput = true
            } else {
              item.isInput = false
            }
            // 单选框且值为空，隐藏不显示
            // console.log(item.nameZh)
            // console.log((item.type === 3 || item.type === 4) && util.isNullStr(item.defaults))
            if ((item.type === 3 || item.type === 4)) {
              if (item.defaults.indexOf(',') >= 0) {
                item.defaultArr = item.defaults.split(',')
              } else {
                item.defaultArr = item.defaults.split('\n')
              }
            } else if (item.nameKey === 'portrait') {
            } else {
            }
            if ((item.type === 6 || item.nameKey === 'cpc') && item.isAdd !== true) {
              list.push({
                nameKey: 'country',
                nameZh: '国家',
                nameEn: 'Country',
                isShow: 1,
                type: 6,
                isAdd: true,
                isInput: false,
                mandatory: item.mandatory
              });
              list.push({
                nameKey: 'province',
                nameZh: '省份',
                nameEn: 'Province',
                isShow: 1,
                type: 6,
                isAdd: true,
                isInput: false,
                mandatory: item.mandatory
              });
              list.push({
                nameKey: 'city',
                nameZh: '城市',
                nameEn: 'City',
                isShow: 1,
                isAdd: true,
                type: 6,
                isInput: false,
                mandatory: item.mandatory
              })
            }
            var temp_str = 'params.' + item.nameKey;
            _self.setData({
              [temp_str]: _self.data.params[item.nameKey]
            })
            list.push(item)
          });
          list = _self.setDisplayForAllFields(list);
          console.log("=====list==>", JSON.stringify(list))
          _self.setData({
            fieldList: list
          })
        }
      }
    });
    _self.setData({
      exhibits: exhibits,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    })


  },
  //给 params填入一些默认的value
  setDefaultParams() {
    //设置默认手机
    var params = this.data.params;
    params.mobilePhone = this.data.phoneNumber;
    this.setData({
      params
    })
  },
  isDisplay(displayStr) {
    if (!displayStr) return false
    var lang = 'zh'
    if (!wx.getStorageSync('lang')) {
      lang = 'zh'
    } else {
      lang = wx.getStorageSync('lang') == 'zh_CN' ? 'zh' : 'en'
    }
    return displayStr.indexOf('mini') >= 0
  },
  setDisplayForAllFields(list) {
    list = list.map(item => {
      item.isShow = this.isDisplay(item.display) ? 1 : 0;
      //如果是产品类型 一定是要显示
      if (item.nameKey == 'tags') {
        item.isShow = 1
      }
      //如果是头像 不需要显示在自定义列表
      if (item.nameKey == 'portrait') {
        item.isShow = 0
      }
      //如果是 省市县 country  province city 一定是要显示
      if (item.nameKey == 'country') {
        item.isShow = 1
      }
      if (item.nameKey == 'province') {
        item.isShow = 1
      }
      if (item.nameKey == 'city') {
        item.isShow = 1
      }
      if (item.nameKey == 'cpc') {
        item.isShow = 0
      }

      // console.log("item.isShow =======>",item.display,item.isShow )
      return item
    })
    return list
  },
  onShow: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //修改类型是4的 多选 checkout
  bindchangecheckout(e) {
    var field = e.currentTarget.dataset.field
    var values = e.detail;
    if (field.type == '4') {
      this.data.params[field.nameKey] = values
      this.setData({
        params: this.data.params
      })
      // console.log("==== /修改类型是4的 多选 checkout this.data.params[field.nameKey]===>", this.data.params[field.nameKey])
    }
  },
  //单选修改
  radioChange(e) {
    var field = e.currentTarget.dataset.field
    var valueIndex = e.detail.value;
    if (field.type == '3') {
      this.data.params[field.nameKey] = field.defaultArr[valueIndex] || ""
      // console.log("===this.data.params[field.nameKey] ====>",field.nameKey,field.defaultArr[valueIndex]||"")
      this.setData({
        params: this.data.params
      })
      // console.log("==== /修改类型是4的 多选 checkout this.data.params[field.nameKey]===>", this.data.params[field.nameKey])
    }
  }
})
