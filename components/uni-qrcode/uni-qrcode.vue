<template>
	<view>
		<canvas :id="cid" :canvas-id="cid" :style="{width: `${size}px`, height: `${size}px`}" />
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'

	export default {
		props: {
			cid: {
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
					canvasId: this.cid,
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
			drawBackgroundImage(qrcode) {
				var ctx = uni.createCanvasContext(this.cid, this)

				ctx.drawImage(this.backgroundImage, 0, 0, this.size, this.size)

				ctx.drawImage(qrcode, 0, 0, this.size, this.size)

				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: this.cid,
						success: (res) => {
							this.filePath = res.tempFilePath
						}
					})
				})
			},
			drawLogo(qrcode) {
				var ctx = uni.createCanvasContext(this.cid, this)

				ctx.drawImage(qrcode, 0, 0, this.size, this.size)

				var logoSize = this.size / 4
				var logoX = this.size / 2 - logoSize / 2
				var logoY = logoX

				var borderSize = logoSize + 10
				var borderX = this.size / 2 - borderSize / 2
				var borderY = borderX
				var borderRadius = 5
				
				this.fillRoundRect(ctx, borderRadius, borderX, borderY, borderSize, borderSize)
				
				ctx.drawImage(this.logo, logoX, logoY, logoSize, logoSize)

				ctx.draw(false, () => {
					uni.canvasToTempFilePath({
						canvasId: this.cid,
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
			}
		}
	}
</script>
