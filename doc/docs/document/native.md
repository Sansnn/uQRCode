---
sidebarDepth: 1
---

# 原生

文档对应版本：v4.0.6

## 基本配置

通过实例指定配置，例如：

```javascript
// 获取uQRCode实例
var qr = new UQRCode();
// 设置uQRCode属性
qr.data = 'https://uqrcode.cn/doc'; // 指定二维码对应内容
qr.size = 220; // 指定要生成的二维码大小
qr.margin = 10; // 指定二维码的边距
```

### data

- 类型：`string`
- 默认值：`''`
- 必填：`是`
- 只读：`否`

指定二维码对应内容。

### size

- 类型：`number`
- 默认值：`200`
- 必填：`否`
- 只读：`否`

指定要生成的二维码大小。

### useDynamicSize

- 类型：`boolean`
- 默认值：`false`
- 必填：`否`
- 只读：`否`

是否使用动态尺寸。可以去掉方块小数点，绘制出来后没有白色细线，提升美观度。但要注意实际尺寸会发生变化，需要通过实例获取到动态尺寸数值及时重设画布尺寸。

### dynamicSize

- 类型：`number`
- 默认值：`undefined`
- 必填：`否`
- 只读：`是`

动态尺寸数值，[useDynamicSize](#usedynamicsize) 指定为`true`时自动计算。

### typeNumber

- 类型：`number`
- 默认值：`-1`
- 必填：`否`
- 只读：`否`

指定二维码版本。设为-1为自动计算，字符越多，版本越高。

### errorCorrectLevel

- 类型：`number`
- 默认值：`UQRCode.errorCorrectLevel.H`
- 必填：`否`
- 只读：`否`

指定二维码纠错等级。

[UQRCode.errorCorrectLevel](#uqrcode-errorcorrectlevel) 的选项。

### margin

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码边距。

### areaColor

- 类型：`string`
- 默认值：`#FFFFFF`
- 必填：`否`
- 只读：`否`

指定二维码绘制区域颜色、底部背景色。

### backgroundColor

- 类型：`string`
- 默认值：`rgba(255,255,255,0)`
- 必填：`否`
- 只读：`否`

指定二维码背景色。

### backgroundImageSrc

- 类型：`string`
- 默认值：`undefined`
- 必填：`否`
- 只读：`否`

指定二维码背景图片地址。

### backgroundImageWidth

- 类型：`number`
- 默认值：[size](#size)
- 必填：`否`
- 只读：`否`

指定二维码背景图片宽度。

### backgroundImageHeight

- 类型：`number`
- 默认值：[size](#size)
- 必填：`否`
- 只读：`否`

指定二维码背景图片高度。

### backgroundImageX

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码背景图片位置X坐标。

### backgroundImageY

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码背景图片位置Y坐标。

### backgroundImageAlpha

- 类型：`number`
- 默认值：`1`
- 必填：`否`
- 只读：`否`

指定二维码背景图片透明度。

### backgroundImageBorderRadius

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码背景图片圆角值。

### backgroundPadding

- 类型：`number`
- 默认值：`0.0`
- 必填：`否`
- 只读：`否`
- 范围：`0.0`-`1.0`

指定二维码背景码点内边距。

### foregroundColor

- 类型：`string`
- 默认值：`#000000`
- 必填：`否`
- 只读：`否`

指定二维码前景色。

### foregroundImageSrc

- 类型：`string`
- 默认值：`undefined`
- 必填：`否`
- 只读：`否`

指定二维码前景图片地址。

### foregroundImageWidth

- 类型：`number`
- 默认值：[size](#size) / 4
- 必填：`否`
- 只读：`否`

指定二维码前景图片宽度。默认为size的1/4。

### foregroundImageHeight

- 类型：`number`
- 默认值：[size](#size) / 4
- 必填：`否`
- 只读：`否`

指定二维码前景图片高度。默认为size的1/4。

### foregroundImageX

- 类型：`number`
- 默认值：[size](#size) / 2 - [foregroundImageWidth](#foregroundimagewidth) / 2
- 必填：`否`
- 只读：`否`

指定二维码前景图片位置X坐标。默认在画布中间位置。

### foregroundImageY

- 类型：`number`
- 默认值：[size](#size) / 2 - [foregroundImageHeight](#foregroundimageheight) / 2
- 必填：`否`
- 只读：`否`

指定二维码前景图片位置Y坐标。默认在画布中间位置。

### foregroundImagePadding

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码前景图边距填充。

### foregroundImageBackgroundColor

- 类型：`string`
- 默认值：`#FFFFFF`
- 必填：`否`
- 只读：`否`

指定二维码前景图的背景颜色。

### foregroundImageBorderRadius

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码前景图边框圆角值。

### foregroundImageShadowOffsetX

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码前景图阴影水平偏移值。

### foregroundImageShadowOffsetY

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码前景图阴影垂直偏移值。

### foregroundImageShadowBlur

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码前景图阴影模糊度。

### foregroundImageShadowColor

- 类型：`string`
- 默认值：`#808080`
- 必填：`否`
- 只读：`否`

指定二维码前景图阴影颜色。

### foregroundPadding

- 类型：`number`
- 默认值：`0.0`
- 必填：`否`
- 只读：`否`
- 范围：`0.0`-`1.0`

指定二维码前景码点内边距。

### positionProbeBackgroundColor

- 类型：`string`
- 默认值：[backgroundColor](#backgroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码定位角图案背景色，默认值跟随背景色。

### positionProbeForegroundColor

- 类型：`string`
- 默认值：[foregroundColor](#foregroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码定位角图案前景色，默认值跟随前景色。

### separatorColor

- 类型：`string`
- 默认值：[foregroundColor](#foregroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码分割图案颜色，默认值跟随前景色。

### positionAdjustBackgroundColor

- 类型：`string`
- 默认值：[backgroundColor](#backgroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码对齐图案背景色，默认值跟随背景色。

### positionAdjustForegroundColor

- 类型：`string`
- 默认值：[foregroundColor](#foregroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码对齐图案前景色，默认值跟随前景色。

### timingBackgroundColor

- 类型：`string`
- 默认值：[backgroundColor](#backgroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码时序图案背景色，默认值跟随背景色。

### timingForegroundColor

- 类型：`string`
- 默认值：[foregroundColor](#foregroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码时序图案前景色，默认值跟随前景色。

### typeNumberBackgroundColor

- 类型：`string`
- 默认值：[backgroundColor](#backgroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码版本图案背景色，默认值跟随背景色。

### typeNumberForegroundColor

- 类型：`string`
- 默认值：[foregroundColor](#foregroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码版本图案前景色，默认值跟随前景色。

### darkBlockColor

- 类型：`string`
- 默认值：[foregroundColor](#foregroundcolor)
- 必填：`否`
- 只读：`否`

指定二维码暗块颜色，默认值跟随前景色。

### base

- 类型：`object`
- 默认值：`undefined`
- 必填：`否`
- 只读：`是`

二维码基本对象，通过内部实例化QRCode类并调用make后得到。

### modules

- 类型：`array`
- 默认值：`[]`
- 必填：`否`
- 只读：`是`

制作二维码主要模块数据。

### moduleCount

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`是`

制作二维码主要模块数据的模块数量。

### canvasContext

- 类型：`object`
- 默认值：`undefined`
- 必填：`否`
- 只读：`否`

canvas画布上下文。使用 [drawCanvas](#drawcanvas) 必填。

### drawReserve

- 类型：`boolean`
- 默认值：`false`
- 必填：`否`
- 只读：`否`

ctx.draw保留绘制，本次绘制是否接着上一次绘制。2d没有draw方法，所以2d该属性对2d无效。

### isMaked

- 类型：`boolean`
- 默认值：`false`
- 必填：`否`
- 只读：`是`

判断当前实例是否已调用make。

## 静态属性

### UQRCode.errorCorrectLevel

- 类型：`Object`
- 默认值：`{L: 1, M: 0, Q: 3, H: 2}`

二维码纠错等级可选项。

### UQRCode.Error

- 类型：`Class`
- 构造函数：
  - msg：`String` 错误消息

错误类。

### UQRCode.use

- 类型：`Function`
- 返回值：`void`
- 参数：
  - plugin：`Function` 插件回调函数

全局注册扩展插件，使用方式同 [register](#register)。

## 实例方法

### loadImage

- 类型：`Function`
- 返回值：`Promise`
- 参数：
  - src：`String` 图片路径

设置实例的`canvas`加载图片方法，需要返回`Promise`对象。如果要绘制图片，需要设置加载图片方法，否则无法正确获取图片资源。各平台方式不同，具体请查阅平台对应的文档。

可通过`UQRCode.prototype.loadImage`全局设置，或者`new UQRCode().loadImage`对实例设置。

下面列举原生HTML，uni-app和微信小程序 Canvas 2D的获取方式：

- html
  ```javascript
  UQRCode.prototype.loadImage = function(src) {
    // 需要返回Promise对象
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.src = src;
      img.onload = function() {
        // resolve返回img
        resolve(img);
      }
      img.onerror = err => {
        // reject返回错误信息
        reject(err);
      }
    });
  }
  ```

- uni-app
  ```javascript
  UQRCode.prototype.loadImage = function(src) {
    // 需要返回Promise对象
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src,
        success: res => {
          // resolve返回img
          resolve(res.path);
        },
        fail: err => {
          // reject返回错误信息
          reject(err);
        }
      });
    });
  }
  ```

- 微信小程序 Canvas 2D
  ```javascript
  wx.createSelectorQuery()
    .in(this) // 在组件内使用需要
    .select('#qrcode')
    .fields({
      node: true,
      size: true
    })
    .exec(res => {
      var canvas = res[0].node;
      var canvasContext = canvas.getContext('2d');
      // 微信小程序canvas获取图像方式
      UQRCode.prototype.loadImage = function(src) {
        // 需要返回Promise对象，小程序下获取网络图片信息需先配置download域名白名单才能生效
        return new Promise((resolve, reject) => {
          var img = canvas.createImage();
          img.src = src;
          img.onload = () => {
            // resolve返回img
            resolve(img);
          }
          img.onerror = err => {
            // reject返回错误信息
            reject(err);
          }
        });
      };
    });
  ```

  **参考：**

  - [微信小程序 Canvas.createImage](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/Canvas.createImage.html)

### setOptions

- 类型：`Function`
- 返回值：`void`
- 参数：
  - options：`Object` 基本配置对象

通过对象形式设置 [基本配置](https://uqrcode.cn/doc/document/native.html#基本配置) 。

```javascript
// 获取uQRCode实例
var qr = new UQRCode();
// 设置uQRCode属性
qr.setOptions({
  data: 'https://uqrcode.cn/doc', // 指定二维码对应内容
  size: 220, // 指定要生成的二维码大小
  margin: 10 // 指定二维码的边距
});
// 调用制作二维码方法
qr.make();
console.log(qr);
```

### make

- 类型：`Function`
- 返回值：`void`

制作二维码方法，用于生成实例`modules`、`moduleCount`等数据。

```javascript
// 获取uQRCode实例
var qr = new UQRCode();
// 设置uQRCode属性
qr.data = 'https://uqrcode.cn/doc'; // 指定二维码对应内容
qr.size = 220; // 指定要生成的二维码大小
qr.margin = 10; // 指定二维码的边距
// 调用制作二维码方法
qr.make();
// 获取modules模块
console.log(qr.modules);
// 获取modules模块数量
console.log(qr.moduleCount);
```

### getDrawModules

- 类型：`Function`
- 返回值：`Array`
  - name：`String` 模块名称 `area|backgroundImage|background|foreground|foregroundImage`
  - type：`String` 模块类型 `area|image|tile`
  - color：`String` 模块颜色
  - destX：`Number` 码点范围X坐标，未受动态尺寸或内边距影响的原始X坐标
  - destY：`Number` 码点范围Y坐标，未受动态尺寸或内边距影响的原始Y坐标
  - destWidth：`Number` 码点范围宽度
  - destHeight：`Number` 码点范围高度
  - x：`Number` 绘制X坐标
  - y：`Number` 绘制Y坐标
  - width：`Number` 绘制宽度
  - height：`Number` 绘制高度
  - paddingTop：`Number` tile模块内边距-上
  - paddingRight：`Number` tile模块内边距-右
  - paddingBottom：`Number` tile模块内边距-下
  - paddingLeft：`Number` tile模块内边距-左
  - rowIndex：`Number` tile模块在modules的row索引
  - colIndex：`Number` tile模块在modules的col索引
  - imageSrc：`String` 图片路径
  - mappingName：`String` 映射名称
  - alpha：`Number` 透明度
  - borderRadius：`Number` 圆角值
  - padding：`Number` 前景图内边距
  - backgroundColor：`Number` 前景图背景色
  - shadowOffsetX：`Number` 前景图阴影水平偏移
  - shadowOffsetY：`Number` 前景图阴影垂直偏移
  - shadowBlur：`Number` 前景图阴影模糊度
  - shadowColor：`String` 前景图阴影颜色

获取绘制模块，层级：最底层 -> 绘制区域 -> 背景图片 -> 背景|前景 -> 前景图片 -> 最顶层。需在已调用`make`后再调用，可使用 [isMaked](#ismaked) 判断是否调用`make`。

```javascript
// 获取uQRCode实例
var qr = new UQRCode();
// 设置uQRCode属性
qr.data = 'https://uqrcode.cn/doc'; // 指定二维码对应内容
qr.size = 220; // 指定要生成的二维码大小
qr.margin = 10; // 指定二维码的边距
// 调用制作二维码方法
qr.make();
// 获取绘制模块
var drawModules = qr.getDrawModules();
console.log(drawModules);
```

### drawCanvas

- 类型：`Function`
- 返回值：`Promise`

绘制到canvas画布。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>uQRCode二维码生成</title>
  </head>
  <body>
    <canvas id="qrcode" width="200" height="200"></canvas>
    <script type="text/javascript" src="uqrcode.js"></script>
    <script>
      // 引入uQRCode
      var UQRCode = window.UQRCode;
      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置uQRCode属性
      qr.data = 'https://uqrcode.cn/doc';
      qr.size = 200;
      // 调用制作二维码方法
      qr.make();
      // 获取canvas元素
      var canvas = document.getElementById("qrcode");
      // 获取canvas上下文
      var canvasContext = canvas.getContext("2d");
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;
      // 调用绘制方法将二维码图案绘制到canvas上
      qr.drawCanvas()
        .then(() => {
          console.log('绘制完成');
        })
        .catch(() => {
          console.log('绘制失败');
        });
    </script>
  </body>
</html>
```

### register

- 类型：`Function`
- 返回值：`void`
- 参数：
  - plugin：`Function` 插件回调函数

实例注册扩展插件。

- 使用扩展示例：
  ```html
  <body>
    <canvas id="qrcode"></canvas>
    <script type="text/javascript" src="uqrcode.js"></script>
    <script type="text/javascript" src="uqrcode.style.round.js"></script>
    <script type="text/javascript">
      // 引入uQRCode
      const UQRCode = window.UQRCode;
      // 引入uQRCode扩展
      const UQRCodeStyleRound = window.UQRCodeStyleRound;

      // 获取uQRCode实例
      var qr = new UQRCode();
      // 设置uQRCode属性
      qr.data = 'https://uqrcode.cn/doc'; // 指定二维码对应内容
      qr.size = 220; // 指定要生成的二维码大小
      qr.margin = 10; // 指定二维码的边距
      // 注册扩展
      qr.register(UQRCodeStyleRound);
      // 设置扩展属性
      qr.foregroundRadius = 1; // 前景码点设置圆角系数最大，绘制为圆形
      qr.backgroundRadius = 1; // 背景码点设置圆角系数最大，绘制为圆形
      // 调用制作二维码方法
      qr.make();

      // 获取canvas元素
      var canvas = document.getElementById("qrcode");
      canvas.width = qr.dynamicSize;
      canvas.height = qr.dynamicSize;
      // 获取canvas上下文
      var canvasContext = canvas.getContext("2d");
      // 设置uQRCode实例的canvas上下文
      qr.canvasContext = canvasContext;

      // 调用扩展绘制方法将二维码图案绘制到canvas上
      qr.draw25DCanvas();
    </script>
  </body>
  ```

- 自定义扩展请参考以下示例：
  ```javascript
  function Plugin(UQRCode, options, isInstance) {
    /**
     * UQRCode，当前作用域内所依赖的UQRCode类
     * options，实例属性
     * isInstance，是否来自实例注册，false表示为通过UQRCode.use全局注册，true表示仅当前实例注册
     */

    /* 扩展属性 */
    options.customProperty = false; // 自定义属性
    /**
     * options.x1 = '';
     * options.x2 = '';
     * ...
     */

    /* 扩展drawCanvas函数 */
    options.drawCustomCanvas = function() {
      let {
        isMaked, // 判断当前实例是否已调用make函数
        canvasContext: ctx, // 获取canvas上下文
        dynamicSize: size, // 动态尺寸
        customProperty // 扩展属性
      } = this;

      /* 判断当前实例是否已调用make函数，执行drawCustomCanvas前必须调用make，否则无法获取正确的modules */
      if (!isMaked) {
        console.error('[uQRCode]: please execute the make method first!');
        return Promise.reject(new UQRCode.Error('please execute the make method first!'));
      }

      /* 获取绘制模块 */
      let drawModules = this.getDrawModules();

      /* 返回绘制状态 */
      return new Promise((resolve, reject) => {
        try {
          /* 遍历绘制模块 */
          for (var i = 0; i < drawModules.length; i++) {
            var drawModule = drawModules[i];
            if (drawModule.type === 'tile' && drawModule.name == 'foreground') {
              /* 绘制码点 */
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
              if (customProperty) {
                /* 如果customProperty=true，码点绘制为红色 */
                ctx.fillStyle = 'red';
              } else {
                /* 如果customProperty=false，码点绘制为蓝色 */
                ctx.fillStyle = 'blue';
              }
              ctx.fill();
              ctx.clip();
            }
          }
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    }
  }
  Plugin.Type = 'style'; // 如果需要uni-app组件可用此扩展，那么该属性必需
  Plugin.Name = 'custom'; // 如果需要uni-app组件可用此扩展，那么该属性必需
  Plugin.DrawCanvas = 'drawCustomCanvas'; // 如果需要uni-app组件可用此扩展，那么该属性必需
  ```
  - 使用示例
  ```javascript
  // 获取uQRCode实例
  var qr = new UQRCode();
  // 设置uQRCode属性
  qr.data = 'https://uqrcode.cn/doc'; // 指定二维码对应内容
  qr.size = 220; // 指定要生成的二维码大小
  qr.margin = 10; // 指定二维码的边距
  // 注册扩展
  qr.register(Plugin);
  // 设置扩展属性
  qr.customProperty = true;
  // 调用制作二维码方法
  qr.make();

  // 获取canvas元素
  var canvas = document.getElementById("qrcode");
  canvas.width = qr.dynamicSize;
  canvas.height = qr.dynamicSize;
  // 获取canvas上下文
  var canvasContext = canvas.getContext("2d");
  // 设置uQRCode实例的canvas上下文
  qr.canvasContext = canvasContext;

  // 调用扩展绘制方法将二维码图案绘制到canvas上
  qr.drawCustomCanvas();
  ```