import React, {Component} from 'react';
import {Card, Table, Button, message, Modal} from "antd";
import {ArrowRightOutlined, PlusOutlined} from '@ant-design/icons';
import LinkButton from "../../components/link-button";
import {reqCategorys, reqUpdateCategory, reqAddCategory} from "../../api";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

/*商品分类路由*/
class Category extends Component {

    state = {
        loading: false,
        categorys: [],//一级分类列表
        subCategorys: [],//二级分类列表
        parentId: '0', //当前需要显示的分类列表的父分类ID
        parentName: '', //当前需要显示的分类列表的父分类名称
        showStatus: 0, //标识添加/更新的确认框是否显示 --- 0:都不显示，1:显示添加，2:显示更新
    }

    //初始化Table所有列的数组
    initColumns = () => {
        return this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name', //显示数据对应的属性名
            },
            {
                title: '操作',
                width: 500, //此处可以不加px，如果加了px，需要写成‘800px’字符串的形式
                dataIndex: '',
                key: 'x',
                render: (category) => ( //返回需要显示的界面标签
                    <span>
            <LinkButton onClick={() => { this.showUpdate(category) }}>修改分类</LinkButton>
                        {/* 如何向事件回调函数传递参数:先定义一个匿名函数，在函数调用处理的函数并传入数据 */}
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(category) }}>查看子分类</LinkButton > : null
                        }

          </span>
                ),
            }

        ];
    }

    //异步获取一级/二级分类列表显示
    //parentId：如果没有指定，则根据状态中的parentId请求，如果指定了则根据指定的请求
    getCategorys = async (parentId) => {
        //此处注意一定要注意编写的顺序，如果getCategorys（）传了参数，首选参数，如果没传，才选择this.state.parentId；两者顺序不同，效果也不同
        parentId = parentId || this.state.parentId
        //再发请求之前，显示loading
        this.setState({ loading: true })
        const result = await reqCategorys(parentId)
        //在请求完成后，关闭loading
        this.setState({ loading: false })
        if (result.status === 0) {
            //更新分类数组(可能是一级的也可能是二级的)
            if (parentId === '0') {
                this.setState({ categorys: result.data })
            } else {
                this.setState({ subCategorys: result.data })
            }

        } else {
            message.error("获取分类列表失败")
        }
    }

    //显示指定一级分类对象的二级子列表
    showSubCategorys = (category) => {
        //setState()不能立即获取最新的状态，因为setState()是异步更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { //在状态更新且重新render()后执行
            //显示二级分类列表显示
            this.getCategorys()
        })
    }

    //显示指定一级分类列表
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: "",
            subCategorys: []
        })
    }

    //添加/更新对话框点击取消时----隐藏
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }

    //显示添加确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }
    //添加分类
    addCategory = async () => {
        this.form.validateFields().then(async (values) => {
            //隐藏确认框
            this.setState({
                showStatus: 0,
            })

            //准备数据
            const { parentId, categoryName } = values
            // console.log(parentId, categoryName);
            // debugger
            // const parentId = this.form.getFieldValue('parentId')
            // const categoryName = this.form.getFieldValue('categoryName')

            //清除输入数据
            this.form.resetFields()

            const result = await reqAddCategory(categoryName, parentId)

            if (result.status === 0) {
                //添加的分类就是当前分类列表下的分类
                if (parentId === this.state.parentId) {
                    this.getCategorys()
                } else if (parentId === '0') {
                    //在二级分类列表下添加一级分类，重新获取一级分类列表,但不需要显示以及列表
                    this.getCategorys('0')
                }

            }
        })
            .catch((err) => {
                message.info('请输入分类名称')
            })

    }

    //显示更新的确认框
    showUpdate = (category) => {
        //保存分类对象
        this.category = category
        this.setState({
            showStatus: 2,
        })
    }
    //更新分类
    updateCategory = () => {
        //进行表单验证，只有通过了才处理
        this.form.validateFields().then(async (values) => {
            //1.隐藏确认框
            this.setState({
                showStatus: 0,
            })

            //准备数据
            const categoryId = this.category._id
            // const categoryName = this.form.getFieldValue('categoryName')
            const { categoryName } = values
            //清除输入数据
            this.form.resetFields()

            //2.发送请求更新分类
            const result = await reqUpdateCategory(categoryId, categoryName)

            if (result.status === 0) {
                //3.重新显示列表
                this.getCategorys()
            }
        })
            .catch((err) => {
                message.info("请输入分类名称");
            })

    }

    //为第一次render()准备数据
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    //执行异步任务:发异步ajax请求
    componentDidMount() {
        this.getCategorys()
    }
    render() {

        const extra = (
            <Button type='primary' icon={<PlusOutlined />} onClick={this.showAdd}>
                添加
            </Button >
        )

        //读取状态数据
        const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state

        //读取指定的分类
        const category = this.category || { name: '' }//如果还没有数据，则指定一个空对象

        const title = parentId === '0' ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    loading={loading}
                />;
                {
                    showStatus === 1 ? <Modal
                        title="添加分类"
                        visible={showStatus === 1}
                        onOk={this.addCategory}
                        onCancel={this.handleCancel}>
                        <AddForm
                            categorys={categorys}
                            parentId={parentId}
                            setForm={form => this.form = form}
                        />
                    </Modal> : null
                }
                {showStatus === 2 ? <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={form => this.form = form}
                    />
                </Modal> : null}
            </Card>
        );
    }
}

export default Category;
