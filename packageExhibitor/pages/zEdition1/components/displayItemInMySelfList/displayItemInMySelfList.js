import {collect_default, like_default} from "../../../../../common/staticImageContants";

const i18n = require('../../../../../i18n/i18n')
Component({
  properties: {item: {type: Object}},
  data: {
    collect_default,
    like_default,
    langIsEn: i18n.isEn(),
    langTranslate: i18n.langTranslate()
  },
  methods: {}
});
