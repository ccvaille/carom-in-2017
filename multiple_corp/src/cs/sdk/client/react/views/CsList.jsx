/* eslint-disable */
var React = require('react');
var connect = require('react-redux').connect;

var csActs = require('../actions/csList');
var postMsgTypes = require('../../modules/const').POST_MSG_TYPES;
var ButtonModeType = require('../../modules/ButtonModeType');
var addEvent = require('../../utils/dom').addEvent;

var getLanguagePackage = require('../../utils/locale');
var toString = Object.prototype.toString;

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);


function isEmptyObject(obj) {
    var name;

    for ( name in obj ) {
        return false;
    }
    return true;
}

function _isArray(obj) {
    if (Array.isArray) {
        return Array.isArray(obj);
    }

    return toString.call(obj) === '[object Array]'
}

var CsList = React.createClass({
    getInitialState: function () {
        return {
            currentGroup: [],
            isShowCurrentGroup: [],
            minisizeList: false,
            isShowCsList: false
        };
    },
    componentDidMount: function () {
        this.props.dispatch(csActs.init());
    },
    selectCs: function (csid, groupid, isQQFirst, csqq, showqq, isOnline) {
        // this.props.dispatch(csActs.selectCs(csid, groupid, isQQFirst, '2459870745'));
        // console.log(isQQFirst, 'aaahhhhh')
        this.props.dispatch(csActs.selectCs(csid, groupid, isQQFirst, csqq, showqq, isOnline));
    },
    selectGroup: function (groupid, currentState, index) {
        // console.log(currentState, 'state', groupid, index)
        var currentGroupNew = this.state.currentGroup || [];
        var isShowCurrentGroupNew = this.state.isShowCurrentGroup || [];

        // currentGroupNew[index] = this.state.currentGroup[index] === groupid ? '' : groupid;
        // console.log(currentGroupNew,'arr')
        currentGroupNew[index] = groupid;
        isShowCurrentGroupNew[index] = !currentState;

        this.setState({
            currentGroup: currentGroupNew,
            // currentGroup: groupid,
            isShowCurrentGroup: isShowCurrentGroupNew
        });
    },
    countAllUnreadNum: function () {
        var unreadNums = this.props.csList.unreadNums,
            allUnreadNum = 0;
        for (var i in unreadNums) {
            allUnreadNum += Number(unreadNums[i]);
        }
        if (allUnreadNum > 99) {
            allUnreadNum = 99 + '+';
        }
        return allUnreadNum;
    },
    minisizeListHandler: function () {
        this.setState({
            minisizeList: true,
            isShowCsList: false
        });
        this.props.dispatch(csActs.resizeCsList({
            width: 80,
            height: 190
        }));
    },
    maxsizeListHandler: function () {
        this.setState({
            minisizeList: false,
            isShowCsList: true
        });
        this.props.dispatch(csActs.resizeCsList({
            width: 168,
            height: 278
        }));
    },
    renderButton: function () {
        var config = this.props.csList.config;
        var shapeName = 'cs-shape ';
        var html = '';
        var bgColor = { backgroundColor: config.bcolor};
        var localeKey = getLanguagePackage(config.language);
        var circleBgStr = '';
        var isPcRootClass = isMobile ? 'cs-shape-wrapper' : 'cs-shape-wrapper pc-cs-shape-wrapper'

        switch (config.bmodestyle * 1) {
            case ButtonModeType.RECT_H:
                shapeName += ' shape-rect-h';
                if (config.language * 1 === 1) {  // 英文
                    html = (<span style={{ display: 'inline-block', marginLeft: 10 }}>{localeKey.listTitle}</span>);
                } else {
                    html = (<span className="zh" style={{ display: 'inline-block', marginLeft: 10 }}>{localeKey.listTitle}</span>);
                }
                break;
            case ButtonModeType.RECT_V:
                shapeName += ' shape-rect-v';

                if (config.language * 1 === 1) {  // 英文
                     html = (<div className="text en">
                         <p>{localeKey.listTitle}</p>
                     </div>)
                } else {
                    html = (<div className="text zh">
                        <p>{localeKey.listTitle}</p>
                    </div>)
                }

                break;
            case ButtonModeType.SQUARE:
                shapeName += ' shape-square';
                // html = (<p>{localeKey.listTitle}</p>);
                break;
            case ButtonModeType.CIRCLE:
                shapeName += ' shape-circle';
                circleBgStr = '?x-oss-process=image/circle,r_260/format,png';

                switch (config.bcolor) {
                    case ButtonModeType.CORNFLOWER_BLUE:
                        shapeName += ' cornflower-blue';
                        break;
                    case ButtonModeType.OCEAN_GREEN:
                        shapeName += ' ocean-green';
                        break;
                    case ButtonModeType.FIRE_BUSH:
                        shapeName += ' fire-bush';
                        break;
                    case ButtonModeType.OLIVE_DRAB:
                        shapeName += ' olive-drab';
                        break;
                    case ButtonModeType.AMETHYST:
                        shapeName += ' amethyst';
                        break;
                    case ButtonModeType.HAVELOCK_BLUE:
                        shapeName += ' havelock-blue';
                        break;
                    case ButtonModeType.CARNATION:
                        shapeName += ' carnation';
                        break;
                    case ButtonModeType.SHIP_COVE:
                        shapeName += ' ship-cove';
                        break;
                    default:
                        break;
                }

                bgColor = { backgroundColor: 'transparent' };
                break;
            default:
                break;
        }

        if (config.theme * 1 === 0 && config.bpic2 !== '') { // 自定义背景-按钮样式
            bgColor = {
                background: 'url(' + config.bpic2 + circleBgStr + ') center center no-repeat',
                backgroundSize: 'cover'
            };

        }

        var unreadNum = this.countAllUnreadNum();

        return (
            <div className="">
                <div className= {isPcRootClass} >
                    <a
                        className={shapeName}
                        href="javascript:;"
                        onClick={this.selectCs.bind(this, '', '', '', '', '', '')}
                        style={bgColor}
                    >
                        {
                            config.theme * 1 === 0 && config.bpic2 !== '' ? '' : (
                                <div>
                                    <span className="icon icon-customer-service" />
                                    {html}
                                </div>
                            )
                        }

                        {
                            unreadNum ?
                            <span className="unread-num">{ unreadNum }</span>
                            : null
                        }
                    </a>
                </div>
            </div>
        )
    },
    rednerList: function () {
        var listData = this.props.csList.listData;
        var config = this.props.csList.config;
        var selectedCs = this.props.csList.selectedCs;
        var themeStyleClassName = 'cs-list';
        var customMainbg = '';
        var customGroupNameColor = '';
        var bgStyle = {};
        var customTitleBg = {};
        var urlStyle = {};
        var csNameStyle = {};
        var localeKey = getLanguagePackage(config.language);
        var returnHtml, miniHtml, miniCustomBg;

        var isShowCsList = this.state.isShowCsList;

        // console.log(listData, 'listData');

        // config.theme ，-1：系统颜色，0: 自定义背景 1,2,3,4,5 系统模板
        switch (config.theme * 1) {
            case 0:

                // "showstyle": -1,                //类型：0 ,列表模式；1，按钮模式；
                // "language": 0,                    //语言：0,简体中文；1，英文；2，繁体中文；
                // "theme": 0,                        //-1,系统颜色；0，自定义背景；。。。系统模板
                // "bcolor": "#s56431",            //背景色
                // "bpic1": "",                    //列表模式-自定义背景图片
                // "bpic2": "",                    //按钮模式背景图片
                // "bpic3": "",                    //列表模式-最小化背景图片
                // "listrand": 0,                    //客服排序：1,随机；0，顺序；
                // "offhide": 0,                    //0，显示离线客服；1，隐藏离线客服；
                // "fixed": 1,                        //是否固定：1,固定；0，滚动；
                // "float": 0,                        //飘窗位置：0,左边；1，右边；
                // "fmargin": 0,                    //左右边距；
                // "ftop": 0,                        //顶部边距
                // "bmodestyle": 0,                //按钮样式：0,矩形/横向；1，矩形/竖向；2，方形；3，圆形；
                // "autohide": 1,                    //标准模式：0,展开；1，最小化
                // "btncolor": "0",                //分组按钮背景色
                // "btntxt": ""                    //分组按钮字体颜色
                if (config.bpic1 !== '') {
                    themeStyleClassName += ' theme-custom custom-bg';
                    customMainbg = config.bpic1;
                    customGroupNameColor = config.btntxt;
                    bgStyle = {
                        background: 'url(' + customMainbg + ') 50% 50% no-repeat',
                        backgroundSize: 'cover'
                        // filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + customMainbg + '", sizingMethod="scale")',
                        // '-ms-filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + customMainbg + '", sizingMethod="scale")'
                      };
                      urlStyle = {
                          background: 'none'
                      };
                    // customTitleBg = { backgroundColor: customGroupNameColor, border: '1px solid '+ customGroupNameColor };
                    customTitleBg = {
                        backgroundColor: 'transparent',
                        border: '1px solid transparent',
                        color: customGroupNameColor
                    };
                    csNameStyle = {
                        color: customGroupNameColor
                    }
                } else {
                    themeStyleClassName += ' theme-custom';
                }
                break;
            case 1:
                themeStyleClassName += ' default';
                break;
            case 2:
                themeStyleClassName += ' cyan-blue';
                break;
            case 3:
                themeStyleClassName += ' dark-green';
                break;
            case 4:
                themeStyleClassName += ' orange';
                break;
            case 5:
                themeStyleClassName += ' jade-green';
                break;
            default:
                break;
        }

        if (!isShowCsList && (config.autohide === 1 || this.state.minisizeList)) {

            if (config.theme * 1 === 0 && config.bpic3 !== '') {
                miniCustomBg = {
                    background: 'url(' + config.bpic3 + ') 50% 50% no-repeat',
                    backgroundSize: 'cover'
                };
            }

            if (config.language * 1 === 1) {  // 英文
                miniHtml = (<div className="text en">
                    <p>{localeKey.listTitle}</p>
                </div>)
            } else {
                miniHtml = (<div className="text zh">
                    <p>{localeKey.listTitle}</p>
                </div>)
            }

            themeStyleClassName += ' mini autohide';

            var unreadNum = this.countAllUnreadNum();

            returnHtml = (
                <div className={themeStyleClassName}>
                    <div className="cs-shape-wrapper">
                        <a
                            className="cs-shape shape-rect-v"
                            href="javascript:;"
                            onClick={this.maxsizeListHandler}
                            style={miniCustomBg}
                        >
                            <span className="icon icon-customer-service" />
                            {miniHtml}
                            {
                                unreadNum ?
                                <span className="unread-num">{ unreadNum }</span>
                                : null
                            }
                        </a>
                    </div>
                </div>
            )
        } else {
            returnHtml = (
                <div className={themeStyleClassName} style={bgStyle}>
                    <img className="ie-background-fix" src={customMainbg} alt="" />
                    <div
                        className="title"
                        style={customTitleBg}
                    >
                        {localeKey.listTitle}
                        <a className="icon icon-close-small close" href="javascript:;" onClick={this.minisizeListHandler}>
                        </a>
                    </div>
                    <ul
                        className="main"
                        style={urlStyle}
                    >
                        {

                            listData && listData.map(function (group, i) {
                                var isCurrentGroup = (this.state.currentGroup[i] === group.id) && this.state.isShowCurrentGroup[i];
                                var showClassName = '';

                                // console.log(this.state.currentGroup[i], isCurrentGroup, group.id, 'state', this.state.isShowCurrentGroup[i], 'html')
                                return (
                                    <li className="group" key={ group.id }>
                                        <a className={ 'group-name' + (isCurrentGroup ? ' ' : ' opened') }
                                           href="javascript:;"
                                           onClick={ this.selectGroup.bind(this, group.id, this.state.isShowCurrentGroup[i], i) }
                                           style={{ color: customGroupNameColor }}
                                        >
                                    <span
                                        className="group-arrow"
                                        style={{
                                            borderLeft: (isCurrentGroup ? '4px solid ' + customGroupNameColor : '3px solid transparent'),
                                            borderTop: (isCurrentGroup ? '3px solid transparent' : '4px solid ' + customGroupNameColor )
                                        }}
                                    />
                                            { group.name }
                                        </a>
                                        <p className="list" style={{ display: isCurrentGroup ? 'none' : 'block' }}>
                                            {
                                                group.data.map(function (cs) {
                                                    var onlineCsList = this.props.csList.onlineCs;
                                                    var isOffHide = this.props.csList.config.offhide;
                                                    var isOnline = !!this.props.csList.onlineCs[cs.csid];
                                                    var unreadNum = this.props.csList.unreadNums[cs.csid];
                                                     if (unreadNum > 99) {
                                                        unreadNum = 99 + '+';
                                                    }
                                                    var returnHtml;
                                                    if (isOffHide * 1 === 1) {
                                                        if ((_isArray(onlineCsList) && !onlineCsList.length) || isEmptyObject(onlineCsList)) {
                                                            returnHtml = (<a className={ 'cs-item' + (isOnline ? '' : ' offline') + (cs.csid === selectedCs ? ' selected' : '') } href="javascript:;" key={ cs.csid }
                                                            onClick={ this.selectCs.bind(this, cs.csid, group.id, cs.qqfirst, cs.qq, cs.showqq, isOnline) }>
                                                                {
                                                                    unreadNum ? <span className="unread-num">{ unreadNum }</span> : null
                                                                }
                                                                <i className="icon icon-customer-service-two"></i>
                                                                <span className="cs-name" style={csNameStyle}>{ cs.showname }</span>
                                                            </a>);
                                                        } else {
                                                            isOnline ? returnHtml = (
                                                                <a className={ 'cs-item' + (cs.csid === selectedCs ? ' selected' : '') } href="javascript:;" key={ cs.csid }
                                                                onClick={ this.selectCs.bind(this, cs.csid, group.id, cs.qqfirst, cs.qq, cs.showqq, isOnline) }>
                                                                    {
                                                                        unreadNum ? <span className="unread-num">{ unreadNum }</span> : null
                                                                    }
                                                                    <i className="icon icon-customer-service-two"></i>
                                                                    <span className="cs-name" style={csNameStyle}>{ cs.showname }</span>
                                                                </a>
                                                            ) : '';
                                                        }
                                                    } else {
                                                        returnHtml = (<a className={ 'cs-item' + (isOnline ? '' : ' offline') + (cs.csid === selectedCs ? ' selected' : '') } href="javascript:;" key={ cs.csid }
                                                           onClick={ this.selectCs.bind(this, cs.csid, group.id, cs.qqfirst, cs.qq, cs.showqq, isOnline) }>
                                                            {
                                                                unreadNum ? <span className="unread-num">{ unreadNum }</span> : null
                                                            }
                                                            <i className="icon icon-customer-service-two"></i>
                                                            <span className="cs-name" style={csNameStyle}>{ cs.showname }</span>
                                                        </a>);
                                                    }
                                                    return returnHtml;
                                                }.bind(this))
                                            }
                                        </p>
                                    </li>
                                );
                            }.bind(this))
                        }
                    </ul>
                </div>
            )
        }
        return returnHtml;
    },
    render: function () {
        var config = this.props.csList.config;
        if (config.showstyle === 1) {
            return this.renderButton();
        }  else {
            return this.rednerList();
        }
    }
});

module.exports = connect(function (state) {
    return {
        csList: state.csList
    }
})(CsList);
