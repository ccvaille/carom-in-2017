import ReactDOM from 'react-dom';
import React from 'react';
import SelectUser from './SelectUser';

/*const defaultOption = {
  width: 500,
  height: 400,
  top: 0,
  left: 0
}

function caculatePosition(target) {
    let result=window.$(target).offset();
    result.left=result.left+Math.floor(target.offsetWidth/2)-20;
    result.top=result.top+target.offsetHeight+10;
    return result;
}

function showSelectUser(option, show, where) {
  let cssOp = {
    width: option.width,
    height: option.height,
    ...caculatePosition(option.target),
  }
  ReactDOM.render( <div><div className="masker"></div>
  < SelectUser option = {{ ...defaultOption,...cssOp}} visible = {show}/></div>,where);
  }*/

  export default SelectUser;
