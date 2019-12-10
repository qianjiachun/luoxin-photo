import { Vue, Component } from 'vue-property-decorator';
import { DatetimePicker, NavBar, Popup, List, Divider, Tag, Grid, GridItem, Cell } from 'vant'
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
        [Grid.name]: Grid,
        [GridItem.name]: GridItem,
        [Cell.name]: Cell,
        PhotoWall,
        PhotoPreview,

    }
    
})
export default class MainPage extends Vue {
    // -------------变量声明区首-------------
    private currentDate: Date = new Date();
    private popShow: boolean = false;
    private linkerShow: boolean = false;
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

    private column_num: number = 3;


    // -------------变量声明区尾-------------

    // -------------html首-------------

    public render() {
        return (
            <div>
                <van-nav-bar
                    title="拆城图库"
                    right-text="设置时间"
                    onClick-right={this.onClickRight}
                    onClick-left={this.onClickLeft}
                >
                    <img style="vertical-align: middle;" src={require("../resource/menu.png")} slot="left" />
                </van-nav-bar>
                <van-popup position="left" v-model={this.linkerShow} style="width:60%;height:100%;background-color:white;">
                    <div style="margin-top:46px">
                    <van-cell title="拆城弹幕仓库" is-link url="http://douyu.55kai.top" />
                    <van-cell title="拆城人口调查" is-link url="http://gift.55kai.top" />
                    </div>
                </van-popup>
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
                                            <van-grid border={"false"} column-num={this.column_num}>
                                                {
                                                    this.photoData[timeS].map((eachImg: Img) => {
                                                        return (
                                                            <van-grid-item>
                                                            <div
                                                                onClick={this.watchImg.bind(this, eachImg.img, eachImg.url, eachImg.type, eachImg.time)}
                                                                style="position:relative">
                                                                <img class={styles.photoList__eachImg} src={eachImg.thumbImg} />
                                                                <div style={this.isGif(eachImg.img)}>
                                                                    GIF</div>
                                                            </div>
                                                            </van-grid-item>
                                                        )
                                                    })
                                                }
                                                </van-grid>
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
    private onClickLeft() {
        this.linkerShow = true;
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
            return "position:absolute;width:100%;height:100%;z-indent:2;left:0;top:80%;line-height:20px;color:gold;font-weight:800";
        } else {
            return "display:none;"
        }
    }

    // -------------methods尾-------------


    // -------------生命周期首-------------
    private created() {
        getPhotoRand().then((response: ImgData) => {
            this.photoWallData = response;
        })
    }
    private mounted() {
        this.timeAnchor = Math.floor(Number(this.currentDate) / 1000);

        getPhoto("", String(this.timeAnchor), String(this.currentPage)).then((response: ImgData) => {
            this.photoData = {};
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

    // -------------emit区尾-------------
}
