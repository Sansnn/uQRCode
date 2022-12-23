import copy from 'rollup-plugin-copy';
import packageConfig from './package.json';

export default [{
  input: 'dist/main/uqrcode.umd.js',
  output: {
    file: 'test/html/js/uqrcode.js',
    compact: true
  }
}, {
  input: 'dist/main/uqrcode.cjs.js',
  output: {
    file: 'test/node/js/uqrcode.js',
    compact: true
  }
}, {
  input: 'dist/main/uqrcode.es.js',
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
        src: 'dist/plugin/round/uqrcode.plugin.round.es.js',
        dest: 'test/uni-app/src/plugins/uqrcode/round',
        rename: 'uqrcode.plugin.round.js'
      }, {
        src: 'LICENSE.md',
        dest: 'test/uni-app/src/plugins/uqrcode/round'
      }, {
        src: 'dist/plugin/round/README.md',
        dest: 'test/uni-app/src/plugins/uqrcode/round'
      }, {
        src: 'dist/plugin/liquid/uqrcode.plugin.liquid.es.js',
        dest: 'test/uni-app/src/plugins/uqrcode/liquid',
        rename: 'uqrcode.plugin.liquid.js'
      }, {
        src: 'LICENSE.md',
        dest: 'test/uni-app/src/plugins/uqrcode/liquid'
      }, {
        src: 'dist/plugin/liquid/README.md',
        dest: 'test/uni-app/src/plugins/uqrcode/liquid'
      }, {
        src: 'dist/plugin/words/uqrcode.plugin.words.es.js',
        dest: 'test/uni-app/src/plugins/uqrcode/words',
        rename: 'uqrcode.plugin.words.js'
      }, {
        src: 'LICENSE.md',
        dest: 'test/uni-app/src/plugins/uqrcode/words'
      }, {
        src: 'dist/plugin/words/README.md',
        dest: 'test/uni-app/src/plugins/uqrcode/words'
      }],
      verbose: true
    })
  ]
}, {
  input: 'dist/main/uqrcode.umd.js',
  output: {
    file: 'publish/browser/uqrcode/uqrcode.js',
    compact: true
  },
  plugins: [
    copy({
      targets: [{
        src: 'LICENSE.md',
        dest: 'publish/browser/uqrcode'
      }, {
        src: 'README.md',
        dest: 'publish/browser/uqrcode'
      }],
      verbose: true
    })
  ]
}, {
  input: 'dist/main/uqrcode.umd.js',
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
  input: 'dist/main/uqrcode.umd.js',
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
  input: 'dist/main/uqrcode.es.js',
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
  input: 'dist/main/uqrcode.es.js',
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
