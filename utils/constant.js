Object.defineProperty(exports, "__esModule", {
  value: !0
});

// 首页 1,参展商页面 2,采购商页面 3
exports.ROLE_TYPE = {
  INDEX: 1,
  EXHIBITOR: 2,
  PURCHASER: 3,
};

//移动端中文（小程序、H5）1,移动端英文（小程序、H5）2,PC端中文3、PC端英文 4
exports.LANG_TYPE = {
  mobile_zh_CN: 1,
  mobile_en: 2,
};




// exports.API_URL = 'https://xgys.coolgua.com/api3';
// exports.API_URL_V1 = 'https://xgys.coolgua.com/v1';
// exports.API_URL_V2 = 'https://xgys.coolgua.com'

exports.API_URL = 'https://live.signchinashow.com/api3';
exports.API_URL_V1 = 'https://live.signchinashow.com/v1';
exports.API_URL_V2 = 'https://live.signchinashow.com'



const staticImgUrl = 'https://www.coolgua.net/match_img'

exports.STATIC_IMAGE_URL = staticImgUrl
const staticDefaultImg = staticImgUrl + '/img/default/'

exports.STATIC_DEFAULT_IMAGE_NAME = {
  demand: `${staticDefaultImg}demand.png`,
  exhibitor: `${staticDefaultImg}exhibitor.png`,
  product: `${staticDefaultImg}product.png`,
  purchaser: `${staticDefaultImg}purchaser.png`
}
exports.LIVE_STATUS_TEXT = {
  101: "直播中",
  102: "未开始",
  103: "已结束",
  104: "禁播",
  105: "暂停钟",
  106: "异常",
  107: "已过期",
}

// https://www.coolgua.net/match_img/img/icon_xiaoxi@2x.png
// https://www.coolgua.net/match_img/img/icon_shipin@2x.png

exports.COMPANY_ID = '395'


// 栏目类型1：网页，2：地图插件，3：小瓜报名 4:友情链接 5:配套活动
exports.COLUMN_TYPE = {
  WEBVIEW: 1,
  FRIENDSHIP_LINKS: 4,
  SUPPORTING_ACTIVITY: 5
}
// exports.appId= 'wxfa01022b9c440b18' // 种茂通
exports.appId = 'wxcd1b215df7c6db13' // 小瓜
// exports.appId= 'wxaba44b6d8537b2f1' //中外洽谈

//小程序提示模板id
exports.templateId = 'MIzUhFxTwmVczitN0csYm67HytwSXPfb1q6tnnKDgzQ'

// 腾讯云 SDKAppID
exports.SDKAppID = 1400395060 //测试 小瓜云
// exports.SDKAppID=1400392652 //中外洽谈
// exports.SDKAppID=1400372526 //正式