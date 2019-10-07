import http from '../utils/http.js'

//查询
export const getUserSession = () => http("get", "api/search",)
//删除
export const delUserSession = (a) => http('post', 'api/del',{id:a})
//修改
export const changeUserSession = (a,b,c,d,e) => http('post', 'api/change',{name:a,gender:b,phone:c,birthday:d,idx:e})
//增加
export const addUserSession = (a,b,c,d) => http('post','api/add',{name:a,gender:b,phone:c,birthday:d})


// 功能:信息查询
// 请求方式: GET
// 路径：localhost:3000/abc  api/search
// 参数: name gender phoneNumber birthday
