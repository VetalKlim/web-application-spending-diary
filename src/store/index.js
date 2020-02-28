// В этом файле настраивается сам объект Store (который будет отвечать за состояние всего приложения )
import Vue from "vue"; 
import Vuex from "vuex"; 
import auth from "./auth"; 
import info from "./info" 
import error from "./error" 
import category from "./category"
import record from './record'

Vue.use(Vuex);


export default new Vuex.Store({
    actions: { 
    },
    modules: {
        // здесь хранятся все модули приложения чтобы не захламлять главный файл Store
        auth, 
        info, 
        error, 
        category,
        record
    }
});