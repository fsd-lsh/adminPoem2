import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
Vue.use(Router);

let router = new Router({

    mode:'hash',

    routes: [

        {
            path: '/',
            name: 'signIn',
            component: () => import(/* webpackChunkName: "vuePoem-[request]" */'../views/signIn.vue'),
            meta: {
                title: '',
            },
        },
    ],
});

const lang = localStorage.getItem('sys-lang');
axios.get('/admin/menu/load?lang='+lang).then(res => {

    if(res.data.code === 955) {
        sessionStorage.setItem('store', JSON.stringify({isSignIn:false,menuTree:{}}));
        router.push('/');
        return false;
    }

    if(res.data.code === 1) {

        let menu = res.data.data.menuInfo;
        let logoInfo = res.data.data.logoInfo;

        if(window.sessionStorage.getItem('store')) {
            let store = JSON.parse(window.sessionStorage.getItem('store'));
            store.menuTree.menuInfo = menu;
            window.sessionStorage.setItem('store', JSON.stringify(store));
        }else {
            window.sessionStorage.setItem('store', JSON.stringify([]));
        }

        for (let index = 0; index < menu.length; index++) {
            for (let sub_index = 0; sub_index < menu[index].child.length; sub_index++) {
                if(menu[index].child[sub_index].child.length) {
                    for (let sub_index2 = 0; sub_index2 < menu[index].child[sub_index].child.length; sub_index2++) {
                        router.addRoute({
                            path: menu[index].child[sub_index].child[sub_index2].href,
                            name: menu[index].child[sub_index].child[sub_index2].name,
                            //component: resolve => require(['@/views/admin/' + menu[index].child[sub_index].child[sub_index2].name], resolve),
                            component: () => import(/* webpackChunkName: "vuePoem-[request]" */`../views/admin/${menu[index].child[sub_index].child[sub_index2].name}.vue`),
                            meta: {
                                title: menu[index].child[sub_index].child[sub_index2].title + ' - ' + logoInfo.title,
                                icon: menu[index].child[sub_index].icon,
                            },
                        });
                    }
                }else {
                    router.addRoute({
                        path: menu[index].child[sub_index].href,
                        name: menu[index].child[sub_index].name,
                        //component: resolve => require(['@/views/admin/' + menu[index].child[sub_index].name], resolve),
                        component: () => import(/* webpackChunkName: "vuePoem-[request]" */`../views/admin/${menu[index].child[sub_index].name}.vue`),
                        meta: {
                            title: menu[index].child[sub_index].title + ' - ' + logoInfo.title,
                            icon: menu[index].child[sub_index].icon,
                        },
                    });
                }
            }
        }
    }
});

router.beforeEach((to, from, next) => {

    if(window.sessionStorage.getItem('store')) {
        let store = JSON.parse(window.sessionStorage.getItem('store'));
        if(to.path === '/' && store.isSignIn === true) {
            router.push('/dash');
        }
    }
    next();
});

export default router;
