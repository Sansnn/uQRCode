/**
 * 获取画布定制上下文。
 * @param {*} ctx 前端传过来的上下文
 * 写扩展插件时需注意，因微信官方旧版Canvas未完全依照Web Canvas API设计，安卓并未兼容，如需要H5和微信小程序旧版Canvas同时兼容，需要在扩展函数里加入这些API的兼容。（如当前未补充的：setLineCap、setTransform、setStrokeStyle等与Web Canvas不一致的API）
 */
export function getCanvasContext(ctx) {
  /**
   ctx注意事项：
     gcanvas drawImage后必跟一个draw(true)，否则会出现图片丢失的情况；
     gcanvas 坑实在是太多了，nvue端建议部署一个nodejs服务，通过接口获取二维码图片，这样做体验最好；
   **/
  /* 兼容setFillStyle写法，主要在uni-app nvue gcanvas 微信小程序normal */
  ctx.setFillStyle = ctx.setFillStyle || function(color) {
    ctx.fillStyle = color;
  }
  /* 兼容setFontSize写法 */
  ctx.setFontSize = ctx.setFontSize || function(fontSize) {
    ctx.font = `${fontSize}px`;
  }
  /* 兼容setTextAlign写法 */
  ctx.setTextAlign = ctx.setTextAlign || function(align) {
    ctx.textAlign = align;
  }
  /* 兼容setTextBaseline写法 */
  ctx.setTextBaseline = ctx.setTextBaseline || function(textBaseline) {
    ctx.textBaseline = textBaseline;
  }
  /* 兼容setGlobalAlpha写法，设置透明度，主要在微信小程序normal */
  ctx.setGlobalAlpha = ctx.setGlobalAlpha || function(alpha) {
    ctx.globalAlpha = alpha;
  }
  /* 兼容setGlobalAlpha写法，设置描边颜色 */
  ctx.setStrokeStyle = ctx.setStrokeStyle || function(color) {
    ctx.strokeStyle = color;
  }
  /* 兼容setGlobalAlpha写法，设定阴影样式 */
  ctx.setShadow = ctx.setShadow || function(offsetX, offsetY, blur, color) {
    ctx.shadowOffsetX = offsetX;
    ctx.shadowOffsetY = offsetY;
    ctx.shadowBlur = blur;
    ctx.shadowColor = color;
  }
  /* 若实例不包含draw方法则创建一个 */
  ctx.draw = ctx.draw || function(reserve, callback) {
    callback && callback();
  }
  return ctx;
}
