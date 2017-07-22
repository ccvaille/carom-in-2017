import React from 'react';
import classNames from 'classnames';
import './index.less'
import guidePopPng from '../../images/guide-pop.png'

class SaleGuide extends React.Component {
    static propTypes = {
        
    };

    state = {

    };

    static defaultProps = {
        position:{
            top:'0px',
            left:'0px'
        }
    };

    handleSubmit=()=>{
        alert(1);
    }

    componentDidMount() {
        
    }

    render() {
        let {position,onOk} = this.props;
        return (
            <div className="sale-guide" style={{top: '3px',left: '9px'}}>
                <div className="mask"></div>
                <div className="ec-tooltip">
                    <div className="left">
                        <span><i className="tip-one"></i><i className="tip-two"></i></span>
                    </div>
                    <div className="pop-content">
                        <img src = {guidePopPng}/>
                    </div>
                    <div className="pop-footer">
                        <span className="btn-go" onClick={onOk}>我知道了</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default SaleGuide;