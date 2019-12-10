module.exports = {
  publicPath: "./",
  configureWebpack: {
    externals: {
      vue: "Vue",
      axios: "axios",
      // echartsWordcloud: "echarts-wordcloud"
    }
  }
};
