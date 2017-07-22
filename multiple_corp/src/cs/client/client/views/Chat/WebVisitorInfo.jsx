import React, { PropTypes } from 'react';
import { Form } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

class WebVisitorInfo extends React.Component {
    static propTypes = {
        info: PropTypes.object.isRequired,
        guid: PropTypes.number.isRequired,
    }

    render() {
        const { info, guid, csName } = this.props;
        let statusNode = null;

        switch (info.status) {
            case 1: {
                if (csName === info.csname) {
                    statusNode = '与我对话中';
                } else {
                    statusNode = `与${info.csname}对话中`;
                }
                break;
            }
            case 2:
                statusNode = '会话已结束';
                break;
            default:
                break;
        }

        return (
            <Form className="visitor-info">
                <FormItem
                    {...formItemLayout}
                    label="访客ID"
                >
                    <span className="info-content">{guid}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="IP地址"
                >
                    <span className="info-content">{info.ip}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="地区"
                >
                    <span className="info-content">{info.province}{info.city}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="来源"
                >
                    {
                        info.referDomain
                        ?
                        <a title={info.referDomain} href={`http://${info.referDomain}`} target="_blank" className="info-content">{info.referDomain}</a>
                        : <span className="info-content">直接输入</span>
                    }
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="关键词"
                >
                    <span className="info-content">{info.keyword}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="着陆页"
                >
                    {
                        info.landingPage
                        ?
                        <a title={info.landingPage} href={info.visitUrl} target="_blank" className="info-content">{info.landingPage}</a>
                        : null
                    }
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="状态"
                >
                    <span className="info-content">{statusNode}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="浏览器"
                >
                    <span className="info-content">{info.browserName}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="操作系统"
                >
                    <span className="info-content">{info.osName}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="访问次数"
                >
                    <span className="info-content">{info.count}次</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="访问时间"
                >
                    <span className="info-content">{info.visitTime}</span>
                </FormItem>
            </Form>
        );
    }
}

export default WebVisitorInfo;
