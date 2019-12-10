import { Vue, Component } from 'vue-property-decorator';

@Component({
    components: {
    }
})
export default class App extends Vue {
    public render() {
        return (
            <div id="app">
               <router-view></router-view>
            </div>
        );
    }
}