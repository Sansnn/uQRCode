<template>
  <view class="content">
    <view class="qrcode">
      <uqrcode
        cid="uQRCode"
        ref="uQRCode"
        :mode="mode"
        :text="text"
        :size="size"
        :margin="margin"
        :background-color="backgroundColor"
        :foreground-color="foregroundColor"
        :foreground-gradient-type="foregroundGradientType"
        :error-correct-level="errorCorrectLevel"
        :type-number="typeNumber"
        :file-type="fileType"
        :tile-margin="tileMargin"
        :tile-radius="tileRadius"
        :tile-alpha="tileAlpha"
        :foreground-image="foregroundImage"
        :foreground-image-options="foregroundImageOptions"
        :background-image-options="backgroundImageOptions"
        :background-image="backgroundImage"
        :corner="corner"
        :debug="true"
      ></uqrcode>
    </view>

    <uni-forms class="form">
      <uni-forms-item label="文本"><uni-easyinput type="textarea" v-model="text" /></uni-forms-item>
      <uni-forms-item label="模式"><uni-data-checkbox v-model="mode" :localdata="[{ value: 'canvas', text: 'canvas' }, { value: 'view', text: 'view' }]" /></uni-forms-item>
      <uni-forms-item label="尺寸"><slider class="slider" :value="size" min="192" max="320" show-value @change="sliderChange($event, 'size')" /></uni-forms-item>
      <uni-forms-item label="边距"><slider class="slider" :value="margin" min="0" max="20" show-value @change="sliderChange($event, 'margin')" /></uni-forms-item>
      <uni-forms-item label="背景色">
        <uni-data-checkbox
          v-model="backgroundColor"
          :localdata="[{ value: '#FFFFFF', text: '白' }, { value: '#FFFF7F', text: '黄' }, { value: '#AAFF7F', text: '绿' }, { value: '', text: '透明' }]"
        />
      </uni-forms-item>
      <uni-forms-item label="前景色">
        <uni-data-checkbox
          v-model="foregroundColor"
          :localdata="[{ value: '#000000', text: '黑' }, { value: '#AA0000', text: '红' }, { value: '#00007F', text: '蓝' }, { value: '#AA0000,#00007F', text: '渐变' }]"
        />
      </uni-forms-item>
      <uni-forms-item label="渐变类型" v-if="foregroundColor.split(',').length > 1">
        <uni-data-checkbox v-model="foregroundGradientType" :localdata="[{ value: 'linear', text: '线性' }, { value: 'circular', text: '圆形/放射' }]" />
      </uni-forms-item>
      <uni-forms-item label="小块间距"><slider class="slider" :value="tileMargin" min="0" max="20" show-value @change="sliderChange($event, 'tileMargin')" /></uni-forms-item>
      <uni-forms-item label="小块圆角"><slider class="slider" :value="tileRadius" min="0" max="100" show-value @change="sliderChange($event, 'tileRadius')" /></uni-forms-item>
      <uni-forms-item label="小块透明度">
        <slider class="slider" :value="tileAlpha" :min="0.0" :max="1.0" :step="0.01" show-value @change="sliderChange($event, 'tileAlpha')" />
      </uni-forms-item>
      <uni-forms-item label="前景图">
        <uni-file-picker file-mediatype="image" limit="1" @select="filePickerSelect($event, 'foregroundImage')" @delete="filePickerDelete('foregroundImage')" />
      </uni-forms-item>
      <uni-forms-item label="前景图选项" v-if="foregroundImage">
        <uni-forms-item label="图片宽度">
          <slider class="slider" :value="foregroundImageOptions.width" :min="size / 8" :max="size / 4" show-value @change="sliderChange($event, 'foregroundImageOptions.width')" />
        </uni-forms-item>
        <uni-forms-item label="图片高度">
          <slider
            class="slider"
            :value="foregroundImageOptions.height"
            :min="size / 8"
            :max="size / 4"
            show-value
            @change="sliderChange($event, 'foregroundImageOptions.height')"
          />
        </uni-forms-item>
        <uni-forms-item label="水平排列">
          <uni-data-picker
            v-model="foregroundImageOptions.align[0]"
            :localdata="[{ text: '靠左', value: 'left' }, { text: '居中', value: 'center' }, { text: '靠右', value: 'right' }]"
            @change="dataPickerChange($event, 'fios')"
          ></uni-data-picker>
        </uni-forms-item>
        <uni-forms-item label="垂直排列">
          <uni-data-picker
            v-model="foregroundImageOptions.align[1]"
            :localdata="[{ text: '顶部', value: 'top' }, { text: '居中', value: 'center' }, { text: '底部', value: 'bottom' }]"
            @change="dataPickerChange($event, 'fioc')"
          ></uni-data-picker>
        </uni-forms-item>
        <uni-forms-item label="anchor">
          <uni-forms-item label="X"><uni-easyinput type="number" v-model="foregroundImageOptions.anchor[0]" /></uni-forms-item>
          <uni-forms-item label="Y"><uni-easyinput type="number" v-model="foregroundImageOptions.anchor[1]" /></uni-forms-item>
        </uni-forms-item>
        <uni-forms-item label="透明度">
          <slider
            class="slider"
            :value="foregroundImageOptions.alpha"
            :min="0.0"
            :max="1.0"
            :step="0.01"
            show-value
            @change="sliderChange($event, 'foregroundImageOptions.alpha')"
          />
        </uni-forms-item>
      </uni-forms-item>

      <uni-forms-item label="背景图">
        <uni-file-picker file-mediatype="image" limit="1" @select="filePickerSelect($event, 'backgroundImage')" @delete="filePickerDelete('backgroundImage')" />
      </uni-forms-item>
      <uni-forms-item label="背景图选项" v-if="backgroundImage">
        <uni-forms-item label="图片宽度">
          <slider
            class="slider"
            :value="backgroundImageOptions.width"
            :min="size / 2"
            :max="size * 1.5"
            show-value
            @change="sliderChange($event, 'backgroundImageOptions.width')"
          />
        </uni-forms-item>
        <uni-forms-item label="图片高度">
          <slider
            class="slider"
            :value="backgroundImageOptions.height"
            :min="size / 2"
            :max="size * 1.5"
            show-value
            @change="sliderChange($event, 'backgroundImageOptions.height')"
          />
        </uni-forms-item>
        <uni-forms-item label="水平排列">
          <uni-data-picker
            v-model="backgroundImageOptions.align[0]"
            :localdata="[{ text: '靠左', value: 'left' }, { text: '居中', value: 'center' }, { text: '靠右', value: 'right' }]"
            @change="dataPickerChange($event, 'bios')"
          ></uni-data-picker>
        </uni-forms-item>
        <uni-forms-item label="垂直排列">
          <uni-data-picker
            v-model="backgroundImageOptions.align[1]"
            :localdata="[{ text: '顶部', value: 'top' }, { text: '居中', value: 'center' }, { text: '底部', value: 'bottom' }]"
            @change="dataPickerChange($event, 'bioc')"
          ></uni-data-picker>
        </uni-forms-item>
        <uni-forms-item label="anchor">
          <uni-forms-item label="X"><uni-easyinput type="number" v-model="backgroundImageOptions.anchor[0]" /></uni-forms-item>
          <uni-forms-item label="Y"><uni-easyinput type="number" v-model="backgroundImageOptions.anchor[1]" /></uni-forms-item>
        </uni-forms-item>
        <uni-forms-item label="透明度">
          <slider
            class="slider"
            :value="backgroundImageOptions.alpha"
            :min="0.0"
            :max="1.0"
            :step="0.01"
            show-value
            @change="sliderChange($event, 'backgroundImageOptions.alpha')"
          />
        </uni-forms-item>
      </uni-forms-item>

      <uni-forms-item label="定位角">
        <uni-forms-item label="左上">
          <uni-forms-item label="颜色">
            <uni-data-checkbox
              v-model="corner.lt.color"
              :localdata="[{ value: '', text: '默认' }, { value: '#AA0000', text: '红' }, { value: '#00007F', text: '蓝' }, { value: '#ffff00,#ff5500', text: '渐变' }]"
            />
          </uni-forms-item>
          <uni-forms-item label="间距">
            <slider class="slider" :value="corner.lt.tileMargin" :min="0" :max="20" show-value @change="sliderChange($event, 'corner.lt.tileMargin')" />
          </uni-forms-item>
          <uni-forms-item label="圆角">
            <slider class="slider" :value="corner.lt.tileRadius" :min="0" :max="100" show-value @change="sliderChange($event, 'corner.lt.tileRadius')" />
          </uni-forms-item>
          <uni-forms-item label="透明度">
            <slider class="slider" :value="corner.lt.tileAlpha" :min="0.0" :max="1.0" :step="0.01" show-value @change="sliderChange($event, 'corner.lt.tileAlpha')" />
          </uni-forms-item>
        </uni-forms-item>
        <uni-forms-item label="右上">
          <uni-forms-item label="颜色">
            <uni-data-checkbox
              v-model="corner.rt.color"
              :localdata="[{ value: '', text: '默认' }, { value: '#AA0000', text: '红' }, { value: '#00007F', text: '蓝' }, { value: '#00ffff,#55aaff', text: '渐变' }]"
            />
          </uni-forms-item>
          <uni-forms-item label="间距">
            <slider class="slider" :value="corner.rt.tileMargin" :min="0" :max="20" show-value @change="sliderChange($event, 'corner.rt.tileMargin')" />
          </uni-forms-item>
          <uni-forms-item label="圆角">
            <slider class="slider" :value="corner.rt.tileRadius" :min="0" :max="100" show-value @change="sliderChange($event, 'corner.rt.tileRadius')" />
          </uni-forms-item>
          <uni-forms-item label="透明度">
            <slider class="slider" :value="corner.rt.tileAlpha" :min="0.0" :max="1.0" :step="0.01" show-value @change="sliderChange($event, 'corner.rt.tileAlpha')" />
          </uni-forms-item>
        </uni-forms-item>
        <uni-forms-item label="左下">
          <uni-forms-item label="颜色">
            <uni-data-checkbox
              v-model="corner.lb.color"
              :localdata="[{ value: '', text: '默认' }, { value: '#AA0000', text: '红' }, { value: '#00007F', text: '蓝' }, { value: '#ffaa00,#AA0000', text: '渐变' }]"
            />
          </uni-forms-item>
          <uni-forms-item label="间距">
            <slider class="slider" :value="corner.lb.tileMargin" :min="0" :max="20" show-value @change="sliderChange($event, 'corner.lb.tileMargin')" />
          </uni-forms-item>
          <uni-forms-item label="圆角">
            <slider class="slider" :value="corner.lb.tileRadius" :min="0" :max="100" show-value @change="sliderChange($event, 'corner.lb.tileRadius')" />
          </uni-forms-item>
          <uni-forms-item label="透明度">
            <slider class="slider" :value="corner.lb.tileAlpha" :min="0.0" :max="1.0" :step="0.01" show-value @change="sliderChange($event, 'corner.lb.tileAlpha')" />
          </uni-forms-item>
        </uni-forms-item>
      </uni-forms-item>

      <uni-forms-item label="纠错等级">
        <uni-data-checkbox
          v-model="errorCorrectLevel"
          :localdata="[
            { value: defaultErrorCorrectLevel.L, text: 'L' },
            { value: defaultErrorCorrectLevel.M, text: 'M' },
            { value: defaultErrorCorrectLevel.Q, text: 'Q' },
            { value: defaultErrorCorrectLevel.H, text: 'H' }
          ]"
        />
      </uni-forms-item>
      <uni-forms-item label="文件类型">
        <uni-data-checkbox v-model="fileType" :localdata="[{ value: 'jpg', text: 'jpg' }, { value: 'png', text: 'png(背景色透明选这个)' }]" />
      </uni-forms-item>
    </uni-forms>

    <button class="button" @click="toTempFilePath('uQRCode')" v-if="mode === 'canvas'">导出临时文件路径</button>
    <button class="button" type="primary" @click="save('uQRCode')" v-if="mode === 'canvas'">保存</button>
    <text class="text" v-if="mode === 'view'">view模式不支持导出文件，只能通过截屏方式保存</text>

    <text class="title">批量生成</text>
    <view class="qrcode-box" v-for="(item, index) in qrcodeList" :key="index">
      <uqrcode :cid="'batchQRCode' + index" ref="batchQRCode" :text="item" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000"></uqrcode>
      <text class="text">{{ item }}</text>
    </view>
    <button class="button" type="primary" @tap="saveBatch">批量保存</button>

    <text class="title">下面是一些示例</text>

    <view class="qrcode-box">
      <uqrcode cid="demo1" text="uQRCode" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000"></uqrcode>
      <text class="text">普通二维码</text>
    </view>

    <view class="qrcode-box">
      <uqrcode cid="demo2" text="uQRCode" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000" foreground-image="/static/logo.png"></uqrcode>
      <text class="text">二维码带logo</text>
    </view>

    <view class="qrcode-box">
      <uqrcode
        cid="demo3"
        text="uQRCode is very very niubility"
        :size="256"
        :margin="10"
        background-color="#FFFFFF"
        foreground-color="#000000"
        :tile-margin="30"
        :tile-radius="30"
        :corner="{ lt: { tileMargin: 0, tileRadius: 0 }, rt: { tileMargin: 0, tileRadius: 0 }, lb: { tileMargin: 0, tileRadius: 0 } }"
        foreground-image="/static/weixin-work.jpg"
      ></uqrcode>
      <text class="text">企业微信二维码</text>
    </view>

    <view class="qrcode-box">
      <uqrcode cid="demo4" text="uQRCode" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000" :tile-margin="20" :tile-radius="100"></uqrcode>
      <text class="text">圆点二维码</text>
    </view>

    <view class="qrcode-box">
      <uqrcode
        cid="demo5"
        text="uQRCode"
        :size="256"
        :margin="10"
        background-color="#FFFFFF"
        foreground-color="#000000"
        :tile-margin="20"
        :tile-radius="100"
        :corner="{ lt: { tileMargin: 0, tileRadius: 0 }, rt: { tileMargin: 0, tileRadius: 0 }, lb: { tileMargin: 0, tileRadius: 0 } }"
      ></uqrcode>
      <text class="text">仅内容区域为圆点</text>
    </view>

    <view class="qrcode-box">
      <uqrcode
        cid="demo6"
        text="uQRCode"
        :size="256"
        :margin="10"
        background-color="#FFFFFF"
        foreground-color="#000000"
        :corner="{ lt: { tileMargin: 20, tileRadius: 100 }, rt: { tileMargin: 20, tileRadius: 100 }, lb: { tileMargin: 20, tileRadius: 100 } }"
      ></uqrcode>
      <text class="text">仅定位角为圆点</text>
    </view>

    <view class="qrcode-box">
      <uqrcode
        cid="demo7"
        text="uQRCode"
        :size="256"
        :margin="10"
        background-color="#FFFFFF"
        foreground-color="#000000"
        :corner="{ rt: { tileMargin: 20, tileRadius: 100 }, lb: { tileMargin: 20, tileRadius: 100 } }"
      ></uqrcode>
      <text class="text">定位角右上和左下为圆点</text>
    </view>

    <view class="qrcode-box">
      <uqrcode text="uQRCode" cid="demo8" :size="256" :margin="10" background-color="#FFFFFF" foreground-color="#000000" background-image="/static/background-image.jpg"></uqrcode>
      <text class="text">设置背景图片</text>
    </view>

    <view class="qrcode-box">
      <uqrcode
        cid="demo9"
        text="uQRCode"
        :size="256"
        :margin="10"
        background-color="#FFFFFF"
        foreground-color="#000000"
        :corner="{ lt: { color: '#AA0000' }, rt: { color: '#ffff00,#ff5500' }, lb: { color: ['#00ffff', '#55aaff'] } }"
      ></uqrcode>
      <text class="text">单独设置定位角颜色</text>
    </view>

    <view class="qrcode-box">
      <uqrcode cid="demo10" text="uQRCode" :size="256" :margin="10" background-color="#FFFFFF" :foreground-color="['#AA0000', '#00007F']"></uqrcode>
      <text class="text">渐变色二维码</text>
    </view>

    <view class="qrcode-box">
      <uqrcode
        cid="demo11"
        text="uQRCode is very very niubility"
        :size="256"
        :margin="10"
        background-color="#FFFFFF"
        foreground-color="#ffff00,#ff5500"
        background-image="/static/avatar.jpg"
        :background-image-options="{ alpha: 0.5 }"
        foreground-image="/static/avatar@radius.png"
        :foreground-image-options="{ width: 48, height: 48 }"
        :tile-margin="25"
        :tile-radius="75"
        :tile-alpha="1"
        :corner="{
          lt: { tileMargin: 0, tileRadius: 0, tileAlpha: 0.6 },
          rt: { tileMargin: 0, tileRadius: 0, tileAlpha: 0.6 },
          lb: { tileMargin: 0, tileRadius: 0, tileAlpha: 0.6 }
        }"
      ></uqrcode>
      <text class="text">美化一丢丢(适当美化，太过复杂不容易被扫出来)</text>
    </view>
  </view>
</template>

<script>
import uQRCode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/common/uqrcode';

export default {
  data() {
    return {
      mode: 'canvas',
      text: `uQRCode`,
      size: 256,
      margin: 10,
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000',
      foregroundGradientType: 'linear',
      errorCorrectLevel: uQRCode.errorCorrectLevel.H,
      typeNumber: -1,
      fileType: 'jpg',
      tileMargin: 0,
      tileRadius: 0,
      tileAlpha: 1,
      foregroundImage: '',
      foregroundImageOptions: {
        width: 48,
        height: 48,
        align: ['center', 'center'],
        anchor: [0, 0],
        alpha: 1
      },
      backgroundImage: '',
      backgroundImageOptions: {
        width: 256,
        height: 256,
        align: ['center', 'center'],
        anchor: [0, 0],
        alpha: 1
      },
      corner: {
        lt: {
          color: ''
        },
        rt: {
          color: ''
        },
        lb: {
          color: ''
        }
      },
      defaultErrorCorrectLevel: uQRCode.errorCorrectLevel,
      qrcodeList: ['我是第一个', '我是第二个', '我是第三个']
    };
  },
  onLoad() {
    // #ifdef APP-NVUE
    console.log('当前编译模式：nvue');
    // #endif
    // #ifndef APP-NVUE
    console.log('当前编译模式：vue');
    // #endif
  },
  methods: {
    toTempFilePath(id) {
      uni.showLoading({
        mask: true,
        title: '请稍后...'
      });
      this.$refs[id].toTempFilePath({
        success: res => {
          console.log(res);
          uni.hideLoading();
          uni.showToast({
            icon: 'none',
            title: '文件临时路径：' + res.tempFilePath
          });
        },
        fail: err => {
          uni.hideLoading();
          uni.showToast({
            icon: 'none',
            title: JSON.stringify(err)
          });
        }
      });
    },
    save(id) {
      uni.showLoading({
        mask: true,
        title: '请稍后...'
      });
      this.$refs[id].save({
        success: res => {
          console.log(res);
          uni.hideLoading();
          uni.showToast({
            icon: 'none',
            title: res.msg
          });
        },
        fail: err => {
          uni.hideLoading();
          uni.showToast({
            icon: 'none',
            title: JSON.stringify(err)
          });
        }
      });
    },
    saveBatch() {
      this.$refs.batchQRCode.forEach((ref, index) => {
        setTimeout(() => {
          ref.save({
            success: res => {
              uni.showToast({
                icon: 'none',
                title: `${res.msg} (${index + 1})`
              });
            }
          });
        }, index * 500);
      });
    },
    sliderChange(e, dataName) {
      let value = e.detail.value;
      let dataKeyLayer = dataName.split('.');
      let key = dataKeyLayer.pop();
      let target = this.$data;
      dataKeyLayer.forEach(x => {
        target = target[x];
      });
      this.$set(target, key, value);
    },
    filePickerSelect(e, dataName) {
      this.$set(this.$data, dataName, e.tempFilePaths[0]);
    },
    filePickerDelete(dataName) {
      this.$set(this.$data, dataName, '');
    },
    dataPickerChange(e, name) {
      switch (name) {
        case 'fios':
          this.foregroundImageOptions.align[0] = e.detail.value[0].value;
          break;
        case 'fioc':
          this.foregroundImageOptions.align[1] = e.detail.value[0].value;
          break;
        case 'bios':
          this.backgroundImageOptions.align[0] = e.detail.value[0].value;
          break;
        case 'bioc':
          this.backgroundImageOptions.align[1] = e.detail.value[0].value;
          break;
      }
    }
  }
};
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
  background-color: #f0f0f0;
}

.title {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  margin: 64rpx 0 32rpx;
  font-size: 36rpx;
  color: #666666;
}

.text {
  margin: 32rpx 0;
  font-size: 32rpx;
  color: #666666;
}

.form {
  width: 686rpx;
  padding: 0 32rpx;
  margin-top: 32rpx;
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
