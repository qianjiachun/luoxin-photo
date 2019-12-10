import { Vue, Component } from 'vue-property-decorator';
import { DatetimePicker, NavBar, Popup, List, Divider, Tag } from 'vant'
import PhotoWall from '../components/PhotoWall.vue'
import PhotoPreview from '../components/PhotoPreview.vue'
import { getPhotoRand, getPhoto } from '../apis/photoGet'
import { ImgData, Img } from '../interfaces'
import { timestampToTime } from '../common/timeFormat'
import styles from '../styles/photo.module.less'
import '../styles/photo.less'
// 这里引入组件，然后在@Component components:{}里写上组件名称即可在render里使用
// import ComponentA from '@/component/ComponentA'

@Component({
    components: {
        [DatetimePicker.name]: DatetimePicker,
        [NavBar.name]: NavBar,
        [Popup.name]: Popup,
        [List.name]: List,
        [Divider.name]: Divider,
        [Tag.name]: Tag,
        PhotoWall,
        PhotoPreview,
        
    }
    
})
export default class MainPage extends Vue {

    // -------------prop组件传值区首-------------
    // @Prop()
    // public prop?: string; // !必定有值 ?可选

    // @Prop(Number)
    // prop1!: number;

    // @Prop({
    //     type: String,
    //     default: 'default value',  // 一般为String, Number
    //     // 对象|数组，则默认值从函数返回
    //     // default: ()=>{ return [1,2] }
    //     required: false,
    //     validator: (value) => {
    //         return [1,2].indexOf(value) !== -1
    //     }
    // }) prop2!: string;
    // -------------prop组件传值区尾-------------


    // -------------变量声明区首-------------
    // 相当于原生Vue中的data(){}的内容，调用方法:this.xxx
    // private msg: string = 'heihei';
    private currentDate: Date = new Date();
    private popShow: boolean = false;
    private timeAnchor: number = 0;
    private loading: boolean = false;
    private finished: boolean = false;

    private photoWallData: any = {
        data: [{ thumbImg: "" }, { thumbImg: "" }, { thumbImg: "" }, { thumbImg: "" }, { thumbImg: "" }, { thumbImg: "" }, { thumbImg: "" }, { thumbImg: "" }, { thumbImg: "" },]
    };

    private photoData: any = {
    }
    private currentPage: number = 0;

    private img_preview_show: boolean = false;
    private img_preview_imgs: any[] = [];
    private img_preview_url: string = "";
    private img_preview_time: string = "";
    // 当变量涉及到多语言(中/英)的时候，需要写public data(){}来对变量进行赋值
    // private lang: string;

    // -------------变量声明区尾-------------

    // -------------html首-------------
    // 调用: {this.变量/函数}
    // v-model绑定数据; onClick(用on+大驼峰事件名，和Vue中的v-bind一样；例如onOn-Click)
    // emit: 子组件中@Emit('getInfo')，则父组件在标签写 onGetInfo={(a: any) => this.函数名(a)}，在子组件中触发emit，也要用箭头函数
    // v-for数组: this.arr.map((value: any) =>{return (<div>{value}</div>)})
    // v-for对象: Object.keys(this.obj).map(key => {return(<div>{this.obj[key][0].url}</div>)})
    public render() {
        return (
            <div>
                <van-nav-bar
                    title="拆城图库"
                    right-text="设置时间"
                    onClick-right={this.onClickRight}
                />
                <van-popup
                    v-model={this.popShow}
                    position="bottom"
                >
                    <van-datetime-picker
                        v-model={this.currentDate}
                        type="date"
                        onConfirm={this.onClickDateConfirm}
                        onCancel={this.onClickDateCancel}
                    />
                </van-popup>
                <photo-wall photoWallData={this.photoWallData}></photo-wall>
                <div class={styles.photoList}>

                    <van-list
                        v-model={this.loading}
                        finished={this.finished}
                        finished-text="没有更多了"
                        onload={this.onLoad}
                    >
                        {
                            Object.keys(this.photoData).map(timeS => {
                                return (
                                    <div>
                                        
                                        <div style="margin-left:7px;margin-bottom:7px;"><van-tag mark size="large" color="#f2826a">{timeS}</van-tag></div>
                                        <div>
                                            <div>
                                                {
                                                    this.photoData[timeS].map((eachImg: Img) => {
                                                        return (
                                                            <div
                                                                onClick={this.watchImg.bind(this, eachImg.img, eachImg.url, eachImg.type, eachImg.time)}
                                                                style="position:relative;width:170px;height:150px;display:inline-block;margin:0px 7px;">
                                                                <img class={styles.photoList__eachImg} src={eachImg.thumbImg} />
                                                                <div style={this.isGif(eachImg.img)}>
                                                                    GIF</div>
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <van-divider></van-divider>
                                    </div>
                                )
                            })
                        }

                    </van-list>
                    <photo-preview onChangeShow={this.changeShow} img_preview_show={this.img_preview_show} img_preview_imgs={this.img_preview_imgs} img_preview_url={this.img_preview_url} img_preview_time={this.img_preview_time}></photo-preview>
                    <div style="overflow: hidden;position: fixed;right: 10px;bottom: 20px;z-index: 10;">
                        <div style="overflow: hidden;">
                            <div style="padding-top:20px;padding-right:20px;padding-bottom:150px">
                                <a href="#" style="float: right;" class="btns">↑</a>
                            </div>
                        </div>
                    </div>



                </div>

            </div>
        );
    }
    // -------------html尾-------------

    // -------------data(){}首-------------
    // 用于多语言变量的赋值
    public data() {
        return {
            // lang: this.l('locales_demo'),
        }
    }
    // -------------data(){}尾-------------


    // -------------methods首-------------
    // private myFunc() {}
    private onClickRight() {
        this.popShow = true;
        this.timeAnchor = Math.floor(Number(new Date()) / 1000);

    }
    private onClickDateConfirm() {
        this.popShow = false;
        this.timeAnchor = Math.floor(Number(this.currentDate) / 1000);

        getPhoto("", String(this.timeAnchor), String(this.currentPage)).then((response: ImgData) => {
            this.photoData = {}; // 第一次
            this.currentPage = 0;
            for (let i = 0; i < response.data.length; i++) {
                let each: Img = response.data[i];
                let timeStr: string = timestampToTime(Number(each.time), false);
                let eachArr: any = {
                    img: each.img,
                    thumbImg: each.thumbImg,
                    type: each.type,
                    time: each.time,
                    url: each.url
                }
                if (this.photoData.hasOwnProperty(timeStr) == false) {
                    this.photoData[timeStr] = [];
                    this.photoData[timeStr].push(eachArr);
                } else {
                    this.photoData[timeStr].push(eachArr);
                }
            }
        })
    }

    private onClickDateCancel() {
        this.popShow = false;
    }
    private onLoad() {
        this.currentPage = this.currentPage + 1;
        getPhoto("", String(this.timeAnchor), String(this.currentPage)).then((response: ImgData) => {
            for (let i = 0; i < response.data.length; i++) {
                let each: Img = response.data[i];
                let timeStr: string = timestampToTime(Number(each.time), false);
                let eachArr: any = {
                    img: each.img,
                    thumbImg: each.thumbImg,
                    type: each.type,
                    time: each.time,
                    url: each.url
                }
                if (this.photoData.hasOwnProperty(timeStr) == false) {
                    this.photoData[timeStr] = [];
                    this.photoData[timeStr].push(eachArr);
                } else {
                    this.photoData[timeStr].push(eachArr);
                }
            }
        })
        this.loading = false;
    }
    private watchImg(img: string, url: string, type: string, time: string) {
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
        this.img_preview_time = timestampToTime(Number(time), true);
        this.img_preview_url = host + url;
    }
    private changeShow(n: boolean) {
        this.img_preview_show = n;
    }
    private isGif(n: string) {
        if (n.indexOf("gif") != -1) {
            return "position:absolute;width:180px;height:160px;z-indent:2;left:0;top:80px;line-height:20px;color:gold;font-weight:800";
        } else {
            return "display:none;"
        }
    }

    // -------------methods尾-------------

    // -------------watch首-------------
    // @Watch('变量名', {immediate: true, deep: true}) // immediate: 立刻执行 deep: 深拷贝
    // private valueWatch(n: string, o: string) {}

    // -------------watch尾-------------

    // -------------computed首-------------
    // private get 变量名() {
    //     return this.a + this.b
    // }
    // -------------computed尾-------------


    // -------------生命周期首-------------
    private created() {
        getPhotoRand().then((response: ImgData) => {
            this.photoWallData = response;
        })
    }
    private mounted() {
        this.timeAnchor = Math.floor(Number(this.currentDate) / 1000);

        getPhoto("", String(this.timeAnchor), String(this.currentPage)).then((response: ImgData) => {
            this.photoData = {}; // 第一次
            this.currentPage = 0;
            for (let i = 0; i < response.data.length; i++) {
                let each: Img = response.data[i];
                let timeStr: string = timestampToTime(Number(each.time), false);
                let eachArr: any = {
                    img: each.img,
                    thumbImg: each.thumbImg,
                    type: each.type,
                    time: each.time,
                    url: each.url
                }
                if (this.photoData.hasOwnProperty(timeStr) == false) {
                    this.photoData[timeStr] = [];
                    this.photoData[timeStr].push(eachArr);
                } else {
                    this.photoData[timeStr].push(eachArr);
                }
            }

        })

    }

    // -------------生命周期尾-------------

    // -------------emit区首-------------
    // @Emit('getInfo')
    // private emitFunc(str: string) {
    //     return str;
    // }
    // -------------emit区尾-------------
}
