const {defaultUserImage} = require('../../common/staticImageContants');
const i18n = require('../../i18n/i18n.js');
Component({
  properties: {
    item: {
      type: Object
    },
    status: {
      type: [undefined, Boolean]
    },
    type: {
      type: [undefined, Number, String]
    }
  },
  data:{
    defaultUserImage: defaultUserImage,
    langTranslate: i18n.langTranslate(),
  },
  attached:function(){
    // console.log(this.properties.item,'666666666')
  },
  methods: {
  }
});
