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
		<view class="component">
			<view class="component-title">自定义组件</view>
			<view class="component-buttons">
				<button class="button" type="default" @tap="toComponent(1)">透明背景</button>
				<button class="button" type="default" @tap="toComponent(2)">图片背景</button>
				<button class="button" type="default" @tap="toComponent(3)">设置边距</button>
				<button class="button" type="default" @tap="toComponent(4)">在二维码上绘制本地图片</button>
				<button class="button" type="default" @tap="toComponent(5)">在二维码上绘制网络图片</button>
				<button class="button" type="default" @tap="toComponent(6)">事件触发生成</button>
				<button class="button" type="default" @tap="toComponent(7)">修改背景色和前景色</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'

	export default {
		data() {
			return {
				qrcodeText: 'uQRCode 更新时间：2020-08-04',
				qrcodeSize: uni.upx2px(1770/4),
				qrcodeSrc: ''
			}
		},
		onLoad() {
			console.log('errorCorrectLevel', uQRCode.errorCorrectLevel)
			console.log('defaults', uQRCode.defaults)
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
						console.log(res)
						this.qrcodeSrc = res
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			toComponent(type) {
				uni.navigateTo({
					url: '/pages/component/qrcode/qrcode?type=' + type
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
		margin-top: var(--status-bar-height);
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

	.canvas canvas {
		margin: 0 auto;
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

	.component {
		margin-top: 30rpx;
		text-align: center;
	}

	.component-title {
		display: inline-block;
		padding: 20rpx 40rpx;
		border-bottom: 2px solid #d8d8d8;
		font-size: 36rpx;
	}

	.component-buttons {
		margin-top: 30rpx;
	}
</style>
