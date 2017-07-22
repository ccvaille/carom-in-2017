import React, { PropTypes } from 'react';
import { CheckBox } from 'antd';

class CorpStructure extends React.Component {
    componentDidMount() {
        this.props.corpActions.getCorpDepts();
    }

    render() {
        const { depts } = this.props.corpStructure;
        const deptNode = depts.map((dept, i) => (
            <li key={i}>
                {dept.name}
            </li>
        ));
        return (
            <div className="corporation-structure">
                <ul className="departments">
                    {deptNode}
                </ul>
            </div>
        );
    }
}

export default CorpStructure;
