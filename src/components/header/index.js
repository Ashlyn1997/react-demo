import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import {connect} from "react-redux";

import {reqWeather} from '../../api';
import menuList from "../../config/menuConfig";
import {formateDate} from "../../utils/dateUtils";
import LinkButton from "../link-button";
import './index.less'
import {logout} from '../../redux/actions'

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串格式
        weather: '' // 天气文本
    }
    getTime = () => {
        //每隔1s获取当前时间，并更新状态数据currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        }, 1000)
    }
    getWeather = async () => {
        //调用接口请求异步获取数据
        const { weather } = await reqWeather(110101)
        //更新状态
        this.setState({weather})
    }
    getTitle = () => {
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) { //如果当前item对象的key与path一样，item的title就是要显示的title
                title = item.title
            } else if (item.children) {
                //在所有的子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                //如果有值才说明有匹配的
                if (cItem) {
                    //取出它的title
                    title = cItem.title
                }
            }
        })
        return title
    }
    /*退出登陆*/
    logout = () => {
        //显示确认框
        Modal.confirm({
            content: '确认退出吗',
            onOk: () => {
                this.props.logout()
            }
        })
    }
    //在第一次render()之后执行一次
    //一般在此执行异步操作：发ajax请求/启动定时器
    componentDidMount() {
        //获取当前的时间
        this.getTime()
        //获取当前天气
        this.getWeather()
    }
    // 当前组件卸载之前调用
    componentWillUnmount() {
        //清楚定时器
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime, weather} = this.state
        const username = this.props.user.username
        // const title = this.getTitle()
        const title = this.props.headTitle
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({headTitle: state.headTitle, user: state.user}),
    {logout}
)(withRouter(Header))
