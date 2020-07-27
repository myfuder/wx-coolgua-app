import {icon_delete, icon_image_upload} from "../../../../../common/staticImageContants";
import {uploadImage} from "../../../../../utils/util";
const i18n=require('../../../../../i18n/i18n')
Component({
  properties: {},
  data: {
    icon_image_upload,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate(),
  },
  methods: {
    uploadImage() {
      uploadImage().then(path => {
        this.triggerEvent("finish", path)
      })
    }
  }
});
