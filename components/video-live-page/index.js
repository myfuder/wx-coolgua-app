// components/video-live-page/index.js

const {  live_play_normal } = require('../../common/staticImageContants');
let i18n = require("../../i18n/i18n");
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {

    width: { type: String, value: '' },

    height: { type: String, value: '' },

    page_img:{type:String,value:''},

    play_custom: { type: String, value: '' },

    play_img: { type: String, value: live_play_normal},

    live_name: { type: String, value: ''},

    is_live: { type: Boolean, value: true},

    live_number:{type:Number,value:0}
  },

  /**
   * 组件的初始数据
   */
  data: {
    langTranslate: i18n.langTranslate(),
    isEn: i18n.isEn(),
  },
  attached: function () {
    this.setData({
      langTranslate: i18n.langTranslate(),
      isEn: i18n.isEn(),
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
