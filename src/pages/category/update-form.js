import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

const { Item } = Form;

// 更新分类form组件
class UpdateForm extends Component {

    formRef = React.createRef();

    static propTypes = {
        categoryName: PropTypes.string,
        setForm: PropTypes.func,
    }

    componentDidMount(){
        this.props.setForm(this.formRef.current);
    }

    render() {

        const { categoryName } = this.props;
        return (
            <Form ref={this.formRef}>
                <Item
                    name="categoryName"
                    initialValue={categoryName}
                    rules={[
                        { required: true, message: '分类名称必须输入' },
                    ]}
                >
                    <Input placeholder="请输入分类名称"/>
                </Item>
            </Form>
        );
    }
}

export default UpdateForm;
