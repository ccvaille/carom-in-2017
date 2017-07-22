import React from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps,nextState){
        if(_.isEqual(nextProps.option.series[0].data[0],this.props.option.series[0].data[0])&&this.props.style.height!=='0px'){
            return false;
        }
        else{
            return true;
        }
    }

    componentWillReceiveProps(nextProps,nextState){

    }

    render() {
        let {option,onEvents,style,showLoading,chartRef} =this.props;

        return (
            <ReactEcharts
                ref={chartRef}
                option={option}
                notMerge={true}
                lazyUpdate={false}
                onEvents={onEvents}
                style={style} showLoading={showLoading}/>
        )

    }
}

export default Chart
