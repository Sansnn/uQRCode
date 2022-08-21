<template>
  <view class="page">
    <!-- #ifdef APP-NVUE -->
    <text class="msg">nvue</text>
    <!-- #endif -->
    <view class="input">
      <text style="font-size: 16px;">{{ text }}</text>
    </view>
    <!-- 加个scroll-view测试微信小程序canvas在滚动容器中浮动问题，测试结果为：在开发者工具为浮动，预览在真机上正常。 -->
    <scroll-view :scroll-y="true" style="height: 500px;">
      <view class="page" style="height: 1500px;">
        <view class="qrcode-box">
          <view class="qrcode">
            <!-- #ifndef MP-WEIXIN || APP-NVUE -->
            <canvas id="qrcode" canvas-id="qrcode" :style="{ width: `${size}px`, height: `${size}px` }"></canvas>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <canvas id="qrcode" canvas-id="qrcode" type="2d" :style="{ width: `${size}px`, height: `${size}px` }"></canvas>
            <!-- #endif -->
            <!-- #ifdef APP-NVUE -->
            <gcanvas ref="gcanvas" :style="{ width: `${size}px`, height: `${size}px` }"></gcanvas>
            <!-- #endif -->
          </view>
          <text class="msg">这是一个uQRCode原生方式生成的二维码，示范了uqrcode.js的基本用法</text>
        </view>
        <view class="btns">
          <navigator class="btn" url="/pages/example/example"><button type="primary">查看更多示例</button></navigator>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onReady } from '@dcloudio/uni-app';

/* 引入uQRCode */
import UQRCode from '../../uni_modules/Sansnn-uQRCode/js_sdk/uqrcode';

/* 引入nvue所需模块 */
// #ifdef APP-NVUE
import { enable, WeexBridge } from '../../uni_modules/Sansnn-uQRCode/js_sdk/gcanvas';
const modal = weex.requireModule('modal');
// #endif

const text = ref('uQRCode');
const size = ref(200);

/* 必须在onReady里调用，因为要确保canvas组件已成功渲染 */
onReady(async () => {
  /* 获取uQRCode实例 */
  const qr = new UQRCode();
  /* 设置二维码内容 */
  qr.data = text.value;
  /* 设置二维码大小，必须与canvas设置的宽高一致 */
  qr.size = size.value;
  /* 设置二维码前景图 */
  qr.foregroundImageSrc = '/static/logo.png';
  qr.foregroundImagePadding = 4;
  qr.foregroundImageBorderRadius = 4;
  qr.foregroundImageShadowOffsetX = 0;
  qr.foregroundImageShadowOffsetY = 0;
  qr.foregroundImageShadowBlur = 12;
  qr.foregroundImageShadowColor = 'rgba(0, 0, 0, 0.68)';
  /* 调用制作二维码方法 */
  qr.make();

  /* 获取canvas上下文 */
  // #ifndef MP-WEIXIN || APP-NVUE
  /* uniapp获取canvas上下文方式 */
  const canvasContext = uni.createCanvasContext('qrcode');
  /* uniapp获取图像方式 */
  UQRCode.loadImage = function(src) {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src,
        success: res => {
          resolve(res.path);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  };
  // #endif
  // #ifdef MP-WEIXIN
  /* 微信小程序获取canvas上下文方式 */
  const canvas = await new Promise(resolve => {
    uni
      .createSelectorQuery()
      .select(`#qrcode`)
      .fields({
        node: true,
        size: true
      })
      .exec(res => {
        resolve(res[0].node);
      });
  });
  const canvasContext = canvas.getContext('2d');
  const dpr = uni.getSystemInfoSync().pixelRatio;
  canvas.width = this.size * dpr;
  canvas.height = this.size * dpr;
  canvasContext.scale(dpr, dpr);
  /* 微信小程序获取图像方式 */
  UQRCode.loadImage = function(src) {
    /* 小程序下获取网络图片信息需先配置download域名白名单才能生效 */
    return new Promise((resolve, reject) => {
      const img = canvas.createImage();
      img.src = src;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = err => {
        reject(err);
      };
    });
  };
  // #endif
  // #ifdef APP-NVUE
  /* NVue获取canvas上下文方式 */
  const gcanvas = this.$refs['gcanvas'];
  const canvas = enable(gcanvas, {
    bridge: WeexBridge
  });
  const canvasContext = canvas.getContext('2d');
  /* NVue获取图像方式 */
  UQRCode.loadImage = function(src) {
    return new Promise((resolve, reject) => {
      /* getImageInfo在nvue的bug：获取同一个路径的图片信息，同一时间第一次获取成功，后续失败，猜测是写入本地时产生文件写入冲突，所以没有返回，特别是对于网络资源 --- js部分已实现队列绘制，已解决此问题 */
      uni.getImageInfo({
        src,
        success: res => {
          resolve(res.path);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  };
  // #endif
  /* 设置uQRCode实例的canvas上下文 */
  qr.canvasContext = canvasContext;
  /* 调用绘制方法将二维码图案绘制到canvas上 */
  qr.drawCanvas();
});
</script>

<style>
.page {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  align-items: center;
}

.input {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  width: 320px;
  margin: 30px 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.qrcode-box {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  align-items: center;
  margin-bottom: 30px;
  padding: 0 30px;
}

.qrcode {
  padding: 16px;
  background-color: #ffffff;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.msg {
  margin-top: 15px;
  font-size: 14px;
  color: #9a9b9c;
}

.btns {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.btn {
  margin: 0 10px;
}
</style>
