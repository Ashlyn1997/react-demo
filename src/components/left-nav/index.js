import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import { Menu } from 'antd';
import {connect} from "react-redux";
import logo from '../../assets/images/logo.png'
import menuList from "../../config/menuConfig";
import './index.less'
import {setHeadTitle} from "../../redux/actions";

const { SubMenu } = Menu;

/*左侧导航的组件*/
class LeftNav extends Component {
    //判断当前登陆用户对item是否有权限
    hasAuth = (item) => {
        const {key, isPublic} = item
        const menus = this.props.user.role.menus
        const username = this.props.user.username
        //1、如果当前用户是admin
        //2、如果当前item是公开的
        //3、当前用户有此item的权限：key有没有在menus中
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children){ //4、如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }
    /*根据menu的数据数组生成对应的标签数组*/
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(item => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    if (item.key === path || path.indexOf(item.key) === 0) {
                        this.props.setHeadTitle(item.title)
                    }
                    return (
                        // 请注意此处动态渲染icon的方法，在antdV4中有新的动态引入路由的方法，
                        // 可参考https://blog.csdn.net/sunnyboysix/article/details/107239490
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    //查找一个与当前请求路径匹配的子item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    if (cItem) {
                        //如果存在，说明当前item的子列表需要打开
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu key={item.key} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
        })
    }
    /*
    * 在第一次render()之前执行一次
    * 为第一个render()准备数据（必须同步的）
    * */
    UNSAFE_componentWillMount() {
        //对象的属性其实也是状态的一种，如果这个状态变化的时候不需要引起 UI 变化的，
        // 就可以写成这种形式，可以减少 render。
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product')===0) { //当前请求的是商品或其子路由界面
            path = '/product'
        }
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.menuNodes}
                </Menu>
            </div>
        );
    }
}

/*withRouter高阶组件：
* 包装非路由组件，返回一个新的组件
* 新的组件向非路由组件传递3个属性：history/location/match*/
export default connect(
    state => ({user: state.user}),
    {setHeadTitle}
)(withRouter(LeftNav))