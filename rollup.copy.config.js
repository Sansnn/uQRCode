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
        src: 'dist/style/words/uqrcode.style.words.umd.js',
        dest: 'test/html/js',
        rename: 'uqrcode.style.words.js'
      }, {
        src: 'dist/style/25d/uqrcode.style.25d.umd.js',
        dest: 'test/html/js',
        rename: 'uqrcode.style.25d.js'
      }, {
        src: 'dist/style/art/uqrcode.style.art.umd.js',
        dest: 'test/html/js',
        rename: 'uqrcode.style.art.js'
      }],
      verbose: true
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
        src: 'package/package.uni_module.Sansnn-uQRCode.json',
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
      }],
      verbose: true
    })
  ]
}, {
  input: 'dist/uqrcode.umd.js',
  output: {
    file: 'publish/browser/uqrcode.js',
    compact: true
  }
}, {
  input: 'dist/uqrcode.es.js',
  output: {
    file: 'publish/npm/uqrcodejs/uqrcode.js',
    compact: true
  },
  plugins: [
    copy({
      targets: [{
        src: 'package/package.node_module.uqrcodejs.json',
        dest: 'publish/npm/uqrcodejs',
        rename: 'package.json',
        transform: (contents, filename) => contents.toString().replace('__VERSION__', packageConfig.version)
      }, {
        src: 'LICENSE.md',
        dest: 'publish/npm/uqrcodejs'
      }, {
        src: 'README.md',
        dest: 'publish/npm/uqrcodejs'
      }],
      verbose: true
    })
  ]
}, {
  input: 'dist/uqrcode.es.js',
  output: {
    file: 'publish/npm/@uqrcode/js/uqrcode.js',
    compact: true
  },
  plugins: [
    copy({
      targets: [{
        src: 'package/package.node_module.@uqrcode.js.json',
        dest: 'publish/npm/@uqrcode/js',
        rename: 'package.json',
        transform: (contents, filename) => contents.toString().replace('__VERSION__', packageConfig.version)
      }, {
        src: 'LICENSE.md',
        dest: 'publish/npm/@uqrcode/js'
      }, {
        src: 'README.md',
        dest: 'publish/npm/@uqrcode/js'
      }],
      verbose: true
    })
  ]
}, {
  input: 'dist/uqrcode.es.js',
  output: {
    file: 'publish/npm/@uqrcode/uni-app/js_sdk/uqrcode/uqrcode.js',
    compact: true
  },
  plugins: [
    copy({
      targets: [{
        src: 'test/uni-app/src/uni_modules/Sansnn-uQRCode/*',
        dest: 'publish/npm/@uqrcode/uni-app'
      }, {
        src: 'package/package.node_module.@uqrcode.uni-app.json',
        dest: 'publish/npm/@uqrcode/uni-app',
        rename: 'package.json',
        transform: (contents, filename) => contents.toString().replace('__VERSION__', packageConfig.version)
      }],
      verbose: true
    })
  ]
}, {
  input: 'dist/uqrcode.es.js',
  output: {
    file: 'publish/uni-app/Sansnn-uQRCode/js_sdk/uqrcode/uqrcode.js',
    compact: true
  },
  plugins: [
    copy({
      targets: [{
        src: 'test/uni-app/src/uni_modules/Sansnn-uQRCode/*',
        dest: 'publish/uni-app/Sansnn-uQRCode'
      }],
      verbose: true
    })
  ]
}];
