import React from 'react';
import { Link } from 'mods/react-router';

// import restHub from 'services/restHub';

class MainLayout extends React.Component {
    componentDidMount() {
        // restHub.post('cs/general/index', {
        //     data: {
        //         date: 0,
        //     },
        // }).then(({ errorMsg, errorCode, jsonResult }) => {
        //     console.warn(errorCode, errorMsg, jsonResult);
        // });
        // axiosIns({
        //     url: 'cs/index/in',
        //     method: 'get',
        //     withCredentials: true,
        // }).then((resp) => {
        //     console.log(resp);
        // });
    }
    render() {
        return (
            <div className="main-layout">
                {this.props.children}
                 <Link to="/www/account/login">login</Link> 
            </div>
        );
    }
}

module.exports = MainLayout;
