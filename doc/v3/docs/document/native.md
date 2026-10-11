---
sidebarDepth: 1
---

# 原生

文档对应版本：v3.6.5

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

### margin

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`

指定二维码边距。

### backgroundColor

- 类型：`string`
- 默认值：`#FFFFFF`
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

### positionProbeImageSrc

- 类型：`string`
- 默认值：`undefined`
- 必填：`否`
- 只读：`否`

指定二维码定位角图案图片地址。

### positionProbeLeftUpperImageSrc

- 类型：`string`
- 默认值：[positionProbeImageSrc](#positionprobeimagesrc)
- 必填：`否`
- 只读：`否`

指定二维码定位角图案左上角图片地址，默认值跟随定位角图案图片地址。

### positionProbeRightUpperImageSrc

- 类型：`string`
- 默认值：[positionProbeImageSrc](#positionprobeimagesrc)
- 必填：`否`
- 只读：`否`

指定二维码定位角图案右上角图片地址，默认值跟随定位角图案图片地址。

### positionProbeLeftLowerImageSrc

- 类型：`string`
- 默认值：[positionProbeImageSrc](#positionprobeimagesrc)
- 必填：`否`
- 只读：`否`

指定二维码定位角图案左下角图片地址，默认值跟随定位角图案图片地址。

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

### positionAdjustImageSrc

- 类型：`string`
- 默认值：`undefined`
- 必填：`否`
- 只读：`否`

指定二维码对齐图案图片地址。

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

### canvasContext

- 类型：`object`
- 默认值：`undefined`
- 必填：`否`
- 只读：`否`

canvas画布上下文。使用 [drawCanvas](#drawcanvas) 必填。

### queue

- 类型：`boolean`
- 默认值：`false`
- 必填：`否`
- 只读：`否`

是否队列绘制，NVue GCanvas必须开启。

### modules

- 类型：`boolean`
- 默认值：`false`
- 必填：`否`
- 只读：`是`

制作二维码主要模块数据。

### moduleCount

- 类型：`boolean`
- 默认值：`false`
- 必填：`否`
- 只读：`是`

制作二维码主要模块数据的模块数量。

### drawModules

- 类型：`boolean`
- 默认值：`false`
- 必填：`否`
- 只读：`是`

绘制模块，层级顺序，最底层 -> 背景 -> 背景图片 -> 前景 -> 前景图片 -> 最顶层。

### style

- 类型：`string`
- 默认值：`default`
- 必填：`否`
- 只读：`否`
- 可选：`default`, `art`, `liquid`, `round`
- 支持：`art`, `liquid`, `round`仅`v3.6.0 Plus 版本`支持

`v3.6.0 新增` 二维码风格。

### foregroundPadding

- 类型：`number`
- 默认值：`0`
- 必填：`否`
- 只读：`否`
- 可选：`0`-`1.0`
- 支持：仅`style`为`default`, `round`支持

`v3.6.0 新增` 前景内边距。

### foregroundRadius

- 类型：`number`
- 默认值：`1`
- 必填：`否`
- 只读：`否`
- 可选：`0`-`1.0`
- 支持：仅`style`为`liquid`, `round`支持

`v3.6.0 新增` 前景圆角半径。

### patterns

- 类型：`array<object>`
- 默认值：`[]`
- 必填：`否`
- 只读：`否`
- 支持：仅`style`为`art`支持

`v3.6.0 新增` 艺术码图案组合。

### patterns[].format

- 类型：`array`
- 默认值：`undefined`
- 必填：`是`
- 只读：`否`

图案组合的版式，是一个布尔值二维数组，图案必须是矩形，所以一维数组里的所有二维数组数量必须一致。true表示小块必须是黑块，false表示小块必须不是黑块，null表示可是可不是黑块。

```javascript
/** 
 * 图案组合为单个小块示例
 * ■
 * */
qr.patterns = [{
  format: [
    [true]
  ]
}];

/** 
 * 图案组合为横向两个小块示例
 * ■ ■
 * */
qr.patterns = [{
  format: [
    [true, true]
  ]
}];

/** 
 * 图案组合为纵向两个小块示例
 * ■
 * ■
 * */
qr.patterns = [{
  format: [
    [true],
    [true]
  ]
}];

/** 
 * 这个图案该如何做？
 * 请先观看图案，思考一下，再看下方的示例
 * ■ ■ ■
 * ■ □ ■
 * ■ ■ ■
 * */
qr.patterns = [{
  format: [
    [true, true, true],
    [true, false, true],
    [true, true, true]
  ]
}];

/** 
 * 不知道上个图案你做对了没？做对了那恭喜你，说明你已经快要掌握这部分规则了，接下来提升难度
 * 请先观看图案，思考一下，再看下方的示例
 * ■ ■ ■ ■ ■ ■ ■
 * ■ □ □ □ □ □ ■
 * ■ □ ■ ■ ■ □ ■
 * ■ □ ■ ■ ■ □ ■
 * ■ □ ■ ■ ■ □ ■
 * ■ □ □ □ □ □ ■
 * ■ ■ ■ ■ ■ ■ ■
 * */
qr.patterns = [{
  format: [
    [true, true, true, true, true, true, true],
    [true, false, false, false, false, false, true],
    [true, false, true, true, true, false, true],
    [true, false, true, true, true, false, true],
    [true, false, true, true, true, false, true],
    [true, false, false, false, false, false, true],
    [true, true, true, true, true, true, true],
  ]
}];

/** 
 * 上面的图案是否似曾相识，没错，它就是二维码的定位图案，又称码眼，位于二维码的左上角，右上角和左下角
 * 这么复杂的图案都已掌握，那下面这个图案相信你也不在话下
 * □ ■ ■ ■
 * ■ ■ □ □
 * □ ■ ■ ■
 * */
qr.patterns = [{
  format: [
    [false, true, true, true],
    [true, true, false, false],
    [false, true, true, true],
  ]
}];
```
::: tip TIP
恭喜你已掌握图案组合的版式设计！
:::

#### patterns[].imageSrc

- 类型：`string`
- 默认值：`''`
- 必填：`是`
- 只读：`否`

图案对应的要替换的图片路径。

#### patterns[].probit

- 类型：`number`
- 默认值：`1`
- 必填：`是`
- 只读：`否`

图案绘制概率，0为不会绘制，1为100%绘制，0.5为50%概率绘制，以此类推。

#### patterns[].limit

- 类型：`number`
- 默认值：`-1`
- 必填：`否`
- 只读：`否`

图案绘制次数限制。

## 实例方法

### setOptions

- 类型：`Function`
- 默认值：`undefined`

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
- 默认值：`undefined`

制作二维码方法，用于生成实例`modules`、`moduleCount`、`drawModules`等数据。

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
// 获取绘制模块
console.log(qr.drawModules);
```

### drawCanvas

- 类型：`Function`
- 默认值：`Promise`

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

## 静态属性

### UQRCode.errorCorrectLevel

- 类型：`Object`
- 默认值：`{L: 1, M: 0, Q: 3, H: 2}`

二维码纠错等级可选项。

### UQRCode.isQueueLoadImage

- 类型：`boolean`
- 默认值：`false`

是否为队列加载图片。某些平台一起使用多个组件时需要通过队列逐一绘制，否则部分绘制方法异常，`NVue`端的`GCanvas`尤其明显，在不通过队列绘制时会出现图片丢失的情况。

## 静态方法

### UQRCode.loadImage

- 类型：`Function`
- 默认值：`undefined`

`canvas`加载图片方法，需要返回`Promise`对象。如果要绘制图片，需要设置加载图片方法，否则无法正确获取图片资源。各平台方式不同，具体请查阅平台对应的文档。

下面列举原生HTML和微信小程序 Canvas 2D的获取方式：

- html
  ```javascript
  UQRCode.loadImage = function(src) {
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
      UQRCode.loadImage = function(src) {
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