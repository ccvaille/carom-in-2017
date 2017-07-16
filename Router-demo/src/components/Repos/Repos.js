import React from 'react';

const Repos = (props) => (
    <div>
        <h3>This is a title.</h3>
        <p>{props.params.name}</p>
    </div>
);

Repos.propTypes = {
    parame: React.propTypes.object,
}

export default Repos;