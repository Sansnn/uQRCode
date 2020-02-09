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
		<button class="button" type="primary" @tap="poster()">二维码海报</button>
		<button class="button" type="primary" @tap="component()">自定义组件</button>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'

	export default {
		data() {
			return {
				qrcodeText: 'uQRCode',
				qrcodeSize: 129,
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
			},
			poster() {
				uni.navigateTo({
					url: '/pages/poster/poster'
				})
			},
			component() {
				uni.navigateTo({
					url: '/pages/component/qrcode/qrcode'
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
