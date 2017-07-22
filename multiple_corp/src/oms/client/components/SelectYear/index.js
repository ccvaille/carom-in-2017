import React from 'react'
import {Select,Icon} from 'antd';
const Option = Select.Option;
import classNames from 'classnames';
import './index.less'


class SelectYear extends React.Component {
    static propTypes = {
        options: React.PropTypes.array,
        onChange: React.PropTypes.func,
        value:React.PropTypes.string,
    };

    static defaultProps = {
        options: [],
        onChange: undefined,
        value:'0'
    };


    state={
        index:0,
    };

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){
        let index=0;
        nextProps.options.forEach(function(item,i,array){
            if(item.value==nextProps.value){
                index=i;
            }
        });
        this.setState({
            index:index
        });
    }

    handleChange(value) {
        this.props.onChange(value);
    }

    handleLastClick(){
        let index=this.state.index;
        if(index==0){
            return;
        }
        else{
            index--;
            let value=this.props.options[index].value;
            this.props.onChange(value);

            this.setState({
                index:index
            });
        }
    }

    handleNextClick(){
        let index=this.state.index;
        if(index==this.props.options.length-1){
            return;
        }
        else{
            index++;
            let value=this.props.options[index].value;
            this.props.onChange(value);

            this.setState({
                index:index
            });
        }
    }

    render() {
        let {options,onChange,value,...others}=this.props;
        let selectChildren=[];
        options.forEach(function (item, index, array) {
            selectChildren.push(<Option key={item.value.toString()}>{item.label.toString()}</Option>);
        });

        const lCls=classNames({
            'year-btn':true,
            'btn-forb':this.state.index==options.length-1
        });

        const rCls=classNames({
            'year-btn':true,
            'btn-forb':this.state.index==0
        });

        return (
            <div className="ec-select-year">
                <Icon type="left-circle" className={lCls} onClick={this.handleNextClick.bind(this)}/>
                <Select value={value.toString()} style={{width: 120}}
                        onChange={this.handleChange.bind(this)}>
                    {selectChildren}
                </Select>
                <Icon type="right-circle" className={rCls} onClick={this.handleLastClick.bind(this)}/>
            </div>
        )
    }
}

export default SelectYear;