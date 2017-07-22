import React, { PropTypes } from 'react';
import './index.less';
import classNames from 'classnames';
import loadingGif from '../../images/loading.gif';


class LoadMore extends React.Component {
    render = () => {
        // let {ref} = this.props;
        return (
            <div className="load-more">
                <img src={loadingGif} /><span>正在加载更多的数据...</span>
            </div>
        )
    }
}

export default LoadMore;
