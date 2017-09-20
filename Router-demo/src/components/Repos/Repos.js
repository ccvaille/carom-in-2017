import React from 'react';

const Repos = (props) => (
    <div>
        <h3>Repos</h3>
        <h5>{props.name}</h5>
    </div>
);

Repos.propsTypes = {
    name: React.PropTypes.Object,
};

export default Repos;