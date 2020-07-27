const keyMap = {
  activityDetail: 'activityDetail',
  token: 'token',
  sessionId: 'sessionId',
  userInfo: 'userInfo',
  roleType: 'roleType',
  isRememberPwd: 'isRememberPwd',
  isAutoLogin: 'isAutoLogin',
  password: 'password'
}

// 设置活动详情缓存
function setActivityDetail(data) {
  return wx.setStorageSync(keyMap.activityDetail, data)
}

//返回缓存中的activityDetail属性
function getActivityDetail() {
  return wx.getStorageSync(keyMap.activityDetail) || {}
}

// 设置token
function setToken(data) {
  return wx.setStorageSync(keyMap.token, data)
}

//返回缓存中的token
function getToken() {
  return wx.getStorageSync(keyMap.token) || ''
}

// 设置是否记住密码
function setRememberPwd(data) {
  return wx.setStorageSync(keyMap.isRememberPwd, data)
}

//返回缓存中的记住密码
function getRememberPwd() {
  return wx.getStorageSync(keyMap.isRememberPwd) || false
}

// 设置是否自动登录
function setAutoLogin(data) {
  return wx.setStorageSync(keyMap.isAutoLogin, data)
}

//返回缓存中的记住密码
function getAutoLogin() {
  return wx.getStorageSync(keyMap.isAutoLogin) || false
}

// 设置sessionId
function setSessionId(data) {
  return wx.setStorageSync(keyMap.sessionId, data)
}

//返回缓存中的token
function getSessionId() {
  return wx.getStorageSync(keyMap.sessionId) || ''
}

// 移除sessionId
function removeSessionId(data) {
  return wx.removeStorageSync(keyMap.sessionId)
}

// 设置userInfo
function setUserInfo(data) {
  return wx.setStorageSync(keyMap.userInfo, data)
}

//返回缓存中的userInfo
function getUserInfo() {
  return wx.getStorageSync(keyMap.userInfo) || ''
}

// 设置角色
function setRoleType(data) {
  return wx.setStorageSync(keyMap.roleType, data)
}

//返回缓存中的角色类型
function getRoleType() {
  return wx.getStorageSync(keyMap.roleType) || ''
}

// 设置密码
function setPassword(data) {
  return wx.setStorageSync(keyMap.password, data)
}

//返回缓存中的密码
function getPassword() {
  return wx.getStorageSync(keyMap.password) || ''
}

//设置承诺书 为确定状态
function setAgreePromiseTrue(){
  return wx.setStorageSync("isAgreement",true)
}
function setAgreePromiseFalse(){
  return wx.setStorageSync("isAgreement",false)
}
function getAgreePromise(){
  return wx.getStorageSync("isAgreement")||false
}

module.exports = {
  setActivityDetail: setActivityDetail,
  getActivityDetail: getActivityDetail,
  setToken: setToken,
  getToken: getToken,
  setSessionId: setSessionId,
  getSessionId: getSessionId,
  removeSessionId: removeSessionId,
  getUserInfo: getUserInfo,
  setUserInfo,
  setRoleType,
  getRoleType,
  getRememberPwd,
  setRememberPwd,
  setAutoLogin,
  getAutoLogin,
  setPassword,
  getPassword,
  setAgreePromiseTrue,
  setAgreePromiseFalse,
  getAgreePromise
}