import React, {Component} from 'react';
import {Card, Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

/*柱状图路由*/
class Bar extends Component {
    //返回柱状图的配置对象
    getOption = () => {

    }
    render() {
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.update}></Button>
                </Card>
                <Card title='柱状图一'>
                    <ReactEcharts option={this.getOption()}></ReactEcharts>
                </Card>
            </div>
        );
    }
}

export default Bar;