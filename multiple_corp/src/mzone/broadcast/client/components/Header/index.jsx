import React, {Component, PropTypes} from 'react'

import { Link } from 'react-router'
import { Button, Select } from 'antd'

const Option = Select.Option;

class Header extends React.Component {
    render() {
        const { handleChange, filter } = this.props;
        return (
            <div className="top-actions">
                    <Link to="/mzone/broadcast/editor.html" className="new-item-btn">发布新的广播</Link>
                    <Select
                        defaultValue={ filter ? filter + '' : '1' }
                        style={{
                        width: 150,
                        height: 30
                    }}
                        onChange={ handleChange }>
                        <Option value="1">查看全部</Option>
                        <Option value="2">只看我发布的</Option>
                    </Select>
                </div>
        )
    }
}

Header.propTypes = {
    handleChange: PropTypes.func.isRequired,
}

export default Header