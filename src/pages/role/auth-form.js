import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree,
} from 'antd'
import menuList from "../../config/menuConfig";
const {Item} = Form

//添加分类的form组件
class AuthForm extends PureComponent {

    static propTypes = {
        role: PropTypes.object
    }

    constructor(props) {
        super(props)
        //根据传入角色的menus生成初始状态
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    //为父组件提供提供最新的menus数据的方法
    getMenus = () => this.state.checkedKeys

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push({
                title: item.title,
                key: item.key,
                children: item.children ? this.getTreeNodes(item.children) : null
            })
            return pre
        }, [])
    }


    //选中某个node时的回调
    onCheck = (checkedKeys) => {
        this.setState({checkedKeys})
    };

    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }

    //根据新传入的role来更新checkedKeys状态
    //当组件接收到新的属性时自动调用
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }


    render() {
        const {role} = this.props
        const {checkedKeys} = this.state
        return (
            <div>
                <Item label='角色名称'>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    onCheck={this.onCheck}
                    treeData={this.treeNodes}
                    checkedKeys={checkedKeys}
                />
            </div>
        );
    }
}

export default AuthForm