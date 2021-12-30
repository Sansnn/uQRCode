<template>
  <view class="content">
    <text class="title">uQRCode 二维码生成</text>

    <view style="margin-top: 20px;">
      <!-- #ifdef APP-NVUE -->
      <text class="text">当前环境(vue|nvue)：nvue</text>
      <!-- #endif -->
      <!-- #ifndef APP-NVUE -->
      <text class="text">当前环境(vue|nvue)：vue</text>
      <!-- #endif -->
    </view>

    <view class="qrcode-box">
      <uqrcode mode="canvas" id="uQRCode" ref="uQRCode" :text="qrcodeText" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000"></uqrcode>
      <text class="text">canvas</text>
      <button class="button" @click="refresh" style="margin-top: 10px;">刷新</button>
      <button class="button" @click="toTempFilePath('uQRCode')" style="margin-top: 10px;">导出临时路径</button>
      <button class="button" type="primary" @click="save('uQRCode')" style="margin-top: 10px;">保存</button>
    </view>

    <view class="qrcode-box">
      <uqrcode mode="view" id="uQRCodeView" ref="uQRCodeView" :text="qrcodeText" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000"></uqrcode>
      <text class="text">view</text>
      <text class="text">view模式仅支持渲染出二维码，不支持获取临时路径和保存</text>
    </view>

    <text class="title">批量生成</text>
    <view class="qrcode-box" v-for="(item, index) in qrcodeList" :key="index">
      <uqrcode :id="'batchQRCode'+index" ref="batchQRCode" :text="item" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000"></uqrcode>
      <text class="text">{{item}}</text>
    </view>
    <button class="button" type="primary" @tap="saveBatch">批量保存</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        qrcodeText: `uQRCode 3.0.0 更新时间：2021-12-30 预览时间：${new Date()}`,
        qrcodeList: ['我是第一个', '我是第二个', '我是第三个'],
        platform: uni.getSystemInfoSync().platform
      }
    },
    methods: {
      refresh() {
        this.qrcodeText = `uQRCode 3.0.0 更新时间：2021-12-30 预览时间：${new Date()}`
      },
      toTempFilePath(id) {
        uni.showLoading({
          mask: true,
          title: '请稍后...'
        })
        this.$refs[id].toTempFilePath({
          success: res => {
            uni.showToast({
              icon: 'none',
              title: '文件临时路径：' + res.tempFilePath
            })
          },
          fail: err => {
            uni.showToast({
              icon: 'none',
              title: JSON.stringify(err)
            })
          },
          complete: () => {
            uni.hideLoading()
          }
        })
      },
      save(id) {
        uni.showLoading({
          mask: true,
          title: '请稍后...'
        })
        this.$refs[id].save({
          success: res => {
            uni.showToast({
              icon: 'none',
              title: res.msg
            })
          },
          fail: err => {
            uni.showToast({
              icon: 'none',
              title: JSON.stringify(err)
            })
          },
          complete: () => {
            uni.hideLoading()
          }
        })
      },
      saveBatch() {
        this.$refs.batchQRCode.forEach((ref, index) => {
          setTimeout(() => {
            ref.save({
              success: res => {
                uni.showToast({
                  icon: 'none',
                  title: `${res.msg} (${index + 1})`
                })
              }
            })
          }, index * 500)
        })
      }
    }
  }
</script>

<style>
  /* #ifndef APP-NVUE */
  page {
    background-color: #f0f0f0;
  }

  /* #endif */

  .content {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 44px;
    padding-bottom: 32px;
  }

  .title {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    margin-top: 50rpx;
    font-size: 36rpx;
    color: #666666;
  }

  .text {
    /* #ifndef APP-NVUE */
    display: block;
    /* #endif */
    margin-top: 12rpx;
    font-size: 34rpx;
  }

  .button {
    width: 690rpx;
    margin: 10rpx;
  }

  .qrcode-box {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    margin: 32px 32px 0 32px;
  }
</style>
