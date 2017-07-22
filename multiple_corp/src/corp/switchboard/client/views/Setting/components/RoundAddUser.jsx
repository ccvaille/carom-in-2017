import React, { PropTypes } from 'react';

import classNames from 'classnames';

class RoundAddUser extends React.Component {
    renderSelected = (selected) => {
        return (
            <div id="formperson" name="formperson">
                <div className="csbg2">设置<span id="username">{selected.name}</span>坐席</div>
                <div className="mobile">
                    <span>接听电话</span>:
                    <input type="text" 
                        id="mobile" 
                        placeholder="电话号码"
                        value={selected.phone}  
                        onChange={e => this.props.mode2SelectedInput(e)}/>
                </div>
                <div style={{
                    "marginLeft":"90px", 
                    "marginTop":"20px"
                }} className="btn-box">
                    <button
                        className="submit"
                        name="btn_saveperson"
                        id="select-employee"
                        onClick={this.props.saveSelectEmployee} >
                            保存
                    </button>
                </div>
                                    
            </div>
        )
    }
    renderNoSelected = () => {
        return (
            <div id="formperson" name="formperson">
                <div className="csbg2">设置<span id="username"></span>坐席</div>
                <div style={{
                    "marginTop": "80px",
                    "textAlign": "center"
                }}>
                    <span>提示：点击左方的员工进行添加</span>
                </div>
            </div>
        )
    }
    render() {
        const mode2Selected = this.props.mode2Selected;
        console.log(mode2Selected);
        return (
            <div>
                <div className="menubg" style={{"marginTop": "10px"}}>
                    <ul>
                        <li 
                            className="menubgok" 
                            id="sltuser" 
                            style={{"cursor":"pointer"}}>现有员工</li>
                        <li 
                            style={{"cursor":"pointer", "display": "none"}} 
                            id="adduser">新增员工</li>
                    </ul>
                </div>
                <div id="sltuserbody">
                    <div className="outerBox">
                        <div>
                            <div className="addcs_left" >
                                <div className="csbg1">请选择要添加的员工</div>
                                <div className="addcs_leftin ztree" id="tree2" style={{
                                    "background":"#f2f6f7", 
                                    "padding":"15px 0px 5px 15px",
                                    "width":"277px", 
                                    "height":"430px "
                                }}></div>
                            </div>
                            <div className="addcs_left" style={{
                                    "border": "1px solid #CAD6DC"
                                }} id="userset">
                                {
                                    mode2Selected.id ?
                                        this.renderSelected(mode2Selected):
                                            this.renderNoSelected()
                                }
                               
                            </div>
                        </div>
                          
                    </div>
                    
                </div>
            </div>
        )
    }
}
export default RoundAddUser;