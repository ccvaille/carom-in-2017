import React, {Component, PropTypes} from 'react'

import {Table, Button, Select, Modal} from 'antd';

class TableList extends React.Component {
    render() {
        const {columns, dataSource, pagination, scrollY, loading } = this.props;
        return (
            <div>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination ? pagination : false}
                    scroll={{y: scrollY}}/>
            </div>
        )
    }
}

TableList.propTypes = {
    columns: PropTypes.array.isRequired,
    dataSource: PropTypes.array.isRequired,
    scrollY: PropTypes.number,
}

export default TableList