<template>
    <div class="photoWall_wrap">
        <photo-preview @changeShow="changeShow" :img_preview_show="img_preview_show" :img_preview_imgs="img_preview_imgs" :img_preview_url="img_preview_url" :img_preview_time="img_preview_time"></photo-preview>
        <div id="perspective">
            <div id="photowrap" @touchmove.prevent>
                <img class="photowall_img"
                    v-for="(item, index) in photoWallData.data"
                    :key="index"
                    :src="item.thumbImg"
                    @click="watchImg(item.img, item.url, item.type, item.time)"
                />
            </div>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import Vue from "vue";
import '@vant/touch-emulator';
import {timestampToTime} from '../common/timeFormat.ts';
import PhotoPreview from './PhotoPreview';
export default {
    //import引入的组件需要注入到对象中才能使用
    props: ["photoWallData"],
    components: {
        PhotoPreview
    },
    data() {
        //这里存放数据
        return {
            img_preview_show: false,
            img_preview_imgs: [],
            img_preview_url: "",
            img_preview_time: ""
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        watchImg(img, url, type, time) {
            let host = "";
            this.img_preview_imgs = [img];
            this.img_preview_show = true;
            
            if (type == "weibo") {
                host = "https://weibo.com/2085966565/"
            } else {
                if (type.indexOf("yuba") != -1) {
                    host = "https://yuba.douyu.com/p/"
                } else {
                    host = ""
                }
                
            }
            this.img_preview_time = timestampToTime(time, true);
            this.img_preview_url = host + url;
        },
        changeShow(n) {
            this.img_preview_show = n;
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        let oWrap = document.getElementById("photowrap");
        let oImgs = oWrap.getElementsByClassName("photowall_img");
        let overTop =
            document.getElementsByClassName("photoWall_wrap")[0].offsetTop +
            100;

        let deg = 360 / oImgs.length;
        for (let i = 0; i < oImgs.length; i++) {
            oImgs[i].style.transform =
                "rotateY(" + i * deg + "deg) translateZ(200px)";
        }
        let nowX, nowY, lastX, lastY, minusX, minusY;
        let ev, timer;
        let roX = -10,
            roY = 0;
        document.onmousedown = function(ev) {
            ev = ev || window.event;
            lastX = ev.clientX;
            lastY = ev.clientY;
            if (lastY > overTop) {
                return;
            }
            this.onmousemove = function(ev) {
                ev = ev || window.event;
                //当前鼠标距离页面左边的距离
                nowX = ev.clientX;
                //当前鼠标距离页面上边的距离
                nowY = ev.clientY;

                //X方向上的差值
                minusX = nowX - lastX;
                //Y方向上的差值
                minusY = nowY - lastY;
                //X轴的旋转角度(乘0.1是防止旋转过快)
                roX -= minusY * 0.1;
                //y轴的旋转角度(乘0.2是防止旋转过快)
                roY += minusX * 0.2;
                oWrap.style.transform =
                    "rotateX(" + roX + "deg) rotateY(" + roY + "deg)";
                lastX = nowX;
                lastY = nowY;
            };
            this.onmouseup = function() {
                timer = setInterval(function() {
                    minusX *= 0.95;
                    minusY *= 0.95;
                    roY += minusX * 0.2;
                    roX -= minusY * 0.1;
                    oWrap.style.transform =
                        "rotateX(" + roX + "deg) rotateY(" + roY + "deg)";
                    if (Math.abs(minusX) < 0.5 && Math.abs(minusY) < 0.5) {
                        clearInterval(timer);
                    }
                }, 13);
                //鼠标抬起，结束鼠标移动事件
                this.onmousemove = null;
            };
            return false;
        };

        document.ontouchstart = function(e) {
            ev = e.touches[0];
            lastX = ev.clientX;
            lastY = ev.clientY;
            if (lastY > overTop) {
                return;
            }
            this.ontouchmove = function(e) {
                ev = e.touches[0];
                //当前鼠标距离页面左边的距离
                nowX = ev.clientX;
                //当前鼠标距离页面上边的距离
                nowY = ev.clientY;
                //X方向上的差值
                minusX = nowX - lastX;
                //Y方向上的差值
                minusY = nowY - lastY;
                //X轴的旋转角度(乘0.1是防止旋转过快)
                roX -= minusY * 0.1;
                //y轴的旋转角度(乘0.2是防止旋转过快)
                roY += minusX * 0.2;
                oWrap.style.transform =
                    "rotateX(" + roX + "deg) rotateY(" + roY + "deg)";
                lastX = nowX;
                lastY = nowY;
            };
            this.ontouchend = function() {
                timer = setInterval(function() {
                    minusX *= 0.95;
                    minusY *= 0.95;
                    roY += minusX * 0.2;
                    roX -= minusY * 0.1;
                    oWrap.style.transform =
                        "rotateX(" + roX + "deg) rotateY(" + roY + "deg)";
                    if (Math.abs(minusX) < 0.5 && Math.abs(minusY) < 0.5) {
                        clearInterval(timer);
                    }
                }, 13);
                //鼠标抬起，结束鼠标移动事件
                this.ontouchmove = null;
            };
            return false;
        };
        
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style>
#perspective {
    perspective: 800px;
}
#photowrap {
    width: 115px;
    height: 80px;
    /* border:1px solid red; */
    margin: 50px auto;
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(-10deg);
}
#photowrap img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 1px;
    box-shadow: 0 0 2px #fff;
}
#photowrap img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 1px;
    box-shadow: 0 0 2px #fff;
    -webkit-box-reflect: below 5px -webkit-linear-gradient(top, rgba(0, 0, 0, 0)
                40%, rgba(0, 0, 0, 0.5) 100%);
}
</style>