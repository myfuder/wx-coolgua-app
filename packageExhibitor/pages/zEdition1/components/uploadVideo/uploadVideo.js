import {icon_delete, icon_image_upload} from "../../../../../common/staticImageContants";
import {uploadImage, uploadVideo} from "../../../../../utils/util";
const i18n =require('../../../../../i18n/i18n')
Component({
  properties: {
    video: {
      observer(value) {
        this.setData({
          videoFile: value,
        })
      },
      type: [String]
    },

  },
  data: {
    icon_image_upload,
    videoFile: "",
    icon_delete,
    isEn: i18n.isEn(),
    langTranslate: i18n.langTranslate(),
  },
  methods: {
    uploadVideo() {
      var self = this
      uploadVideo().then(path => {
        self.setData({
          videoFile: path
        })
        this.triggerEvent("finish", path)
      })
    },
    deleteVideo() {
      var self = this
      wx.showModal({
        content: "确定要删除视频吗",
        title: "提示",
        success: function (res) {
          console.log(res);
          if (res.confirm) {
            self.setData({
              videoFile: ""
            })
            self.triggerEvent("finish", "")
          } else {
          }
        }
      })
    },
  }
});
