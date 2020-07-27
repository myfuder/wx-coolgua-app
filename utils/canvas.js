/**
 * 绘制圆
 * author: nguhuangxiao
 */
var util = require('./util.js');
function circleImg1(url, ctx, dx, dy, sw, sy) { 
  ctx.drawImage(url, 48, 30, 80, 80)
  ctx.drawImage('../common/img/logomask.png', 48, 30, 80, 80);
}

function circleImg(url, ctx, dx, dy, sw, sy) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(sw / 2 + dx, sy / 2 + dy, sw / 2, 0, Math.PI * 2, false);
  ctx.closePath()
  ctx.setStrokeStyle('#fff')
  ctx.stroke()
  ctx.clip();
  ctx.drawImage(url, dx, dy, sw, sy); 
  ctx.restore();
}

/**
 * 绘制图片
 * author: nguhuangxiao
 */
function drawFriendImageInfo(ctx, data, res) {
  console.log(ctx, data, res)
  let exhibitsName = data.company 
  ctx.font=`22px bold` 
  ctx.fillText(exhibitsName, 210, 75)

  let booth= '展位号：'+data.booth
  ctx.font=`20px normal` 
  ctx.fillText(booth, 210, 165)

  let hall = '展馆号：'+data.hall
  ctx.font=`20px normal` 
  ctx.fillText(hall, 210, 118)

  let exhibitsType = '产品类型：'
  ctx.font=`20px normal` 
  ctx.fillText(exhibitsType, 210, 210)
  var initY=250
  for(var index in data.tags){
    var widthImg=ctx.measureText(data.tags[index].name).width
    console.log(widthImg)
    initY+=widthImg;
    console.log(initY)
    var margin = 20
    ctx.fillText(data.tags[index].name, initY+margin*index, 210)
  }
  ctx.drawImage('../../../../common/img/hot.png', 395, 290, 20, 26)
  let exhibitsHot = '热度：'+data.hot
  ctx.font=`20px normal` 
  ctx.fillText(exhibitsHot, 430, 310)

  ctx.drawImage('../../../../common/img/appointment.png', 560, 292, 24, 21)
  let exhibits = '预约数：'+data.num
  ctx.font=`20px normal` 
  ctx.fillText(exhibits, 595, 310)

  let introductionName = '展商介绍：' 
  ctx.font=`22px normal` 
  ctx.fillStyle='#333333'
  ctx.fillText(introductionName, 20, 360)
  canvasTextAutoLine(data.introduction,ctx,50,410,35,7)

  if (data.portrait){
    var portrait = data.portrait
    wx.getImageInfo({
      src: portrait,
      complete: function (res) {
        ctx.drawImage(res.path, 20, 48, 170, 170)
        ctx.draw()
      }
    })
  }else{
    var portrait = '../../../../common/img/head.png'
    ctx.drawImage(portrait, 20, 48, 170, 170)
    var qrcode = portrait
    wx.getImageInfo({
      src: qrcode,
      complete: function (res) {
        //ctx.drawImage(res.path, 244, 680, 262, 262)
        ctx.draw()
      }
    })
  }
  var qrcode = data.acode
  ctx.drawImage(qrcode, 244, 680, 262, 262)
}

function drawQuenImageInfo(ctx, data, res) {
  console.log(ctx,data, res)
  let exhibitsName = data.name 
  ctx.font=`22px bold` 
  ctx.fillText(exhibitsName, 245, 73)

  let exhibitorName= '展商名称：'+data.exhibitorName
  ctx.font=`20px normal` 
  ctx.fillText(exhibitorName, 245, 118)
  let exhibitsType = '产品类型：'
  ctx.font=`20px normal` 
  ctx.fillText(exhibitsType, 245, 163)
  var initY=330
  for(var index in data.tagsName){
    var widthImg=ctx.measureText(data.tagsName[index]).width
    console.log(widthImg)
    initY+=widthImg;
    console.log(initY)
    var margin = 20
    ctx.fillText(data.tagsName[index], initY+margin*index, 163)
  }

  ctx.drawImage('../../../../common/img/popularity.png', 245, 190, 17, 23)
  let exhibitsHot = '展品人气：'+'123'
  ctx.font=`20px normal` 
  ctx.fillStyle='#ffa200'
  ctx.fillText(exhibitsHot, 270, 208)

  let name = '图片：' 
  ctx.font=`22px normal` 
  ctx.fillStyle='#333333'
  ctx.fillText(name, 48, 285)

  let introductionName = '展品介绍：' 
  ctx.font=`22px normal` 
  ctx.fillStyle='#333333'
  ctx.fillText(introductionName, 48, 595)
  canvasTextAutoLine(data.introduction,ctx,48,640,35,2)

  if (data.coverImage){
    ctx.drawImage(data.coverImage, 48, 48, 170, 170)
  }
  if (data.productImage1){
    ctx.drawImage(data.productImage1, 48, 310, 320, 190)
  }
  if (data.productImage2){
    ctx.drawImage(data.productImage2, 390, 310, 320, 190)
  }
  var qrcode = data.acode
  ctx.drawImage(qrcode, 244, 690, 262, 262)

  var portrait = '../../../../common/img/head.png'
  var qrcode = portrait
  wx.getImageInfo({
    src: qrcode,
    complete: function (res) {
      //ctx.drawImage(res.path, 244, 680, 262, 262)
      ctx.draw()
    }
  })
}
function canvasTextAutoLine(str,canvas,initX,initY,lineHeight,num){
  var ctx = canvas;
  var lineWidth = 0;
  var canvasWidth = '700'; 
  var lastSubStrIndex= 0; 
  var text = 0
  for(let i=0;i<str.length;i++){ 
    if(text<num){
      lineWidth+=ctx.measureText(str[i]).width; 
      if(lineWidth>canvasWidth-initX){//减去initX,防止边界出现的问题
        ctx.font=`20px normal` 
        ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
        initY+=lineHeight;
        lineWidth=0;
        lastSubStrIndex=i;
        text++
      } 
      if(i==str.length-1){
        ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
      }
    }
  }
}

module.exports = {
  drawFriendImageInfo,
  drawQuenImageInfo
}