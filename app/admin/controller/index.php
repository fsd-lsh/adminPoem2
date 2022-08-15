<?php

namespace admin\controller;

use service\component;

class index extends component\login {

    /**
     * Func: index
     * User: Force
     * Date: 11/28/20
     * Time: 8:45 PM
     * Desc: 后台首页
     */
    public function index() {

        //API
        sys_api([

            //登录
            'sign_in' => function() {
                parent::__construct(0, 'admin');
                parent::sign_in();
            },

            //注销
            'sign_out' => function() {
                parent::__construct(0, 'admin');
                parent::sign_out();
            },
        ]);
    }
}
