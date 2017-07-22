import React from 'react';
import VisitorInfo from '../VisitorInfo';



class App extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount(){
        let data={"guid": 1000762,
    "gutype": 1,
    "guidName": "局域网#1000762",
    "face": "",
    "csname": "李博韬【内网】",
    "status": 1,
    "talkid": 5595,
    "os": 1,
    "browser": 6,
    "search": 0,
    "keyword": "",
    "ip": "10.0.108.154",
    "ip2long": "167799962",
    "province": "局域网",
    "city": "局域网",
    "terminal": 1,
    "visitUrl": "http://static.workec.com:8080/?corpid=21299",
    "referUrl": "",
    "referUrlHash": "",
    "visitUrlHash": "oFGdmM08uX1h",
    "referDomain": "",
    "landingPage": "http://static.workec.com:8080/?corpid=21299",
    "visitTime": "2017-04-26 14:38:29",
    "count": 2,
    "title": "EC",
    "ginfo": {
        "f_corp_id": 21299,
        "f_scheme": 0,
        "f_last_time": 1493188709,
        "f_first_time": 1493113466,
        "f_count": 2,
        "f_crm_id": 0,
        "f_distinct_id": "30a1ea0d73c24ed0121ee0c2921caabe",
        "f_id": 1000762
    },
    "crmid": 0,
    "browserName": "Chrome",
    "terminalName": "电脑",
    "osName": "WIN7"};
        this.props.visitorAction.getVisitorInfo(data);
    }
    render(){
        return <div>
            <VisitorInfo info={this.props.info} guid={1} csName="123" />
        </div>
    }
}

export default App;