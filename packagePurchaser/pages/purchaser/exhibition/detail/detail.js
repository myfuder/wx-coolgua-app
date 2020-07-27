//index.js
//获取应用实例
const app = getApp();
let _self = null;
let api = require("../../../../../utils/api"),
  constant = require("../../../../../utils/constant"),
  i18n = require('../../../../../i18n/i18n.js'),
  storage = require("../../../../../utils/storage.js"),
  util = require("../../../../../utils/util"),
  phone = require('../../../../../utils/phone');
const {defaultUserImage} =require('../../../../../common/staticImageContants')
Page({
  data: {
    exhibitList: [],
    exhibits: [],
    id: null,
    detailInfo: {},
    exhibitData: [],
    staticImageUrl: constant.STATIC_IMAGE_URL,
    live: '',
    liveUrl: '',
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    uhide: 0,
    company:'',
    liveList:[]
  },
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
  // 初始化数据
  initData: function () {
    (0, api.getSupplierDetail)({
      query: {
        id: _self.data.id,
      },
      method: 'GET',
      success: function (res) {
        const data = {
          ...res.data.result,
          hot: res.data.resultEx.hot,
          num:res.data.resultEx.num,
          name: res.data.result.company,
          coverImage: util.isNullStr(res.data.result.portrait) ? '' : res.data.result.portrait
        };
        _self.setData({
          company:data.company,
          detailInfo: data,
          exhibitList: [data]
        })
        _self.getListData(_self.data.detailInfo.projectId)
        _self.getExhibitsById()
      }
    });
  },
  getExhibitsById: function () {
    (0, api.getExhibitsById)({
      query: {
        id: _self.data.id
      },
      method: 'GET',
      success: function (res) {
        _self.setData({
          exhibitData: res.data.result
        })
      }
    })
  },
  call: function (e) {
    phone.call(e.currentTarget.dataset.id)
  },
  intentMore() {
    wx.navigateTo({
      url: '/packagePurchaser/pages/purchaser/index/hot-video/hot-video',
    })
  },
  toLiveDetailPage: function (e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/index/hot-detail/hot-detail?id=${e.currentTarget.dataset.id}&type=${e.currentTarget.dataset.type}&live_type=${e.target.dataset.live_type}`,
    })
  },
  goDetailPage: function(e) {
    wx.navigateTo({
      url: `/packagePurchaser/pages/purchaser/exhibits/detail/detail?id=${e.currentTarget.dataset.id}`,
    })
  },
  getListData: function (projectId) {
    let _self = this;
    (0, api.getLiveList)({
      query: {
        id: projectId
      },
      data: {
        pageNum: 1,
        pageSize: 2
      },
      success: function (res) {
        console.log(res)
        _self.setData({
          liveList:res.data.result.data
        })
      }
    });
    
  },
  //点击图片查看大图
	wxParseImgTap:function(event) {
		var that = this;
		//点击详情页图片查看大图，列表页跳转详情页
    var nowImgUrl = event.target.dataset.src;
    var imageUrls=[]
    imageUrls.push(nowImgUrl)
    var tagFrom = event.target.dataset.from;
    console.log(nowImgUrl,imageUrls)
    if (typeof (tagFrom) != 'undefined' && tagFrom.length > 0) {
      wx.previewImage({
        current: nowImgUrl, // 当前显示图片的http链接
        urls: imageUrls // 需要预览的图片http链接列表
      })
    }
	},
  onLoad: function (options) {
    
    _self = this
    _self.setData({
      id: options.id,
      staticImageUrl: constant.STATIC_IMAGE_URL,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    },()=>{
      wx.setNavigationBarTitle({
        title: this.data.langTranslate['展商详情'],
      });
    })
    _self.initData()
  },
  onShow: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      imageUrl:this.data.detailInfo&&this.data.detailInfo.portrait||defaultUserImage,
      title: that.data.company,
      path: '/packagePurchaser/pages/purchaser/exhibition/detail/detail?id=' + that.data.id,
      success(status) {
        console.log(status)
      }
    }
  }
})