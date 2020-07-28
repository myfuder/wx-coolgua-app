//index.js
//获取应用实例
const app = getApp()
let _self = null;
let api = require("../../../../../utils/api"), constant = require("../../../../../utils/constant"), i18n = require('../../../../../i18n/i18n.js'), storage = require("../../../../../utils/storage.js"), util = require("../../../../../utils/util");
import { icon_share,icon_share_En } from "../../../../../common/staticImageContants";

Page({
  data: { 
    exhibitList: [],
    exhibits: [],
    staticImageUrl: constant.STATIC_IMAGE_URL,
    id: null,
    detailInfo: {},
    productImage: [],
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
    name:'',
    icon_share, icon_share_En
  },
  // 初始化数据
  initData: function(){
    const exhibits = [];
    for(let i = 0; i < 5;i++) {
      exhibits.push({
        id: i
      })
    };
    _self.setData({
      exhibits: exhibits
    });
    (0, api.getExhibitsDetail)({
      query: {
        id: this.data.id
      },
      success: function (res) {
        const detailInfo = {
          ...res.data.result,
          coverImage: util.isNullStr(res.data.result.cover_image) ? '' : res.data.result.cover_image,
          hot: res.data.result.popular,
          hallNumber: res.data.result.hall_number
        };
        _self.setData({
          detailInfo: {
            ...detailInfo
          },
          exhibitList: [detailInfo],
          name:res.data.result.name,
          productImage: res.data.result.productImage
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
    
    this.setData({
      staticImageUrl: constant.STATIC_IMAGE_URL,
      id: options.id,
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn()
    },()=>{
      wx.setNavigationBarTitle({
        title: this.data.langTranslate['展品详情'],
      });
    })
  },
  onShow:function(){
    _self = this
    _self.initData()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      imageUrl:this.data.detailInfo&&this.data.detailInfo.cover_image||this.data.staticImageUrl,
      title: that.data.name,
      path: '/packagePurchaser/pages/purchaser/exhibits/detail/detail?id=' + that.data.id,
      success(status) {
        console.log(status)
      }
    }
  }
})
