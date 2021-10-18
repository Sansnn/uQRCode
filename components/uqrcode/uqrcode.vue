<template>
	<view class="uqrcode" v-if="options.canvasId">
		<canvas :id="options.canvasId" :canvas-id="options.canvasId"
			:style="{'width': `${options.size}px`, 'height': `${options.size}px`}" />
	</view>
</template>

<script>
	import uqrcode from './common/uqrcode'

	export default {
		name: 'uqrcode',
		data() {
			return {
				options: {
					canvasId: '',
					size: 354,
					margin: 10,
					text: ''
				},
				result: {}
			}
		},
		created() {
			this.options.canvasId = `qrcode_${this.uuid()}`
		},
		methods: {
			make(options) {
				return new Promise((resolve, reject) => {
					uqrcode.make(Object.assign(this.options, options), this).then(res => {
						this.result = res
						resolve({
							...res
						})
					}).catch(err => {
						reject(err)
					})
				})
			},
			save() {
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: 'H5长按image保存'
				})
				// #endif
				// #ifndef H5
				console.log(this.result)
				uni.saveImageToPhotosAlbum({
					filePath: this.result.tempFilePath,
					success: (res) => {
						uni.showToast({
							icon: 'success',
							title: '保存成功'
						})
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: JSON.stringify(err)
						})
					}
				})
				// #endif
			},
			uuid(len = 32, firstU = true, radix = null) {
				let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
				let uuid = [];
				radix = radix || chars.length;

				if (len) {
					// 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
					for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
				} else {
					let r;
					// rfc4122标准要求返回的uuid中,某些位为固定的字符
					uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
					uuid[14] = '4';

					for (let i = 0; i < 36; i++) {
						if (!uuid[i]) {
							r = 0 | Math.random() * 16;
							uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
						}
					}
				}

				// 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
				if (firstU) {
					uuid.shift();
					return 'u' + uuid.join('');
				} else {
					return uuid.join('');
				}
			}
		}
	}
</script>

<style>

</style>
