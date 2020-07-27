/*商机需求*/
import {defaultUserImage} from "../../../../../common/staticImageContants";

const i18n = require('../../../../../i18n/i18n')
Component({
  properties: {item: {type: Object}},
  data: {
    defaultUserImage: defaultUserImage,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate()
  },
  methods: {
    previewImage() {
      wx.previewImage({
        current: 0,
        urls: [this.data.item.portrait]
      })
    },
  }
});
