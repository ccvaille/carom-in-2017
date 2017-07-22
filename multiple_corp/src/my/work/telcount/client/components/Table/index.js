import React, { Component, PropTypes } from "react";
import './index.less';

class Table extends Component {
    render() {
        const { title, data, isempty } = this.props;
        return (
               <div className="table-style">
                    <table>
                        <tr>
                            { title.map(function(title, index) {
                                return <th>{ title }</th>
                            }) }
                        </tr>
                        {
                            isempty != 1 ? data.map(function(data, index) {
                                return data ? <tr>{
                                    data.map(function(data, index) {
                                        return <td>{ data }</td>
                                    })
                                }</tr> : ''
                            }) : ''
                        }
                    </table>
                    {
                        isempty != 1 ? '' : <div className="no-data">暂无数据</div>
                    }
               </div>
        )
    }
}

export default Table;