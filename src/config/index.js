import Vue from 'vue';
import store from '../store';
import router from './router';
import { sync } from 'vuex-router-sync';
import LoadingY from '../plug/index';
import config from './config';
import postData from "../api/postData";
import baseUrl from '../../config/url'
Vue.prototype.$config = config;
window.$OnLine = new Vue()
window.$MakeAppointment = new Vue()
window.$ActivePage = new Vue()
window.$CaseAdd = new Vue()
window.$CaseEdit = new Vue()
window.$CaseSuccessfulOperation = new Vue()
window.$CaseScoreDetails = new Vue()
window.$CaseScoreWeight = new Vue()
window.$CaseScoreWeightDeduction = new Vue()
window.$DeductionCaseScoreWeight = new Vue()
window.$CasePreservation = new Vue()
window.$AbilityAnalysis = new Vue()
window.$MenuActiveIndex = new Vue()
window.$CaseSummarys = new Vue()
Vue.use(LoadingY)
global.PostData = postData;
global.BaseUrl = baseUrl
// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

import api from '../api/modules/config'
// 临时关闭登录校验，方便查看页面
router.beforeEach((to, from, next) => {
    // 直接放行所有路由，不进行登录校验
    next();
    
    // 原登录校验代码已注释
    // let toLogin = () => {
    //   if (to.name == 'login') next();
    //   else {
    //       sessionStorage.clear();
    //       next({path: '/login'});
    //   }
    // }
    // if(sessionStorage.getItem('token')){
    //     if(to.name === 'login'){
    //         next({name: 'user-manage'})
    //     }else if(to.name != 'login'){
    //         // user/getUserDetail
    //         api.post('v1/user/getUserInfo',{token: sessionStorage.getItem('token')}).then((res) => {
    //             if (res.data.res_code === 1) {
    //                 let d = res.data.data;
    //                 sessionStorage.setItem('organizationId',d.organization_id)
    //                 store.dispatch('set_user_info', d);
    //                 sessionStorage.setItem('PERSONALDETAILS',JSON.stringify(d))
    //                 next()
    //             }else {
    //                 if (to.name !== 'login') next({ path: '/login' });
    //                 else toLogin();
    //             }
    //         })
    //     }
    // }else toLogin()
})
export default router;
