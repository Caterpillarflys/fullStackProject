

  module.exports = {
    devServer: {
        proxy: { // 设置代理
            '/api': {
                target: 'http://localhost:4000', 
                changeOrigin: true, 
                pathRewrite: { 
                    '^/api': '' 
                }
            }
        }
    }
}





