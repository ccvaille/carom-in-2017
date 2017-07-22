import React from 'react';

import './index.less';

function Form (props){
    return (<form className="kf_form">
        {props.children}
    </form>)
};

export default Form;