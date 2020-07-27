// packageExhibitor/pages/zEdition1/product/edit/index.js
import {getString} from "../../../../../locals/lang.js";
import {getCurrentPage1} from "../../../../../utils/util";
import {
  default_checkbox_checked,filter_active,
  default_checkbox_no_chekced,
  icon_delete
} from "../../../../../common/staticImageContants";
//获取应用实例
const app = getApp()
let defaultImage;
const i18n=require('../../../../../i18n/i18n')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultImage,filter_active,
    id: '',
    info: '',
    ProductType: [],//产品类型
    language: '',
    choosetype: [],//选择类别数组
    parentarr: [],//临时判断选中的父类
    name: '',//产品中文名称
    nameEn: '',//YY英文名称
    cover_image: '',//封面图
    imagesrc: [],//图集
    introduction: '',//中文介绍
    introductionEn: '',//英文介绍
    ismask: false,
    zdycs: [],
    infoarray: [],
    region: ['', '', ''],
    customItem: '全部',
    typebody: [],
    typedefaults: [],
    company: '',
    companyEn: '',
    uploadImage: "",
    uploadImages: [],
    icon_delete: icon_delete,
    default_checkbox_checked,
    default_checkbox_no_chekced,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      label: {
        productType: getString('wp', 'app.meinfo.room.productType'),
        ZHName: getString('wp', 'app.btn.ZHName'),
        ENName: getString('wp', 'app.btn.ENName'),
        img: getString('wp', 'app.btn.img'),
        ZHIntroller: getString('wp', 'app.btn.ZHIntroller'),
        ENIntroller: getString('wp', 'app.btn.ENIntroller'),
        coverImg: getString('wp', 'app.btn.coverImg'),
        cancel: getString('wp', 'app.btn.cancel'),
        save: getString('wp', 'app.btn.save'),
        remove: getString('wp', 'app.info.remove'),
        upload: getString('wp', 'app.info.upload'),
        choosed: getString('wp', 'app.info.choosed'),
        photo: getString('exhibitors_index', 'app.info.photo'),
        shoot: getString('exhibitors_index', 'app.info.shoot'),
        album: getString('exhibitors_index', 'app.info.album'),
      }
    })
    this.initinfo()
    //获取类别
    this.gettype()
    if (options.id) {
      this.id = options.id
      this.detail()
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.title.editpro')
      })
    } else {
      wx.setNavigationBarTitle({
        title: getString('exhibitors_index', 'app.title.addpro')
      })
    }
    // 判断语言类型
    var language = wx.getStorageSync('lang')
    this.setData({
      language: language
    })

  },
  initinfo() {
    var that = this
    //获取展商信息
    wx.request({
      url: app.globalData.host + '/api3/supplier/detail/' + wx.getStorageSync('userInfo').id,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          var info = res.data.result
          that.setData({
            company: info.company,
            companyEn: info.companyEn

          })
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })


    //获取后台设置字段
    var companyId = wx.getStorageSync('activityDetail').companyId
    var userId = wx.getStorageSync('userInfo').id
    wx.request({
      url: app.globalData.host + '/cg/${companyId}/match/${userId}/v1/queryRegistration/',
      method: 'POST',
      data: {
        accessToken: wx.getStorageSync('token'),
        timeStamp: (new Date()).getTime(),
        src: 2,
        projectId: wx.getStorageSync('activityDetail').id
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
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
          for (var i = 0; i < that.data.zdycs.length; i++) {
            var key = that.data.zdycs[i].nameKey
            var type = that.data.zdycs[i].type
            if ((type == 1 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == 'name'))) {
              type = 1
            } else if ((type == 2 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "introduction" || key == "introductionEn"))) {
              type = 2
            } else if (type == 3 && that.data.typedefaults.length == 0) {
              type = 3
            } else if (type == 4 && that.data.typedefaults.length == 0) {
              type = 4
            } else if ((type == 5 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "cover_image" || key == "product_image1" || key == "product_image2"))) {
              type = 5
            } else if (type == 6 || key == "cpc") {
              type = 6
            } else if (type == 7 || key == "tags") {
              type = 7
            } else if (type == 8 || key == "video") {
              type = 8
            }
            if (that.data.language != 'en') {
              if (key == "supplier_id") {
                // var _this = this
                // var name = that.data.zdycs[i].nameZh
                // wx.request({
                //   url: app.globalData.host + '/api3/supplier/detail/'+wx.getStorageSync('userInfo').id,
                //   method: 'GET',
                //   header: {
                //     'Content-Type': 'application/json'
                //   },
                //   success: function (res) {
                // 	  console.log(res)
                //     if (res.data.code=='0') {
                //       var  info=res.data.result
                // 	  that.data.infoarray.push({name:name,value:info.company,type:type,defaults:'',nameKey:key})
                //     } else {

                //     }
                //   },
                //   fail: function (error) {
                //     console.log(error)
                //   }
                // })
                that.data.infoarray.push({
                  name: that.data.zdycs[i].nameZh,
                  value: that.data.company,
                  type: type,
                  defaults: '',
                  nameKey: key
                })
                // that.data.infoarray.push({name:that.data.zdycs[i].nameZh,value:wx.getStorageSync('userInfo').company,type:type,defaults:'',nameKey:key})

              } else {
                that.data.infoarray.push({
                  name: that.data.zdycs[i].nameZh,
                  value: '',
                  type: type,
                  defaults: '',
                  nameKey: key
                })
              }
            } else {
              if (key == "supplier_id") {

                that.data.infoarray.push({
                  name: that.data.zdycs[i].nameEn,
                  value: that.data.companyEn,
                  type: type,
                  defaults: '',
                  nameKey: key
                })
              } else {
                that.data.infoarray.push({
                  name: that.data.zdycs[i].nameEn,
                  value: '',
                  type: type,
                  defaults: '',
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
          // that.initinfo3()
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })


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
  gettype() {
    var that = this
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
          if (that.id != '') {
            that.detail()
          }
        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
    })
  },
  detail() {
    var that = this
    var url = app.globalData.host + '/api3/exhibit/detail/' + this.id;
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
          that.setData({
            info: res.data.result,
            name: res.data.result.name,//产品中文名称
            nameEn: res.data.result.nameEn,//YY英文名称
            cover_image: res.data.result.cover_image,//封面图
            imagesrc: res.data.result.productImage,//图集
            introduction: res.data.result.introduction,//中文介绍
            introductionEn: res.data.result.introductionEn,//英文介绍
            choosetype: res.data.result.tags.split(',')
          })
          // this.data.imagesrc = this.data.imagesrc.push(this.data.cover_image)
          for (var i = 0; i < that.data.ProductType.length; i++) {
            for (var j = 0; j < that.data.ProductType[i].subclass.length; j++) {
              if (that.data.choosetype.indexOf(that.data.ProductType[i].subclass[j].id) != -1) {
                that.data.ProductType[i].subclass[j].checked = true
              }
            }
          }
          var ProductType = that.data.ProductType
          that.setData({ProductType})
          console.log(that.data.ProductType)
          console.log(that.data.choosetype)

          that.data.infoarray = []
          for (var i = 0; i < that.data.zdycs.length; i++) {
            var key = that.data.zdycs[i].nameKey
            var type = that.data.zdycs[i].type
            if ((type == 1 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == 'name'))) {
              type = 1
            } else if ((type == 2 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "introduction" || key == "introductionEn"))) {
              type = 2
            } else if (type == 3 && that.data.typedefaults.length == 0) {
              type = 3
            } else if (type == 4 && that.data.typedefaults.length == 0) {
              type = 4
            } else if ((type == 5 && that.data.typedefaults.length == 0) || (that.data.typebody.length == 0 && (key == "cover_image" || key == "product_image1" || key == "product_image2"))) {
              type = 5
            } else if (type == 6 || key == "cpc") {
              type = 6
            } else if (type == 7 || key == "tags") {
              type = 7
            } else if (type == 8 || key == "video") {
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
                  if (key == "supplier_id") {
                    // var _this = this
                    // var name = that.data.zdycs[i].nameZh
                    // wx.request({
                    //   url: app.globalData.host + '/api3/supplier/detail/'+wx.getStorageSync('userInfo').id,
                    //   method: 'GET',
                    //   header: {
                    //     'Content-Type': 'application/json'
                    //   },
                    //   success: function (res) {
                    // 	  console.log(res)
                    //     if (res.data.code=='0') {
                    //       var  info=res.data.result
                    // 	  that.data.infoarray.push({name:name,value:info.company,type:type,defaults:'',nameKey:key})
                    //     } else {

                    //     }
                    //   },
                    //   fail: function (error) {
                    //     console.log(error)
                    //   }
                    // })
                    that.data.infoarray.push({
                      name: that.data.zdycs[i].nameZh,
                      value: that.data.company,
                      type: type,
                      defaults: '',
                      nameKey: key
                    })
                  } else {
                    that.data.infoarray.push({
                      name: that.data.zdycs[i].nameZh,
                      value: info[key],
                      type: type,
                      defaults: defaults,
                      nameKey: key
                    })
                  }

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

                  if (key == "supplier_id") {
                    // var _this = this
                    // var name = that.data.zdycs[i].nameZh
                    // wx.request({
                    //   url: app.globalData.host + '/api3/supplier/detail/'+wx.getStorageSync('userInfo').id,
                    //   method: 'GET',
                    //   header: {
                    //     'Content-Type': 'application/json'
                    //   },
                    //   success: function (res) {
                    // 	  console.log(res)
                    //     if (res.data.code=='0') {
                    //       var  info=res.data.result
                    // 	  that.data.infoarray.push({name:name,value:info.companyEn,type:type,defaults:'',nameKey:key})
                    //     } else {

                    //     }
                    //   },
                    //   fail: function (error) {
                    //     console.log(error)
                    //   }
                    // })
                    that.data.infoarray.push({
                      name: that.data.zdycs[i].nameEn,
                      value: that.data.companyEn,
                      type: type,
                      defaults: '',
                      nameKey: key
                    })
                  } else {
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

          }
          var aaa = []
          for (var m = 0; m < that.data.infoarray.length; m++) {
            aaa.push(that.data.infoarray[m].name)
          }
          console.log(aaa)
          for (var i = 0; i < that.data.zdycs.length; i++) {
            var key = that.data.zdycs[i].nameKey
            var type = that.data.zdycs[i].type
            if (type == 1 || key == 'company' || key == 'company' || key == "companyEn" || key == "contact" || key == "contactEn" || key == "email" || key == "website" || key == "boothNumber" || key == "mobilePhone" || key == "job" || key == "jobEn") {
              type = 1
            } else if (type == 2 || key == "introduction" || key == "introductionEn") {
              type = 2
            } else if (type == 3 || key == "expo") {
              type = 3
            } else if (type == 4 || key == "hall_number" || key == "nature" || key == "industry") {
              type = 4
            } else if (type == 5 || key == "portrait") {
              type = 5
            } else if (type == 6 || key == "cpc") {
              type = 6
            } else if (type == 7 || key == "tags") {
              type = 7
            } else if (type == 8 || key == "video") {
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
          //设置 uploadImages
          var uploadImages = []
          if (that.data.info.product_image1) {
            uploadImages.push(that.data.info.product_image1)
          }
          if (that.data.info.product_image2) {
            uploadImages.push(that.data.info.product_image2)
          }
          that.setData({
            infoarray: that.data.infoarray,
            uploadImages
          })
          if (!that.data.info.cover_image) {
            that.data.info.cover_image = that.data.info.product_image1 || that.data.info.product_image2
          }
          that.selectComponent("#treeProductType").setValues4Tree(that.data.info.tags)

        } else {

        }
      },
      fail: function (error) {
        console.log(error)
      }
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
  radioChange1: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var value = `infoarray[${index}].value`;
    console.log(e)
    this.setData({
      [value]: e.detail.value
    })
  },
  checkboxchoose: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index
    var value = `infoarray[${index}].value`;
    console.log(e)
    this.setData({
      [value]: e.detail.value.join(',')
    })
    console.log(this.data.infoarray)
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
  uploadimg() {
    console.log('11')
    this.setData({
      ismask: true
    })
  },
  cancel() {
    this.setData({
      ismask: false
    })
  },
  bindZHNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindEHNameInput: function (e) {
    this.setData({
      nameEn: e.detail.value
    })
  },
  bindintroInput: function (e) {
    this.setData({
      introduction: e.detail.value
    })
  },
  bindinforenInput: function (e) {
    this.setData({
      introductionEn: e.detail.value
    })
  },
  removeimg() {
    this.setData({
      imagesrc: [],
      cover_image: ''
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
  //上传图片
  album() {
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: (res) => {
        console.log(res,"uuuuuuuuuuuuuuuuuu");
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
                var path = JSON.parse(res.data).result
                this.setData({
                  ismask: false
                })
                console.log(path,"ttttttttttttttttt");
                if (this.data.imagesrc.length < 3 && this.data.cover_image == '') {
                  this.setData({
                    imagesrc: this.data.imagesrc.concat(path)
                  });
                } else if (this.data.imagesrc.length < 2 && this.data.cover_image != '') {
                  this.setData({
                    imagesrc: this.data.imagesrc.concat(path)
                  });
                } else {
                  var tip = ''
                  if (that.data.language != 'en') {
                    tip = '图集最多上传3张，可先选一张做封面'
                  } else {
                    tip = 'no more than three'
                  }
                  wx.showToast({
                    title: tip,
                    icon: 'none',
                    duration: 1000
                  })
                }
                console.log(this.data.imagesrc)

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
                  ismask: false
                  // imagesrc:[]
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
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: (res) => {
        console.log(res,"666666666666666")
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
              console.log(res,"uuuuuuuuuuuuu")
              if (JSON.parse(res.data).code == '0') {
                var path = JSON.parse(res.data).result
                this.setData({
                  ismask: false
                })
                if (this.data.imagesrc.length < 3 && this.data.cover_image == '') {
                  this.setData({
                    imagesrc: this.data.imagesrc.concat(path)
                  });
                } else if (this.data.imagesrc.length < 2 && this.data.cover_image != '') {
                  this.setData({
                    imagesrc: this.data.imagesrc.concat(path)
                  });
                } else {
                  var tip = ''
                  if (that.data.language != 'en') {
                    tip = '图集最多上传3张，可先选一张做封面'
                  } else {
                    tip = 'no more than three'
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
                  ismask: false
                  // imagesrc:[]
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
  radioChange: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.index)
    var cover = this.data.cover_image
    this.data.cover_image = this.data.imagesrc[e.currentTarget.dataset.index]
    if (cover != '') {
      this.data.imagesrc[e.currentTarget.dataset.index] = cover
    }

    var data1 = this.data.cover_image
    var data2 = this.data.imagesrc
    // this.setData({
    // 	cover_image:data1,
    // 	imagesrc:data2
    // })
    console.log(this.data.cover_image)
    console.log(this.data.imagesrc)
  },
  changeName(e) {
    var name = e.detail.value
    this.setData({
      name
    })
  },
  changeNameEn(e) {
    var nameEn = e.detail.value
    this.setData({
      nameEn
    })
  },
  editsave() {
    console.log(this.data.cover_image)
    console.log(this.data.imagesrc)
    if (this.data.imagesrc.indexOf(this.data.cover_image) != -1) {
      this.data.imagesrc.splice(this.data.imagesrc.indexOf(this.data.cover_image), 1)
    }
    console.log(this.data.imagesrc)
    console.log(this.data.infoarray)
    let object = {}
    for (var i = 0; i < this.data.infoarray.length; i++) {
      let keyX = this.data.infoarray[i].nameKey
      object[keyX] = this.data.infoarray[i].value
      if (keyX == "tags") {
        object[keyX] = this.data.choosetype.join(',')
      } else if (keyX == "cover_image") {
        object[keyX] = this.data.cover_image
      } else if (keyX == "product_image1") {
        if (this.data.imagesrc.length > 0) {
          object[keyX] = this.data.imagesrc[0]
        } else {
          object[keyX] = ''
        }
      } else if (keyX == "product_image2") {
        if (this.data.imagesrc.length > 1) {
          object[keyX] = this.data.imagesrc[1]
        } else {
          object[keyX] = ''
        }
      } else if (keyX == "supplier_id") {
        if (this.data.language != 'en') {
          object[keyX] = wx.getStorageSync('userInfo').id
        } else {
          object[keyX] = wx.getStorageSync('userInfo').id
        }

      }
    }
    console.log(object)
    // if(object.product_image1==''){
    //  delete object.product_image1
    // }
    // if(object.product_image2==''){
    // 			 delete object.product_image2
    // }
    // return
    var that = this
    // if (that.data.name== ''){
    //   wx.showToast({
    //     title: '请输入产品名称',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.nameEN== ''){
    //   wx.showToast({
    //     title: '请输入产品英文名称',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.introduction== ''){
    //   wx.showToast({
    //     title: '请输入产品介绍',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else if (that.data.introductionEn== ''){
    //   wx.showToast({
    //     title: '请输入产品英文介绍',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false
    // }else{
    var url = ''
    if (this.id != '') {
      url = app.globalData.host + '/api3/exhibit/update/' + this.id
    } else {
      object['project_id'] = wx.getStorageSync('activityDetail').id
      url = app.globalData.host + '/api3/exhibit/add/' + wx.getStorageSync('userInfo').id
    }
    var that = this
    //如果封面还是没有 默认使用 productImage1
    object.product_image1 = this.data.uploadImages[0] || ""
    object.product_image2 = this.data.uploadImages[1] || ""
    if (!object.cover_image) {
      object.cover_image = object.product_image1 || object.product_image2
    }
    object.tags = this.selectComponent("#treeProductType").getTags4post()
    object.introduction = this.data.introduction
    object.introduction_en = this.data.introductionEn
    // object.hall_number=this.data.info.hall_number
    object.supplier_id = this.data.info.supplier_id
    object.name_en = this.data.nameEn
    object.name = this.data.name
    // object.company=this.data.info.company
    // object.companyEn=this.data.info.companyEn
    object.id = this.data.info.id
    wx.request({
      url: url,
      method: 'POST',
      // data:{
      // 	name:that.data.name,
      // 	name_en:that.data.nameEN,
      // 	introduction:that.data.introduction,
      // 	introduction_en:that.data.introductionEn,
      // 	cover_image:that.data.cover_image,
      // 	product_image1:that.data.imagesrc[0],
      // 	product_image2:that.data.imagesrc[1],
      // tags:that.data.choosetype.join(',')
      // },
      data: object,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '0') {
          if (that.id != '') {
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
          } else {
            var tip = ''
            if (that.data.language != 'en') {
              tip = '添加成功'
            } else {
              tip = 'add success'
            }
            wx.showToast({
              title: tip,
              icon: 'none',
              duration: 1000
            })
          }
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
  changetreeProductType(e) {
    var tags = e.detail
    this.setData({
      tags
    })
    getCurrentPage1().setData({
      tags
    })
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
  finishUpload(e) {
    var path = e.detail
    if (!path) return false
    var uploadImages = this.data.uploadImages
    uploadImages.push(path)
    this.setData({
      uploadImages: uploadImages
    })
    getCurrentPage1().setData({
      uploadImages: uploadImages
    })
  },
  deleteImage(e) {
    var imageIndex = e.currentTarget.dataset.imageindex
    this.data.uploadImages.splice(imageIndex, 1)
    this.setData({
      uploadImages: this.data.uploadImages
    })
    getCurrentPage1().setData({
      uploadImages: this.data.uploadImages
    })
  },
  selectImage(e) {
    var imageIndex = e.currentTarget.dataset.imageindex
    this.setData({
      cover_image: this.data.uploadImages[imageIndex]
    })
    getCurrentPage1().setData({
      cover_image: this.data.uploadImages[imageIndex]
    })
  },
  changeintroducton(e) {
    var value = e.detail.value
    this.setData({
      introduction: value
    })
    getCurrentPage1().setData({
      introduction: value
    })
  },
  changeintroductonen(e) {
    var value = e.detail.value
    this.setData({
      introductionEn: value
    })
    getCurrentPage1().setData({
      introductionEn: value
    })
  },
})