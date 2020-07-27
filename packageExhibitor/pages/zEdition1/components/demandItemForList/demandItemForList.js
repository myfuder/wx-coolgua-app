/*商机需求*/
import {defaultUserImage, fireImage} from "../../../../../common/staticImageContants";

const i18n = require('../../../../../i18n/i18n')
Component({
  properties: {
    item: {type: Object}
  },
  data: {
    fireImage,
    defaultUserImage,
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn()
  },
  methods: {
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
  }
});
