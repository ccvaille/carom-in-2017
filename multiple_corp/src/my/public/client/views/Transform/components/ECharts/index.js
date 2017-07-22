import React from 'react'
import ReactEcharts from 'echarts-for-react'

const ECharts = ({
    option, style
}) => {
    return (
        <div className="ECharts-item">
            <ReactEcharts option={ option } style={style}/>
        </div>
    )
}
export default ECharts
