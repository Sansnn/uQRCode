# uQRCode

**点击群号加入群聊【uQRCode交流群】：[695070434](https://jq.qq.com/?_wv=1027&k=JRjzDqiw)**

uQRCode 生成方式简单，可扩展性高，适用所有前端应用和Node.js服务端，可运行到所有支持canvas的平台。支持NVUE（NVUE中使用GCanvas）。

支持自定义二维码渲染规则，可通过uQRCode API得到矩阵信息后，自行实现canvas或view+css渲染二维码，如随机颜色、圆点、方块、块与块之间的间距等，详情参考示例项目。

### 插件市场
[https://ext.dcloud.net.cn/plugin?id=1287](https://ext.dcloud.net.cn/plugin?id=1287)

### github
[https://github.com/Sansnn/uQRCode](https://github.com/Sansnn/uQRCode)

### npm
[https://www.npmjs.com/package/u-qrcode](https://www.npmjs.com/package/u-qrcode)

### 示例预览
[https://static-c15f4b57-ef97-4d2b-b939-f580f910d7e2.bspapp.com](https://static-c15f4b57-ef97-4d2b-b939-f580f910d7e2.bspapp.com)

### 二维码
**什么是QR码**

QR码属于矩阵式二维码中的一个种类，由DENSO(日本电装)公司开发，由JIS和ISO将其标准化。

**QR码的特点**

一是高速读取(QR就是取自“Quick Response”的首字母)，通过摄像头从拍摄到解码到显示内容也就三秒左右，对摄像的角度也没有什么要求；

二是高容量、高密度，理论上内容经过压缩处理后可以存7089个数字，4296个字母和数字混合字符，2953个8位字节数据，1817个汉字；

三是支持纠错处理，按照QR码的标准文档说明，QR码的纠错分为4个级别，分别是：
- level L : 最大 7% 的错误能够被纠正；
- level M : 最大 15% 的错误能够被纠正；
- level Q : 最大 25% 的错误能够被纠正；
- level H : 最大 30% 的错误能够被纠正；

四是结构化，看似无规则的图形，其实对区域有严格的定义。

更多二维码介绍及原理：[https://blog.csdn.net/jason_ldh/article/details/11801355](https://blog.csdn.net/jason_ldh/article/details/11801355)

### 组件使用

导入`u-qrcode`组件后，在 `template` 中创建 `<u-qrcode/>` 组件

```html
<u-qrcode ref="qrcode" canvas-id="qrcode" value="uQRCode"></u-qrcode>
```

### 属性说明
|属性名		|类型		|可选值	|默认值	|是否必填	|说明																								|
|---			|---		|---		|---		|---			|:---																								|
|canvasId	|String	|-			|-			|是				|组件标识/canvasId																	|
|value		|String	|-			|-			|是				|二维码内容																					|
|size			|Number	|-			|354		|否				|二维码大小，默认单位px，rpx需要使用uni.upx2px()转换|
|options	|Object	|-			|-			|否				|参数可选项，详见下方options说明										|

### 事件说明
|事件名		|参数	|返回值	|说明																													|
|---			|---	|---		|:---																													|
|click		|-		|void		|点击事件																											|
|complete	|-		|Object	|生成完成事件，返回值success: true表示生成成功，false生成失败	|

### 方法说明
|方法名					|参数						|返回值	|说明					|
|---						|---						|---		|:---					|
|remake					|-							|void		|重新生成			|
|toTempFilePath	|Object:callback|void		|导出临时路径	|
|save						|Object:callback|void		|保存					|

#### options说明
|属性名							|类型					|可选值					|默认值	|是否必填	|说明																					|
|---								|---					|---						|---		|---			|:---																					|
|typeNumber					|Number				|-							|-1			|否				|二维码版本																		|
|errorCorrectLevel	|String/Number|L/M/Q/H/1/0/3/2|H			|否				|纠错等级L/M/Q/H分别对应1/0/3/2								|
|useDynamicSize			|Boolean			|-							|false	|否				|是否使用动态尺寸，可以去除二维码小块白色细线	|
|margin							|Number				|-							|0			|否				|填充边距，默认单位px													|
|background					|Object				|-							|-			|否				|背景设置，详见下方options.background说明			|
|foreground					|Object				|-							|-			|否				|前景设置，详见下方options.foreground说明			|
|positionDetection	|Object				|-							|-			|否				|定位角设置，详见下方options.positionDetection说明		|
|separator					|Object				|-							|-			|否				|分割图案设置，详见下方options.separator说明	|
|alignment					|Object				|-							|-			|否				|对齐图案设置，详见下方options.alignment说明	|
|timing							|Object				|-							|-			|否				|时序图案设置，详见下方options.timing说明	|
|darkBlock					|Object				|-							|-			|否				|暗块设置，详见下方options.darkBlock说明			|
|versionInformation	|Object				|-							|-			|否				|版本信息设置，详见下方options.versionInformation说明	|

#### options.background说明
|属性名	|类型		|可选值	|默认值	|是否必填	|说明																				|
|---		|---		|---		|---		|---			|:---																				|
|color	|String	|-			|#FFFFFF|否				|背景色，若需要透明背景可设置为rgba(0,0,0,0)|
|image	|Object	|-			|-			|否				|背景图片设置，详见下方options.background.image说明|

#### options.background.image说明
|属性名	|类型					|可选值																							|默认值								|是否必填	|说明																								|
|---		|---					|---																								|---									|---			|:---																								|
|src		|String				|-																									|-										|否				|背景图片路径																				|
|width	|Number				|-																									|1										|否				|指定背景图片宽度，1为二维码size的100%							|
|height	|Number				|-																									|1										|否				|指定背景图片高度，1为二维码size的100%							|
|align	|Array<String>|['left'/'center'/'right', 'top'/'center'/'bottom']	|['center', 'center']	|否				|指定背景图片对齐方式，[0]为水平方位，[1]为垂直方位	|
|anchor	|Array<Number>|-																									|[0, 0]								|否				|指定背景图片锚点，[0]为X轴偏移量，[1]为Y轴偏移量		|
|alpha	|Number				|0-1																								|1										|否				|指定背景图片透明度																	|

#### options.foreground说明
|属性名	|类型		|可选值	|默认值	|是否必填	|说明																								|
|---		|---		|---		|---		|---			|:---																								|
|color	|String	|-			|#FFFFFF|否				|前景色																							|
|image	|Object	|-			|-			|否				|前景图片设置，详见下方options.foreground.image说明	|

#### options.foreground.image说明
|属性名	|类型					|可选值																							|默认值								|是否必填	|说明																								|
|---		|---					|---																								|---									|---			|:---																								|
|src		|String				|-																									|-										|否				|前景图片路径																				|
|width	|Number				|-																									|1/4									|否				|指定前景图片宽度，1为二维码size的100%							|
|height	|Number				|-																									|1/4									|否				|指定前景图片高度，1为二维码size的100%							|
|align	|Array<String>|['left'/'center'/'right', 'top'/'center'/'bottom']	|['center', 'center']	|否				|指定前景图片对齐方式，[0]为水平方位，[1]为垂直方位	|
|anchor	|Array<Number>|-																									|[0, 0]								|否				|指定前景图片锚点，[0]为X轴偏移量，[1]为Y轴偏移量		|

#### options.positionDetection说明
|属性名					|类型		|可选值	|默认值										|是否必填	|说明																|
|---						|---		|---		|---											|---			|:---																|
|backgroundColor|String	|-			|options.background.color	|否				|定位角区域背景色，默认值跟随背景色	|
|foregroundColor|String	|-			|options.foreground.color	|否				|定位角小块颜色，默认值跟随前景色		|

#### options.separator说明
|属性名	|类型		|可选值	|默认值										|是否必填	|说明														|
|---		|---		|---		|---											|---			|:---														|
|color	|String	|-			|options.background.color	|否				|分割区域颜色，默认值跟随背景色	|

#### options.alignment说明
|属性名					|类型		|可选值	|默认值										|是否必填	|说明															|
|---						|---		|---		|---											|---			|:---															|
|backgroundColor|String	|-			|options.background.color	|否				|对齐区域背景色，默认值跟随背景色	|
|foregroundColor|String	|-			|options.foreground.color	|否				|对齐小块颜色，默认值跟随前景色		|

#### options.timing说明
|属性名					|类型		|可选值	|默认值										|是否必填	|说明															|
|---						|---		|---		|---											|---			|:---															|
|backgroundColor|String	|-			|options.background.color	|否				|时序区域背景色，默认值跟随背景色	|
|foregroundColor|String	|-			|options.foreground.color	|否				|时序小块颜色，默认值跟随前景色		|

#### options.darkBlock说明
|属性名	|类型		|可选值	|默认值										|是否必填	|说明												|
|---		|---		|---		|---											|---			|:---												|
|color	|String	|-			|options.foreground.color	|否				|暗块颜色，默认值跟随前景色	|

#### options.versionInformation说明
|属性名					|类型		|可选值	|默认值										|是否必填	|说明																	|
|---						|---		|---		|---											|---			|:---																	|
|backgroundColor|String	|-			|options.background.color	|否				|版本信息区域背景色，默认值跟随背景色	|
|foregroundColor|String	|-			|options.foreground.color	|否				|版本信息小块颜色，默认值跟随前景色		|

### u-qrcode.js使用

引入u-qrcode.js

``` javascript
import uQRCode from '../../uni_modules/Sansnn-uQRCode/js_sdk/u-qrcode';
```

或者使用npm安装

> npm i u-qrcode

``` javascript
import uQRCode from 'u-qrcode';
```

nodejs引入

``` javascript
import uQRCode from 'u-qrcode/module';
```

在 `template` 中创建 `<canvas/>` 组件并设置 `id`，画布宽高

```html
<canvas id="qrcode" canvas-id="qrcode" :style="{ width: `${size}px`, height: `${size}px` }"></canvas>
```

在 `script` 中调用生成方法

```javascript
import uQRCode from '../../uni_modules/Sansnn-uQRCode/js_sdk/u-qrcode';

export default {
  data() {
    return {
      text: 'uQRCode',
      size: 256
    }
  },
  onReady() {
    const ctx = uni.createCanvasContext('qrcode');
    const uqrcode = new uQRCode(
      {
        text: this.text,
        size: this.size
      },
      ctx
    );
    uqrcode.make();
    uqrcode.draw();
  }
}
```

### new uQRCode(options, canvasContext, loadImage)说明

|属性名				|类型		|可选值	|默认值	|是否必填	|说明																																																																									|
|---					|---		|---		|---		|---			|:---																																																																									|
|options			|Object	|-			|-			|是				|包含组件属性中的options的所有属性，详见下方options说明																																																|
|canvasContext|Object	|-			|-			|是				|canvas绘画上下文																																																																			|
|loadImage		|Promise|-			|-			|否				|绘制图片时，某些平台必传，例如微信小程序2d绘图需要创建Image对象，不能直接使用路径，这时就需要传入canvas.createImage给loadImage方法，否则无法绘制图片	|

#### options说明，包含组件属性中的options的所有属性，下方仅列举未包含的属性，其余属性请移步到组件属性options说明查看
|属性名	|类型		|可选值	|默认值	|是否必填	|说明				|
|---		|---		|---		|---		|---			|:---				|
|text		|String	|-			|-			|是				|二维码内容	|
|size		|Number	|-			|354		|否				|二维码大小	|

### uQRCode实例属性
|属性名				|类型		|说明										|
|---					|---		|:---										|
|options			|Object	|实例化传入的选项值			|
|canvasContext|Object	|画布实例								|
|makeData			|Object	|制作二维码全部数据			|
|modules			|Array	|制作二维码主要模块数据	|
|moduleCount	|Number	|模块数量								|

### uQRCode实例方法
|方法名	|参数		|返回值	|说明						|
|---		|---		|---		|:---						|
|make		|-			|void		|制作二维码方法	|
|draw		|options|Promise|绘制二维码方法，绘制层级关系，最底层背景 -> 背景图片 -> 前景 -> 最顶层前景图片，options见下方说明	|

#### draw(options)说明
|属性名							|类型										|可选值	|默认值	|是否必填	|说明																				|
|---								|---										|---		|---		|---			|:---																				|
|drawBackground			|Object: {before, after}|-			|-			|否				|绘制背景前后可执行自定义方法before，after	|
|drawBackgroundImage|Object: {before, after}|-			|-			|否				|绘制背景图前后可执行自定义方法before，after|
|drawForeground			|Object: {before, after}|-			|-			|否				|绘制前景前后可执行自定义方法before，after	|
|drawForegroundImage|Object: {before, after}|-			|-			|否				|绘制前景图前后可执行自定义方法before，after|

### uQRCode静态属性
|属性名						|类型		|说明										|
|---							|---		|:---										|
|errorCorrectLevel|Object	|纠错等级								|
|defaults					|Object	|预设默认值							|

### uQRCode静态方法
|方法名			|参数	|返回值					|说明							|
|---				|---	|---						|:---							|
|deepReplace|o, r	|替换后的新对象	|对象属性深度替换	|

### 常见问题

**如何扫码跳转指定网页**

二维码内容直接放入完整的网页地址即可，例如：`https://ext.dcloud.net.cn/plugin?id=1287`。微信客户端不能是ip地址。

**nvue打包后生成失败**

Canvas是作为独立的模块，打包时需要选择使用Canvas模块才能正常使用相关的功能。 需要在manifest.json的代码视图中配置如下（暂时还不支持可视化界面操作）：
```javascript
"app-plus" : {
  /* 模块配置 */
  "modules" : {
    "Canvas" : "nvue canvas"    //使用Canvas模块
  },
  //...
},
//...
```
保存好提交云端打包。
