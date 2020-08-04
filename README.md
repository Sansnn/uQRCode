# uQRCode
uni-app 二维码生成插件

uQRCode 生成方式简单，可扩展性高，如有复杂需求可通过自定义组件或修改源码完成需求。已测试H5、微信小程序、iPhoneXsMax真机。

本示例项目中的自定义组件旨在抛砖引玉，有其他需求的朋友可自行扩展，自定义组件参考 ``/components/uni-qrcode/uni-qrcode.vue`` ，自定义组件使用案例参考 ``/pages/component/qrcode/qrcode.vue`` 。

联系方式：QQ540000228。

最近一次用于更新代码的 HBuilder X 版本为 2.8.3。

![](https://github.com/Sansnn/uQRCode/blob/master/static/demo/1.jpg)
![](https://github.com/Sansnn/uQRCode/blob/master/static/demo/2.jpg)
![](https://github.com/Sansnn/uQRCode/blob/master/static/demo/3.jpg)
![](https://github.com/Sansnn/uQRCode/blob/master/static/demo/4.jpg)
![](https://github.com/Sansnn/uQRCode/blob/master/static/demo/5.jpg)
![](https://github.com/Sansnn/uQRCode/blob/master/static/demo/6.jpg)

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

### 使用方式

在 ``script`` 中引用组件

```javascript
import uQRCode from '@/common/uqrcode.js'
```

在 ``template`` 中创建 ``<canvas/>``

```html
<canvas canvas-id="qrcode" style="width: 256px;height: 256px;" />
```

在 ``script`` 中调用 ``make()`` 方法

```javascript
export default {
  methods: {
    make() {
      uQRCode.make({
        canvasId: 'qrcode',
        componentInstance: this,
        text: 'uQRCode',
        size: 256,
        margin: 10,
        backgroundColor: '#ffffff',
        foregroundColor: '#000000',
        fileType: 'jpg',
        correctLevel: uQRCode.errorCorrectLevel.H,
        success: res => {
          console.log(res)
        }
      })
    }
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

### make(options)

生成二维码

**options参数说明：**

|参数|类型|必填|说明|
|---|---|---|:---|
|canvasId|String|是|画布标识，传入 `<canvas/>` 的 `canvas-id`|
|componentInstance|Object|否|自定义组件实例 `this` ，表示在这个自定义组件下查找拥有 `canvas-id` 的 `<canvas/>` ，如果省略，则不在任何自定义组件内查找|
|text|String|是|二维码内容|
|size|Number|否|画布尺寸大小，请与 `<canvas/>` 所设 `width` ， `height` 保持一致（默认：`256`）|
|margin|Number|否|边距，二维码实际尺寸会根据所设边距值进行缩放调整（默认：`0`）|
|backgroundColor|String|否|背景色，若设置为透明背景， `fileType` 需设置为 `'png'` ， 然后设置背景色为 `'rgba(255,255,255,0)'` 即可（默认：`'#ffffff'`）|
|foregroundColor|String|否|前景色（默认：`'#000000'`）|
|fileType|String|否|输出图片的类型，只支持 `'jpg'` 和 `'png'`（默认：`'png'`）|
|errorCorrectLevel|Number|否|纠错等级，参考属性说明 `errorCorrectLevel`（默认：`errorCorrectLevel.H`）|

### 完整示例

```html
<template>
	<view class="content">
		<view class="text">uQRCode二维码生成</view>
		<view class="canvas">
			<canvas canvas-id="qrcode" :style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}" />
			<text>canvas</text>
		</view>
		<view class="image">
			<image :src="qrcodeSrc" />
			<text>image</text>
		</view>
		<input class="input" v-model="qrcodeText" placeholder="输入内容生成二维码" />
		<button class="button" type="primary" @tap="make()">生成二维码</button>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'

	export default {
		data() {
			return {
				qrcodeText: 'uQRCode',
				qrcodeSize: uni.upx2px(256),
				qrcodeSrc: ''
			}
		},
		onLoad() {
			this.make()
		},
		methods: {
			make() {
				uni.showLoading({
					title: '二维码生成中',
					mask: true
				})

				uQRCode.make({
					canvasId: 'qrcode',
					text: this.qrcodeText,
					size: this.qrcodeSize,
					margin: 10,
					success: res => {
						this.qrcodeSrc = res
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #f0f0f0;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.text {
		display: flex;
		justify-content: center;
		margin-top: 50rpx;
		font-size: 36rpx;
		color: #666666;
	}

	.canvas {
		margin-top: 50rpx;
		text-align: center;
	}

	.image {
		width: 258rpx;
		margin-top: 50rpx;
		text-align: center;
	}

	.image image {
		display: block;
		width: 258rpx;
		height: 258rpx;
	}

	.input {
		width: 600rpx;
		height: 40px;
		margin: 50rpx 0;
		padding: 0 20rpx;
		border: 1px solid #b0b0b0;
		border-radius: 5px;
		background-color: #ffffff;
		box-sizing: border-box;
	}

	.button {
		width: 690rpx;
		margin: 10rpx;
	}
	
	.button:last-child {
		margin-bottom: 50rpx;
	}
</style>
```

**Tips**
- 示例项目中的图片采集于互联网，仅作为案例展示，不作为广告/商业，如有侵权，请告知删除。下载使用的用户，请勿把示例项目中的图片应用到你的项目；
- uQRCode 借鉴了 [jquery-qrcode](https://github.com/jeromeetienne/jquery-qrcode) 源码。
