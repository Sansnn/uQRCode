<template>
  <view class="content">
    <view class="qrcode">
      <uqrcode ref="uQRCode" :mode="mode" :text="text" :size="size" :margin="margin" :background-color="backgroundColor" :foreground-color="foregroundColor" :error-correct-level="errorCorrectLevel" :type-number="typeNumber" :file-type="fileType"></uqrcode>
    </view>

    <button class="button" @click="toTempFilePath('uQRCode')" v-if="mode==='canvas'">导出临时文件路径</button>
    <button class="button" type="primary" @click="save('uQRCode')" v-if="mode==='canvas'">保存</button>
    <text class="text" v-if="mode==='view'">view模式不支持导出文件，只能通过截屏方式保存</text>

    <uni-forms class="form">
      <uni-forms-item label="文本">
        <uni-easyinput type="textarea" v-model="text" />
      </uni-forms-item>
      <uni-forms-item label="模式">
        <uni-data-checkbox v-model="mode" :localdata="[{value: 'canvas', text: 'canvas'}, {value: 'view', text: 'view'}]" />
      </uni-forms-item>
      <uni-forms-item label="尺寸">
        <slider class="slider" :value="256" min="192" max="320" show-value @change="sliderChange($event, 'size')" />
      </uni-forms-item>
      <uni-forms-item label="边距">
        <slider class="slider" :value="10" min="0" max="20" show-value @change="sliderChange($event, 'margin')" />
      </uni-forms-item>
      <uni-forms-item label="背景色">
        <uni-data-checkbox v-model="backgroundColor" :localdata="[{value: '#FFFFFF', text: '1'}, {value: '#FFFF7F', text: '2'}, {value: '#AAFF7F', text: '3'}]" />
      </uni-forms-item>
      <uni-forms-item label="前景色">
        <uni-data-checkbox v-model="foregroundColor" :localdata="[{value: '#000000', text: '1'}, {value: '#AA0000', text: '2'}, {value: '#00007F', text: '3'}]" />
      </uni-forms-item>
      <uni-forms-item label="纠错等级">
        <uni-data-checkbox v-model="errorCorrectLevel" :localdata="[{value: defaultErrorCorrectLevel.L, text: 'L'}, {value: defaultErrorCorrectLevel.M, text: 'M'}, {value: defaultErrorCorrectLevel.Q, text: 'Q'}, {value: defaultErrorCorrectLevel.H, text: 'H'}]" />
      </uni-forms-item>
      <uni-forms-item label="文件类型">
        <uni-data-checkbox v-model="fileType" :localdata="[{value: 'png', text: 'png'}, {value: 'jpg', text: 'jpg'}]" />
      </uni-forms-item>
    </uni-forms>

    <text class="title">批量生成</text>
    <view class="qrcode-box" v-for="(item, index) in qrcodeList" :key="index">
      <uqrcode :id="'batchQRCode'+index" ref="batchQRCode" :text="item" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000"></uqrcode>
      <text class="text">{{item}}</text>
    </view>
    <button class="button" type="primary" @tap="saveBatch">批量保存</button>
  </view>
</template>

<script>
  import uQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode'

  export default {
    data() {
      return {
        mode: 'canvas',
        text: `uQRCode 3.0.0 更新时间：2021-12-30 预览时间：${new Date()}`,
        size: 256,
        margin: 10,
        backgroundColor: '#FFFFFF',
        foregroundColor: '#000000',
        errorCorrectLevel: uQRCode.errorCorrectLevel.H,
        typeNumber: -1,
        fileType: 'png',
        defaultErrorCorrectLevel: uQRCode.errorCorrectLevel,
        qrcodeList: ['我是第一个', '我是第二个', '我是第三个']
      }
    },
    onLoad() {
      // #ifdef APP-NVUE
      console.log('当前编译模式：nvue')
      // #endif
      // #ifndef APP-NVUE
      console.log('当前编译模式：vue')
      // #endif
    },
    methods: {
      toTempFilePath(id) {
        uni.showLoading({
          mask: true,
          title: '请稍后...'
        })
        this.$refs[id].toTempFilePath({
          success: res => {
            console.log(res)
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              title: '文件临时路径：' + res.tempFilePath
            })
          },
          fail: err => {
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              title: JSON.stringify(err)
            })
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
            console.log(res)
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              title: res.msg
            })
          },
          fail: err => {
            uni.hideLoading()
            uni.showToast({
              icon: 'none',
              title: JSON.stringify(err)
            })
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
      },
      sliderChange(e, dataName) {

        this.$set(this.$data, dataName, e.detail.value)
      }
    }
  }
</script>

<style>
  .content {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 32rpx;
  }

  .qrcode {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 750rpx;
    padding: 32rpx 0;
    background-color: #F0F0F0;
  }

  .title {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    margin: 32rpx 0;
    font-size: 36rpx;
    color: #666666;
  }

  .text {
    margin-top: 32rpx;
    font-size: 32rpx;
    color: #666666;
  }

  .form {
    width: 686rpx;
    padding: 32rpx;
  }

  .slider {
    margin-left: 0;
    margin-right: 0;
  }

  .button {
    width: 690rpx;
    margin-top: 32rpx;
  }

  .qrcode-box {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
