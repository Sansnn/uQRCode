<template>
  <view class="upopup" v-if="showPopup">
    <slot></slot>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        showPopup: false
      }
    },
    methods: {
      open() {
        this.showPopup = true;
        this.$emit('change', {
          show: this.showPopup
        });
      },
      close() {
        this.showPopup = false;
        this.$emit('change', {
          show: this.showPopup
        });
      }
    }
  }
</script>

<style>
  .upopup {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.68);
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
    align-items: center;
  }
</style>