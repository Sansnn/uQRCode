<template>
  <view class="page">
    <!-- #ifdef APP-NVUE -->
    <text class="msg">nvue</text>
    <!-- #endif -->
    <view class="input">
      <text style="font-size: 16px;">{{ text }}</text>
    </view>
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
      <text class="msg">这是一个通过uQRCodeJS生成的二维码，示范了js的基本用法</text>
    </view>
    <navigator url="/pages/example/example"><button type="primary">查看更多示例</button></navigator>
  </view>
</template>

<script>
import uQRCode from '../../uni_modules/Sansnn-uQRCode/components/u-qrcode/common/u-qrcode.js';

/* 引入nvue所需模块 */
// #ifdef APP-NVUE
import { enable, WeexBridge } from '../../uni_modules/Sansnn-uQRCode/components/u-qrcode/gcanvas';
let modal = weex.requireModule('modal');
// #endif

export default {
  data() {
    return {
      text: 'uQRCode',
      size: 200
    };
  },
  /* 必须在onReady里调用，因为要确保canvas组件已成功渲染 */
  async onReady() {
    // #ifndef MP-WEIXIN || APP-NVUE
    /* uniapp获取canvas实例方式 */
    const ctx = uni.createCanvasContext('qrcode');
    // #endif

    // #ifdef MP-WEIXIN
    /* 微信小程序获取canvas实例方式 */
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
    const ctx = canvas.getContext('2d');
    const dpr = uni.getSystemInfoSync().pixelRatio;
    canvas.width = this.size * dpr;
    canvas.height = this.size * dpr;
    ctx.scale(dpr, dpr);
    // #endif

    // #ifdef APP-NVUE
    /* 微信小程序获取canvas实例方式 */
    /* 获取元素引用 */
    const gcanvas = this.$refs['gcanvas'];
    /* 通过元素引用获取canvas对象 */
    const canvas = enable(gcanvas, {
      bridge: WeexBridge
    });
    /* 获取绘图所需的上下文，目前不支持3d */
    const ctx = canvas.getContext('2d');
    // #endif

    /* 调用uqrcode方法 */
    let uqrcode = new uQRCode(
      {
        text: this.text,
        size: this.size
      },
      ctx
    );
    uqrcode.make();
    uqrcode.draw({
      /* 在绘制完前景之后接着绘制文字在二维码上 */
      drawForeground: {
        after: () => {
          ctx.save();

          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.68)';

          ctx.setFillStyle('#FFFFFF');
          ctx.fillRect(
            uqrcode.options.dynamicSize / 2 / 2,
            uqrcode.options.dynamicSize / 2 - uqrcode.options.dynamicSize / 6 / 2,
            uqrcode.options.dynamicSize / 2,
            uqrcode.options.dynamicSize / 6
          );

          ctx.setFillStyle('#FF0000');
          ctx.setFontSize(uqrcode.options.dynamicSize / 10);
          ctx.setTextAlign('center');
          ctx.setTextBaseline('middle');
          ctx.fillText('uQRCode', uqrcode.options.dynamicSize / 2, uqrcode.options.dynamicSize / 2);

          ctx.restore();
          ctx.draw(true);
        }
      }
    });
  },
  methods: {}
};
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
</style>
