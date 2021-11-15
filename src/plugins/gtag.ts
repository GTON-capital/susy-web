import Vue from 'vue';
import VueGtag from 'vue-gtag';

export default ({ app }: {app: any}) => {
    Vue.use(VueGtag, {
        config: { id: 'G-130FMKDCWB' },
        appName: 'Susy',
        pageTrackerScreenviewEnabled: true
    }, app.router);
}