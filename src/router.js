import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase/app";

Vue.use(Router);

const router = new Router({
    mode: "history", 
    base: process.env.BASE_URL,
    routes: [{
            path: "/login",
            name: "login",
            meta: {
                
                layout: "empty"
            },
            component: () =>
                import ("./views/Login.vue") 
        },
        {
            path: "/register",
            name: "register",
            meta: {
                layout: "empty"
            },
            component: () =>
                import ("./views/Register.vue")
        },

        {
            path: "/categories",
            name: "categories",
            meta: {
                layout: "main",
                auth: true
            },
            component: () =>
                import ("./views/Categories.vue")
        },
        {
            path: "/detail/:id",
            name: "detail",
            meta: {
                layout: "main"
            },
            component: () =>
                import ("./views/Detail.vue")
        },
        {
            path: "/detailsMount/:month/:year",
            name: "detailsMount",
            meta: {
                layout: "main"
            },
            component: () =>
                import ("./views/DetailsMount.vue")
        },
        {
            path: "/",
            name: "history",
            meta: {
                layout: "main",
                auth: true
            },
            component: () =>
                import ("./views/History.vue"),

        },

        {
            path: "/planning",
            name: "planning",
            meta: {
                layout: "main",
                auth: true
            },
            component: () =>
                import ("./views/Planning.vue")
        },
        {
            path: "/profile",
            name: "profile",
            meta: {
                layout: "main",
                auth: true
            },
            component: () =>
                import ("./views/Profile.vue")
        },
        {
            path: "/record",
            name: "record",
            meta: {
                layout: "main",
                auth: true
            },
            component: () =>
                import ("./views/Record.vue")
        }
    ]
});

router.beforeEach((to, from, next) => {
    //beforeEach вызывается при каждой смене роута. Здесь проверяем на наличие авторизации 
    const currentUser = firebase.auth().currentUser; // ищем в firebase пользователя 
    const requireAuth = to.matched.some(record => record.meta.auth); // проверяем куда мы идем и требует ли данный роут авторизации
    if (requireAuth && !currentUser) {
        // проверка если текущий роут (куда мы направляемся) он требует авторизации
        // и и если нет никакого пользователя то тогда запрещаем заходить на данную страницу
        next(
            `/login?redirect=${encodeURIComponent(
        window.location.pathname
      )}&message=login`
        ); // с помощью метода next и направляем его на стартовую страницу
    } else {
        // иначе вызывается метод  next() для продолжения авторизации пользователя
        next(); //next(): переход к следующему хуку в цепочке.
    }
});
export default router;
