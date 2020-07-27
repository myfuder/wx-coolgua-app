import {safeBecomeArray} from "../../utils/util";

Component({
  properties: {
    list: {
      type: Array
    },
    values: {
      type: [Array,String]
    }
  },
  data: {
    list_: [],
    values_:[],
  },
  lifetimes: {
    attached() {
      this.fixedList()
    },
  },
  methods: {
    fixedList() {
      var list = safeBecomeArray(this.properties.list);
      this.setData({
        list_: list.map(item => {
          return {
            value: item,
            checked: this.inInContainer(item)
          }
        })
      })
    },
    findIndexInArray(item) {
      var values = safeBecomeArray(this.properties.values)
      return values.findIndex(item2 => item2 == item)
    },
    inInContainer(item) {
      var values = safeBecomeArray(this.properties.values)
      console.log("=values======>",values)
      return values.findIndex(item2 => item2 == item) >= 0
    },

    changeOne(e) {
      var checked = e.detail;
      var itemValue = e.currentTarget.dataset.item && e.currentTarget.dataset.item.value;
      var index = this.findIndexInArray(itemValue)
      var values_=safeBecomeArray(this.properties.values)
      if (index >= 0) {
        values_.splice(index, 1)
      } else {
        values_.push(itemValue)
      }
      this.triggerEvent("changecheckout", values_)
      this.fixedList()
    }
  }
});
