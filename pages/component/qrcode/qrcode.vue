<template>
	<view>

		<view class="block">
			<view class="title">透明背景</view>
			<view class="component" style="background-color: #d2e9ff;">
				<uni-qrcode cid="qrcode2243" text="uQRCode" backgroundColor="rgba(255,255,255,0)" makeOnLoad />
			</view>
		</view>

		<view class="block">
			<view class="title">
				图片背景
				<view class="tips">实现步骤，将二维码背景颜色设置为透明，再进行二次绘制</view>
			</view>
			<view class="component">
				<uni-qrcode cid="qrcode2302" text="uQRCode" foregroundColor="rgba(0,0,0,0.3)" backgroundImage="/static/background-image.jpg"
				 makeOnLoad />
			</view>
		</view>

		<view class="block">
			<view class="title">
				在二维码上绘制本地图片
				<view class="tips">实现步骤，与图片背景同理，先获取到二维码文件资源，再进行二次绘制</view>
			</view>
			<view class="component">
				<uni-qrcode cid="qrcode2307" text="uQRCode" foregroundColor="#2b9939" logo="/static/logo.png" makeOnLoad @makeComplete="qrcode2307Complete" />
			</view>
		</view>

		<view class="block">
			<view class="title">
				在二维码上绘制网络图片
				<view class="tips">实现步骤，与图片背景同理，先获取到二维码文件资源，再进行二次绘制</view>
			</view>
			<view class="component">
				<uni-qrcode cid="qrcode1446" text="uQRCode" foregroundColor="#2b9939" logo="https://img-cdn-qiniu.dcloud.net.cn/uploads/avatar/000/72/20/93_avatar_max.jpg" makeOnLoad @makeComplete="qrcode1446Complete" />
			</view>
		</view>

		<view class="block">
			<view class="title">事件触发生成</view>
			<view class="component" style="background-color: #f0f0f0;">
				<uni-qrcode cid="qrcode2233" ref="qrcode2233" text="uQRCode" />
			</view>
			<view class="operate">
				<button type="primary" size="mini" @click="qrcode2233Click()">点我</button>
			</view>
		</view>

		<view class="block">
			<view class="title">
				设置边距
				<view class="tips">二维码实际尺寸会根据所设边距值进行缩放调整</view>
			</view>
			<view class="component" style="background-color: #f0f0f0;">
				<uni-qrcode cid="qrcode2218" text="uQRCode" :margin="10" makeOnLoad />
			</view>
		</view>

		<view class="block">
			<view class="title">修改背景色和前景色</view>
			<view class="component">
				<uni-qrcode cid="qrcode2229" text="uQRCode" backgroundColor="red" foregroundColor="blue" makeOnLoad @makeComplete="qrcode2229Complete" />
			</view>
		</view>

	</view>
</template>

<script>
	import uniQrcode from '@/components/uni-qrcode/uni-qrcode'

	export default {
		components: {
			uniQrcode
		},
		data() {
			return {

			}
		},
		methods: {
			qrcode2233Click() {
				this.$refs.qrcode2233.make()
			},
			qrcode2229Complete(e) {
				console.log(e)
			},
			qrcode2307Complete(e) {
				console.log(e)
			},
			qrcode1446Complete(e) {
				console.log(e)
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
