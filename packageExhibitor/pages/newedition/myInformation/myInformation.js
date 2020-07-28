// packageExhibitor/pages/newedition/myInformation/myInformation.js

import {filter_active,myself_right_arrow} from "../../../../common/staticImageContants"
import {isDisplayInFields, setArray2Str4Post, validateEmail, validateMobile} from "../../../../utils/util";
import {reg_email, reg_mobile} from "../../../../utils/regs";
import {getString} from "../../../../locals/lang.js";

let api = require("../../../../utils/api"), constant = require("../../../../utils/constant"),
  i18n = require('../../../../i18n/i18n.js'), storage = require("../../../../utils/storage.js"),
  util = require("../../../../utils/util");
  let langTranslate = i18n.langTranslate();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    filter_active,myself_right_arrow,
    form:{
      country:"",
      province:"",
      city:"",
      jobEn:"",
      job:"",
      companyEn:"",
      company:"",
      nature:"",
      contact:"",
      contactEn:"",
      linkEn:"",
      mobilePhone:"",
      email:"",
      tags:"",
      acode:""
    },
    productTypeList:[],
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
    staticImageUrl:"",
    // 单行文本框nameKey类型
    inputNameKey: ['company', 'companyEn', 'contactEn', 'email', 'website', 'contact', 'boothNumber', 'mobilePhone', 'job', 'jobEn'],
    params: {
      tags: ''
    },
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    reg_mobile,
    reg_email,
    showProvice:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
    wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.nav.myinformation'),
    })
    let _self = this;
    // (0, api.getPurchaserDetail)({
    //   query: {
    //     id: storage.getUserInfo().id
    //   },
    //   success: function (res) {
    //     const userInfo = res.data.result;
    //     delete userInfo['tagNames'];
    //     delete userInfo['weixinId'];
    //     delete userInfo['createTime'];
    //     delete userInfo['creator'];
    //     delete userInfo['online'];
    //     delete userInfo['popular'];
    //     delete userInfo['projectId'];
    //     delete userInfo['status'];
    //     delete userInfo['updateTime'];
    //     delete userInfo['tagEnglishNames'];
    //     const countryCodeIndex = userInfo.country
    //     _self.setData({
    //       staticImageUrl: constant.STATIC_IMAGE_URL,
    //       params: userInfo
    //       company: userInfo.company,
    //       portrait: util.isNullStr(userInfo.portrait) ? constant.STATIC_IMAGE_URL + '/img/purchaser/icon_user.png' : userInfo.portrait,
    //       job: userInfo.job,
    //       companyEn: userInfo.companyEn,
    //       nature: userInfo.nature || '',
    //       contact: userInfo.contact,
    //       contactEn: userInfo.contactEn,
    //       mobilePhone: userInfo.mobilePhone,
    //       email: userInfo.email || '',
    //       tags: userInfo.tags
    //     })
    //     _self.initData();
    //   }
    // })
    this.initinfo();

  },
  setForm:function(e){
    let type = e.currentTarget.dataset.type
    let value = this.validateNum(e.detail.value,type)
    let objName = e.currentTarget.dataset.name
    let form = this.data.form;
    form[objName] =value
    this.setData({
      form:form
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
      return item
    })
    return list
  }, 
  uploadPic: function (e) {
    let _self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.host + '/api3/file/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = res.data
            var file = JSON.parse(data)
            if (file.code !== 0 && file.code !== '0') {
              wx.showToast({
                title: langTranslate['上传失败，请联系管理员'],
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: langTranslate['上传成功']
              })
              var path = file.result
              _self.setData({
                'form.acode': path
              })
            }
          }
        })
        // _self.setData({
        //   headFile: tempFilePaths[0]
        // })
      }
    })
  },
  initinfo() {
    var that = this
    var id = wx.getStorageSync('userInfo').id // 展商id
    var url = app.globalData.host + '/api3/supplier/detail/' + id;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == '0') {
          var info = res.data.result
          let form = that.data.form;
          let arr = [];
          for(let i in form){
            if(info.hasOwnProperty(i)){
              form[i] = info[i]
            }
          }
          form.acode = info.portrait
          that.getFilterData();
          // info.introduction = info.introduction && info.introduction.substr(0, 250);
          // info.introductionEn = info.introductionEn && info.introductionEn.substr(0, 250)
          that.setData({
            form
          })

        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  validateNum(val,type){
    if(type == 'num'){
      return val.replace(/\D/g, '')
    }else if(type == 'En'){
      return val.replace(/[^a-zA-Z]/g, '')
    }else if(type=='email'){
      return val.replace(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/g, '')
    }else{
      return val
    }
  },
  zhanpinlist() {
    var that = this
    var supplierId = wx.getStorageSync('userInfo').id // 展商id
    var url = app.globalData.host + '/api3/exhibit/getExhibits/' + supplierId;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == '0') {
          that.setData({
            list: res.data.result
          })
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  formSubmit(e) {
    //1.需要显示2.验证手机
    let _self = this;
    let exhibitList = this.data.productTypeList, list = [], fieldList = this.data.fieldList, isHasNull = false;
    exhibitList.map(item => {
      item.childList.map(childItem => {
        childItem.isChecked ? list.push(childItem.id) : ''
      })
    });
    if (isDisplayInFields('mobilePhone', _self.data.fieldList) &&
      _self.data.form.mobilePhone &&
      !validateMobile(_self.data.form.mobilePhone)) {
      wx.showToast({
        title: '不是手机号格式',
        icon: 'none',
      })
      return false
    }
    //1.需要显示2.验证邮箱
    if (isDisplayInFields('email', _self.data.fieldList) &&
      _self.data.form.email &&
      !validateEmail(_self.data.form.email)) {
      wx.showToast({
        title: langTranslate['不是邮箱格式'],
        icon: 'none',
      })
      return false
    }
    let params = {
      // ..._self.data.form,
      "projectId": wx.getStorageSync('activityDetail').id,
      // "supplierId": wx.getStorageSync('userInfo').id,
      "companyId": wx.getStorageSync('activityDetail').companyId,
      // id: wx.getStorageSync('userInfo').id,
      company: _self.data.form.company,
      companyEn: _self.data.form.companyEn,
      country: _self.data.form.country,
      province: _self.data.form.province,
      city: _self.data.form.city,
      portrait: _self.data.form.acode,
      job: _self.data.form.job,
      jobEn: _self.data.form.jobEn,
      nature: _self.data.form.nature,
      contact: _self.data.form.contact,
      contactEn: _self.data.form.contactEn,
      mobilePhone: _self.data.form.mobilePhone,
      email: _self.data.form.email,
      tags: list.join(',')
    };
    params = setArray2Str4Post(params);
    let url = app.globalData.host + `/api3/supplier/updateSupplier/${storage.getUserInfo().id}`;
    
    wx.request({
      url: url,
      method: 'POST',
      data:params,
      header: {
        'Content-Type': 'application/json',
        // "token":storage.getToken()
      },
      success: function (res) {
        if(res.data.code == 0){
          wx.showToast({
            title: langTranslate['修改成功'],
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      },
    })
  },

  formReset(e) {
    wx.navigateBack({
      delta: 1
    })
  },
  //重置
  resetFilterDialog:function(e){
    
  },
  //点击确认
  closeFilterDialog:function(e){
    
  },
  getFilterData(){
    let _self = this;
    (0, api.getProductType)({
      data: {
        src: 1,
        projectId: storage.getActivityDetail().id
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == '0') {
          const list = [];
          let tags = _self.data.form.tags.split(",");
          res.data.result.map(item => {
            item.id = item.parent.id
            _self.data.isEn ? item.name = item.parent.english : item.name = item.parent.chinese;
            let flagP = false;
            item.subclass.map(childItem => {
              let flag = tags.find(item => {
                return item==childItem.id
              })
              flagP = flag?true:flagP;
              childItem.isChecked = flag?true:false;
              childItem.name = _self.data.isEn ?childItem.english:childItem.chinese;
            });
            item.isChecked = flagP;
            item.childList = item.subclass;
          })
          _self.setData({
            productTypeList: res.data.result
          })
        }
      }
    });
  },
  //点击父级
  chooseTap:function(e){
    let index = e.currentTarget.dataset.index
    let arr = this.data.productTypeList
    arr[index].isChecked = !arr[index].isChecked;
    arr[index].childList.map(item => {
      item.isChecked=arr[index].isChecked
    })
    this.setData({
      productTypeList:arr
    })
  },
  //点击子项
  chooseChildTap:function(e){
    let {pindex,index} = e.currentTarget.dataset
    let arr = this.data.productTypeList
    arr[pindex].childList[index].isChecked = !arr[pindex].childList[index].isChecked;
    arr[pindex].isChecked = arr[pindex].childList.find(item => {
      return item.isChecked
    })
    this.setData({
      productTypeList:arr
    })
  },
  bindCountryCodeChange: function (e) {
    this.setData({
      countryCodeIndex: e.detail.value,
      provinceCodeIndex: 0,
      'form.country': this.data.countryCodes[e.detail.value],
      showProvice:true
    });
    if(e.detail.value!=0){
      this.setData({
        showProvice:false,
        'form.province':'',
        'form.city':'',
      })
    }
  },
  bindProvinceCodeChange: function (e) {
    this.setData({
      provinceCodeIndex: e.detail.value,
      cityCodeIndex: 0,
      'form.province': this.data.provinceCodes[e.detail.value]
    });
    this.getCityData()
  },
  bindCityCodeChange: function (e) {
    this.setData({
      cityCodeIndex: e.detail.value,
      'form.city': this.data.cityCodes[e.detail.value]
    });
  },
  // 获取城市数据
  getCityData() {
    let _self = this;
    let city = _self.data.form.city, cityIndex = 0, isEn = _self.data.isEn;
    (0, api.getCity)({
      method: 'POST',
      query: {
        name: _self.data.provinceCodes[_self.data.provinceCodeIndex]
      },
      isSkipIntercept: true,
      success: function (res) {
        const list = []
        res.data.datas.map(item => {
          isEn ? list.push(item.english) : list.push(item.name)
        });
        if (!util.isNullStr(city)) {
          cityIndex = list.findIndex(item => {
            return item === _self.data.form.city
          })
        }
        _self.setData({
          cityCodes: list,
          cityCodeIndex: cityIndex === -1 ? 0 : cityIndex
        });
      }
    });
  },
  // 初始化数据
  initData: function () {
    let _self = this;
    let exhibits = [], country = _self.data.form.country, countryIndex = 0, province = _self.data.form.province,
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
        let list = []
        res.data.datas.map(item => {
          isEn ? list.push(item.english) : list.push(item.name)
        });
        if (!util.isNullStr(country)) {
          countryIndex = list.findIndex(item => {
            return item === _self.data.form.country
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
            return item === _self.data.form.province
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
            if (_self.data.form.tags.indexOf(childItem.id) !== -1) {
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
            var temp_str = 'from.' + item.nameKey;
            _self.setData({
              [temp_str]: _self.data.form[item.nameKey]
            })
            list.push(item)
          });
          list = _self.setDisplayForAllFields(list);
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    langTranslate = i18n.langTranslate();
    this.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
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