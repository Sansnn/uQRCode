# uQRCode
uni-app 二维码生成插件

### 使用方式

在 ``script`` 中引用组件

```javascript
import uQRCode from '@/common/uqrcode.js'
```

在 ``template`` 中创建 ``<canvas/>``

```html
<canvas canvas-id="qrcode" style="width: 215px;height: 215px;" />
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
        size: 215,
        margin: 10,
        backgroundColor: '#ffffff',
        foregroundColor: '#000000',
        fileType: 'jpg',
        correctLevel: uQRCode.defaults.correctLevel,
        success: res => {
          console.log(res)
        }
      })
    }
  }
}
```

### 完整示例

```html
<template>
	<view class="content">
		<view class="text">uQRCode二维码生成</view>
		<view class="canvas">
			<text>canvas</text>
			<canvas canvas-id="qrcode" :style="{width: `${qrcodeSize}px`, height: `${qrcodeSize}px`}" />
		</view>
		<view class="image">
			<text>image</text>
			<image :src="qrcodeSrc" />
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
				qrcodeSize: 215,
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
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.text {
		display: flex;
		justify-content: center;
		margin-top: 30rpx;
		font-size: 36rpx;
		color: #8f8f94;
	}

	.canvas {
		margin-top: 50rpx;
		text-align: center;
	}

	.image {
		width: 200rpx;
		margin-top: 50rpx;
		text-align: center;
	}
	
	.image image {
		width: 200rpx;
		height: 200rpx;
	}

	.input {
		width: 600rpx;
		height: 40px;
		margin-top: 50rpx;
		padding: 0 20rpx;
		border: 1px solid #b0b0b0;
		border-radius: 10rpx;
		box-sizing: border-box;
	}

	.button {
		width: 690rpx;
		margin-top: 50rpx;
	}
</style>
```

### 方法说明

|方法名|说明|
|---|---|
|[make](#makeoptions)|生成二维码|

### make(options)

生成二维码

**options参数说明：**
|参数|类型|必填|说明|
|---|---|---|---|
|canvasId|String|是|画布标识，传入 `<canvas/>` 的 `canvas-id`|
|componentInstance|Object|否|自定义组件实例 `this` ，表示在这个自定义组件下查找拥有 `canvas-id` 的 `<canvas/>` ，如果省略，则不在任何自定义组件内查找|
|text|String|是|二维码内容|
|size|Number|否|画布尺寸大小，请与 `<canvas/>` 所设 `width` ， `height` 保持一致（默认：`258`）|
|margin|Number|否|边距，二维码实际尺寸会根据所设边距值进行缩放调整（默认：`0`）|
|backgroundColor|String|否|背景色，若设置为透明背景， `fileType` 需设置为 `'png'` ， 然后设置背景色为 `'rgba(255,255,255,0)'` 即可（默认：`'#ffffff'`）|
|foregroundColor|String|否|前景色（默认：`'#000000'`）|
|fileType|String|否|输出图片的类型，只支持 `'jpg'` 和 `'png'`（默认：`'png'`）|
|correctLevel|Number|否|容错级别（默认：`3`）|

**Tips**
- uQRCode 二维码生成部分借鉴了 [jquery-qrcode](https://github.com/jeromeetienne/jquery-qrcode) 源码
