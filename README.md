# uQRCode

uQRCode 生成方式简单，可扩展性高，如有复杂需求可通过自定义组件或修改源码完成需求。已测试H5、微信小程序、iPhoneXsMax真机。

支持自定义二维码渲染规则，可通过 ``getModules`` 方法得到矩阵信息后，自行实现canvas渲染二维码，如随机颜色、圆点、方块、块与块之间的间距等，详情见示例中的 ``custom``。

支持nvue生成，但暂不支持保存。

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

### 简单使用

在 ``template`` 中创建 ``<uqrcode/>`` 并设置 ``ref`` 属性

```html
<uqrcode ref="uqrcode"></uqrcode>
```

在 ``script`` 中调用生成方法

```javascript
export default {
  onReady() {
    this.$refs
    	.uqrcode
    	.make({
    		size: 354,
    		text: 'uQRCode'
    	})
    	.then(res => {
    		// 返回的res与uni.canvasToTempFilePath返回一致
    		console.log(res)
    	})
  }
}
```

### 高级使用

在 ``template`` 中创建 ``<canvas/>`` 并设置 ``id``，画布宽高

```html
<canvas id="qrcode" canvas-id="qrcode" style="width: 354px;height: 354px;" />
```

在 ``script`` 中引用js文件并调用生成方法

```javascript
import uQRCode from '@/components/uqrcode/common/uqrcode.js'

export default {
  onReady() {
    uQRCode.make({
    	canvasId: 'qrcode',
    	componentInstance: this,
    	size: 354,
    	margin: 10,
    	text: 'uQRCode',
    	backgroundColor: '#ffffff',
    	foregroundColor: '#ff0000',
    	fileType: 'png',
    	errorCorrectLevel: uQRCode.errorCorrectLevel.H
    })
    .then(res => {
    	console.log(res)
    })
  }
}
```

### 属性说明

|属性名|说明|
|---|:---|
|errorCorrectLevel|纠错等级，包含 `errorCorrectLevel.L`、`errorCorrectLevel.M`、`errorCorrectLevel.Q`、`errorCorrectLevel.H` 四个级别，`L`: 最大 7% 的错误能够被纠正；`M`: 最大 15% 的错误能够被纠正；`Q`: 最大 25% 的错误能够被纠正；`H`: 最大 30% 的错误能够被纠正。|
|defaults|二维码生成参数的默认值。|

### 方法说明

|方法名|说明|
|---|:---|
|[make](#makeoptions)|生成二维码。|
|[getModules](#getModulesoptions)|可以得到二维码矩阵信息，可根据返回的矩阵信息自行实现二维码生成。|

### make(options)

生成二维码

**options参数说明：**

|参数|类型|必填|说明|
|---|---|---|:---|
|canvasId|String|是|画布标识，传入 `<canvas/>` 的 `canvas-id`|
|componentInstance|Object|否|自定义组件实例 `this` ，表示在这个自定义组件下查找拥有 `canvas-id` 的 `<canvas/>` ，如果省略，则不在任何自定义组件内查找|
|text|String|是|二维码内容|
|size|Number|否|画布尺寸大小，请与 `<canvas/>` 所设 `width` ， `height` 保持一致（默认：`354`）|
|margin|Number|否|边距，二维码实际尺寸会根据所设边距值进行缩放调整（默认：`0`）|
|backgroundColor|String|否|背景色，若设置为透明背景， `fileType` 需设置为 `'png'` ， 然后设置背景色为 `'rgba(255,255,255,0)'` 即可（默认：`'#ffffff'`）|
|foregroundColor|String|否|前景色（默认：`'#000000'`）|
|fileType|String|否|输出图片的类型，只支持 `'jpg'` 和 `'png'`（默认：`'png'`）|
|errorCorrectLevel|Number|否|纠错等级，参考属性说明 `errorCorrectLevel`（默认：`errorCorrectLevel.H`）|
|enableDelay|Boolen|否|启用延迟绘制（默认：`false`）|

### getModules(options)

根据内容得到二维码矩阵信息

|参数|类型|必填|说明|
|---|---|---|:---|
|text|String|是|二维码内容|
|errorCorrectLevel|Number|否|纠错等级，参考属性说明 `errorCorrectLevel`（默认：`errorCorrectLevel.H`）|

### 使用建议
如需在进入页面时生成二维码，建议使用`onReady`，不推荐在`onLoad`中生成。

关于高级使用：canvas在二维码生成中请当做一个生成工具来看待，它的作用仅是绘制出二维码。应把生成回调得到的资源保存并使用，显示用image图片组件，原因是方便操作，例如调整大小，或是H5端长按保存或识别，所以canvas应将它放在看不见的地方。不能用`display:none;overflow:hidden;`隐藏，否则生成空白。这里推荐canvas的隐藏样式代码
```html
<style>
	.canvas-hide {
		/* 1 */
		position: fixed;
		right: 100vw;
		bottom: 100vh;
		/* 2 */
		z-index: -9999;
		/* 3 */
		opacity: 0;
	}
</style>
```

### 常见问题
**二维码生成不完整**

size的单位是px，请尽量避免使用rpx，如果canvas的单位是rpx，那么不同设备屏幕分辨率不一样，rpx转换成px后的画布尺寸不足以放下全部内容，实际绘制图案超出，就会出现不完整或者没有填充完整画布的情况。

另外还可以尝试延迟绘制，``enableDelay`` 设置为 ``true``。

**如何扫码跳转指定网页**

text参数直接放入完整的网页地址即可，例如：`https://ext.dcloud.net.cn/plugin?id=1287`。微信客户端不能是ip地址。

**H5长按识别**

canvas无法长按识别，长按识别需要是图片才行，所以只需将回调过来的资源用image组件显示即可。

### Tips
- 示例项目中的图片采集于互联网，仅作为案例展示，不作为广告/商业，如有侵权，请告知删除。下载使用的用户，请勿把示例项目中的图片应用到你的项目。
