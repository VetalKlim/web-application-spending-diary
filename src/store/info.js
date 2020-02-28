// модуль для получения данных из БД firebase
import firebase from "firebase/app"; // подключаем firebase к файлу
export default {
    state: {
        info: {}

    },
    mutations: {

        setInfo(state, info) {
            state.info = info;
        },

        clearInfo(state) {
            state.info = {};
        }
    },
    actions: {
        async fetchInfo({
            dispatch,
            commit
        }) {

            try {
                const uid = await dispatch("getUid");
                const info = (await firebase
                    .database()
                    .ref(`/users/${uid}/info`)
                    .once("value")).val();

                commit("setInfo", info);


            } catch (e) {

            }
        }
    },
    getters: { // для того чтобы получить текущий state используем getters
        // который принимает state и возвращает поле state.info (обновленное)
        info: state => state.info
    }
};