import { Vue, Component } from 'vue-property-decorator';

// 这里引入组件，然后在@Component components:{}里写上组件名称即可在render里使用
// import ComponentA from '@/component/ComponentA'

@Component({
    components: {
        // ComponentA
    }
    // depends: [
    //     // 这里相当于import组件
    //     // 'component.ComponentA',  // component是组件的标记
    //     // 'api.FooApi'  // api是API的标记
    // ],
})
export default class App extends Vue {

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
    
    // 当变量涉及到多语言(中/英)的时候，需要写public data(){}来对变量进行赋值
    // private lang: string;

    // -------------变量声明区尾-------------

    // -------------html首-------------
    // 调用: {this.变量/函数}
    // v-model绑定数据; onClick(用on+大驼峰事件名，和Vue中的v-bind一样；例如onOn-Click)
    // emit: 子组件中@Emit('getInfo')，则父组件在标签写 onGetInfo={(a: any) => this.函数名(a)}，在子组件中触发emit，也要用箭头函数
    // v-for数组: this.arr.map((value: any) =>{return (<div>{value}</div>)})
    // v-for对象: Object.keys(this.obj).map(key => {return(<div>{this.obj[key][0].url}<div>)})
    public render() {
        return (
            <div id="app">
               <router-view></router-view>
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
    private created() {}
    private mounted() {}
    // -------------生命周期尾-------------

    // -------------emit区首-------------
    // @Emit('getInfo')
    // private emitFunc(str: string) {
    //     return str;
    // }
    // -------------emit区尾-------------

}