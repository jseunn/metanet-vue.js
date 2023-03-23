const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false
})

module.exports = {
  devServer: {
    proxy : 'http://localhost:8082' // 외부 서버로 접속
  }
}