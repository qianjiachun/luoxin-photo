module.exports = {
  configureWebpack: {
    externals: {
      vue: "Vue",
      axios: "axios",
      // echartsWordcloud: "echarts-wordcloud"
    }
  },

  publicPath: './'
};
