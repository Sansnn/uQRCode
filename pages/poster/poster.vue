<template>
	<view>
		<view class="page-background"></view>

		<canvas class="qrcode-canvas" canvas-id="qrcode" style="width: 200px;height: 200px;" />

		<view class="page-container">
			<view class="content">
				<view class="poster-image">
					<image v-if="posterSrc" :src="posterSrc" mode="aspectFit"></image>
				</view>
				<canvas class="poster-canvas" canvas-id="poster" :style="{width: `${posterCanvasWidth}px`, height: `${posterCanvasHeight}px`}" />
			</view>
		</view>

		<view class="page-foot">
			<view class="template-list">
				<view class="template-item" v-for="(x, xi) in posterTemplates" :key="xi" @tap="create(x)" :class="{'checked': x.checked}"
				 :style="{width: x.thumbnailWidth}">
					<image :src="x.thumbnailUrl" />
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view class="tips">长按图片保存</view>
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<view class="tips" @tap="save()">保存到相册</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'

	export default {
		data() {
			return {
				QRCodeText: 'uQRCode',
				QRCodeSrc: '',
				posterSrc: '',
				posterCanvasWidth: 0, // 画布宽度
				posterCanvasHeight: 0, // 画布高度
				posterTemplates: [{
					template: 'template223001',
					canvasWidth: 500,
					canvasHeight: 820,
					thumbnailWidth: '54px',
					thumbnailUrl: '/static/poster-template223001-thumb.jpg',
					backgroundUrl: '/static/poster-template223001-background.jpg',
					checked: false
				}, {
					template: 'template223002',
					canvasWidth: 500,
					canvasHeight: 500,
					thumbnailWidth: '88px',
					thumbnailUrl: '/static/poster-template223002-thumb.jpg',
					backgroundUrl: null,
					checked: false
				}]
			}
		},
		onLoad() {
			uni.showLoading({
				title: '二维码生成中',
				mask: true
			})

			// 生成二维码
			uQRCode.make({
				canvasId: 'qrcode',
				text: this.QRCodeText,
				size: 200,
				success: res => {
					this.QRCodeSrc = res
					// 默认生成第一张海报
					this.create(this.posterTemplates[0])
				}
			})
		},
		methods: {
			create(posterTemplate) {
				if (posterTemplate.checked) {
					return
				}

				uni.showLoading({
					title: '海报生成中',
					mask: true
				})

				this.posterTemplates.forEach(x => {
					x.checked = false
				})
				posterTemplate.checked = true

				this.posterCanvasWidth = posterTemplate.canvasWidth
				this.posterCanvasHeight = posterTemplate.canvasHeight

				this.posterSrc = ''

				setTimeout(() => {
					switch (posterTemplate.template) {
						case 'template223001':
							this.template223001({
								canvasId: 'poster',
								canvasWidth: posterTemplate.canvasWidth,
								canvasHeight: posterTemplate.canvasHeight,
								backgroundSrc: posterTemplate.backgroundUrl,
								logoSrc: '/static/logo.png',
								name: 'uQRCode',
								text: '长按扫描二维码~',
								QRCodeSrc: this.QRCodeSrc,
								success: res => {
									this.posterSrc = res
									uni.hideLoading()
								}
							})
							break
						case 'template223002':
							this.template223002({
								canvasId: 'poster',
								canvasWidth: posterTemplate.canvasWidth,
								canvasHeight: posterTemplate.canvasHeight,
								QRCodeSrc: this.QRCodeSrc,
								success: res => {
									this.posterSrc = res
									uni.hideLoading()
								}
							})
							break
					}
				}, 100)
			},
			save() {
				uni.saveImageToPhotosAlbum({
					filePath: this.posterSrc,
					success: () => {
						uni.showToast({
							icon: 'none',
							title: '保存成功'
						})
					}
				})
			},
			template223001(options) {
				let {
					canvasWidth,
					canvasHeight,
					backgroundSrc,
					logoSrc,
					name,
					text,
					QRCodeSrc
				} = options

				// 绑定画布
				var ctx = uni.createCanvasContext(options.canvasId)
				// 清除画布
				ctx.clearRect(0, 0, canvasWidth, canvasHeight)

				// 获取背景图片信息
				let backgroundImageInfo = {
					"width": "500",
					"height": "667"
				}
				// 设置背景图片宽高
				let backgroundWidth = canvasWidth
				let backgroundHeight = backgroundImageInfo.height * canvasWidth / backgroundImageInfo.width
				// 填充背景图片
				ctx.drawImage(backgroundSrc, 0, 0, backgroundWidth, backgroundHeight)

				// 设置标志图片宽高坐标
				let logoWidth = 80
				let logoHeight = 80
				let logoX = 36
				let logoY = backgroundHeight + (canvasHeight - backgroundHeight) / 2 - logoHeight / 2
				// 绘制为圆形标志
				ctx.save()
				ctx.beginPath()
				// 先画个圆  前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
				ctx.arc(logoWidth / 2 + logoX, logoHeight / 2 + logoY, logoWidth / 2, 0, Math.PI * 2, false)
				ctx.closePath()
				// 画好了圆 剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 这也是我们要save上下文的原因
				ctx.clip()
				// 填充标志图片
				ctx.drawImage(logoSrc, logoX, logoY, logoWidth, logoHeight)
				// 恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 还可以继续绘制
				ctx.restore()

				// 名称最大长度限制 10，超出为省略号
				if (name.length > 10) {
					name = name.substring(0, 10) + '...'
				}
				// 计算文字定位距离
				let nameX = logoX + logoWidth + 10
				let nameY = logoY + 32
				let nameFontSize = 20
				// 设置名称文字样式
				ctx.setFillStyle('#000000')
				ctx.setFontSize(nameFontSize)
				// 填充名称到画布
				ctx.fillText(name, nameX, nameY)

				// 计算文字定位距离
				let textX = nameX
				let textY = nameY + 32
				let textFontSize = 16
				// 设置分享文案文字样式
				ctx.setFillStyle('#999999')
				ctx.setFontSize(textFontSize)
				// 填充分享文案到画布
				ctx.fillText(text, textX, textY)

				// 设置二维码图片宽高
				let QRCodeWidth = 100
				let QRCodeHeight = 100
				// 计算二维码图片定位距离
				let QRCodeX = canvasWidth - QRCodeWidth - 36
				let QRCodeY = backgroundHeight + (canvasHeight - backgroundHeight) / 2 - QRCodeHeight / 2
				// 填充二维码图片
				ctx.drawImage(QRCodeSrc, QRCodeX, QRCodeY, QRCodeWidth, QRCodeHeight)

				// 输出到画布中
				ctx.draw(false, () => {
					// 绘图全部完成后生成文件路径
					uni.canvasToTempFilePath({
						canvasId: options.canvasId,
						fileType: 'jpg',
						success: (res) => {
							options.success && options.success(res.tempFilePath)
						}
					})
				})
			},
			template223002(options) {
				let {
					canvasWidth,
					canvasHeight,
					QRCodeSrc
				} = options

				// 绑定画布
				var ctx = uni.createCanvasContext(options.canvasId)
				// 清除画布
				ctx.clearRect(0, 0, canvasWidth, canvasHeight)

				// 填充二维码图片，并设置边距
				ctx.drawImage(QRCodeSrc, 15, 15, canvasWidth - 30, canvasHeight - 30)

				// 输出到画布中
				ctx.draw(false, () => {
					// 绘图全部完成后生成文件路径
					uni.canvasToTempFilePath({
						canvasId: options.canvasId,
						fileType: 'jpg',
						success: (res) => {
							options.success && options.success(res.tempFilePath)
						}
					})
				})
			}
		}
	}
</script>

<style>
	.page-background {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10;
		background-color: #4d4d4d;
	}
	
	.page-container {
		position: relative;
		z-index: 20;
	}

	.qrcode-canvas {
		position: fixed;
		right: 100vw;
		bottom: 100vh;
		z-index: -999;
	}

	.content {
		width: 100%;
		height: calc(100vh - 44px - 150px);
		background: #4d4d4d;
		overflow-y: scroll;
	}

	.poster-image {
		width: 100%;
		height: 100%;
		min-height: 500rpx;
		padding: 100rpx;
		box-sizing: border-box;
	}

	.poster-image image {
		width: 100%;
		height: 100%;
	}

	.poster-canvas {
		position: fixed;
		right: 100vw;
		bottom: 100vh;
	}

	.page-foot {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 30;
		background-color: #282828;
	}

	.template-list {
		display: flex;
		height: 100px;
	}

	.template-item {
		position: relative;
		height: 88px;
		margin: 6px 0 6px 6px;
	}

	.template-item::before {
		content: "";
		position: absolute;
		z-index: 10;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.template-item.checked::before {
		border: 3px solid #44aa33;
	}

	.template-item image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.tips {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 50px;
		margin-bottom: env(safe-area-inset-bottom);
		background: #ffffff;
		font-size: 16px;
		font-weight: 500;
		color: #dd5544;
	}
</style>
