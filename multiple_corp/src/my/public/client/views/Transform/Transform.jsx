import React, { PropTypes } from 'react';
import './index.less';

import { Link } from 'react-router';
import { withRouter } from 'react-router';

import Sidebar from '../../components/Sidebar';
import TransformContent from './components/TransformContent';

class Transform extends React.Component {

    render = () => {
        return (
            <div className="transform">
                <Sidebar  activeName="transform"/>
                <TransformContent />
            </div>
        )
    }

}

export default withRouter(Transform);
