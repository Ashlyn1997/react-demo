import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

const {Item} = Form
const {Option} = Select
// 添加/修改 用户的form组件
class UserForm extends PureComponent {
    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }

    componentDidMount() {
        // console.log(this.formRef);
        this.props.setForm(this.formRef.current);
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 4}, //左侧label的宽度
            wrapperCol: {span: 15} //右侧包裹的宽度
        }
        const {roles} = this.props
        const user = this.props.user || {}
        return (
            <Form
                ref={this.formRef}
                initialValues={{username: user.username, password: user.password, phone: user.phone, email: user.email, role_id: user.role_id}}
                {...formItemLayout}
            >
                <Item
                    label='用户名'
                    name="username"
                >
                    <Input placeholder="请输入用户名" />
                </Item>
                {
                    user._id ? null : (
                        <Item
                            label='密码'
                            name="password"
                        >
                            <Input.Password placeholder="请输入密码" />
                        </Item>
                    )
                }
                <Item
                    label='手机号'
                    name="phone"
                >
                    <Input placeholder="请输入手机号" />
                </Item>
                <Item
                    label='邮箱'
                    name="email"
                >
                    <Input placeholder="请输入邮箱" />
                </Item>
                <Item
                    label='角色'
                    name="role_id"
                >
                    <Select placeholder='请选择角色'>
                        {
                            roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                        }
                    </Select>
                </Item>
            </Form>
        );
    }
}

export default UserForm