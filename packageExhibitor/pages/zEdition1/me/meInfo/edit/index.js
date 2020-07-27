// packageExhibitor/pages/zEdition1/product/edit/index.js
import {getString} from "../../../../../../locals/lang.js";
import {icon_delete} from "../../../../../../common/staticImageContants";
//获取应用实例
const app = getApp()
const i18n = require('../../../../../../i18n/i18n')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_delete,
    zhanshangid: '',
    info: '',
    ismask: false,
    imageSrc: [],
    ismask1: false,
    videoSrc: '',
    ProductType: [],//产品类型
    language: '',
    choosetype: [],//选择类别数组
    parentarr: [],//临时判断选中的父类
    ZHName: '',//公司 名称
    ENNname: '',//英文名称
    hall_number: '',//展馆号
    boothNumber: '',//展位号
    url: '',//网址
    introduction: '',//中文介绍
    enintro: '',//英文介绍
    infoarray: [],
    zdycs: [],
    region: ['中国大陆', '', ''],
    customItem: '全部',
    country: [],//国家
    province: [],//省份
    city: [],//城市
    allnumber: [[], [], []],
    multiIndex: [0, 0, 0],
    typebody: [],
    typedefaults: [],
    object: {},
    hall_numberOptions: [],//可以选中的场馆号
    isEn: false,
    langTranslate: i18n.langTranslate(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: getString('exhibitors_index', 'app.home.menus1')
    })
    // 判断语言类型
    var language = wx.getStorageSync('lang')
    this.setData({
      language: language,
      label: {
        productType: getString('wp', 'app.meinfo.room.productType'),
        ZHName: getString('wp', 'app.info.zhname'),
        ENName: getString('wp', 'app.info.enname'),
        roomNum: getString('wp', 'app.info.no'),
        doorNum: getString('wp', 'app.info.sitno'),
        link: getString('wp', 'app.meinfo.room.link'),
        img: getString('wp', 'app.info.img'),
        video: getString('wp', 'app.info.video'),
        ZHIntroller: getString('wp', 'app.info.ZHIntroller'),
        ENIntroller: getString('wp', 'app.info.ENIntroller'),
        coverImg: getString('wp', 'app.btn.coverImg'),
        cancel: getString('wp', 'app.btn.cancel'),
        save: getString('wp', 'app.btn.save'),
        remove: getString('wp', 'app.info.remove'),
        upload: getString('wp', 'app.info.upload'),
        choosed: getString('wp', 'app.info.choosed'),
        photo: getString('exhibitors_index', 'app.info.photo'),
        shoot: getString('exhibitors_index', 'app.info.shoot'),
        album: getString('exhibitors_index', 'app.info.album'),
      },
    })
    this.zhanshangid = options.id
    this.initinfo()
  },
  //获取展商信息
  initinfo() {
    var that = this
    //获取后台设置字段
    var companyId = wx.getStorageSync('activityDetail').companyId
    var userId = wx.getStorageSync('userInfo').id
    wx.showLoading()
    wx.request({
      url: app.globalData.host + '/cg/${companyId}/match/${userId}/v1/queryRegistration/',
      method: 'POST',
      data: {
        accessToken: wx.getStorageSync('token'),
        timeStamp: (new Date()).getTime(),
        src: 0,
        projectId: wx.getStorageSync('activityDetail').id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.code == '0') {
          var canshuu = that.mergeBodyAndDefauts(res.data.data.body, res.data.data.defaults)
          console.log(canshuu)
          that.setData({
            zdycs: canshuu
          })
          if (res.data.data.body) {
            that.setData({
              typebody: res.data.data.body
            })
          }
          if (res.data.data.defaults) {
            that.setData({
              typedefaults: res.data.data.defaults
            })
          }
          that.initinfo3()
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
    //获取国家
    wx.request({
      url: app.globalData.host + '/cg/area/country',
      method: 'POST',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.data.country = [
          {id: -1, name: '中国大陆',english:'China'},
          {id: -2, name: '中国香港',english:'China'},
          {id: -3, name: '中国台湾',english:'China'},
          {id: -4, name: '中国澳门',english:'China'},
        ].concat(res.data.datas)
        that.setData({
          country: that.data.country
        })
        // for(var i =0;i<that.data.country.length;i++){
        //  that.data.allnumber[0].push(that.data.country[i].name)
        // }
        that.data.allnumber[0] = that.data.country
        that.data.allnumber[1] = []
        that.data.allnumber[2] = []
        console.log(that.data.allnumber)
        if (that.data.country[0].name == '中国大陆') {
          //获取省份
          wx.request({
            url: app.globalData.host + '/cg/area/province',
            method: 'POST',
            data: {
              strJson: 'CN'
            },
            header: {
              'Content-Type': 'application/json'
            },
            success: function (res1) {
              console.log(res1)
              that.data.province = res1.data.datas
              that.setData({
                province: res1.data.datas
              })
              // for(var i =0;i<that.data.province.length;i++){
              // 		that.data.allnumber[1].push(that.data.province[i].name)
              // }
              that.data.allnumber[1] = that.data.province
              console.log(that.data.allnumber)
              if (that.data.province[0].name == '北京市') {
                //获取城市
                wx.request({
                  url: app.globalData.host + '/cg/area/city?name=北京市',
                  method: 'POST',
                  data: {
                    // name:'北京市'
                  },
                  header: {
                    'Content-Type': 'application/json'
                  },
                  success: function (res2) {
                    console.log(res2)
                    that.data.city = res2.data.datas
                    that.setData({
                      city: res2.data.datas
                    })
                    // for(var i =0;i<that.data.city.length;i++){
                    // 		that.data.allnumber[2].push(that.data.city[i].name)
                    // }
                    that.data.allnumber[2] = that.data.city
                    console.log(that.data.allnumber)
                    if (that.data.language != 'en') {
                      that.data.region = ['中国大陆', '北京市', '直辖市']
                    } else {
                      that.data.region = ['China', 'Beijing', 'City-governed district']
                    }
                    console.log(that.data.region)
                    that.setData({
                      allnumber: that.data.allnumber,
                      region: that.data.region
                    })
                  },
                  fail: function (error2) {
                    console.log(error2)
                  }
                })
              }
            },
            fail: function (error1) {
              console.log(error1)
            }
          })
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })

  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e)
    // this.setData({
    //   multiIndex: e.detail.value
    // })
    if (e.detail.value[0] == 0) {
      if (this.data.language != 'en') {
        this.data.region[0] = this.data.country[e.detail.value[0]].name
        this.data.region[1] = this.data.province[e.detail.value[1]].name
        this.data.region[2] = this.data.city[e.detail.value[2]].name
      } else {
        this.data.region[0] = this.data.country[e.detail.value[0]].english
        this.data.region[1] = this.data.province[e.detail.value[1]].english
        this.data.region[2] = this.data.city[e.detail.value[2]].english
      }
    } else {
      if (this.data.language != 'en') {
        this.data.region[0] = this.data.country[e.detail.value[0]].name
        this.data.region[1] = ''
        this.data.region[2] = ''
      } else {
        this.data.region[0] = this.data.country[e.detail.value[0]].english
        this.data.region[1] = ''
        this.data.region[2] = ''
      }
    }


    this.setData({
      region: this.data.region
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var that = this
    console.log('修改的列为', e,);
    if (e.detail.column == 0) {
      var name = that.data.country[e.detail.value].name
      if (e.detail.value == 0) {
        //获取省份
        wx.request({
          url: app.globalData.host + '/cg/area/province',
          method: 'POST',
          data: {
            strJson: 'CN'
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res1) {
            console.log(res1)
            that.data.province = res1.data.datas
            that.setData({
              province: res1.data.datas
            })
            // for(var i =0;i<that.data.province.length;i++){
            // 		that.data.allnumber[1].push(that.data.province[i].name)
            // }
            that.data.allnumber[1] = that.data.province
            console.log(that.data.allnumber)
            if (that.data.province[0].name == '北京市') {
              //获取城市
              wx.request({
                url: app.globalData.host + '/cg/area/city?name=北京市',
                method: 'POST',
                data: {
                  // name:'北京市'
                },
                header: {
                  'Content-Type': 'application/json'
                },
                success: function (res2) {
                  console.log(res2)
                  that.data.city = res2.data.datas
                  that.setData({
                    city: res2.data.datas
                  })
                  // for(var i =0;i<that.data.city.length;i++){
                  // 		that.data.allnumber[2].push(that.data.city[i].name)
                  // }
                  that.data.allnumber[2] = that.data.city
                  console.log(that.data.allnumber)
                  if (that.data.language != 'en') {
                    that.data.region = ['中国大陆', '北京市', '直辖市']
                  } else {
                    that.data.region = ['China', 'Beijing', 'City-governed district']
                  }
                  that.setData({
                    allnumber: that.data.allnumber,
                    region: that.data.region
                  })
                },
                fail: function (error2) {
                  console.log(error2)
                }
              })
            }
          },
          fail: function (error1) {
            console.log(error1)
          }
        })
      } else {
        if (that.data.language != 'en') {
          that.data.region[0] = name
        } else {
          that.data.region[0] = that.data.country[e.detail.value].english
        }

        that.data.region[1] = ''
        that.data.region[2] = ''
        that.data.allnumber[1] = []
        that.data.allnumber[2] = []
        that.setData({
          allnumber: that.data.allnumber,
          region: that.data.region
        })
      }

    } else if (e.detail.column == 1) {
      var name = that.data.province[e.detail.value].name
      if (that.data.language != 'en') {
        that.data.region[1] = name
      } else {
        that.data.region[1] = that.data.province[e.detail.value].english
      }
      // that.data.region[1] = name
      console.log(that.data.province[e.detail.value].name)
      //获取城市
      wx.request({
        url: app.globalData.host + '/cg/area/city?name=' + name,
        method: 'POST',
        data: {
          // name:name
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res2) {
          console.log(res2)
          that.data.city = res2.data.datas
          that.setData({
            city: res2.data.datas
          })
          // for(var i =0;i<that.data.city.length;i++){
          // 		that.data.allnumber[2].push(that.data.city[i].name)
          // }
          that.data.allnumber[2] = that.data.city
          if (that.data.language != 'en') {
            that.data.region[2] = that.data.city[0].name
          } else {
            that.data.region[2] = that.data.city[0].english
          }
          console.log(that.data.allnumber)
          that.setData({
            allnumber: that.data.allnumber,
            region: that.data.region
          })
        },
        fail: function (error2) {
          console.log(error2)
        }
      })
    } else if (e.detail.column == 2) {
      var name = that.data.city[e.detail.value].name
      if (that.data.language != 'en') {
        that.data.region[2] = name
      } else {
        that.data.region[2] = that.data.city[e.detail.value].english
      }
      that.setData({
        region: that.data.region
      })
    }
  },
  /*
  * 把变量bodys 和 defaults 整合在一起
  * */
  mergeBodyAndDefauts(body, defaults) {
    var _body = body ? body : []
    var _defaults = defaults ? defaults : []
    if (!_body || _body.length == 0) {
      return _defaults
    }
    for (let i = 0; i < _body.length; i++) {
      var bodyItem = _body[i]
      for (let j = 0; j < _defaults.length; j++) {
        var defaultItem = _defaults[j]
        if (bodyItem.nameKey === defaultItem.nameKey) {
          if (this.isNil(bodyItem.defaults)) {
            _body[i].defaults = defaultItem.defaults
          }
        }
      }
    }
    return _body
  },
  isNil(str) {
    if (str === null) {
      console.log(11)
      return true
    }
    if (typeof str === "undefined") {
      console.log(22)
      return true
    }
    if (str === '') {
      console.log(33)
      return true
    }
    return false
  },
  initinfo3() {
    var that = this
    //获取类别
    wx.request({
      url: app.globalData.host + '/api3/org/queryProductType/',
      method: 'POST',
      data: {
        src: 0,
        projectId: wx.getStorageSync('activityDetail').id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          that.setData({
            ProductType: res.data.result
          })
          that.initinfo2()
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  initinfo2() {
    var that = this
    var url = app.globalData.host + '/api3/supplier/detail/' + this.zhanshangid;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          var info = res.data.result
          if (res.data.result.cpc) {
            that.setData({
              region: res.data.result.cpc.split(',')
            })
          }
          var tags=res.data&&res.data.result&&res.data.result.tags&&res.data.result.tags
          that.setData({
            info: res.data.result,
            ZHName: res.data.result.company,//公司 名称
            ENNname: res.data.result.companyEn,//英文名称
            hall_number: res.data.result.hall_number,//展馆号
            boothNumber: res.data.result.boothNumber,//展位号
            url: res.data.result.url,//网址
            introduction: res.data.result.introduction,//中文介绍
            enintro: res.data.result.introductionEn,//英文介绍
            choosetype:tags&&tags.split&&tags.split(',')||[],
            object: res.data.result
          })

          that.selectComponent('#treeProductType').setValues4Tree(tags)
          that.getHall_numberOptions()
          for (var i = 0; i < that.data.ProductType.length; i++) {
            for (var j = 0; j < that.data.ProductType[i].subclass.length; j++) {
              if (that.data.choosetype.indexOf(that.data.ProductType[i].subclass[j].id) != -1) {
                that.data.ProductType[i].subclass[j].checked = true
              }
            }
          }
          var ProductType = that.data.ProductType
          that.setData({ProductType})
          that.setData({
            videoSrc: res.data.result.video
          })
          if (res.data.result.portrait) {
            that.setData({
              imageSrc: that.data.imageSrc.concat(res.data.result.portrait)
            })
          }
          // if(typeof(res.data.result.portrait)=='string'){
          // 	that.setData({
          // 	  imageSrc:that.data.imageSrc.concat(res.data.result.portrait)
          // 	})
          // }else{
          // 	that.setData({
          // 	  imageSrc:res.data.result.portrait
          // 	})
          // }

          for (var i = 0; i < that.data.zdycs.length; i++) {
            var key = that.data.zdycs[i].nameKey
            var type = that.data.zdycs[i].type
            if ((type == 1 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == 'company' || key == 'company' || key == "companyEn" || key == "contact" || key == "contactEn" || key == "email" || key == "website" || key == "boothNumber" || key == "mobilePhone" || key == "job" || key == "jobEn"))) {
              type = 1
            } else if ((type == 2 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "introduction" || key == "introductionEn"))) {
              type = 2
            } else if ((type == 3 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "expo"))) {
              type = 3
            } else if ((type == 4 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "hall_number" || key == "nature" || key == "industry"))) {
              type = 4
            } else if ((type == 5 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "portrait"))) {
              type = 5
            } else if ((type == 6 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "cpc"))) {
              type = 6
            } else if ((type == 7 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "tags"))) {
              type = 7
            } else if ((type == 8 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "video"))) {
              type = 8
            }
            if (that.data.language != 'en') {
              for (j in info) {
                if (j == key) {
                  var defaults = []
                  if (that.data.zdycs[i].defaults != '') {
                    if (that.data.zdycs[i].defaults.indexOf(',') == -1) {
                      defaults = that.data.zdycs[i].defaults.split(/[(\r\n)\r\n]+/)
                    } else {
                      defaults = that.data.zdycs[i].defaults.split(',')
                    }

                  } else {
                    defaults = []
                  }
                  that.data.infoarray.push({
                    name: that.data.zdycs[i].nameZh,
                    value: info[key],
                    type: type,
                    defaults: defaults,
                    nameKey: key
                  })
                }
              }
            } else {
              for (j in info) {
                if (j == key) {
                  var defaults = []
                  if (that.data.zdycs[i].defaults != '') {
                    if (that.data.zdycs[i].defaults.indexOf(',') == -1) {
                      defaults = that.data.zdycs[i].defaults.split(/[(\r\n)\r\n]+/)
                    } else {
                      defaults = that.data.zdycs[i].defaults.split(',')
                    }
                  } else {
                    defaults = []
                  }
                  that.data.infoarray.push({
                    name: that.data.zdycs[i].nameEn,
                    value: info[key],
                    type: type,
                    defaults: defaults,
                    nameKey: key
                  })
                }
              }
            }
          }
          var aaa = []
          for (var m = 0; m < that.data.infoarray.length; m++) {
            aaa.push(that.data.infoarray[m].name)
          }
          console.log(aaa)
          for (var i = 0; i < that.data.zdycs.length; i++) {
            var key = that.data.zdycs[i].nameKey
            var type = that.data.zdycs[i].type
            if ((type == 1 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == 'company' || key == 'company' || key == "companyEn" || key == "contact" || key == "contactEn" || key == "email" || key == "website" || key == "boothNumber" || key == "mobilePhone" || key == "job" || key == "jobEn"))) {
              type = 1
            } else if ((type == 2 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "introduction" || key == "introductionEn"))) {
              type = 2
            } else if ((type == 3 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "expo"))) {
              type = 3
            } else if ((type == 4 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "hall_number" || key == "nature" || key == "industry"))) {
              type = 4
            } else if ((type == 5 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "portrait"))) {
              type = 5
            } else if ((type == 6 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "cpc"))) {
              type = 6
            } else if ((type == 7 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "tags"))) {
              type = 7
            } else if ((type == 8 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "video"))) {
              type = 8
            }
            if (that.data.language != 'en') {
              var name = that.data.zdycs[i].nameZh
              if (aaa.indexOf(name) == -1) {
                var defaults = []
                if (that.data.zdycs[i].defaults != '') {
                  if (that.data.zdycs[i].defaults.indexOf(',') == -1) {
                    defaults = that.data.zdycs[i].defaults.split(/[(\r\n)\r\n]+/)
                  } else {
                    defaults = that.data.zdycs[i].defaults.split(',')
                  }
                } else {
                  defaults = []
                }
                that.data.infoarray.push({
                  name: that.data.zdycs[i].nameZh,
                  value: '',
                  type: type,
                  defaults: defaults,
                  nameKey: key
                })
              }
            } else {
              var name = that.data.zdycs[i].nameEn
              if (aaa.indexOf(name) == -1) {
                var defaults = []
                if (that.data.zdycs[i].defaults != '') {
                  if (that.data.zdycs[i].defaults.indexOf(',') == -1) {
                    defaults = that.data.zdycs[i].defaults.split(/[(\r\n)\r\n]+/)
                  } else {
                    defaults = that.data.zdycs[i].defaults.split(',')
                  }
                } else {
                  defaults = []
                }
                that.data.infoarray.push({
                  name: that.data.zdycs[i].nameEn,
                  value: '',
                  type: type,
                  defaults: defaults,
                  nameKey: key
                })
              }
            }
          }
          var infoarray = that.data.infoarray
          console.log(that.data.infoarray)
          that.setData({
            infoarray: that.data.infoarray
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  getHall_numberOptions() {
    var self = this
    // nameKey: "hall_number"
    var defaults = []
    for (let i = 0; i < this.data.zdycs.length; i++) {
      var item = this.data.zdycs[i]
      if (item.nameKey == 'hall_number') {
        defaults = this.data.zdycs[i].defaults
        if (defaults[0] == '[') {
          defaults.substr(1, defaults.length - 1)
        }
        if (defaults && defaults.constructor === String) {
          defaults = defaults.split(',').filter(item => item)
        }

      }
    }
    var hall_number = self.data.object.hall_number.split(",")
    this.setData({
      hall_numberOptions: defaults && defaults.map(item => {
        var isChecked = hall_number.filter(_item => item.trim() == _item.trim())[0]
        return {
          name: item,
          checked: isChecked
        }
      })
    })
  },
  valueinput: function (e) {
    console.log(e.currentTarget.dataset.item)
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var value = `infoarray[${index}].value`;
    console.log(e)
    this.setData({
      [value]: e.detail.value
    })
    console.log(this.data.infoarray)
  },
  radioChange: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var value = `infoarray[${index}].value`;
    console.log(e)
    this.setData({
      [value]: e.detail.value
    })
    console.log(this.data.infoarray)
  },
  checkboxchoose: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var half_number = e.detail.value
    this.data.object['hall_number'] = half_number.join(',')
    this.setData({
      // [value]: e.detail.value.join(','),
      object: this.data.object
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var index = e.currentTarget.dataset.index
    var value = `infoarray[${index}].value`;
    this.setData({
      region: e.detail.value
    })
    this.setData({
      [value]: e.detail.value.join(',')
    })
  },
  cancelback() {
    wx.navigateBack({})
  },
  bindZHNameInput: function (e) {
    this.setData({
      ZHName: e.detail.value
    })
  },
  bindEHNameInput: function (e) {
    this.setData({
      ENNname: e.detail.value
    })
  },
  bindhall_numberInput: function (e) {
    this.setData({
      hall_number: e.detail.value
    })
  },
  bindboothNumberInput: function (e) {
    this.setData({
      boothNumber: e.detail.value
    })
  },
  bindurlInput: function (e) {
    this.setData({
      url: e.detail.value
    })
  },
  bindintroInput: function (e) {
    this.setData({
      introduction: e.detail.value
    })
  },
  bindinforenInput: function (e) {
    this.setData({
      enintro: e.detail.value
    })
  },
  uploadvideo() {
    this.setData({
      ismask1: true
    })
  },
  removevideo() {
    this.setData({
      videoSrc: ''
    })
  },
  uploadimg() {
    console.log('11')
    this.setData({
      ismask: true
    })
  },
  removeimg() {
    this.setData({
      imageSrc: []
    })
  },
  cancel() {
    this.setData({
      ismask: false
    })
  },
  cancel1() {
    this.setData({
      ismask1: false
    })
  },
  //上传图片
  album() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        for (let i = 0; i < res.tempFiles.length; i++) {
          wx.uploadFile({
            url: app.globalData.host + '/api3/file/upload',
            files: res.tempFiles[i],
            filePath: res.tempFilePaths[i],
            fileType: 'image',
            name: 'file',
            success: (res) => {
              console.log(JSON.parse(res.data).code)
              if (JSON.parse(res.data).code == '0') {
                var path = app.globalData.host + '/' + JSON.parse(res.data).result
                this.setData({
                  ismask: false
                })
                if (this.data.imageSrc.length == 0) {
                  this.setData({
                    imageSrc: this.data.imageSrc.concat(path)
                  });
                } else {
                  var tip = ''
                  if (that.data.language != 'en') {
                    tip = '最多上传1张'
                  } else {
                    tip = 'just only one'
                  }
                  wx.showToast({
                    title: tip,
                    icon: 'none',
                    duration: 1000
                  })
                }
                console.log(this.data.imageSrc)

              } else {
                var tip = ''
                if (that.data.language != 'en') {
                  tip = '上传失败'
                } else {
                  tip = 'upload fail'
                }
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 1000
                })
                this.setData({
                  ismask: false,
                  imageSrc: []
                })
              }

            },
            fail: (err) => {
              console.log('uploadImage fail', err);
              wx.showModal({
                content: err.errMsg,
                showCancel: false
              });
            }
          });
        }
      },
      fail: (err) => {
        console.log('chooseImage fail', err)
      }
    })
  },
  photo() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        for (let i = 0; i < res.tempFiles.length; i++) {
          wx.uploadFile({
            url: app.globalData.host + '/api3/file/upload',
            files: res.tempFiles[i],
            filePath: res.tempFilePaths[i],
            fileType: 'image',
            name: 'file',
            // header: {
            // 	'Authorization': wx.getStorageSync('token')
            // },
            success: (res) => {
              console.log(res)
              if (JSON.parse(res.data).code == '0') {
                var path = app.globalData.host + '/' + JSON.parse(res.data).result
                this.setData({
                  ismask: false
                })
                if (this.data.imageSrc.length == 0) {
                  this.setData({
                    imageSrc: this.data.imageSrc.concat(path)
                  });
                } else {
                  var tip = ''
                  if (that.data.language != 'en') {
                    tip = '最多上传1张'
                  } else {
                    tip = 'just only one'
                  }
                  wx.showToast({
                    title: tip,
                    icon: 'none',
                    duration: 1000
                  })
                }

              } else {
                var tip = ''
                if (that.data.language != 'en') {
                  tip = '上传失败'
                } else {
                  tip = 'upload fail'
                }
                wx.showToast({
                  title: tip,
                  icon: 'none',
                  duration: 1000
                })
                this.setData({
                  ismask: false,
                  imageSrc: []
                })
              }

            },
            fail: (err) => {
              console.log('uploadImage fail', err);
              wx.showModal({
                content: err.errMsg,
                showCancel: false
              });
            }
          });
        }
      },
      fail: (err) => {
        console.log('chooseImage fail', err)
      }
    })
  },
  //上传视频
  album1() {
    var that = this
    wx.chooseVideo({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        console.log(res)
        // for (let i = 0; i < res.tempFiles.length; i++) {
        wx.uploadFile({
          url: app.globalData.host + '/api3/file/upload',
          // files:res.tempFiles[i],
          filePath: res.tempFilePath,
          // fileType: 'image',
          name: 'file',
          success: (res) => {
            console.log(JSON.parse(res.data).code)
            if (JSON.parse(res.data).code == '0') {
              var path = app.globalData.host + '/' + JSON.parse(res.data).result
              this.setData({
                ismask1: false,
                videoSrc: path
              })

            } else {
              var tip = ''
              if (that.data.language != 'en') {
                tip = '上传失败'
              } else {
                tip = 'upload fail'
              }
              wx.showToast({
                title: tip,
                icon: 'none',
                duration: 1000
              })
              this.setData({
                ismask1: false,
                videoSrc: ''
              })
            }

          },
          fail: (err) => {
            console.log('uploadvideo fail', err);
            wx.showModal({
              content: err.errMsg,
              showCancel: false
            });
          }
        });
        // }
      },
      fail: (err) => {
        console.log('chooseVideo fail', err)
      }
    })
  },
  photo1() {
    var that = this
    wx.chooseVideo({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        // for (let i = 0; i < res.tempFiles.length; i++) {
        wx.uploadFile({
          url: app.globalData.host + '/api3/file/upload',
          // files:res.tempFiles[i],
          filePath: res.tempFilePath,
          // fileType: 'image',
          name: 'file',
          // header: {
          // 	'Authorization': wx.getStorageSync('token')
          // },
          success: (res) => {
            console.log(res)
            if (JSON.parse(res.data).code == '0') {
              var path = app.globalData.host + '/' + JSON.parse(res.data).result
              this.setData({
                ismask: false,
                videoSrc: path
              })
            } else {
              var tip = ''
              if (that.data.language != 'en') {
                tip = '上传失败'
              } else {
                tip = 'upload fail'
              }
              wx.showToast({
                title: tip,
                icon: 'none',
                duration: 1000
              })
              this.setData({
                ismask: false,
                videoSrc: ''
              })
            }

          },
          fail: (err) => {
            console.log('uploadvideo fail', err);
            wx.showModal({
              content: err.errMsg,
              showCancel: false
            });
          }
        });
        // }
      },
      fail: (err) => {
        console.log('chooseVideo fail', err)
      }
    })
  },
  //选产品类型
  checkboxChange: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    if (this.data.parentarr.indexOf(index) == -1) {
      //选择父类
      for (var i = 0; i < this.data.ProductType[index].subclass.length; i++) {
        var id = this.data.ProductType[index].subclass[i].id
        if (this.data.choosetype.indexOf(id) == -1) {
          this.data.choosetype.push(this.data.ProductType[index].subclass[i].id)
        }
        this.data.ProductType[index].subclass[i].checked = true
      }
      var ProductType = this.data.ProductType
      this.setData({ProductType})
      this.data.parentarr.push(index)
    } else {
      //当前父类下所有的id都要删除
      for (var i = 0; i < this.data.ProductType[index].subclass.length; i++) {
        var id = this.data.ProductType[index].subclass[i].id
        if (this.data.choosetype.indexOf(id) != -1) {
          var index1 = this.data.choosetype.indexOf(id)
          this.data.choosetype.splice(index1, 1)  //存在删除
        }
        this.data.parentarr.splice(index, 1)
        this.data.ProductType[index].subclass[i].checked = false
        var ProductType = this.data.ProductType
        this.setData({ProductType})
      }

    }

    console.log(this.data.choosetype)
    console.log(this.data.ProductType)
  },
  checkboxChange1: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.value)
    var id = e.currentTarget.dataset.value//选中的id
    if (this.data.choosetype.indexOf(id) == -1) {
      this.data.choosetype.push(id)  //不存在加入
    } else {
      var index = this.data.choosetype.indexOf(id)
      this.data.choosetype.splice(index, 1)  //存在删除
    }
    console.log(this.data.choosetype)
  },
  //编辑保存
  editsave() {
    console.log(this.data.infoarray)
    let object = {}
    for (var i = 0; i < this.data.infoarray.length; i++) {
      let keyX = this.data.infoarray[i].nameKey
      keyX && (object[keyX] = this.data.infoarray[i].value)
      if (keyX && keyX == "tags") {
        object[keyX] = this.data.choosetype.join(',')
      } else if (keyX && keyX == "portrait") {
        object[keyX] = this.data.imageSrc.join(',')
      } else if (keyX == "cpc") {
        object[keyX] = this.data.region.join(',')
      } else if (keyX && keyX == "video") {
        if (this.data.videoSrc == '') {
          object[keyX] = ''
        } else {
          object[keyX] = this.data.videoSrc
        }

      }
    }
    console.log(object)
    // var that=this
    // if (that.data.ZHName== ''){
    //   wx.showToast({
    //     title: '请输入公司名称',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.ENNname== ''){
    //   wx.showToast({
    //     title: '请输入公司英文名称',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.hall_number== ''){
    //   wx.showToast({
    //     title: '请输入展馆号',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.boothNumber== ''){
    //   wx.showToast({
    //     title: '请输入展位号',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.url== ''){
    //   wx.showToast({
    //     title: '请输入网址',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.introduction== ''){
    //   wx.showToast({
    //     title: '请输入中文介绍',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.enintro== ''){
    //   wx.showToast({
    //     title: '请输入英文介绍',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else{
    // 	console.log(that.data.imageSrc)
    // 	console.log(that.data.videoSrc)
    // 	console.log(that.data.enintro)
    // 	console.log(that.data.introduction)
    // 	console.log(that.data.url)
    // 	console.log(that.data.boothNumber)
    // 	console.log(that.data.hall_number)
    // 	console.log(that.data.ENNname)
    // 	console.log(that.data.ZHName)
    // 	console.log(that.data.choosetype)
    var that = this
    var object1 = {}
    object1.tags = this.selectComponent("#treeProductType").getTags4post()
    object1.company_address = this.data.object.company_address
    object1.company_address_en = this.data.object.company_address_en
    object1.cpc = this.data.region.join(',')
    object1.contact = this.data.object.contact
    object1.contact_en = this.data.object.contact_en
    object1.id = this.data.object.id
    // object1.mobile_phone = this.data.object.mobile_phone||this.data.object.mobilePhone
    object1.mobilePhone = this.data.object.mobilePhone
    object1.boothNumber = this.data.object.boothNumber
    object1.hall_number = this.data.object.hall_number
    object1.video = this.data.object.video
    object1.introduction = this.data.object.introduction
    object1.email = this.data.object.email
    object1.company = this.data.object.company
    object1.companyEn = this.data.object.companyEn
    object1.portrait = this.data.object.portrait
    object1.confirm_code = this.data.object.confirm_code
    object1.contactEn = this.data.object.contactEn
    object1.introduction_en = this.data.object.introduction_en
    object1.url = this.data.object.url

    // if (!object.mobilePhone) {
    //   wx.showToast({title: "手机号必填", duration: 1000, icon: 'none'})
    //   return false
    // }
    wx.request({
      url: app.globalData.host + '/api3/supplier/updateSupplier/' + this.zhanshangid,
      method: 'POST',
      // data:{
      // 	company:that.data.ZHName,
      // 	companyEn:that.data.ENNname,
      // 	hall_number:that.data.hall_number,
      // 	boothNumber:that.data.boothNumber,
      // 	url:that.data.url,
      // 	tags:that.data.choosetype.join(','),
      // 	portrait:that.data.imageSrc.join(','),
      // 	video:that.data.videoSrc,
      // 	introduction:that.data.introduction,
      // 	introduction_en:that.data.enintro
      // },
      data: object1,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          var tip = ''
          if (that.data.language != 'en') {
            tip = '编辑成功'
          } else {
            tip = 'edit success'
          }
          wx.showToast({
            title: tip,
            icon: 'none',
            duration: 1000
          })
          setTimeout(function () {
            wx.navigateBack({})
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
    // }
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

  },
  changeText(e) {
    var key = e.currentTarget.dataset.key
    var value = e.detail.value
    this.data.object[key] = value
    // object: this.data.object
    this.setData({
      object: this.data.object
    })
  },
  changePortrait(e) {
    var path = e.detail
    this.data.object.portrait = path
    this.setData({
      object: this.data.object
    })
  },
  changeVideo(e) {
    var path = e.detail
    this.data.object.video = path
    this.setData({
      object: this.data.object

    })
  },
  checkedIsInArray(item) {
    var hall_number = this.data.object.hall_number.split(",")
    debugger
    return (hall_number.findIndex(item_ => item_ == item))[0]
  },
  deletePortrait() {
    this.data.object.portrait = ""
    this.setData({
      object: this.data.object
    })
  }
})