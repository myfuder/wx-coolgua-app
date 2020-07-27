function getLanguage() {
  //返回缓存中的language属性 (zh_CN/en)
  return wx.getStorageSync('lang') || 'zh_CN'
};
function translate() {
  //返回翻译的对照信息
  return require('langs/' + getLanguage() + '.js').languageMap;
}
function translateTxt(desc) {
  //翻译
  return translate()[desc] || '竟然没有翻译';
}
function isEn() {
  return getLanguage() === 'en'
}
module.exports = {
  getLanguage: getLanguage,
  langTranslate: translate,
  translateTxt: translateTxt,
  isEn: isEn
}
