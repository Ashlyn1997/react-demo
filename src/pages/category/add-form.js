import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Form, Input, Select } from 'antd'

const { Option } = Select


//添加分类的form组件
class AddForm extends Component {
    formRef = React.createRef();

    static propTypes = {
        setForm: PropTypes.func.isRequired,
        categorys: PropTypes.array.isRequired, //接收以及分类的数组
        parentId: PropTypes.string.isRequired, //
    }

    componentDidMount() {
        // console.log(this.formRef);
        this.props.setForm(this.formRef.current);
    }


    render() {
        return (
            <Form ref={this.formRef}>
                <Form.Item>
                    {/* ---请注意在此处，如果表单里包括了Input/Select(即一个表单里有多个控件),可以使用内嵌的Form.Item完成,
          你可以给 Form.Item 自定义 style 进行内联布局，或者添加 noStyle 作为纯粹的无样式绑定组件
          具体情况可以参考官方文档，见下方链接
          https://ant.design/components/form-cn/#components-form-demo-complex-form-control
          */}
                    <p>所属分类:</p>
                    <Form.Item
                        noStyle
                        name="parentId"
                        initialValue={this.props.parentId}>
                        <Select value={this.props.parentId} style={{ width: "100%" }}>
                            <Option value='0'>一级分类</Option>
                            {
                                this.props.categorys.map((item) => {
                                    return <Option key={item._id} value={item._id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <p>分类名称:</p>
                    {/* 此处有坑 */}
                    {/* ----注意 <Form.Item /> 只会对它的直接子元素绑定表单功能 */}
                    <Form.Item
                        noStyle
                        name="categoryName"
                        rules={[
                            { required: true, message: '分类名称必须输入' },
                        ]}
                    >
                        <Input placeholder="请输入分类名称" />
                    </Form.Item>
                </Form.Item>
            </Form>
        );
    }
}

export default AddForm