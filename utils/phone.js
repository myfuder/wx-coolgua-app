import storage from './storage'
import api from './api'
/**
 * @param {参展商id} purchaserId
 * @param {采购商id} supplierId 
 */
const call = (purchaserId, supplierId) => {
  const user = storage.getUserInfo()
  api.createCallService({
    method: 'POST',
    data: {
      purchaserId,
      supplierId,
    },
    success: function (result) {
      const data = result.data.result
      wx.makePhoneCall({
        phoneNumber: data.middleNumber,
        success: function () {},
        fail: function () {}
      })
    }
  })
}

export default {
  call,
}