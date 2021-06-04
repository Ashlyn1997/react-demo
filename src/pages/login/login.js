import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import {connect} from "react-redux";
import {login} from "../../redux/actions";
import logo from '../../assets/images/logo.png'
import './login.less'


const Item = Form.Item // 不能写在import之前

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

/*登陆的路由组件*/
class Login extends Component {
    onFinish = async (values) => {
        const {username, password} = values
        //调用分发异步action的函数 => 发登陆的异步请求，有了结果后更新状态
        this.props.login(username, password)
    };

    // onFinishFailed = (errorInfo) => {
    //     console.log('Failed:', errorInfo);
    // };
    render() {
        //如果用户已经登陆，自动跳转到admin界面
        const user = this.props.user
        if (user && user._id) {
            return <Redirect to='/home' />
        }
        const errorMsg = this.props.user.errorMsg
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React项目：后台管理项目</h1>
                </header>
                <section className="login-content">
                    <div>{errorMsg}</div>
                    <h2>用户登陆</h2>
                    <div>
                        <Form
                            {...layout}
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.onFinish}
                        >
                            <Item
                                label="Username"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Item>

                            <Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Item>
                            <Item {...tailLayout}>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Submit
                                </Button>
                            </Item>
                        </Form>
                    </div>
                </section>
            </div>
        )
    }
}

export default connect(
    state => ({user: state.user}),
    {login}
)(Login)

/*
* async 和 await
* 1、作用？
*   简化promise对象的使用：不用再使用then()来指定成功/失败的回调函数
*   以同步编码方式实现异步流程
* 2、哪里写await ？
*   在返回promise的表达式左侧写await：不想要promise，想要promise异步执行的成功的value数据
* 3、哪里写async？
*   await所在函数（最近的）定义的左侧
* */