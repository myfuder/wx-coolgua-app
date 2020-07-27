/*商机需求*/
import {defaultUserImage, fireImage} from "../../../../../common/staticImageContants";
const constant=require('../../../../../utils/constant');
const i18n = require('../../../../../i18n/i18n');
Component({
  properties: {
    item: {type: Object}
  },
  data: {
    fireImage,
    defaultUserImage,
    langIsEn: i18n.isEn(),
    langTranslate: i18n.langTranslate(),
    staticImageUrl:constant.STATIC_IMAGE_URL,
    seeMoreShow: false,
    moreTags: [],
  },
  methods: {
    seeMoreClick(){
      var tagNames = JSON.parse(JSON.stringify(this.properties.item.tagNames));
      var moreTags = tagNames.splice(8, tagNames.length)
      this.setData({
        moreTags,
        seeMoreShow: !this.data.seeMoreShow
      })
    },
    go2demandDetail() {
      var item = this.properties.item
      wx.navigateTo({
        url: `/packageExhibitor/pages/zEdition1/demand/detail/index?id=${item.id}`,
      })
    },
    go2purchaser() {
      var item = this.properties.item
      wx.navigateTo({
        url: `/packageExhibitor/pages/zEdition1/purchaser/detail/index?purchaserId=${item.purchaserId}&projectId=${item.projectId}`,
      })
    },
    zoomImage(e) {
      var imageurl = e.currentTarget.dataset.imageurl
      wx.previewImage({
        current: 0, // 当前显示图片的http链接
        urls: [imageurl] // 需要预览的图片http链接列表
      })
    },
  }
});
