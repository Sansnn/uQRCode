module.exports = {
    base: '/doc/',
    title: 'uQRCode 中文文档',
    description: 'uQRCode 全端二维码生成插件',
    head: [
        ['meta', { name: 'keywords', content: 'uQRCode,uniapp二维码生成'}],
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['script', {},
            `
            var _hmt = _hmt || [];
            (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?cf021d5d929cca65e8c8dfe3e8ff950a";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
            })();
            `
        ]
    ],
    locales: {
        // 键名是该语言所属的子路径
        // 作为特例，默认语言可以使用 '/' 作为其路径。
        '/': {
            lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
        }
    },
    themeConfig: {
        nav: [
            { text: '指南', link: '/guide/' },
            {
                text: '文档',
                items: [
                    { text: '原生', link: '/document/native/' },
                    { text: 'uni-app组件', link: '/document/uni-app/' },
                    // { text: 'v3 文档', link: 'https://uqrcode.cn/doc/v3/' }
                ]
            },
            { 
                text: '插件',
                items: [
                    { text: '风格', link: '/plugin/style/' }
                ]
            },
            // { text: '设计器', link: '/design/' },
            { text: 'Github', link: 'https://github.com/Sansnn/uQRCode' }
        ],
        sidebar: {
            '/guide/': [
                '',
                ['getting-started', '快速上手'],
                ['common-problem', '常见问题']
            ],
            '/document/': [
                ['native', '原生'],
                ['uni-app', 'uni-app组件'],
            ]
        }
    },
    configureWebpack: {
        node: {
            global: true,
            process: true
        }
    },
    chainWebpack (config) {
        config.resolve.alias.set('core-js/library/fn', 'core-js/features');
    },
    globalUIComponents: ['FloatWindow']
};
