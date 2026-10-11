<template>
  <div class="wrapper" v-if="show">
    <div class="content">
      <img style="display: block;width: 180px;margin: 10px auto; 0" :src="qrImg" />
      <p style="text-align: center;margin: 10px 0;font-size: 0.7em;">二维码示例</p>
    </div>
    <div class="close">
      <i class="el-icon-error" style="font-size: 24px;cursor: pointer;color: #909399;display: inline-block;background-color: #ffffff;border-radius: 100%;" @click="close()"></i>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: true,
        qrImg: '',
        qrImgIndex: 0,
        qrImgInterval: null
      }
    },
    mounted() {
      let qrImgs = [
        this.$withBase('/assets/img/yz_1.png'),
        this.$withBase('/assets/img/yz_2.png'),
        this.$withBase('/assets/img/yz_3.png'),
        this.$withBase('/assets/img/yz_4.png'),
        this.$withBase('/assets/img/yz_5.png'),
        this.$withBase('/assets/img/yz_6.png'),
        this.$withBase('/assets/img/yz_7.png'),
        this.$withBase('/assets/img/yz_8.png'),
        this.$withBase('/assets/img/yz_9.png'),
        this.$withBase('/assets/img/yz_10.png'),
        this.$withBase('/assets/img/yz_11.png'),
        this.$withBase('/assets/img/yz_12.png'),
      ];
      this.qrImgIndex = Math.floor(Math.random() * qrImgs.length);
      this.qrImg = qrImgs[this.qrImgIndex];
      this.qrImgInterval = setInterval(() => {
        this.qrImg = qrImgs[this.qrImgIndex];
        this.qrImgIndex++;
        if (this.qrImgIndex == qrImgs.length) {
          this.qrImgIndex = 0;
        }
      }, 3000);
    },
    methods: {
      close() {
        this.show = false;
        clearInterval(this.qrImgInterval);
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 19;
    width: 260px;
  }

  .content {
    box-sizing: border-box;
    padding: 10px 15px 0;
    background: #ffffff;
    border: 1px solid #3eaf7c;
    border-radius: 0.25rem;
    box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.1);
  }
  
  .close {
    text-align: center;
    margin-top: 16px;
  }
</style>
