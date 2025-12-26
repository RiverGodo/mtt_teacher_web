import api from './config'
//用户登录
export function login_pwd(name,password) {
    return api.post('/v1/user/login', {
        username: name,
        password: password
    });
}
//获取个人详情
export function user_info(){
    return api.post('/v1/user/getUserInfo');
}
