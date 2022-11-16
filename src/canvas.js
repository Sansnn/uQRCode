/**
 * 获取画布定制上下文
 * @param {*} ctx 前端传过来的上下文
 */
export function getCanvasContext(ctx) {
  /**
   ctx注意事项：
     gcanvas drawImage后必跟一个draw(true)，否则会出现图片丢失的情况；
     gcanvas 坑实在是太多了，nvue端建议部署一个nodejs服务，通过接口获取二维码图片，这样做体验最好；
   **/
  /* 兼容setFillStyle写法，主要在uni-app nvue gcanvas */
  ctx.setFillStyle = ctx.setFillStyle || function(color) {
    ctx.fillStyle = color;
  }
  /* 兼容setFontSize写法，主要在微信小程序canvas2d */
  ctx.setFontSize = ctx.setFontSize || function(fontSize) {
    ctx.font = `${fontSize}px`;
  }
  /* 兼容setTextAlign写法，主要在微信小程序canvas2d */
  ctx.setTextAlign = ctx.setTextAlign || function(align) {
    ctx.textAlign = align;
  }
  /* 兼容setTextBaseline写法，主要在微信小程序canvas2d */
  ctx.setTextBaseline = ctx.setTextBaseline || function(textBaseline) {
    ctx.textBaseline = textBaseline;
  }
  /* 若实例不包含draw方法则创建一个 */
  ctx.draw = ctx.draw || function(reserve, callback) {
    callback && callback();
  }
  ctx.clearRect = ctx.clearRect || function(x, y, width, height) {
    ctx.draw(false);
  }
  return ctx;
}
