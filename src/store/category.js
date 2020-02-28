import firebase from "firebase/app/";
export default {
    actions: {
        async createCategory({ dispatch, commit }, { nameCategory }) {
            try {
                const uid = await dispatch("getUid");
                const category = await firebase
                    .database()
                    .ref(`/users/${uid}/categories`)

                .push({
                    nameCategory
                });
                return {
                    nameCategory,
                    id: category.key
                };
            } catch (error) {

                commit("setError", error);
                throw error;
            }
        },
        async fetchCategories({ dispatch, commit }) {
            try {
                const uid = await dispatch("getUid");
                let categories =
                    (await firebase
                        .database()
                        .ref(`/users/${uid}/categories`)
                        .once("value"))
                    .val() || {};

                return Object.keys(categories).map(key => ({...categories[key], id: key }));

            } catch (error) {
                commit('setError', error);
                throw error;
            }
        },
        async fetchCategoryById({ dispatch, commit }, id) { // запрос по определенной категории 
            try {
                const uid = await dispatch("getUid");
                let category =
                    (await firebase
                        .database()
                        .ref(`/users/${uid}/categories`).child(id)
                        .once("value"))
                    .val() || {};
                return {...category, id }
            } catch (error) {
                throw error;
            }
        },
        async updateCategory({ dispatch, commit }, { nameCategory, id }) {
            try {
                const uid = await dispatch("getUid");
                await firebase
                    .database()
                    .ref(`/users/${uid}/categories`)
                    .child(id)
                    .update({
                        nameCategory
                    });
            } catch (error) {
                commit('setError', error);
                throw error;
            }
        },
        async deleteCategory({ dispatch, commit }, { id }) {
            try {
                const uid = await dispatch("getUid");
                await firebase
                    .database()
                    .ref(`/users/${uid}/categories`)
                    .child(id)
                    .remove();

            } catch (error) {

                commit('setError', error);
                throw error;

            }
        }
    }
};