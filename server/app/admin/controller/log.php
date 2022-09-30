<?php

namespace admin\controller;

use service\middleware;

/**
 * Class log
 * @package admin\controller
 */
class log extends middleware\login {

    private $log_path = APP_RUNTIME_PATH . 'log';

    /**
     * log constructor.
     * @throws \Exception
     */
    public function __construct() {
        parent::__construct(1, 'admin');
    }

    /**
     * Func: fwLog
     * User: Force
     * Date: 2021/9/1
     * Time: 20:46
     * Desc: 框架日志
     */
    public function fwLog() {

        //API
        sys_api([

            //加载列表
            'load' => function() {

                //扫描日志模块
                $dir = scandir($this->log_path);
                unset(
                    $dir[array_search('.', $dir)],
                    $dir[array_search('..', $dir)]
                );
                if(count($dir) > 100) {
                    $dir = array_slice($dir, 0, 50);
                }

                //队列
                $lists = [];
                foreach ($dir as $dir_name) {

                    //扫描日志目录
                    $log_file = $this->log_path . '/' . $dir_name;
                    $log_file = scandir($log_file);
                    unset(
                        $log_file[array_search('.', $log_file)],
                        $log_file[array_search('..', $log_file)]
                    );
                    $log_file = array_slice($log_file, 0, 50);

                    //队列
                    foreach ($log_file as $log_name) {

                        //日志详情处理
                        $temp = [];
                        $log_detail = file_get_contents($this->log_path . '/' . $dir_name . '/' . $log_name);
                        $log_detail = explode("\n", $log_detail);
                        $log_detail = array_filter($log_detail);

                        foreach ($log_detail as $item_log) {

                            $level = '';
                            if(is_numeric(strpos($item_log,'[INFO]'))) {
                                $item_log = str_replace('[INFO] ', '', $item_log);
                                $level = 'info';
                            }
                            if(is_numeric(strpos($item_log,'[FATAL]'))) {
                                $item_log = str_replace('[FATAL] ', '', $item_log);
                                $level = 'fatal';
                            }

                            $log_time = substr($item_log, 0, 19);
                            $item_log = str_replace($log_time.' ', '', $item_log);

                            $temp[] = [
                                'info' => $item_log,
                                'level' => $level,
                                'log_time' => $log_time,
                            ];
                        }
                        $log_detail = $temp;
                        unset($temp);

                        //排序
                        $log_detail = array_order_by($log_detail, 'log_time', SORT_DESC);
                        $log_detail = array_values($log_detail);

                        //组装数据
                        $lists[] = [
                            'module_path' => $this->log_path . '/' . $dir_name . '/',
                            'log_name' => $log_name,
                            'log_date' => date('Y-m-d', strtotime(substr($log_name, 0, 8))),
                            'log_hour' => substr($log_name, 8, 2),
                            'log_detail' => $log_detail,
                        ];
                    }
                }

                //排序
                $lists = array_order_by($lists, 'log_name', SORT_DESC);
                $lists = array_values($lists);

                //response
                ajax(1, trans('admin.sysLog.loadListOk'), $lists);
            },
        ]);
    }

    /**
     * Func: sysLog
     * User: Force
     * Date: 2021/9/1
     * Time: 20:53
     * Desc: 系统日志
     */
    public function sysLog() {

        //API
        sys_api([

            //加载列表
            'load' => function() {

                //组装条件
                $where = [];
                if(is_numeric($_POST['status'])) {
                    $where['level'] = intval($_POST['status']);
                }

                //获取日志
                $log_data = m('sys_log')
                    ->where($where)
                    ->order('id desc');

                //分页
                $log_data = \poem\more\page::run($log_data, '/#/log/sysLog', 15);

                //数据格式化
                if(is_array($log_data['list']) && !empty($log_data['list'])) {

                    //获取后台用户信息
                    $admin_info = m('sys_admin')
                        ->field('id, name')
                        ->where([
                            'status' => 1,
                        ])
                        ->select();
                    if($admin_info) {
                        $admin_info = array_combine(array_column($admin_info, 'id'), $admin_info);
                    }

                    foreach ($log_data['list'] as $key => $item) {
                        $log_data['list'][$key]['admin'] = $admin_info[$item['admin_id']]['name'];
                        $log_data['list'][$key]['ctime'] = date('Y-m-d H:i:s', $item['ctime']);
                        $log_data['list'][$key]['level_mean'] = trans('admin.sysLog.levelMean'.$item['level']);
                    }
                }

                //response
                ajax(1, trans('admin.sysLog.loadListOk'), [
                    'lists' => $log_data['list'],
                    'page_html' => $log_data['html'],
                ]);
            },
        ]);
    }
}