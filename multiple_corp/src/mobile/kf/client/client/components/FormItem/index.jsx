import React from 'react';
import './index.less';

function FormItem (props){
    return (<div className="kf_form_item">
        <div className="kf_form_label">{props.label}:</div>
        <div className="kf_form_content">{props.children}</div>
    </div>);
}

export default FormItem;