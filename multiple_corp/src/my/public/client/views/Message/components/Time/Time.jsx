import React, { PropTypes } from 'react';
import './index.less';

import { withRouter, Link } from 'react-router';
import { Icon, Modal, TimePicker, Button } from 'antd';
import moment from 'moment';
import {hasClass, addClass, removeClass} from '~comm/utils/index.js';

const format = 'HH:mm';
class Time extends React.Component {
    componentDidMount = () => {
        document.body.addEventListener('click', (e) => {
            var target = e.target;
            while (target) 
            {
                if (
                    hasClass(target, 'ant-time-picker-panel-clear-btn') ||
                    hasClass(target, 'sure-time')
                ){
                    this.closeCb();
                    this.hasClickTimePicker = false; 
                    return;  
                } else if (
                    hasClass(target, 'ant-time-picker-panel') ||
                    hasClass(target, 'ant-time-picker ')    
                ) {
                    this.hasClickTimePicker = true;
                    return;
                }
                target = target.parentElement;
            }
            if (this.hasClickTimePicker) {
                this.closeCb();
                this.hasClickTimePicker = false;
            }
        })
    }
    changeTime = (time, timeString) => {
        this.timer = (timeString && timeString.indexOf('date') <= -1) ? timeString : '12:30';
    }
    closeCb = () => {
        const {
            messageActions, 
            activeLi, 
            formInfo,
            timeReducers,
        } = this.props;
        this.timer = this.timer ? this.timer : timeReducers.time[activeLi - 2];
        if (activeLi === 2) {
            messageActions.setFormInfoTime([
                this.timer,
                timeReducers.time[1]
            ]); 
            messageActions.changeTime([
                this.timer,
                timeReducers.time[1]
            ]);
        } else if (activeLi === 3) {
            messageActions.setFormInfoTime([
                timeReducers.time[0],
                this.timer,
            ]); 
            messageActions.changeTime([
                timeReducers.time[0],
                this.timer,
            ]);
        }
        
        messageActions.switchEditFormInfoSave(false);    
    }
    render = () => {
        const { 
            activeLi, 
            formInfo,
            timeReducers,

        } = this.props;
        return (
            activeLi === 1 ?
                <span className="first-label-span">关注公众号立即推送</span> :
                    <div className="time-picker" ref='my-time-picker'>
                        <span className="first-label-span">每天</span>
                        <TimePicker 
                            defaultValue={moment(timeReducers.time[activeLi-2], format)}
                            value={moment(timeReducers.time[activeLi-2], format)}
                            format={format} 
                            key={timeReducers.time[activeLi-2]}
                            hideDisabledOptions={true}
                            addon={
                                panel => (
                                    <Button size="small" type="primary" className="sure-time" onClick={() => {panel.close()}}>
                                        确定
                                    </Button>
                                )
                            }
                            disabledHours={() => { return [0, 1, 2, 3, 4, 5] } }
                            onChange={(time, timeString) => { this.changeTime(time, timeString) }} />
                        <span className="first-label-span">自动推送</span>
                    </div>      
        )
    }
}

export default withRouter(Time);