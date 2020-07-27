//index.js
//获取应用实例
const app = getApp();
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
Page({
  data: {
    exhibitList: [],
    exhibits: [],
    userInfo: {},
    id: null,
    purchasedGoodsName: '',
    purchasedCount: '',
    purchasedPrice: '',
    material: '',
    images: ['','','',''],
    staticImageUrl: constant.staticImageUrl,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    // 发布需求是否正在提交
    submitting: false
  },
  // 初始化数据
  initData: function(){
    const exhibitList = [];
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
          item.isChecked = false;
          item.subclass.map(childItem => {
            childItem.isChecked = false;
          });
          item.childList = item.subclass;
        })
        _self.setData({
          exhibitList: res.data.result,
          userInfo: storage.getUserInfo()
        })
        if (!util.isNullStr(_self.data.id)) {
          _self.getDetailInfo()
        }
      }

    });
  },
  goDetailPage: function() {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/me/appoint-detail/appoint-detail',
    })
  },
  chooseTap: function(e) {
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
  chooseChildTap: function(e) {
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
  returnPage: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  setPurchasedGoodsName: function(t) {
    var e = t.detail.value;
    this.setData({
      purchasedGoodsName: e
    });
  },
  setPurchasedCount: function(t) {
    var e = t.detail.value;
    this.setData({
      purchasedCount: e
    });
  },
  setMaterial: function(t) {
    var e = t.detail.value;
    this.setData({
      material: e
    });
  },
  uploadPic: function(e) {
    const index = e.currentTarget.dataset.index
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
            console.log(res)
            var data = res.data
            var file = JSON.parse(data)
            if (file.code !== 0 && file.code !== '0') {
              wx.showToast({
                title: '上传失败，请联系管理员',
                icon: 'none'
              })
            } else {
              var path = app.globalData.host +'/'+ file.result
              const imageList = _self.data.images;
              imageList[index] = path
              _self.setData({
                images: imageList
              })
            }
          }
        })
      }
    })
  },
  setPurchasedPrice: function(t) {
    var e = t.detail.value;
    this.setData({
      purchasedPrice: e
    });
  },
  submitTap: function() {
    if (this.data.submitting) {
      return;
    }
    if (util.isNullStr(this.data.purchasedCount) || util.isNullStr(this.data.material) || util.isNullStr(this.data.purchasedGoodsName) || util.isNullStr(this.data.purchasedPrice)) {
      wx.showToast({
        title: '请完善信息再提交',
        icon: 'none'
      });
      return;
    }
    const exhibitList = this.data.exhibitList, list = []
    exhibitList.map(item => {
      item.isChecked ? list.push(item.id) : ''
      item.childList.map(childItem => {
        childItem.isChecked ? list.push(childItem.id) : ''
      })
    });
    if (list.length === 0) {
      wx.showToast({
        title: '请选择需求类型',
        icon: 'none'
      });
      return;
    };

    const image1 = this.data.images[0], image2 = this.data.images[1], image3 = this.data.images[2], image4 = this.data.images[3]
    var imagess=[image1,image2,image3,image4].filter(item=>!util.isNullStr(item))
    // util.isNullStr(image2) || util.isNullStr(image2) || util.isNullStr(image3) || util.isNullStr(image4)
    if (imagess.length<=0) {
      wx.showToast({
        title: '请上传完图片再提交',
        icon: 'none'
      });
      return;
    };
    _self.setData({
      submitting: true
    });
    (0, api.publishDemand)({
      data: {
        id: _self.data.id,
        projectId: storage.getActivityDetail().id,
        purchasedCount: _self.data.purchasedCount,
        purchasedGoodsName: _self.data.purchasedGoodsName,
        material: _self.data.material,
        purchasedPrice: _self.data.purchasedPrice,
        purchaserId: storage.getUserInfo().id,
        types: list.join(','),
        image1: image1,
        image2: image2,
        image3: image3,
        image4: image4,
        status: 0
      },
      method: 'POST',
      success: function (res) {
        wx.showToast({
          title: '发布成功'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      complete: function(res) {
        _self.setData({
          submitting: false
        })
      }
    })
  },
  getDetailInfo: function() {
    (0, api.getDemandDetail)({
      query: {
        id: _self.data.id
      },
      success: function (res) {
        const data = res.data.result, typeIds = data.types.split(','), allTypeIds = _self.data.exhibitList;
        allTypeIds.map(item => {
          let isAllChecked = true
          item.childList.map(childItem => {
            typeIds.indexOf(childItem.id) !== -1 ? childItem.isChecked = true : ''
            if (childItem.isChecked === false) {
              isAllChecked = false
            }
          })
          item.isChecked = isAllChecked
        })
        _self.setData({
          purchasedGoodsName: data.purchasedGoodsName,
          purchasedCount: data.purchasedCount,
          material: data.material,
          purchasedPrice: data.purchasedPrice,
          images: [data.image1, data.image2, data.image3, data.image4],
          exhibitList: allTypeIds
        })
      }
    });
  },
  onLoad: function (options) {
    console.log(options)
    _self = this
    wx.setNavigationBarTitle({
      title: i18n.langTranslate()['发布需求'],
    })
    const id = options.id
    if (!util.isNullStr(id)) {
      _self.setData({
        id: id
      });
      // _self.getDetailInfo()
    }
    _self.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    })
    _self.initData()
  },
  onShow:function(){
    this.setData({
      userInfo:storage.getUserInfo()
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
