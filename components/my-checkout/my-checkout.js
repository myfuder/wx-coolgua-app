import {filter_active,default_checkbox_checked, default_checkbox_no_chekced} from "../../common/staticImageContants";

let constant = require("../../utils/constant");
Component({
  properties: {
    checked: {
      type: Boolean
    },
    title: {
      type: String
    }
  },
  data: {
    staticImageUrl: constant.STATIC_IMAGE_URL,
    default_checkbox_checked, default_checkbox_no_chekced,filter_active
  },
  methods: {
    bindchangecheckout() {
      this.triggerEvent('changecheckout', !this.properties.checked)
    }
  }
});
