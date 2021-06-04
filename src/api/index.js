/*
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
* 每个函数的返回值都是promise*/
import jsonp from 'jsonp'
import ajax from "./ajax";
import {message} from "antd";

//基本要求：能根据接口文档定义接口请求函数

//登陆
// export function reqLogin(username, password) {
//     return ajax('/login', {username, password}, 'POST')
// }
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

//获取一级/二级分类的列表
export const reqCategorys = (parentId) =>ajax('/manage/category/list', {parentId})
//添加分类
export const reqAddCategory = (categoryName, parentId) =>ajax('/manage/category/add', {categoryName, parentId}, "POST")
//更新分类
export const reqUpdateCategory = (categoryId, categoryName) =>ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

//根据分类Id获取该分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

//更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

//搜索商品分页列表（根据商品名称/商品描述）
//searchType：搜索的类型，productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})

//删除指定名称的图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

//添加商品/修改商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ?'update':'add'),product, 'POST')

//获取所有角色的列表
export const reqRoles = () => ajax('manage/role/list')

//获取添加角色
export const reqAddRole = (roleName) => ajax('manage/role/add', {roleName}, 'POST')

//更新角色
export const reqUpdateRole = (role) => ajax('manage/role/update', role, 'POST')

//获取所有用户的列表
export const reqUsers = () => ajax('/manage/user/list')

//删除指定用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')

//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ?'update':'add'), user, 'POST')


//jsonp请求的接口请求函数
/*
* jsonp解决ajax跨域的原理
* 1、jsonp只能解决GET类型的ajax请求跨域问题
* 2、jsonp请求不是ajax请求，而是一般的get请求
* 3、基本原理：
*       浏览器端：
*           动态生成器<script>来请求后台接口(src就是接口的url)
*           定义好用于接收响应数据的函数(fn)，并将函数名通过请求参数提交给后台(如：callback=fn)
*           接收到请求处理产生结果数据后，返回一个函数调用的js代码，并将结果数据作为实参传入函数调用浏览器端
*           收到响应自动执行函数调用的js代码，也就执行了提前定义好的回调函数，并得到了需要的结果数据
* */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=f289de4d5e24f661e011abf4c965050d&city=${city}`
        jsonp(url, {}, (err, data) => {
            //如果成功了
            if (!err && data.status === '1') {
                const { weather } = data.lives[0]
                resolve({weather})
            } else {
                message.error('获取天气信息失败')
            }
        })
    })
}


