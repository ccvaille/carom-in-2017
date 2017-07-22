import React, { PropTypes } from 'react';
import Form from '../../../components/Form';
import FormItem from '../../../components/FormItem';

const formItemLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

class WechatVisitorInfo extends React.Component {
    render() {
        const { info, guid } = this.props;
        let statusNode = null;

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
                    <span className="info-content">{info.nickname}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="性别"
                >
                    <span className="info-content">{info.sex}</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="地区"
                >
                    {info.province}{info.city}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="来源"
                >
                    <span className="info-content">微信访客</span>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="上次来访"
                >
                    <span className="info-content">{info.visitTime}</span>
                </FormItem>
            </Form>
        );
    }
}

export default WechatVisitorInfo;
