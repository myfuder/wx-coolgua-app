import {default_product_image, fireImage} from "../../../../../common/staticImageContants";

const i18n = require('../../../../../i18n/i18n')
Component({
  properties: {item: {type: Object}},
  data: {
    default_product_image,
    fireImage,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate()
  },
  methods: {
    go2productdetail() {
      wx.navigateTo({
        url: `/packageExhibitor/pages/zEdition1/product/detail/detail?id=${this.properties.item.id}`
      })
    }
  }
});
