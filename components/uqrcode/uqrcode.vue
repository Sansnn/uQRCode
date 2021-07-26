<template>
	<view class="uqrcode">
		<canvas id="qrcode" canvas-id="qrcode" :style="{'width': `${options.size}px`, 'height': `${options.size}px`}" />
	</view>
</template>

<script>
	import uqrcode from './common/uqrcode'

	export default {
		name: 'uqrcode',
		data() {
			return {
				options: {
					canvasId: 'qrcode',
					size: 354,
					margin: 10,
					text: ''
				}
			}
		},
		methods: {
			make(options) {
				return uqrcode.make(Object.assign(this.options, options), this)
			}
		}
	}
</script>

<style>

</style>
