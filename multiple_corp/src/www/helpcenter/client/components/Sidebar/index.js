import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Category from '../Category';
import classnames from 'classnames'
import './index.less'

class Sidebar extends Component {
    static propoTypes = {
        categorys: PropTypes.array.isRequired,
        params: PropTypes.object.isRequired
    }

    state = {
        openedId: -1,
    }


    onClickMenu = (id) => {
        id == undefined ? id = -1 : '';
        if(this.state.openedId == id) id = -1;
        this.setState({
            openedId: id
        })
    }

    render() {
        const { categorys, location } = this.props;
        // const secondCats = categorys.child;
        const cat = location.query.cat;
        let openid = this.state.openedId;
        if(cat && openid == -1) {
            for(let i = 0, j = categorys.length; i < j; i++) {
                for(let m = 0, n = categorys[i].child.length; m < n; m++) {
                    if(categorys[i].child[m].f_id == cat) {
                        openid = categorys[i].f_id;
                        break;
                    }
                }
            }
        }

        return ( 
            <div id="sidebar">
                <Link  to="/tech/help" className="title"><span className="icon-help"></span>帮助中心</Link>
                <ul>
                    {categorys.map((category, i) => 
                        <Category key={i} category={ category } cat={ cat } onClickMenu={() => this.onClickMenu(category.f_id) } openid={ openid }/>
                        )
                    }
                </ul>
                <div className="single-link"><a href="http://www.workec.com/feedback" target="_blank">意见反馈</a></div>
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
    categorys: state.sidebar.categorys
  }
}

export default connect(mapStateToProps)(Sidebar);