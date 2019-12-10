<template>
    <div>
        <van-image-preview v-model="img_preview_show1" :images="img_preview_imgs" @close="imgClose">
            <template v-slot:index>
                <div style="text-align:center">
                    <a
                        :href="img_preview_url"
                        target="_blank"
                        style="color:gold"
                    >点我跳转至图片来源</a>
                    <br>
                    {{img_preview_time}}
                    <br>
                    {{img_preview_url}}
                </div>
            </template>
        </van-image-preview>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Vue from "vue";
import { ImagePreview } from "vant";
Vue.use(ImagePreview);
export default {
    //import引入的组件需要注入到对象中才能使用
    props: ['img_preview_show', 'img_preview_imgs', 'img_preview_url', 'img_preview_time'],
    components: {
        
    },
    data() {
        return {
            img_preview_show1: false
        }
    },
    watch: {
        img_preview_show(n) {
            this.img_preview_show1 = n;
        }
    },
    methods: {
        imgClose() {
            this.$emit("changeShow",this.img_preview_show1);
        }
    },
}
</script>

<style>

</style>