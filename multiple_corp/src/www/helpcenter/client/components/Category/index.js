import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import './index.less';
import className from 'classnames';

class Category extends Component {


    onClickSub = (e) => {
        e.stopPropagation();
    }

    render() {
        let childList = '';
        let activeClass = '';
        const { category, openid, onClickMenu, cat } = this.props;
        const children = category.child;
        const path = '/tech/help';

        if(children.length > 0) {
            childList = (
                children.map((child, i) => {
                    if(child.f_id == cat) {
                        activeClass = 'active';
                    } else {
                        activeClass = '';
                    }
                    return (
                        <li key={i}>
                        <Link to={path + "?cat=" + child.f_id}
                            className={ activeClass }>{child.f_name}</Link>
                        </li>
                   );
                }
                      
                )
            )    
        }
        const liClasses = className({
            'list-item': true,
            open: openid === category.f_id
        })
        return (
            <li className={ liClasses } >
                <label>
                    <div className="cat-name" onClick={ onClickMenu }>{category.f_name}</div>
                    <ul className="sub-list" onClick={ this.onClickSub }>
                        { childList }
                    </ul>
                </label>
            </li>
        )
    }
}


export default withRouter(Category)