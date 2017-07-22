import React, { PropTypes } from 'react';
import { Form } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const sex = {
    1: '男',
    2: '女',
};

class WechatVisitorInfo extends React.Component {
    render() {
        const { info, guid } = this.props;

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
                    label="昵称"
                >
                    <span className="info-content">{info.nickName}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="性别"
                >
                    <span className="info-content">{sex[info.sex]}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="地区"
                >
                    {info.province}{info.address}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="来源"
                >
                    <span className="info-content">微信访客</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="访问时间"
                >
                    <span className="info-content">{moment(info.lastmsgtime * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                </FormItem>
            </Form>
        );
    }
}

export default WechatVisitorInfo;
