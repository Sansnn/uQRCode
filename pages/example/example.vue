<template>
  <view class="page">
    <!-- #ifdef APP-NVUE -->
    <text class="msg">nvue</text>
    <!-- #endif -->
    <view class="input"><textarea style="font-size: 16px;" v-model="text" :auto-height="true" :maxlength="150"></textarea></view>
    <view class="qrcode-box">
      <view class="qrcode"><u-qrcode ref="qr1" canvas-id="qr1" :value="text" :size="size" @click="remake('qr1')"></u-qrcode></view>
      <text class="msg">这是一个常规的二维码</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode"><u-qrcode ref="qr2" canvas-id="qr2" :value="text" :size="size" :options="{ useDynamicSize: false }" @click="remake('qr2')"></u-qrcode></view>
      <text class="msg">这是一个不使用useDynamicSize选项参数的二维码，小块之间会出现白线哦，不建议这么设置，nvue不支持使用useDynamicSize</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode">
        <u-qrcode
          ref="qr3"
          canvas-id="qr3"
          :value="text"
          :size="size"
          :options="{ margin: 10, background: { color: 'rgba(25, 147, 227, 0.5)' }, foreground: { color: 'rgb(185, 0, 0)' } }"
          @click="remake('qr3')"
        ></u-qrcode>
      </view>
      <text class="msg">这是一个设置了边距、半透明蓝色背景和红色前景色的二维码</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode">
        <u-qrcode
          ref="qr4"
          canvas-id="qr4"
          :value="`---------------------------${text}---------------------------`"
          :size="size"
          :options="{
            positionDetection: {
              backgroundColor: 'rgba(105,126,255,0.28)',
              foregroundColor: '#697eff'
            },
            separator: {
              color: 'rgba(184,112,253,0.29)'
            },
            alignment: {
              backgroundColor: 'rgba(255,122,140,0.28)',
              foregroundColor: '#ff7a8c'
            },
            timing: {
              backgroundColor: 'rgba(252,219,135,0.21)',
              foregroundColor: '#fcdb87'
            },
            darkBlock: {
              color: '#0f47ff'
            },
            versionInformation: {
              backgroundColor: 'rgba(0,255,83,0.18)',
              foregroundColor: '#00ff53'
            }
          }"
          @click="remake('qr4')"
        ></u-qrcode>
      </view>
      <text class="msg">这是一个分别设置了定位角、分割图案、对齐图案、时序图案、暗块、版本信息颜色的二维码</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode"><u-qrcode ref="qr5" canvas-id="qr5" :value="text" :size="size" :options="{ errorCorrectLevel: 'M' }" @click="remake('qr5')"></u-qrcode></view>
      <text class="msg">这是一个设置了纠错等级为M的二维码</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode">
        <u-qrcode
          ref="qr6"
          canvas-id="qr6"
          :value="text"
          :size="size"
          :options="{
            foreground: {
              image: {
                src: '/static/logo.png',
                width: 0.25,
                height: 0.25,
                align: ['center', 'center'],
                anchor: [0, 0]
              }
            }
          }"
          @click="remake('qr6')"
        ></u-qrcode>
      </view>
      <text class="msg">这是一个带logo的二维码，logo处于二维码中间</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode">
        <u-qrcode
          ref="qr7"
          canvas-id="qr7"
          :value="text"
          :size="size"
          :options="{
            foreground: {
              image: {
                src: '/static/logo.png',
                width: 0.25,
                height: 0.25,
                align: ['right', 'bottom'],
                anchor: [-10, -10]
              }
            }
          }"
          @click="remake('qr7')"
        ></u-qrcode>
      </view>
      <text class="msg">这是一个带logo的二维码，logo处于二维码右下角，与边距有一定距离</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode">
        <u-qrcode
          ref="qr8"
          canvas-id="qr8"
          :value="text"
          :size="size"
          :options="{
            background: {
              color: 'rgba(0,0,0,0)',
              image: {
                src: '/static/logo.png',
                width: 0.75, // 图片宽
                height: 0.75, // 图片高
                align: ['center', 'center'], // 图片对齐方式水平，垂直
                anchor: [0, 0], // 图片位置，X坐标，Y坐标
                alpha: 0.88 // 透明度
              }
            },
            foreground: {
              color: 'rgb(11, 34, 116)'
            }
          }"
          @click="remake('qr8')"
        ></u-qrcode>
      </view>
      <text class="msg">这是一个带背景图片的二维码，背景缩放1.5倍，且背景图片带有一定透明度</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode">
        <u-qrcode
          ref="qr9"
          canvas-id="qr9"
          :value="text"
          :size="size"
          :options="{
            background: {
              image: {
                src: 'https://img-cdn-tc.dcloud.net.cn/uploads/avatar/000/72/20/93_avatar_max.jpg',
                width: 1, // 图片宽
                height: 1, // 图片高
                align: ['center', 'center'], // 图片对齐方式水平，垂直
                anchor: [0, 0], // 图片位置，X坐标，Y坐标
                alpha: 1 // 透明度
              }
            },
            foreground: {
              color: '#f0f0f0'
            },
            margin: 10
          }"
          @click="remake('qr9')"
        ></u-qrcode>
      </view>
      <text class="msg">这是一个背景图片来自网络资源的二维码，且背景铺满，前景色为白色，小程序下绘制网络图片需先配置download域名白名单才能生效哦</text>
    </view>
    <view class="qrcode-box">
      <view class="qrcode">
        <u-qrcode
          ref="qr10"
          canvas-id="qr10"
          :value="text"
          :size="size"
          :options="{
            foreground: {
              image: {
                src: 'https://img-cdn-tc.dcloud.net.cn/uploads/avatar/000/72/20/93_avatar_max.jpg',
                width: 0.25,
                height: 0.25,
                align: ['center', 'center'],
                anchor: [0, 0]
              }
            }
          }"
          @click="remake('qr10')"
        ></u-qrcode>
      </view>
      <text class="msg">这是一个logo来自网络资源的二维码，小程序下绘制网络图片需先配置download域名白名单才能生效哦</text>
    </view>
    <view class="qrcode-box" v-for="(item, index) in 5" :key="index">
      <view class="qrcode"><u-qrcode :ref="`qr_${index}`" :canvas-id="`qr_${index}`" :value="`qr_${index}`" :size="size" @click="remake(`qr_${index}`)"></u-qrcode></view>
      <text class="msg">批量生成二维码{{ `qr_${index + 1}` }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      text: 'uQRCode',
      size: 200
    };
  },
  methods: {
    remake(refName) {
      const ref = this.$refs[refName];
      /* ref通过v-for遍历后会自动包裹在数组里，所以要判断一下 */
      if (Array.isArray(ref)) {
        ref[0].remake();
      } else {
        ref.remake();
      }
    }
  }
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
