import React, { PropTypes } from 'react';
import { Table } from 'antd';

class TrackWayTable extends React.Component {
    static propTypes = {
        dataSource: PropTypes.object.isRequired,
    }

    render() {
        // console.log(this.props, 'proasjhgfjhsgps');

        const columns = [{
            title: '访问时间',
            dataIndex: 'time',
            key: 'time',
            width: '26%',
        }, {
            title: '访问页面',
            dataIndex: 'url',
            key: 'url',
            width: '54%',
            render: (text, record) => (
                <div style={{ textAlign: 'left' }}>
                    {

                        record.type * 1 === 0 ? (
                            <div>
                                <a href={text} target="_blank">{record.title}</a>
                                <p>{text}</p>
                            </div>
                        ) : (<p>{text}</p>)
                    }

                </div>
            ),
        }, {
            title: '停留时长',
            dataIndex: 'stayTime',
            key: 'stayTime',
            width: '20%',
            render: (text) => {
                if (text === '0秒') {
                    return '';
                }
                return text;
            },
        }];

        return (
            <div>
                <Table
                    columns={columns}
                    dataSource={this.props.dataSource}
                    pagination={false}
                />
            </div>
        );
    }

}

export default TrackWayTable;
