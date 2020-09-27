<template>
	<view>

		<view class="block" v-if="type == 1">
			<view class="title">透明背景</view>
			<view class="component" style="background-color: #d2e9ff;">
				<uni-qrcode cid="qrcode2243" text="uQRCode" backgroundColor="rgba(255,255,255,0)" makeOnLoad />
			</view>
		</view>

		<view class="block" v-if="type == 2">
			<view class="title">
				图片背景
				<view class="tips">实现步骤，将二维码背景颜色设置为透明，再进行二次绘制</view>
			</view>
			<view class="component">
				<uni-qrcode cid="qrcode2302" text="uQRCode" foregroundColor="rgba(0,0,0,0.3)" backgroundImage="/static/background-image.jpg"
				 makeOnLoad />
			</view>
		</view>

		<view class="block" v-if="type == 3">
			<view class="title">
				设置边距
				<view class="tips">二维码实际尺寸会根据所设边距值进行缩放调整</view>
			</view>
			<view class="component" style="background-color: #f0f0f0;">
				<uni-qrcode cid="qrcode2218" text="uQRCode" :margin="20" makeOnLoad />
			</view>
		</view>

		<view class="block" v-if="type == 4">
			<view class="title">
				在二维码上绘制本地图片
				<view class="tips">实现步骤，与图片背景同理，先获取到二维码文件资源，再进行二次绘制</view>
			</view>
			<view class="component">
				<uni-qrcode cid="qrcode2307" text="uQRCode" foregroundColor="#2b9939" logo="/static/logo.png" makeOnLoad
				 @makeComplete="qrcode2307Complete" />
			</view>
		</view>

		<view class="block" v-if="type == 5">
			<view class="title">
				在二维码上绘制网络图片
				<view class="tips">实现步骤，与图片背景同理，先获取到二维码文件资源，再进行二次绘制</view>
			</view>
			<view class="component">
				<uni-qrcode cid="qrcode1446" text="uQRCode" foregroundColor="#2b9939" logo="https://img-cdn-qiniu.dcloud.net.cn/uploads/avatar/000/72/20/93_avatar_max.jpg"
				 makeOnLoad @makeComplete="qrcode1446Complete" />
			</view>
		</view>

		<view class="block" v-if="type == 6">
			<view class="title">事件触发生成</view>
			<view class="component" style="background-color: #f0f0f0;">
				<uni-qrcode cid="qrcode2233" ref="qrcode2233" text="uQRCode" />
			</view>
			<view class="operate">
				<button type="primary" size="mini" @click="qrcode2233Click()">点我</button>
			</view>
		</view>

		<view class="block" v-if="type == 7">
			<view class="title">修改背景色和前景色</view>
			<view class="component">
				<uni-qrcode cid="qrcode2229" text="uQRCode" backgroundColor="red" foregroundColor="blue" makeOnLoad @makeComplete="qrcode2229Complete" />
			</view>
		</view>

		<view v-if="type == 8">
			<view class="block">
				<view class="title">canvas</view>
				<view class="component">
					<canvas id="batch" canvas-id="batch" :style="{width: `${size}px`, height: `${size}px`}" />
				</view>
			</view>

			<view class="block" v-for="(item, index) in list" :key="index">
				<view class="title">{{item.qrcodeText}}</view>
				<view class="component">
					<image :src="item.qrcodeSrc" :style="{width: `${size}px`, height: `${size}px`}" />
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	import UniQrcode from '@/components/uni-qrcode/uni-qrcode'

	export default {
		components: {
			UniQrcode
		},
		data() {
			return {
				type: null,
				size: uni.upx2px(590),
				list: [{
					id: '1',
					qrcodeText: '8g7ahja0vx'
				}, {
					id: '2',
					qrcodeText: '5awg5jh89u'
				}, {
					id: '3',
					qrcodeText: '09ikkz48we'
				}, {
					id: '4',
					qrcodeText: 'zghuu8iteg'
				}]
			}
		},
		async onLoad(options) {
			this.type = options.type
			if (this.type == 8) {
				for (var i = 0; i < this.list.length; i++) {
					var item = this.list[i]
					var res = await uQRCode.make({
						canvasId: 'batch',
						text: item.qrcodeText,
						size: this.size
					})
					this.$set(item, 'qrcodeSrc', res)
				}
			}
		},
		methods: {
			qrcode2233Click() {
				this.$refs.qrcode2233.make()
			},
			qrcode2229Complete(e) {
				console.log('qrcode2229Complete', e)
			},
			qrcode2307Complete(e) {
				console.log('qrcode2307Complete', e)
			},
			qrcode1446Complete(e) {
				console.log('qrcode1446Complete', e)
			}
		}
	}
</script>

<style>
	page {
		background-color: #f0f0f0;
	}

	.block {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: #ffffff;
	}

	.title {
		font-size: 30rpx;
		font-weight: 500;
		padding-bottom: 20rpx;
		line-height: 1.5;
	}

	.tips {
		font-size: 24rpx;
		color: #888888;
	}

	.component {
		display: flex;
		justify-content: center;
		padding: 20rpx 0;
	}

	.operate {
		display: flex;
		justify-content: center;
		padding: 20rpx 0;
	}
</style>
