import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import './index.less'

import SaleCheckbox from '../SaleCheckbox'
import SaleCurrency from '../SaleCurrency'
import SaleGroup from '../SaleGroup'
import SaleRadio from '../SaleRadio'
import SaleSelect from '../SaleSelect'
import SaleText from '../SaleText'
import SaleTime from '../SaleTime'


import {
  selectType
} from '../../actions'



class TabsControl  extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0
    }
  }

  static propTypes = {
    type: PropTypes.any.isRequired,
    changeType: PropTypes.func.isRequired
  }


  componentDidMount() {
    const { changeType } = this.props
    changeType({type: 1})
  }

  getTitleItemCssClass = (index) => {
    return (index === this.state.currentIndex ?
        'tab-title-item active' :
        'tab-title-item')
  }

  getContentItemCssClass = (index) => {
    return (index === this.state.currentIndex ?
        'tab-content-item active' :
        'tab-content-item')
  }

  handleType = (index, type) => {
    const { changeType } = this.props
    changeType({type: type})
    this.setState({currentIndex: index})
  }

  render () {
    let self = this;
    return (
      <div>
        <nav className="tab-title-items">
          <h3>字段类型</h3>
          <div className="tab-title-content">
          {React.Children.map(this.props.children, (ele, index) => {
              return (<div
                onClick={ (e) => {this.handleType(index, ele.props.type) }}
                className={self.getTitleItemCssClass(index)}
              >
              {ele.props.name}
              </div>)
          })
          }
          </div>
        </nav>
        <div className="tab-content-items">
          {React.Children.map(this.props.children, (ele, index) => {

            if (index === this.state.currentIndex) {
              return (<div className={self.getContentItemCssClass(index)}>{ele}</div>)
            }
            else {
              return null;
            }

          })}
        </div>
      </div>
    )
  }
}




class TabItem extends Component {
  render () {
    return (<div>{this.props.children}</div>)
  }
}


const mapStateToProps = (state) => {
  return {
    type: state.fieldType,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeType: (data) => {
      dispatch(selectType(data))
    }
  }
}


class Tab extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    type: PropTypes.any.isRequired,
    changeType: PropTypes.func.isRequired
  }

  render () {
    const { type, changeType } = this.props
    return (<div className="container">
        <TabsControl type={type} changeType={changeType}>
          <TabItem name="文本" type="1">
            <SaleText />
          </TabItem>
          <TabItem name="时间" type="6">
            <SaleTime />
           </TabItem>
           <TabItem name="货币" type="7">
            <SaleCurrency />
           </TabItem>
          <TabItem name="下拉" type="8">
            <SaleSelect />
          </TabItem>
          <TabItem name="单选" type="9">
            <SaleRadio />
          </TabItem>
          <TabItem name="复选" type="10">
            <SaleCheckbox />
          </TabItem>
          <TabItem name="分组" type="group">
            <SaleGroup />
          </TabItem>
        </TabsControl>
      </div>)
  }
}

 export default connect(mapStateToProps, mapDispatchToProps)(Tab);
