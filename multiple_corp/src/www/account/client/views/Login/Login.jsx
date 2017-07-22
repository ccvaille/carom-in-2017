import React, { PropTypes } from 'react';
import Footer from 'components/Footer';
import Header from '../Header';
import Input from 'components/Input';
import Button from 'components/Button';
import './Login.less';
import register from '../../images/register.png';

class Login extends React.Component {
    componentDidMount() {
        const nc = new noCaptcha();
        console.log(nc);
        const ncAppkey = 'FFFF0000000001769D0C';  // 应用标识,不可更改
        const ncScene = 'login';  //场景,不可更改
        const ncToken = [ncAppkey, (new Date()).getTime(), Math.random()].join(':');
        const ncOption = {
            renderTo: '#capcha-test', //渲染到该DOM ID指定的Div位置
            appkey: ncAppkey,
            scene: ncScene,
            token: ncToken,
            trans: '{"name1":"code100"}', //测试用，特殊nc_appkey时才生效，正式上线时请务必要删除；code0:通过;code100:点击验证码;code200:图形验证码;code300:恶意请求拦截处理
            callback(data) { // 校验成功回调
                console.log(data.csessionid);
                console.log(data.sig);
                console.log(ncToken);
                nc.reset();
                // nc.reload();

                // document.getElementById('csessionid').value = data.csessionid;
                // document.getElementById('sig').value = data.sig;
                // document.getElementById('token').value = ncToken;
                // document.getElementById('scene').value = ncScene;
            },
            error() {

            },
        };
        nc.init(ncOption);
    }

    render() {
        return (
            <div className="login">
                <Header />     
                <div className="login-box">
                    <h2><img src={register} alt="" />欢迎注册EC帐号</h2>
                    <Input label="手机号码" placeholder="" />
                    <div id="capcha-test" />
                    <Input label="验证码" type="number" placeholder="短信验证码" />
                    <Input label="公司全称" placeholder="如：深圳市六度人和科技有限公司" />
                    <Input label="姓名" placeholder="请填写真实姓名" />
                    <Input label="密码" type="password" placeholder="密码至少6~16位，含数字、英文、符号两种" />
                    <Input label="重复密码" type="password" placeholder="密码至少6~16位，含数字、英文、符号两种" /> 
                    <Input label="验证码" type="number" placeholder="短信验证码" isrequired={false} />
                    <p>选填信息</p>   
                    <Button>完成注册111</Button>              
                </div>
                <Footer />
            </div>

        );
    }
}

module.exports = Login;
