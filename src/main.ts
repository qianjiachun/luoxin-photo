import Vue from 'vue'
import App from './App'
import router from './router'
import 'vant/lib/index.css'
// import PhotoWall from './packages/photo/components/'
// import PhotoPreview from './components/PhotoPreview.vue'
// Vue.component('PhotoWall', PhotoWall);
// Vue.component('PhotoPreview', PhotoPreview);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
