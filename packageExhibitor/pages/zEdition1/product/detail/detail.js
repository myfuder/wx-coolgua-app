import {API_URL} from "../../../../../utils/constant";
import {ajax} from "../../../../../utils/util";
import {
  defaultUserImage,
  delete_icon_image,
  edit_icon_image,
  icon_share
} from "../../../../../common/staticImageContants";

const i18n=require('../../../../../i18n/i18n')
const storage = require('../../../../../utils/storage')
Page({
  data: {
    id: "",
    height: wx.getSystemInfoSync().screenHeight,
    detail: {},
    edit_icon_image,
    delete_icon_image,
    icon_share,
    isUser: false,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate(),
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  onShow() {
    this.getDetail()
  },
  go2delete() {
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.showLoading()
          ajax.get(`${API_URL}/exhibit/del/${self.data.detail.id}`).then(res => {
            wx.hideLoading()
            wx.navigateBack({delta: -1})
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  go2edit() {
    wx.navigateTo({
      url: `/packageExhibitor/pages/zEdition1/product/edit/index?id=${this.data.detail.id}`
    })
  },
  async getDetail() {
    wx.showLoading()
    var result = await ajax.get(API_URL + `/exhibit/detail/${this.data.id}`)
    if (result.code != 0) {
      return false
    }
    wx.hideLoading()
    var detail = result.result
    if (detail.supplierId == storage.getUserInfo().id) {
      var isUser = true
    } else {
      var isUser = false
    }
    this.setData({
      detail, isUser
    })
  },
  onShareAppMessage() {
    return {
      title: `【${this.data.detail.name}】  ${this.data.detail.introduction}`,
      path: `/packageExhibitor/pages/zEdition1/product/detail/detail?id=${this.data.id}`,
      imageUrl: this.data.detail.cover_image || defaultUserImage
    }
  },
  zoomImage() {
    var nowImgUrl=[this.data.detail.cover_image,this.data.detail.product_image1,this.data.detail.product_image2]
    nowImgUrl=nowImgUrl.filter(item=>item!='')
    wx.previewImage({
      current: 0, // 当前显示图片的http链接
      urls: nowImgUrl // 需要预览的图片http链接列表
    })
  }
})