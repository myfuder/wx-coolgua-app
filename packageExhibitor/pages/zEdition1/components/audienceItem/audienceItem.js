import {defaultUserImage, fireImage} from "../../../../../common/staticImageContants";

const i18n = require('../../../../../i18n/i18n');
const constant = require('../../../../../utils/constant')
Component({
  attached() {
    this.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    })
  },
  properties: {
    item: {
      type: Object,
    }
  },
  data: {
    defaultUserImage,
    fireImage,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate(),
    seeMoreShow: false,
    moreTags: [],
    staticImageUrl: constant.STATIC_IMAGE_URL,
  },
  methods: {
    zoomImage(e) {
      var imageurl = e.currentTarget.dataset.imageurl
      wx.previewImage({
        current: 0, // 当前显示图片的http链接
        urls: [imageurl] // 需要预览的图片http链接列表
      })
    },
    seeMoreClick() {
      var tagNames = JSON.parse(JSON.stringify(this.properties.item.tagNames));
      var moreTags = tagNames.splice(10, tagNames.length)
      this.setData({
        moreTags,
        seeMoreShow: !this.data.seeMoreShow
      })
    },
    invitation: function () {
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/purchaser/invitation/invitation'
      })
    },
    detailClick() {
      if (this.data.list != '') {
        let item = this.properties.item
        wx.navigateTo({
          // url: `/packageExhibitor/pages/zEdition1/purchaser/detail/index?id=${item.id}&purchaserId=${item.purchaserId}&projectId=${item.projectId}`,
          url: `/packageExhibitor/pages/zEdition1/purchaser/detail/index?purchaserId=${item.id}&projectId=${item.projectId}`,
        })
      }
    },
  }
});
