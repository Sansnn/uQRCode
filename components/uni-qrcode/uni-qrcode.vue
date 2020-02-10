<template>
	<view>
		<canvas :canvas-id="id" :style="{width: `${size}px`, height: `${size}px`}" />
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'

	export default {
		props: {
			id: {
				type: String,
				required: true
			},
			text: {
				type: String,
				required: true
			},
			size: {
				type: Number,
				default: 129
			},
			margin: {
				type: Number,
				default: 0
			},
			backgroundColor: {
				type: String,
				default: '#ffffff'
			},
			foregroundColor: {
				type: String,
				default: '#000000'
			},
			backgroundImage: {
				type: String
			},
			logo: {
				type: String
			},
			makeOnLoad: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				filePath: ''
			}
		},
		mounted() {
			if (this.makeOnLoad) {
				this.make()
			}
		},
		methods: {
			make() {
				var options = {
					canvasId: this.id,
					componentInstance: this,
					text: this.text,
					size: this.size,
					margin: this.margin,
					backgroundColor: this.backgroundColor,
					foregroundColor: this.foregroundColor,
					success: res => {
						this.filePath = res
						this.makeComplete()
					}
				}

				if (this.backgroundImage) {
					options.backgroundColor = 'rgba(255,255,255,0)'
					options.success = res => {
						this.drawBackgroundImage(res)
					}
				}

				if (this.logo) {
					options.backgroundColor = 'rgba(255,255,255,0)'
					options.success = res => {
						this.drawLogo(res)
					}
				}

				uQRCode.make(options)
			},
			makeComplete() {
				this.$emit('makeComplete', this.filePath)
			},
			async drawBackgroundImage(qrcode) {
				var ctx = uni.createCanvasContext(this.id, this)

				var backgroundImageInfo = await this.getImageInfo(this.backgroundImage)
				var backgroundImagePath = backgroundImageInfo.path

				ctx.drawImage(backgroundImagePath, 0, 0, this.size, this.size)

				ctx.drawImage(qrcode, 0, 0, this.size, this.size)

				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: this.id,
						success: (res) => {
							this.filePath = res.tempFilePath
						}
					})
				})
			},
			async drawLogo(qrcode) {
				var ctx = uni.createCanvasContext(this.id, this)

				ctx.drawImage(qrcode, 0, 0, this.size, this.size)

				var logoInfo = await this.getImageInfo(this.logo)
				var logoPath = logoInfo.path
				var logoSize = this.size / 4
				var logoX = this.size / 2 - logoSize / 2
				var logoY = logoX

				var borderSize = logoSize + 10
				var borderX = this.size / 2 - borderSize / 2
				var borderY = borderX
				var borderRadius = 5
				
				this.fillRoundRect(ctx, borderRadius, borderX, borderY, borderSize, borderSize)
				
				ctx.drawImage(logoPath, logoX, logoY, logoSize, logoSize)
				// this.drawRoundImage(ctx, logoX, logoY, logoSize, logoSize, logoPath)

				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: this.id,
						success: (res) => {
							this.filePath = res.tempFilePath
						}
					})
				})
			},
			fillRoundRect(ctx, r, x, y, w, h) {
				ctx.save()
				ctx.translate(x, y)
				ctx.beginPath()
				ctx.arc(w - r, h - r, r, 0, Math.PI / 2)
				ctx.lineTo(r, h)
				ctx.arc(r, h - r, r, Math.PI / 2, Math.PI)
				ctx.lineTo(0, r)
				ctx.arc(r, r, r, Math.PI, Math.PI * 3 / 2)
				ctx.lineTo(w - r, 0)
				ctx.arc(w - r, r, r, Math.PI * 3 / 2, Math.PI * 2)
				ctx.lineTo(w, h - r)
				ctx.closePath()
				ctx.setFillStyle('#ffffff') 
				ctx.fill()
				ctx.restore()
			},
			fillRound(ctx, x, y, w, h) {
				ctx.save()
				ctx.beginPath()
				ctx.arc(w / 2 + x, h / 2 + y, w / 2, 0, Math.PI * 2, false)
				ctx.closePath()
				ctx.setFillStyle('#ffffff') 
				ctx.fill()
				ctx.restore()
			},
			drawRoundImage(ctx, x, y, w, h, img) {
				ctx.save()
				ctx.beginPath()
				ctx.arc(w / 2 + x, h / 2 + y, w / 2, 0, Math.PI * 2, false)
				ctx.closePath()
				ctx.clip()
				ctx.drawImage(img, x, y, w, h)
				ctx.restore()
			},
			async getImageInfo(src) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: src,
						success: image => {
							resolve(image)
						},
						fail(error) {
							uni.showToast({
								icon: 'none',
								title: '图片加载失败'
							})
							reject(error)
						}
					})
				})
			}
		}
	}
</script>

<style>

</style>
