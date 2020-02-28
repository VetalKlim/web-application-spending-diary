import Vue from "vue";
import Vuelidate from 'vuelidate';
import App from "./App.vue";
import router from "./router";
import VueMeta from 'vue-meta'; 
import store from "./store"; 
import dateFilter from "@/filters/date.filter.js"; 
import currencyFilter from '@/filters/currency.filter'
import messagePlugin from '@/utils/message.plugin.js' 
import titlePlugin from '@/utils/title.plugin.js'
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";
import Loader from "./components/app/Loader"; 
import LoaderLittle from "./components/app/LoaderLittle.vue";
import localizeFilter from '@/filters/localize.filter.js'
import firebase from 'firebase/app' 
import 'firebase/auth' 
import 'firebase/database' 
import tooltipDirective from '@/directives/tooltip.directive.js'
import Paginate from 'vuejs-paginate'

Vue.config.productionTip = false;
Vue.use(messagePlugin); 
Vue.use(Vuelidate); 
Vue.use(VueMeta);
Vue.use(titlePlugin);
Vue.filter('date', dateFilter); 
Vue.filter('currency', currencyFilter) 
Vue.filter('localize', localizeFilter)
Vue.component('Loader', Loader); 
Vue.component('LoaderLittle', LoaderLittle);
Vue.component('Paginate', Paginate) 
Vue.directive('tooltip', tooltipDirective); 
let app; // создаем переменную для того чтобы записать результат работы new Vue


firebase.initializeApp({
    apiKey: "AIzaSyA5fhewHtQ7okR8JWDXBPmjlBteYMssEuw",
    authDomain: "vue-spending-diary.firebaseapp.com",
    databaseURL: "https://vue-spending-diary.firebaseio.com",
    projectId: "vue-spending-diary",
    storageBucket: "",
    messagingSenderId: "746476818354",
    appId: "1:746476818354:web:5eeec18f70cb24ebb4deab"
});


firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router, 
            store, 
            render: h => h(App)
        }).$mount("#app");
    }
})
