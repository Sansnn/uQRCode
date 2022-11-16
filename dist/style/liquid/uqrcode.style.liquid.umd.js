//---------------------------------------------------------------------
// uQRCode二维码生成插件 v4.0.0
// 
// uQRCode是一款基于Javascript环境开发的二维码生成插件，适用所有Javascript运行环境的前端应用和Node.js。
// 
// Copyright (c) Sansnn uQRCode All rights reserved.
// 
// Licensed under the Apache License, Version 2.0.
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// github地址：
//   https://github.com/Sansnn/uQRCode
// 
// npm地址：
//   https://www.npmjs.com/package/uqrcodejs
// 
// uni-app插件市场地址：
//   https://ext.dcloud.net.cn/plugin?id=1287
// 
// 复制使用请保留本段注释，感谢支持开源！
// 
//---------------------------------------------------------------------

//---------------------------------------------------------------------
// 当前文件格式为 umd，通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
// 如需在其他环境使用，请获取环境对应的格式文件
// 格式说明：
// amd - 异步模块定义，适用于 RequireJS 等模块加载器
// cjs - CommonJS，适用于 Node 环境和其他打包工具（别名：commonjs）
// es - 将 bundle 保留为 ES 模块文件，适用于其他打包工具以及支持 <script type=module> 标签的浏览器（别名: esm，module）
// umd - 通用模块定义，生成的包同时支持 amd、cjs 和 iife 三种格式
//---------------------------------------------------------------------

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.UQRCodeStyleLiquid = factory());
})(window, (function () {
  function Plugin(UQRCode, options) {
    options.foregroundRadius = 0.0; // 前景码点圆角半径，0.0-1.0

    options.drawLiquidCanvas = function() {
      let {
        isMaked,
        canvasContext: ctx,
        dynamicSize: size,
        foregroundColor,
        foregroundRadius,
        backgroundColor,
        backgroundRadius,
        drawModules,
        drawReserve,
        margin
      } = this;

      if (!isMaked) {
        console.error('[uQRCode]: please execute the make method first!');
        return Promise.reject(new UQRCode.Error('please execute the make method first!'));
      }

      function drawLiquidBasic(ctx, x, y, w, h, ri, ci, c, e) {
        var f, g;
        switch (e) {
          case 0:
            f = ci * w + margin;
            g = ri * h + margin;
            ctx.lineTo(f, g);
            break;
          case 1:
            f = ci * w + w + margin;
            g = ri * h + margin;
            ctx.lineTo(f, g);
            break;
          case 2:
            f = ci * w + w + margin;
            g = ri * h + h + margin;
            ctx.lineTo(f, g);
            break;
          case 3:
            f = ci * w + margin;
            g = ri * h + h + margin;
            ctx.lineTo(f, g);
            break;
        }
      }

      function drawLiquidRound(ctx, x, y, w, h, ri, ci, c, e) {
        var r = w / 2 * foregroundRadius;
        var f, g;
        switch (e) {
          case 0:
            f = ci * w + r + margin;
            g = ri * h + r + margin;
            ctx.arc(f, g, r, Math.PI, 1.5 * Math.PI, false);
            break;
          case 1:
            f = ci * w + w - r + margin;
            g = ri * h + r + margin;
            ctx.arc(f, g, r, 1.5 * Math.PI, 2 * Math.PI, false);
            break;
          case 2:
            f = ci * w + w - r + margin;
            g = ri * h + h - r + margin;
            ctx.arc(f, g, r, 0, Math.PI / 2, false);
            break;
          case 3:
            f = ci * w + r + margin;
            g = ri * h + h - r + margin;
            ctx.arc(f, g, r, Math.PI / 2, Math.PI, false);
        }
      }

      function drawLiquidAngle(ctx, x, y, w, h, ri, ci, c, e) {
        ctx.beginPath();
        var r = w / 2 * foregroundRadius;
        var f, g;
        switch (e) {
          case 0:
            f = ci * w + r + margin;
            g = ri * h + r + margin;
            ctx.arc(f, g, r, Math.PI, 1.5 * Math.PI, false);
            f = ci * w + margin;
            g = ri * h + margin;
            break;
          case 1:
            f = ci * w + w - r + margin;
            g = ri * h + r + margin;
            ctx.arc(f, g, r, 1.5 * Math.PI, 2 * Math.PI, false);
            f = ci * w + w + margin;
            g = ri * h + margin;
            break;
          case 2:
            f = ci * w + w - r + margin;
            g = ri * h + h - r + margin;
            ctx.arc(f, g, r, 0, Math.PI / 2, false);
            f = ci * w + w + margin;
            g = ri * h + h + margin;
            break;
          case 3:
            f = ci * w + r + margin;
            g = ri * h + h - r + margin;
            ctx.arc(f, g, r, Math.PI / 2, Math.PI, false);
            f = ci * w + margin;
            g = ri * h + h + margin;
        }
        ctx.lineTo(f, g);
        ctx.closePath();
        ctx.fillStyle = c;
        ctx.fill();
        // ctx.strokeStyle = c;
        // ctx.stroke();
      }


      let draw = async (resolve, reject) => {
        try {
          ctx.clearRect(0, 0, size, size);
          ctx.draw(false);
          for (var i = 0; i < drawModules.length; i++) {
            var drawModule = drawModules[i];
            ctx.save();
            switch (drawModule.type) {
              case 'area':
                /* 绘制区域 */
                ctx.setFillStyle(drawModule.color);
                ctx.fillRect(drawModule.x, drawModule.y, drawModule.width, drawModule.height);
                break;
              case 'tile':
                /* 绘制小块 */
                if (drawModule.name == 'foreground') {
                  if (foregroundRadius > 0) {
                    var x = drawModule.destX;
                    var y = drawModule.destY;
                    var w = drawModule.destWidth;
                    var h = drawModule.destHeight;
                    var ri = drawModule.rowIndex;
                    var ci = drawModule.colIndex;

                    ctx.beginPath();
                    ctx.moveTo(x, y + h / 2);
                    this.isBlack(ri, ci - 1) || this.isBlack(ri - 1, ci) || this.isBlack(ri - 1, ci - 1) ? drawLiquidBasic(ctx, x, y, w, h, ri, ci, foregroundColor, 0) : drawLiquidRound(ctx, x, y, w, h, ri, ci, foregroundColor, 0);
                    this.isBlack(ri - 1, ci) || this.isBlack(ri, ci + 1) || this.isBlack(ri - 1, ci + 1) ? drawLiquidBasic(ctx, x, y, w, h, ri, ci, foregroundColor, 1) : drawLiquidRound(ctx, x, y, w, h, ri, ci, foregroundColor, 1);
                    this.isBlack(ri + 1, ci) || this.isBlack(ri, ci + 1) || this.isBlack(ri + 1, ci + 1) ? drawLiquidBasic(ctx, x, y, w, h, ri, ci, foregroundColor, 2) : drawLiquidRound(ctx, x, y, w, h, ri, ci, foregroundColor, 2);
                    this.isBlack(ri + 1, ci) || this.isBlack(ri, ci - 1) || this.isBlack(ri + 1, ci - 1) ? drawLiquidBasic(ctx, x, y, w, h, ri, ci, foregroundColor, 3) : drawLiquidRound(ctx, x, y, w, h, ri, ci, foregroundColor, 3);
                    ctx.closePath();
                    ctx.fillStyle = foregroundColor;
                    ctx.fill();
                    // ctx.strokeStyle = foregroundColor;
                    // ctx.stroke();
                  } else {
                    var x = drawModule.x;
                    var y = drawModule.y;
                    var w = drawModule.width;
                    var h = drawModule.height;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.arcTo(x + w, y, x + w, y + h, 0);
                    ctx.arcTo(x + w, y + h, x, y + h, 0);
                    ctx.arcTo(x, y + h, x, y, 0);
                    ctx.arcTo(x, y, x + w, y, 0);
                    ctx.closePath();
                    ctx.fillStyle = drawModule.color;
                    ctx.fill();
                    ctx.clip();
                  }
                } else if (drawModule.name == 'background') {
                  if (foregroundRadius > 0) {
                    var x = drawModule.destX;
                    var y = drawModule.destY;
                    var w = drawModule.destWidth;
                    var h = drawModule.destHeight;
                    var ri = drawModule.rowIndex;
                    var ci = drawModule.colIndex;
                    this.isBlack(ri - 1, ci) && this.isBlack(ri, ci - 1) && drawLiquidAngle(ctx, x, y, w, h, ri, ci, foregroundColor, 0);
                    this.isBlack(ri - 1, ci) && this.isBlack(ri, ci + 1) && drawLiquidAngle(ctx, x, y, w, h, ri, ci, foregroundColor, 1);
                    this.isBlack(ri + 1, ci) && this.isBlack(ri, ci + 1) && drawLiquidAngle(ctx, x, y, w, h, ri, ci, foregroundColor, 2);
                    this.isBlack(ri + 1, ci) && this.isBlack(ri, ci - 1) && drawLiquidAngle(ctx, x, y, w, h, ri, ci, foregroundColor, 3);
                  }
                }
                break;
              case 'image':
                /* 绘制图像 */
                if (drawModule.name === 'backgroundImage') {
                  var x = drawModule.x;
                  var y = drawModule.y;
                  var w = drawModule.width;
                  var h = drawModule.height;
                  var r = drawModule.borderRadius;
                  if (w < 2 * r) {
                    r = w / 2;
                  }
                  if (h < 2 * r) {
                    r = h / 2;
                  }

                  /* 设置透明度 */
                  ctx.globalAlpha = drawModule.alpha;

                  /* 绘制圆角 */
                  ctx.beginPath();
                  ctx.moveTo(x + r, y);
                  ctx.arcTo(x + w, y, x + w, y + h, r);
                  ctx.arcTo(x + w, y + h, x, y + h, r);
                  ctx.arcTo(x, y + h, x, y, r);
                  ctx.arcTo(x, y, x + w, y, r);
                  ctx.closePath();
                  ctx.strokeStyle = 'rgba(0,0,0,0)';
                  ctx.stroke();
                  ctx.clip();

                  try {
                    var img = await this.loadImage(drawModule.imageSrc);
                    ctx.drawImage(img, drawModule.x, drawModule.y, drawModule.width, drawModule.height);
                  } catch (e) {
                    console.error(`[uQRCode]: ${drawModule.imageSource} invalid!`);
                    throw new UQRCode.Error(`${drawModule.imageSource} invalid!`);
                  }
                } else if (drawModule.name === 'foregroundImage') {
                  var x = drawModule.x;
                  var y = drawModule.y;
                  var w = drawModule.width;
                  var h = drawModule.height;
                  var r = drawModule.borderRadius;
                  if (w < 2 * r) {
                    r = w / 2;
                  }
                  if (h < 2 * r) {
                    r = h / 2;
                  }
                  var bx = drawModule.x - drawModule.padding;
                  var by = drawModule.y - drawModule.padding;
                  var bw = drawModule.width + drawModule.padding * 2;
                  var bh = drawModule.height + drawModule.padding * 2;
                  var br = (bw / w) * r;
                  if (bw < 2 * br) {
                    br = bw / 2;
                  }
                  if (bh < 2 * br) {
                    br = bh / 2;
                  }

                  /* 绘制阴影 */
                  ctx.save();
                  ctx.shadowOffsetX = drawModule.shadowOffsetX;
                  ctx.shadowOffsetY = drawModule.shadowOffsetY;
                  ctx.shadowBlur = drawModule.shadowBlur;
                  ctx.shadowColor = drawModule.shadowColor;
                  /* 阴影需要一个填充块作为载体 */
                  ctx.beginPath();
                  ctx.moveTo(bx + br, by);
                  ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
                  ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
                  ctx.arcTo(bx, by + bh, bx, by, br);
                  ctx.arcTo(bx, by, bx + bw, by, br);
                  ctx.closePath();
                  ctx.setFillStyle(drawModule.backgroundColor);
                  ctx.fill();
                  ctx.restore();

                  /* 绘制Padding */
                  ctx.beginPath();
                  ctx.moveTo(bx + br, by);
                  ctx.arcTo(bx + bw, by, bx + bw, by + bh, br);
                  ctx.arcTo(bx + bw, by + bh, bx, by + bh, br);
                  ctx.arcTo(bx, by + bh, bx, by, br);
                  ctx.arcTo(bx, by, bx + bw, by, br);
                  ctx.closePath();
                  ctx.setFillStyle(drawModule.padding > 0 ? drawModule.backgroundColor : 'rgba(0,0,0,0)');
                  ctx.fill();

                  /* 绘制圆角 */
                  ctx.beginPath();
                  ctx.moveTo(x + r, y);
                  ctx.arcTo(x + w, y, x + w, y + h, r);
                  ctx.arcTo(x + w, y + h, x, y + h, r);
                  ctx.arcTo(x, y + h, x, y, r);
                  ctx.arcTo(x, y, x + w, y, r);
                  ctx.closePath();
                  ctx.strokeStyle = 'rgba(0,0,0,0)';
                  ctx.stroke();
                  ctx.clip();

                  try {
                    var img = await this.loadImage(drawModule.imageSrc);
                    ctx.drawImage(img, drawModule.x, drawModule.y, drawModule.width, drawModule.height);
                  } catch (e) {
                    console.error(`[uQRCode]: ${drawModule.imageSource} invalid!`);
                    throw new UQRCode.Error(`${drawModule.imageSource} invalid!`);
                  }
                }
                break;
            }
            
            /* gcanvas需要每一阶段都draw一下，否则重绘有问题，例如uni-app nvue绘制图片会失败 */
            if (drawReserve) {
              ctx.draw(true);
            }
            
            ctx.restore();
          }
          ctx.draw(true);
          /* 某些平台的draw回调不一定会触发，故resolve不放在draw回调中 */
          setTimeout(resolve, 150);
        } catch (e) {
          if (e instanceof UQRCode.Error) {
            reject(e);
          } else {
            throw e;
          }
        }
      };

      return new Promise((resolve, reject) => {
        /* 完成绘制 */
        draw(resolve, reject);
      });
    };
  }

  Plugin.Type = 'style'; // 如果需要组件可用此扩展，那么该属性必需
  Plugin.Name = 'liquid'; // 如果需要组件可用此扩展，那么该属性必需
  Plugin.DrawCanvas = 'drawLiquidCanvas'; // 如果需要组件可用此扩展，那么该属性必需

  return Plugin;

}));