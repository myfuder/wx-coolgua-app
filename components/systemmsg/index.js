// packageExhibitor/pages/zEdition1/components/bizComponents/demand/index.js
import { getString } from "../../locals/lang.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
	systemmsglist: {
	  type: Array
	}
  },
  lifetimes: {
      // 组件所在页面的生命周期函数
      created: function () {
        console.log('222')
        console.log(this.systemmsglist)
      },
      attached() {
        this.setData({
          label: {
            productName: getString('wp', 'app.purchase.product.name'),
            num: getString('wp', 'app.purchase.product.num'),
            priceRang: getString('wp', 'app.purchase.product.priceRang'),
            properties: getString('wp', 'app.purchase.product.properties'),
            Industr: getString('wp', 'app.purchase.product.Industr'),
            detail: getString('wp', 'app.purchase.product.detail'),
            kind: getString('wp', 'app.company.kind'),
            intrest: getString('wp', 'app.intrest.kind'),
          }
        })
      }
    },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    detailClick:()=>{
      wx.navigateTo({
        url: '/packageExhibitor/pages/zEdition1/purchaser/detail/index',
      })
    }
  }
})

