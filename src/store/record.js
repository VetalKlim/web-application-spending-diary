import firebase from "firebase/app";
export default {
    actions: {
        async createRecord({ dispatch, commit }, record) {
            // функция принимает параметры которые пришли с создания записи операции
            try {
                const uid = await dispatch("getUid"); // вычисляем id пользователя
                return await firebase // обращаемся к firebase
                    .database() // в БД
                    .ref(`/users/${uid}/records`) // по пути
                    .push(record); // и записываем в БД поля по операции
            } catch (error) {
                // если есть ошибка
                commit("setError", error); // обращаемся к методу setError и передаем туда данные по ошибке
                throw error; // и закрываем дальнейшую логику
            }
        },
        // функция служит для обновления данных в БД
        async updateInfo({ dispatch, commit, getters }, toUpdate) {
            try {
                const uid = await dispatch("getUid"); 
                const updateData = {
                    ...getters.info,
                    ...toUpdate
                }; // обновляем данные с помощью getters (берем все данные и меняем их на все которые будут
                // тех что не будут останутся нетронутыми )
                await firebase // обогащаемся  firebase
                    .database() // в БД
                    .ref(`/users/${uid}/info`) // по пути
                    .update(updateData); // обновляем данные
                commit("setInfo", updateData); // вызываем метод setInfo и передаем объект для того чтобы обновить поле Info в файле store/info
            } catch (error) {
                commit("setError");
                throw error;
            }
        },
        async fetchRecords({ dispatch, commit }) {
            // функция которая берет с БД весе данные по записям (доход и расход)
            try {
                const uid = await dispatch("getUid");
                const records =
                    (await firebase
                        .database()
                        .ref(`/users/${uid}/records`)
                        .once("value")).val() || {};
                let res = Object.keys(records).map(key => ({
                    ...records[key],
                    id: key
                }));
                return res;
            } catch (error) {
                commit("setError", error);
                throw error;
            }
        },
        async fetchRecordById({ dispatch, commit }, id) {
            // запрос по определенной записи
            try {
                const uid = await dispatch("getUid");
                const record =
                    (await firebase
                        .database()
                        .ref(`/users/${uid}/records`)
                        .child(id)
                        .once("value")).val() || {};
                return {...record, id: id };
            } catch (error) {
                commit("setError", error);
                throw error;
            }
        },
        async editRecord({ dispatch, commit }, {
            nameCategory,
            id,
            categoryId,
            dateMonth,
            dateYear,
            dateDay,
            amount,
            fullDate,
            description,
            type
        }) {
            // метод для редактирования записи
            try {
                const uid = await dispatch("getUid");
                await firebase
                    .database()
                    .ref(`/users/${uid}/records`)
                    .child(id)
                    .set({
                        nameCategory,
                        id,
                        categoryId,
                        dateMonth,
                        dateYear,
                        dateDay,
                        amount,
                        fullDate,
                        description,
                        type
                    });
            } catch (error) {
                commit("setError", error);
                throw error;
            }
        },
        async deleteRecord({ dispatch, commit }, id) {
            // Удаление записи
            try {
                let uid = await dispatch("getUid");
                await firebase
                    .database()
                    .ref(`/users/${uid}/records`)
                    .child(id)
                    .remove();
            } catch (error) {
                commit("setError", error);
                throw error;
            }
        },
        async deleteRecordByCategory({ dispatch, commit }, newRecords) {
            // удаление записей по категории
            try {
                let uid = await dispatch("getUid");
                await firebase
                    .database()
                    .ref(`/users/${uid}/records`)
                    .set(newRecords); // set - это метод для обновления БД
            } catch (error) {
                commit("setError", error);
                throw error;
            }
        },
        async updateRecords({ commit, dispatch }, editRecords) { // метод который обновляет все записи после того как была изменена название категории
            try {
                let uid = await dispatch('getUid');
                await firebase.database().ref(`/users/${uid}/records`)
                    .set(editRecords);
                console.log('успех');

            } catch (error) {
                console.log('лажа');
                commit('setError', error);
                throw error;

            }
        }

    }
};
