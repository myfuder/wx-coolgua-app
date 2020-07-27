import {addressImage, default_activity_image, timeImage} from "../../../../../common/staticImageContants";

Component({
    properties: {
        item:{
            type:Object
        }
    },
    data: {
        default_activity_image,
        timeImage,
        addressImage
    },
    methods: {
      go2detail(e){
        var tid = this.properties.item.tid;
        wx.navigateTo({
          url: '/packageExhibitor/pages/zEdition1/activityDetail/activityDetail?tid=' + tid
        })
      }
    }

});
