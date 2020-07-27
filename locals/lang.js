import exhibitorsIndex1 from "./zh-CN/exhibitors_index";
import exhibitorsIndex2 from "./en-US/exhibitors_index";

import wp1 from "./zh-CN/wp";
import wp2 from "./en-US/wp";

export const getString = (model, key) => {
  let lang = wx.getStorageSync('lang')
  // console.warn("getString国际化：", lang)
  if(lang=='en') {
    switch (model) {
      case 'exhibitors_index':
        return exhibitorsIndex2[key]
      case 'wp':
        return wp2[key]
      default:
        break;
    }
  } else {
    switch (model) {
      case 'exhibitors_index':
        return exhibitorsIndex1[key]
      case 'wp':
        return wp1[key]
      default:
        break;
    }
  }
}