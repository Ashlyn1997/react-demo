import React, {Component} from 'react';
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    message
} from "antd";
import LinkButton from "../../components/link-button";
import PicturesWall from './pictures-wall'
import RichTextEditor from "./rich-text-editor";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {reqAddOrUpdateProduct, reqCategorys} from "../../api";

const Item = Form.Item
const TextArea = Input.TextArea

//Product的添加和更新的子路由组件
class ProductAddUpdate extends Component {
    constructor(props) {
        super(props);
        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    state = {
        options: [],
    }

    initOptions = async (categorys) => {
        //根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false, //不是叶子
        }))
        //如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId, categoryId} = product
        if (isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true, //是叶子
            }))
            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value=== pCategoryId)
            //关联到对应的一级option上
            targetOption.children = childOptions
        }
        //更新options状态
        this.setState({options})
    }

    //获取一级/二级分类列表
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status===0) {
            const categorys = result.data
            //如果是一级分类列表
            if (parentId==='0') {
                this.initOptions(categorys)
            } else { //二级列表
                return categorys //返回二级列表==>当前async函数返回的promise状态变为成功，且值为categorys
            }
        }
    }

    //用来加载下一级列表的回调函数
    loadData = async (selectedOptions) => {
        //得到选择的option对象
        const targetOption = selectedOptions[0];
        //显示loading
        targetOption.loading = true;
        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        //隐藏loading
        targetOption.loading = false;

        if (subCategorys && subCategorys.length > 0) {
            //生成一个二级列表的options
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            //关联到当前option上
            targetOption.children = childOptions
        } else { //当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        //更新options状态
        this.setState({
            options: [...this.state.options]
        })
    };

    onFinish = async (values) => {
        //1、收集数据，并封装成promise对象
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
        //如果是更新，需要添加_id
        if (this.isUpdate) {
            product._id = this.product._id
        }
        //2、调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)
        //3、根据结果提示
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
            this.props.history.goBack()
        }else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
        }
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    componentDidMount() {
        this.getCategorys('0')
    }

    UNSAFE_componentWillMount() {
        //取出携带的state
        const product = this.props.location.state
        //保存是否是更新的标识
        this.isUpdate = !!product
        //保存商品（如果没有，）
        this.product = product || {}
    }

    render() {
        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs, detail} = product
        //用来接收级联分类ID的数组
        const categoryIds = []
        if (isUpdate) {
            //商品是一个一级分类的商品
            if (pCategoryId==='0') {
                categoryIds.push(pCategoryId)
            }else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 12 },
        }
        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined
                        style={{marginRight: 10, fontSize: 20}}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        return (
            <Card title={title}>
                <Form
                    {...formItemLayout}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    initialValues={{ name: product.name, desc: product.desc, price: product.price, categoryIds: categoryIds }}
                >
                    <Item
                        label='商品名称'
                        name='name'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品名称',
                            },
                        ]}
                    >
                        <Input placeholder='请输入商品名称'></Input>
                    </Item>
                    <Item
                        label='商品描述'
                        name='desc'
                        rules={[
                            {
                                required: true,
                                message: '必须输入商品描述',
                            },
                        ]}
                    >
                        <TextArea placeholder='请输入商品描述' autosize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item
                        label='商品价格'
                        name='price'
                        rules={[
                            { required: true, message: '必须输入商品价格' }
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>
                    </Item>
                    <Item
                        label='商品分类'
                        name='categoryIds'
                    >
                        <Cascader
                            options={this.state.options}
                            loadData={this.loadData}
                        />
                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label='商品详情' labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default ProductAddUpdate;
//1、子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
//2、父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法