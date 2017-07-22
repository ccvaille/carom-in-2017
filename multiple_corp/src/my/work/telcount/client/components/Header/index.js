import React, {PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import './index.less'
const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.


class Header extends React.Component {
    componentWillMount() {

    }

    render() {
        const config = {
            title: {
                text: 'Monthly Average Temperature',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: WorldClimate.com',
                x: -20
            },
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                name: 'New York',
                data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                name: 'Berlin',
                data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        };
        return (
            <div>
                <div className="header">
                    <h2>今日统计<i className="iconfont">&#xe60c;</i></h2>
                    <span>最后更新时间：<i>2016-10-24</i><i>18:00:00</i></span>
                </div>
                <ul className="statistics-items">
                    <li>
                        <p>接通率</p>
                        <span>33.23%</span>
                    </li>
                    <li>
                        <p>通话时长</p>
                        <span>698</span>
                    </li>
                    <li>
                        <p>拨打次数</p>
                        <span>302</span>
                    </li>
                    <li>
                        <p>联系人数量</p>
                        <span>204</span>
                    </li>
                </ul>
                <div className="statistics-table">
                    <ul>
                        <li className={this.props.demo.tabIndex == 1 ? "active" : "x"} onClick={() => {
                            this.props.change(1);
                        }}>接通率</li>
                        <li className={this.props.demo.tabIndex == 2 ? "active" : "x"} onClick={() => {
                            this.props.change(2);
                        }}>通话时长
                        </li>
                        <li className={this.props.demo.tabIndex == 3 ? "active" : "x"} onClick={() => {
                            this.props.change(3);
                        }}>拨打次数</li>
                        <li className={this.props.demo.tabIndex == 4 ? "active" : "x"} onClick={() => {
                            this.props.change(4);
                        }}>联系人数量</li>
                        <li className={this.props.demo.tabIndex == 5 ? "active" : "x"} onClick={() => {
                            this.props.change(5);
                        }}>平均通话时长</li>
                    </ul>

                    <div className="statistics-highcharts">
                        <ReactHighcharts config={config}></ReactHighcharts>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {demo} = state;
    return {demo}
};

const change = (index) => {
    return {
        type: 'CHANGE_TAB_INDEX',
        index: index
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        change
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)



