//index.js
//获取应用实例

import {isDisplayInFields, setArray2Str4Post, validateEmail, validateMobile} from "../../../../../utils/util";
import {default_checkbox_checked, default_checkbox_no_chekced,filter_active} from "../../../../../common/staticImageContants";

const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util");
Page({
  data: {
    filter_active,
    exhibitList: [],
    exhibits: [],
    staticImageUrl: constant.STATIC_IMAGE_URL,
    portrait: '',
    company: '',
    job: '',
    jobEn: '',
    companyEn: '',
    nature: '',
    contact: '',
    contactEn: '',
    mobilePhone: '',
    email: '',
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
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    default_checkbox_checked, default_checkbox_no_chekced
  },
  // 初始化数据
  initData: function () {
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
        let list = []
        res.data.datas.map(item => {
          isEn ? list.push(item.english) : list.push(item.name)
        });
        if (!util.isNullStr(country)) {
          countryIndex = list.findIndex(item => {
            return item === _self.data.params.country
          })
        }
        list = ['中国大陆', '中国香港', '中国台湾', '中国澳门'].concat(list)
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
          item.subclass.map(childItem => {
            if (_self.data.params.tags.indexOf(childItem.id) !== -1) {
              childItem.isChecked = true;
            } else {
              isChecked = false
              childItem.isChecked = false;
            }
          });
          item.isChecked = isChecked;
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
  goDetailPage: function () {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/appoint-detail/appoint-detail',
    })
  },
  goPublishPage: function () {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/publish-demand/publish-demand',
    })
  },
  setTags: function (t) {
    var e = t.detail.value;
    this.setData({
      'params.tags': e
    });
  },
  uploadPic: function (e) {
    const index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        _self.setData({
          headFile: tempFilePaths[0]
        })
      }
    })
  },
  uploadTap: function () {
    if (this.headFile === null) {
      wx.showToast({
        title: '请选择图片再进行上传',
        icon: 'none'
      })
      return
    }
    wx.uploadFile({
      url: app.globalData.host + '/api3/file/upload', //仅为示例，非真实的接口地址
      filePath: _self.data.headFile,
      name: 'file',
      success: function (res) {
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
      }
    })
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
  submitTap: function () {
    // if (util.isNullStr(this.data.contact) || util.isNullStr(this.data.contactEn) || util.isNullStr(this.data.mobilePhone)) {
    //   wx.showToast({
    //     title: '请输入必填项',
    //     icon: 'none'
    //   })
    //   return
    // }
    // if (!util.checkMobile(this.data.mobilePhone)) {
    //   wx.showToast({
    //     title: '请输入正确格式的手机号码',
    //     icon: 'none'
    //   })
    //   return
    // }
    let exhibitList = this.data.exhibitList, list = [], fieldList = this.data.fieldList, isHasNull = false;
    exhibitList.map(item => {
      item.childList.map(childItem => {
        childItem.isChecked ? list.push(childItem.id) : ''
      })
    });
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

    let params = {
      ..._self.data.params,
      id: _self.data.params.id,
      company: _self.data.params.company,
      country: _self.data.params.country,
      province: _self.data.params.province,
      city: _self.data.params.city,
      portrait: _self.data.params.portrait,
      job: _self.data.params.job,
      jobEn: _self.data.params.jobEn,
      nature: _self.data.params.nature,
      goal: _self.data.params.goal,
      contact: _self.data.params.contact,
      contactEn: _self.data.params.contactEn,
      mobilePhone: _self.data.params.mobilePhone,
      email: _self.data.params.email,
      tags: list.join(',')
    };
    /*    if (!util.isNullStr(params['mobilePhone']) && !util.checkMobile(params['mobilePhone'])) {
          wx.showToast({
            title: '请输入正确格式的手机号码',
            icon: 'none'
          })
          return
        }*/
    var errorNameKey = ""

    fieldList.map(item => {
      // console.log("===item.nameZh====>", item.nameZh, params[item.nameKey],util.isNullField(params[item.nameKey]))
      if (item.mandatory == '1' &&
        util.isNullField(params[item.nameKey]) &&
        this.isDisplay(item.display)
      ) {
        errorNameKey = item.nameZh
        isHasNull = true
      }
    })
    if (isHasNull) {
      console.log("====errorNameKey===>", errorNameKey)
      wx.showToast({
        title: errorNameKey + '请输入必填项',
        icon: 'none'
      })
      return
    }
    ;
    //便利params 如果value是数组，转1,2,3
    params = setArray2Str4Post(params);
    (0, api.updatePurchaser)({
      data: {
        ...params
      },
      query: {
        id: storage.getUserInfo().id
      },
      isNullToken: true,
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '编辑成功'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }
    })
  },
  onLoad: function () {
    _self = this;
    (0, api.getPurchaserDetail)({
      query: {
        id: storage.getUserInfo().id
      },
      success: function (res) {
        const userInfo = res.data.result;
        delete userInfo['tagNames'];
        delete userInfo['weixinId'];
        delete userInfo['createTime'];
        delete userInfo['creator'];
        delete userInfo['online'];
        delete userInfo['popular'];
        delete userInfo['projectId'];
        delete userInfo['status'];
        delete userInfo['updateTime'];
        delete userInfo['tagEnglishNames'];
        const countryCodeIndex = userInfo.country
        _self.setData({
          staticImageUrl: constant.STATIC_IMAGE_URL,
          params: userInfo
          // company: userInfo.company,
          // portrait: util.isNullStr(userInfo.portrait) ? constant.STATIC_IMAGE_URL + '/img/purchaser/icon_user.png' : userInfo.portrait,
          // job: userInfo.job,
          // companyEn: userInfo.companyEn,
          // nature: userInfo.nature || '',
          // contact: userInfo.contact,
          // contactEn: userInfo.contactEn,
          // mobilePhone: userInfo.mobilePhone,
          // email: userInfo.email || '',
          // tags: userInfo.tags
        })
        _self.initData();
      }
    })
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
