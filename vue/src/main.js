// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import less from 'less';
import store from '../store';
import VueI18n from 'vue-i18n';
import {
    Button, Form, FormItem, Input, Link, Row, Col, Menu, MenuItem, Drawer, Tooltip, Submenu, Tag,
    Card, MenuItemGroup, Table, TableColumn, Dialog, Select, Switch, Option, OptionGroup, Tree,
    Notification, Loading, Message, MessageBox, Descriptions, DescriptionsItem, DatePicker
} from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';

import './components/custom';

Vue.config.productionTip = false;

Vue.use(less);
Vue.use(VueI18n);

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Link);
Vue.use(Row);
Vue.use(Col);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Drawer);
Vue.use(Tooltip);
Vue.use(Submenu);
Vue.use(Tag);
Vue.use(Card);
Vue.use(MenuItemGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Switch);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Tree);
Vue.use(Descriptions);
Vue.use(DescriptionsItem);
Vue.use(DatePicker);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

//i18n
let lang = window.localStorage.getItem('sys-lang');
lang = lang ? lang : 'zh';
window.localStorage.setItem('sys-lang', lang);
const i18n = new VueI18n({
    locale: lang,
    messages: {
        'zh': require('@/../../common/lang/zh.json'),
        'en': require('@/../../common/lang/en.json'),
    }
});

//路由切换-title更新
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    switch (to.path) {
        case '/': {
            document.title = i18n.t('admin.signIn.signIn');
            break;
        }
        case '/userInfo': {
            document.title = i18n.t('admin.user.userInfo');
            break;
        }
    }
    next();
})

//路由切换-自动返回页面顶部
router.afterEach(() => {
    window.scrollTo(0, 0);
});

//防止手动修改本地存储
window.addEventListener('storage', (e) => {
    sessionStorage.setItem(e.key, e.oldValue);
});

new Vue({
    el: '#app',
    router,
    i18n,
    store,
    components: {App},
    template: '<App/>',
})
