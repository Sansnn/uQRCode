import copy from 'rollup-plugin-copy';
import packageConfig from './package.json';

export default [{
  input: 'dist/uqrcode.umd.js',
  output: {
    file: 'test/html/js/uqrcode.js',
    compact: true
  },
  plugins: [
    copy({
      targets: [{
        src: 'dist/style/round/uqrcode.style.round.umd.js',
        dest: 'test/html/js',
        rename: 'uqrcode.style.round.js'
      }, {
        src: 'dist/style/liquid/uqrcode.style.liquid.umd.js',
        dest: 'test/html/js',
        rename: 'uqrcode.style.liquid.js'
      }, {
        src: 'dist/style/25d/uqrcode.style.25d.umd.js',
        dest: 'test/html/js',
        rename: 'uqrcode.style.25d.js'
      }]
    })
  ]
}, {
  input: 'dist/uqrcode.es.js',
  output: {
    file: 'test/uni-app/src/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js',
    compact: true
  },
  plugins: [
    copy({
      targets: [{
        src: 'package/package.uni_module.json',
        dest: 'test/uni-app/src/uni_modules/Sansnn-uQRCode',
        rename: 'package.json',
        transform: (contents, filename) => contents.toString().replace('__VERSION__', packageConfig.version)
      }, {
        src: 'test/uni-app/src/uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.vue',
        dest: 'test/uni-app/src/uni_modules/Sansnn-uQRCode/components/u-qrcode',
        rename: 'u-qrcode.vue'
      }, {
        src: 'LICENSE.md',
        dest: 'test/uni-app/src/uni_modules/Sansnn-uQRCode'
      }, {
        src: 'README.md',
        dest: 'test/uni-app/src/uni_modules/Sansnn-uQRCode'
      }, {
        src: 'dist/style/round/uqrcode.style.round.es.js',
        dest: 'test/uni-app/src/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode',
        rename: 'uqrcode.style.round.js'
      }, {
        src: 'dist/style/liquid/uqrcode.style.liquid.es.js',
        dest: 'test/uni-app/src/uni_modules/Sansnn-uQRCode/js_sdk/uqrcode',
        rename: 'uqrcode.style.liquid.js'
      }]
    })
  ]
}]
