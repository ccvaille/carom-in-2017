import React from 'react'
import FilterPanel from '../../components/FilterPanel';
import FormList from '../../components/FormList';

import './index.less';

class RightSide extends React.Component {
	componentWillMount() {

	}

	render() {
		return (
			<div className="right-side">
                <FilterPanel/>
                <FormList />
			</div>
		)
	}
}
export default RightSide;
