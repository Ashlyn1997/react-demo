import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'


//添加分类的form组件
class AddForm extends Component {
    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    componentDidMount() {
        // console.log(this.formRef);
        this.props.setForm(this.formRef.current);
    }

    render() {
        return (
            <Form ref={this.formRef}>
                {/* ----注意 <Form.Item /> 只会对它的直接子元素绑定表单功能 */}
                <Form.Item
                    label='角色名称'
                    name="roleName"
                    rules={[
                        { required: true, message: '角色名称必须输入' },
                    ]}
                >
                    <Input placeholder="请输入角色名称" />
                </Form.Item>
            </Form>
        );
    }
}

export default AddForm