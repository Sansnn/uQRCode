module.exports = {
    base: '/doc/v3/',
    title: 'uQRCode 中文文档',
    description: '全端二维码生成插件',
    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['script', {},
            `
            ;
            (function() {
                var replace = 'doc.uqrcode.cn';
                var redirect = 'uqrcode.cn/doc';
                var current = location.host;
                if (current == replace) {
                    var url = location.href.replace(replace, redirect);
                    location.replace(url);
                }
            })();
            `
        ],
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
    themeConfig: {
        nav: [
            { text: '指南', link: '/guide/' },
            {
                text: '文档',
                items: [
                    { text: '原生', link: '/document/native/' },
                    { text: 'uni-app组件', link: '/document/uni-app/' }
                ]
            },
            { text: '设计器', link: '/design/' },
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
    }
};
