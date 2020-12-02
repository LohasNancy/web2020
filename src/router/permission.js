//权限管理页面
import router from "./index";
import store from "../store";

router.beforeEach((to, from, next) => {
    if (to.meta.isLogin) {
        //需要登录
        var token = store.state.loginModule.user.token;
        // var token = false;
        if (token) {
            next();
        } else {
            next({
                path: "./login"
            })
        }
    } else {
        //不需要登录
        next();
    }
})