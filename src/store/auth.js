
// в этом модуле лежит вся логика авторизации, регистрации и выход с приложения (logout)
import firebase from "firebase/app";

export default {
    actions: {
      
        async login({
            dispatch,
            commit
        }, {
            email,
            password
        }) {
            try {
               
                await firebase.auth().signInWithEmailAndPassword(email, password);
               
            } catch (e) {
               
                commit("setError", e);
                throw e;
            }
           
        },
        
        // __________________________________________________________________________
        async register({
            dispatch,
            commit
        }, {
            email,
            password,
            name
        }) {
            try {
               
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                const uid = await dispatch("getUid"); 
               
                await firebase
                    .database()
                    .ref(`/users/${uid}/info`)
                    .set({
                        
                        bill: 0, // бюджет который задается
                        name: name, // имя пользователя
                        limit: 0,
                        locale: "ru-RU"

                    });
            } catch (e) {
                
                commit("setError", e); 
               
                throw e;
            }
        },

        // ____________________________________________________________________________
        getUid() {
           
            const user = firebase.auth().currentUser;
           
            return user ? user.uid : null; 
            
        },

        // __________________________________________________________________________
       
        async logout({
            dispatch,
            commit
        }) {
          
            try {
                await firebase.auth().signOut();
                commit("clearInfo"); 
            } catch (error) {
                commit('setError', error)
                throw error;
            }
        },
        changePasswordUser({ commit }) { // Метод который меняет пароль на новый 
            let auth = firebase.auth();
            auth
                .sendPasswordResetEmail(auth.currentUser.email)
                .then(() => {})
                .catch(error => {
                    // commit('setError', error)
                });
        }
    }
};