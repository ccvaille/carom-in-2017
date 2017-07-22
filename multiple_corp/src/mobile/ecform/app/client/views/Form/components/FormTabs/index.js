import React, { PropTypes } from 'react';
import { Tabs, Button } from 'antd-mobile';
import './index.less';

const TabPane = Tabs.TabPane;
function renderTab1(index, data, activeTab) {
    return (
        <span>
            {data[index - 1]}
            {
                activeTab == '1' ?
                    <i className="iconfont icon-zhankaixuanzhong" /> :
                    <i className="iconfont icon-zhankai" />
            }

        </span>
    );
}

function renderTab2() {
    return (
        <span>筛选<i className="iconfont icon-shaixuanxuanzhong" /></span>
    );
}
function renderTab3(index, timeIndex) {
    // return (
    //     <span>推送时间<i className="iconfont icon-paixuxuanzhong"></i></span>
    // )
    return (
        index === 4 ?
            <span>收到时间<i className="iconfont icon-paixuxuanzhong" /></span> : (
            timeIndex === 1 ?
                <span>最近修改
                    <i className="iconfont icon-paixuxuanzhong" />
                </span> : (
                    timeIndex === 2 ?
                        <span>创建时间
                            <i className="iconfont icon-paixuxuanzhong" />
                        </span> : (
                            timeIndex === 3 ?
                                <span>填写量
                                    <i className="iconfont icon-paixuxuanzhong" />
                                </span> :
                                <span>阅读量
                                    <i className="iconfont icon-paixuxuanzhong" />
                                </span>
                        )
                )
        )
    );
}
const FormTabs = ({
    menuRender,
    switchTab,
    activeTab,
    cancelActiveTab,
    groupMenuData,
    timeGroupData,
    activeTabGroupMenu,
    activeTabTimeMenu,
    cancelActiveTagIds,
    searchForms,
}) => (
    <div className="tab-container">
        <Tabs
            activeKey={activeTab}
            onTabClick={switchTab}
            swipeable={false}
        >
            <TabPane
                tab={renderTab1(activeTabGroupMenu, groupMenuData, activeTab)}
                key="1"
            >
                {menuRender.call(this, 1)}
            </TabPane>
            <TabPane tab={renderTab2()} key="2">
                {menuRender.call(this, 2)}
                <div className="footer">
                    <Button
                        className="btn rest"
                        onClick={cancelActiveTagIds}
                    >重置</Button>
                    <Button
                        className="btn ok"
                        onClick={searchForms.bind(true)}
                    >确定</Button>
                </div>
            </TabPane>
            <TabPane
                tab={renderTab3(activeTabGroupMenu, activeTabTimeMenu)}
                key="3"
            >
                {menuRender.call(this, 3)}
            </TabPane>
        </Tabs>
        {
                activeTab !== '4' ?
                    <div
                        className="mask"
                        onClick={cancelActiveTab}
                    /> : null
            }
    </div>
    );

export default FormTabs;
