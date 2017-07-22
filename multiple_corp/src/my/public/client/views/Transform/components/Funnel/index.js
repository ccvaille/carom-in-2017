import React from 'react'
import './index.less'


const Funnel = ({
    keyData
}) => {
    const summary = keyData.summary;
    return (
        <div>
            <div className="funnel-box">
                {
                    summary ?
                    <ul className="funnel-data">
                        <li>送达用户数<span className="num">{ summary.send }</span></li>
                        <li>阅读用户数<span className="num">{ summary.view }</span></li>
                        <li>登记用户数<span className="num">{ summary.commit }</span></li>
                        <li>入库用户数<span className="num">{ summary.crm }</span></li>
                    </ul>
                    :
                    <ul className="funnel-data">
                        <li>送达用户数<span className="num">0</span></li>
                        <li>阅读用户数<span className="num">0</span></li>
                        <li>登记用户数<span className="num">0</span></li>
                        <li>入库用户数<span className="num">0</span></li>
                    </ul>
                }
                {
                    summary ?
                    <ul>
                        <li className="read-tran">阅读转化率<span className="percent">{ summary.view_rate }%</span></li>
                        <li className="register-tran">登记转化率<span className="percent">{ summary.commit_rate }%</span></li>
                        <li className="inbound-tran">入库转化率<span className="percent">{ summary.crm_rate }%</span></li>
                        <li className="customer-tran">客户转化率<span className="percent">{ summary.total_rate }%</span></li>
                    </ul>
                    :
                    <ul>
                        <li className="read-tran">阅读转化率<span className="percent">0%</span></li>
                        <li className="register-tran">登记转化率<span className="percent">0%</span></li>
                        <li className="inbound-tran">入库转化率<span className="percent">0%</span></li>
                        <li className="customer-tran">客户转化率<span className="percent">0%</span></li>
                    </ul>
                }
            </div>
        </div>
    )
}

export default Funnel