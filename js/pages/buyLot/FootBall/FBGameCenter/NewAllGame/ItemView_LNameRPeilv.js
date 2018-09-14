/**
 Created by Ward on 2018/08/17
 布局是整行，左边描述，右边按钮的视图 的itemView,例如下面的布局:
   ----------------------------
 |                  -----      |
 | 英格兰          | 1.80 |     |
 |                  -----      |
   -----------------------------
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';


export default class ItemView_HC_GL extends Component {

    constructor(props) {
        super(props);

        this.handleSuperSlt = false;

        if (props.superSltDic['d_key'] && props.superSltDic['d_key'] == props.d_key) {
            // 综合过关，在这场比赛有选号时不为null
            this.handleSuperSlt = true;
            this.state = {
                seleIdx: props.superSltDic['sltIdx'], //选择的下标
                selectHV: props.superSltDic['slthv'],  //选的是主还是客
                isClickFold:true, //是否展开Item
            }

        } else {
            this.state = {
                seleIdx: -1,
                selectHV:-1,
                isClickFold:false, //是否展开Item
            }
        }

        this.isHC = this.props.d_key.includes('HC');  // true为让球，flase大小
    }

    _handleSuperSltDic(tit, key, sltdata) {
        // 回调一下上级选号内容。
        let dict = { sltIdx: this.props.superSltDic['sltIdx'], d_key: this.props.d_key, kTit: tit, team: key };
        Object.assign(dict, sltdata);
        this.handleSuperSlt = false;
        this.props.ballClick ? this.props.ballClick([dict]) : null; // 在这里走回调，他居然报警告 不允许我在render回调
    }

    componentWillReceiveProps(nextProps) {
        // 如果是综合过关，切换tabbar后，old_keys[1]为true，一定重置界面的选择状态 为superSltDic的值。其它的seleIdx都要设为: -1,
        if (nextProps.old_keys[1] == true) {

            if (nextProps.superSltDic['d_key'] && nextProps.superSltDic['d_key'] == nextProps.d_key) {
                this.handleSuperSlt = true;
                this.setState({
                    seleIdx: nextProps.superSltDic['sltIdx'],
                })

            } else {
                this.setState({
                    seleIdx: -1,
                })
            }

        } else if (nextProps.d_key != nextProps.slt_key && nextProps.old_keys.includes(nextProps.d_key)) {
            // 不能是当前选择的区 && 之前有选择过的。重置为1。
            this.setState({
                seleIdx: -1,
            })
        }
    }

    // 只刷新 当前选择的，和之前有选择的。 其余的就不刷了 浪费时间。
    shouldComponentUpdate(nextProps, nextState) {
        let aaa = nextProps.d_key != nextProps.slt_key && nextProps.old_keys.includes(nextProps.d_key);
        let bbb = nextState.seleIdx != -1 || nextState.seleIdx != this.state.seleIdx;
        let ccc = nextState.isClickFold != this.state.isClickFold;  //点击展开或者折叠时
        let isRefresh = nextProps.old_keys[0];  // 第0个元素为true时，一定刷新。
        if (aaa || bbb || ccc || isRefresh) {
            return true;
        } else {
            return false;
        }
    }

    //新的样式视图 dataList:数据数组 d_key:字段标识  host:主队名称, guest:客队名称
    _newItemViews(d_key, host, guest){

        let hostDataArr = [];  //主队的数据数组
        let guestDataArr = [];  //客队的数据数组
        let sumDataArr = [];   //和的数据数组
        let itemViewArr = [];  //Item视图数组
        let data = this.props.data;

        if (d_key == 'HC' || d_key == 'HHC'){
            //让球盘
            hostDataArr = data['H'] ?  data['H'] : [];
            guestDataArr = data['V'] ? data['V'] : [];

            if (hostDataArr.length == guestDataArr.length){

                let viewBackColor = '#feffff';  //默认的背景色

                for (let i= 0; i < hostDataArr.length; i++){

                    let hostObject = hostDataArr[i];
                    let guestObject = guestDataArr[i];
                    let uniqueKey = 'H';  //第一个按钮的标识,界面显示选中状态需要
                    let uniqueKey1 = 'V';  //第二个按钮的标识,界面显示选中状态需要
                    let isSelect = this.state.seleIdx == i && this.state.selectHV == uniqueKey;
                    let isSelect1 = this.state.seleIdx == i && this.state.selectHV == uniqueKey1;

                    viewBackColor = i % 2 == 0 ? '#feffff' : '#f8f8f7';
                    itemViewArr.push(<View key = {i} style = {{height:120, backgroundColor:viewBackColor}}>
                        {this._singleItemView(isSelect, data, hostObject, host, 'H', i, uniqueKey, 60)}
                        {this._singleItemView(isSelect1, data, guestObject, guest, 'V', i,  uniqueKey1, 60)}
                    </View>)
                }
            }
        }
        else if (d_key == '1X2' || d_key == 'H1X2'){
            //独赢盘

            let viewBackColor = '#feffff';  //默认的背景色
            let queue = '';  //主客和

            for (let i = 0; i < data.length; i ++){

                let isSelect = this.state.seleIdx == i && this.state.selectHV == `${i}`;
                queue = data[i].k == 'H' ? '主' : data[i].k == 'V' ? '客' : '和';

                viewBackColor = i % 2 == 0 ? '#feffff' : '#f8f8f7';
                itemViewArr.push(<View key = {i} style = {{height:60, backgroundColor:viewBackColor}}>
                    {this._singleItemView(isSelect, data, data[i], queue, '', i,`${i}`, 60)}
                </View>)
            }
        }
        else if (d_key == 'HFT' || d_key == 'DC'){
            //半场全场盘

            let viewBackColor = '#feffff';  //默认的背景色
            let queueName = '';  //主客队比分

            for (let i = 0; i < data.length; i ++){

                let isSelect = this.state.seleIdx == i && this.state.selectHV == `${i}`;

                switch (data[i].k){
                    case 'HH':
                        queueName = `${host} / ${host}`;
                        break;
                    case 'HV':
                        queueName = `${host} / ${guest}`;
                        break;
                    case 'HX':
                        queueName = `${host} / 和局`;
                        break;
                    case 'XH':
                        queueName = `和局 / ${host}`;
                        break;
                    case 'XV':
                        queueName = `和局 / ${guest}`;
                        break;
                    case 'XX':
                        queueName = `和局 / 和局`;
                        break;
                    case 'VH':
                        queueName = `${guest} / ${host}`;
                        break;
                    case 'VV':
                        queueName = `${guest} / ${guest}`;
                        break;
                    case 'VX':
                        queueName = `${guest} / 和局`;
                        break;
                    default:
                        break;
                }


                viewBackColor = i % 2 == 0 ? '#feffff' : '#f8f8f7';
                itemViewArr.push(<View key = {i} style = {{height:60, backgroundColor:viewBackColor}}>
                    {this._singleItemView(isSelect, data, data[i], queueName, '', i, `${i}`, 60)}
                </View>)
            }
        }
        else if (d_key == 'CNS' || d_key == 'WBH' || d_key == 'WEH' || d_key == 'SBH' || d_key == 'HMG' || d_key == 'WTN'){

            let isSelect = this.state.seleIdx == 0 && this.state.selectHV == '0';
            let isSelect1 = this.state.seleIdx == 1 && this.state.selectHV == '1';

            itemViewArr.push(<View key = {0} style = {{height:120, backgroundColor:'#feffff'}}>
                {this._singleItemView(isSelect, data, data[0],  host,  '', 0, '0', 60)}
                {this._singleItemView(isSelect1, data, data[1], guest,  '', 1, '1',  60)}
            </View>)
        }
        else if (d_key == '1X2BTS' || d_key == 'DCBTS'){

            let hkey = d_key == '1X2BTS' ? 'H' : 'HV';
            let vkey = d_key == '1X2BTS' ? 'V' : 'HX';
            let xkey = d_key == '1X2BTS' ? 'X' : 'VX';

            hostDataArr = data[hkey] ?  data[hkey] : [];
            guestDataArr = data[vkey] ? data[vkey] : [];
            sumDataArr = data[xkey] ? data[xkey] : [];

            let viewBackColor = '#feffff';  //默认的背景色

            for (let i= 0; i < 3; i++){

                let dataModelArr = [];
                let queueStr = '';
                let teamStr = '';

                switch (i){
                    case 0:
                        dataModelArr = hostDataArr;  //主
                        queueStr = d_key == '1X2BTS' ? host : `${host} / ${guest}`;
                        teamStr= hkey;
                        break;
                    case 1:
                        dataModelArr = guestDataArr; //客
                        queueStr = d_key == '1X2BTS' ? guest : `${host} / 和局`;
                        teamStr= vkey;
                        break;
                    case 2:
                        dataModelArr = sumDataArr;  //和
                        queueStr = d_key == '1X2BTS' ? '和局' : `${guest} / 和局`;
                        teamStr= xkey;
                        break;
                }

                let isSelect = this.state.seleIdx == i && this.state.selectHV == 'Yes';
                let isSelect1 = this.state.seleIdx == i && this.state.selectHV == 'No';

                viewBackColor = i % 2 == 0 ? '#feffff' : '#f8f8f7';
                itemViewArr.push(<View key = {i} style = {{height:120, backgroundColor:viewBackColor}}>
                    {this._singleItemView(isSelect, data, dataModelArr[0], `${queueStr} & 是`,  teamStr, i,   'Yes', 60)}
                    {this._singleItemView(isSelect1, data, dataModelArr[1], `${queueStr} & 不是`,  teamStr, i, 'No', 60)}
                </View>)
            }
        }
        else if (d_key == 'FGM' || d_key == 'TFG' || d_key == 'TFG3W'){

            for (let i = 0; i < data.length; i++){

                let descStrArr = [];  //左边显示的文字的数组

                switch (d_key){
                    case 'FGM':
                        descStrArr = ['射门','头球','无进球','点球','自由球','乌龙球'];
                        break;
                    case 'TFG':
                        descStrArr = ['第26分钟或之前','第27分钟或之后','无进球'];
                        break;
                    case 'TFG3W':
                        descStrArr = ['上半场开始-14:59分钟', '15:00-29:59分钟','30:00分钟-半场','下半场开始-59:59分钟','60:00-74:59分钟','75:00分钟-全场','无进球'];
                        break;
                }

                let isSelect = this.state.seleIdx == i && this.state.selectHV == `${data[i].k}${i}`;

                itemViewArr.push(<View key = {i} style = {{height:60, backgroundColor:viewBackColor}}>
                    {this._singleItemView(isSelect, data, data[0], descStrArr[i],  '', i, `${data[i].k}${i}`, 60)}
                </View>)
            }

        }
        else if (d_key == 'WM'){

            hostDataArr = data['H'] ?  data['H'] : [];
            guestDataArr = data['V'] ? data['V'] : [];
            sumDataArr = data['X'] ? data['X'] : [];

            for (let i = 0; i < 3; i++){

                let newDataArr = [];

                switch (i){
                    case 0:
                        newDataArr = hostDataArr;
                        break;
                    case 1:
                        newDataArr = guestDataArr;
                        break;
                    case 2:
                        newDataArr = sumDataArr;
                }

                if (i == 2){

                    let isSelect = this.state.seleIdx == i && this.state.selectHV == '0-0';
                    let isSelect1 = this.state.seleIdx == i && this.state.selectHV == '任何进球';

                    itemViewArr.push(<View key = {i} style = {{height:120, backgroundColor:'#f8f8f7'}}>
                        <View style = {{height:60, flexDirection:'row'}}>
                            <View style = {{flex:0.7, justifyContent:'center', paddingLeft:15}}>
                                <CusBaseText>
                                    0-0 和局
                                </CusBaseText>
                            </View>
                            <View style = {{flex:0.3, alignItems:'center', justifyContent:'center'}}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style = {{
                                    borderWidth:.5,
                                    borderColor:isSelect ? '#f00' : '#d3d3d3',
                                    borderRadius:5,
                                    width:Adaption.Width(70),
                                    height:45,
                                    alignItems:'center',
                                    justifyContent:'center'
                                }}
                                    onPress={() => {

                                    let dict = {};
                                    if (isSelect) {
                                        this.state.seleIdx = -1;
                                        this.state.selectHV = -1;
                                    } else {
                                        this.state.seleIdx = i;
                                        this.state.selectHV = '0-0';  //记住选择的号码的下标(必须唯一的)

                                        dict['sltIdx'] = i;   //当前按钮所在的行数
                                        dict['d_key'] = this.props.d_key;
                                        dict['kTit'] = '0-0 和局';     //底部工具栏要显示的问题
                                        dict['team'] = 'X';  //数据源的字段名，例如:H,V等等
                                        dict['slthv'] = '0-0';  //当前选择号码的按钮标识

                                        if (this.props.d_key == 'WM'){

                                            Object.assign(dict, data['X'][0]); //回调改变数据源，刷新底部选择号码文字描述
                                        }

                                    }
                                    this.props.ballClick ? this.props.ballClick([dict]) : null;

                                    this.setState({
                                        seleIdx: this.state.seleIdx,
                                        selectHV: this.state.selectHV,
                                    });
                                }}>

                                    <CusBaseText style = {{fontSize:Adaption.Font(16,13)}}>
                                        {newDataArr[0].p}
                                    </CusBaseText>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style = {{height:60, flexDirection:'row'}}>
                            <View style = {{flex:0.7,  justifyContent:'center', paddingLeft:15}}>
                                <CusBaseText>
                                    任何进球和局
                                </CusBaseText>
                            </View>
                            <View style = {{flex:0.3, alignItems:'center', justifyContent:'center'}}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style = {{
                                        borderWidth:.5,
                                        borderColor:isSelect1 ? '#f00' : '#d3d3d3',
                                        borderRadius:5,
                                        width:Adaption.Width(70),
                                        height:45,
                                        alignItems:'center',
                                        justifyContent:'center'
                                    }}
                                    onPress={() => {

                                        let dict = {};
                                        if (isSelect1) {
                                            this.state.seleIdx = -1;
                                            this.state.selectHV = -1;
                                        } else {
                                            this.state.seleIdx = i;
                                            this.state.selectHV = '任何进球';  //记住选择的号码的下标(必须唯一的)

                                            dict['sltIdx'] = i;   //当前按钮所在的行数
                                            dict['d_key'] = this.props.d_key;
                                            dict['kTit'] = '任何进球和局';     //底部工具栏要显示的问题
                                            dict['team'] = 'X';  //数据源的字段名，例如:H,V等等
                                            dict['slthv'] = '任何进球和局';  //当前选择号码的按钮标识

                                            if (this.props.d_key == 'WM'){

                                                Object.assign(dict, data['X'][1]); //回调改变数据源，刷新底部选择号码文字描述
                                            }

                                        }
                                        this.props.ballClick ? this.props.ballClick([dict]) : null;

                                        this.setState({
                                            seleIdx: this.state.seleIdx,
                                            selectHV: this.state.selectHV,
                                        });
                                    }}>

                                    <CusBaseText style = {{fontSize:Adaption.Font(16,13)}}>
                                        {newDataArr[1].p}
                                    </CusBaseText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>)
                }
                else {

                    let isSlect = this.state.seleIdx == 0 && this.state.selectHV == `${i == 0 ? 'H' : 'V'}`;
                    let isSlect1 = this.state.seleIdx == 1 && this.state.selectHV == `${i == 0 ? 'H' : 'V'}`;
                    let isSlect2 = this.state.seleIdx == 2 && this.state.selectHV == `${i == 0 ? 'H' : 'V'}`;
                    let isSlect3 = this.state.seleIdx == 3 && this.state.selectHV == `${i == 0 ? 'H' : 'V'}`;

                    itemViewArr.push(<View key = {i} style = {{height:270}}>
                        <View style = {{backgroundColor:'#f8f8f7', height:30, justifyContent:'center', paddingLeft:15}}>
                            <CusBaseText style = {{color:'#7d6b57', fontSize:Adaption.Font(16,13)}}>
                                {i == 0 ? host : guest}
                            </CusBaseText>
                        </View>
                        {this._singleItemView(isSlect, data, newDataArr[0], '净胜1球', i == 0 ? 'H' : 'V', 0, `${i == 0 ? 'H' : 'V'}`, 60)}
                        {this._singleItemView(isSlect1, data, newDataArr[1], '净胜2球', i == 0 ? 'H' : 'V', 1, `${i == 0 ? 'H' : 'V'}`, 60)}
                        {this._singleItemView(isSlect2, data, newDataArr[2], '净胜3球', i == 0 ? 'H' : 'V', 2, `${i == 0 ? 'H' : 'V'}`, 60)}
                        {this._singleItemView(isSlect3, data, newDataArr[3], '净胜4球或更多', i == 0 ? 'H' : 'V', 3,`${i == 0 ? 'H' : 'V'}`, 60)}
                    </View>)
                }
            }
        }

        return <View>
            {itemViewArr}
        </View>


    }

    //创建单行item视图 isSelect:选中的状态 data:数据源, dataObject:赔率和描述的对象, queue:主客队, teamName:投注参数拼接的team。有些需要传'', key:改变数据源下标
    _singleItemView(isSelect, data, dataObject, queue, teamName, key, uniqueKey, viewHeight){

        let lastPeilv = dataObject.p ? dataObject.p : '';  //默认

        //让分和半场让分需要判断
        if (this.props.d_key == 'HC' || this.props.d_key == 'HHC'){

            switch (this.props.selectPanKou){
                case '香港盘':
                    lastPeilv = dataObject.HK ? dataObject.HK : dataObject.p;
                    break;
                case '马来盘':
                    lastPeilv = dataObject.MY ? dataObject.MY : dataObject.p;
                    break;
                case '印尼盘':
                    lastPeilv = dataObject.IND ? dataObject.IND : dataObject.p;
                    break;
                case '欧洲盘':
                    lastPeilv = dataObject.DEC ? dataObject.DEC : dataObject.p;
            }
        }

        return  <View style = {{height:viewHeight, flexDirection:'row'}}>
            <View style = {{flex:0.7, justifyContent:'center', paddingLeft:15, height:viewHeight}}>
                <CusBaseText style = {{fontSize:Adaption.Font(16,13)}}>
                    {queue}
                </CusBaseText>
            </View>
            <View style = {{flex:0.3, alignItems:'center', justifyContent:'center', height:viewHeight}}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style = {{
                        borderWidth:.5,
                        borderColor:isSelect ? '#f00' : '#d3d3d3',
                        borderRadius:5,
                        width:Adaption.Width(70),
                        height:viewHeight - 15,
                        alignItems:'center',
                        justifyContent:'center'
                    }}
                    onPress={() => {

                        let dict = {};
                        if (isSelect) {
                            this.state.seleIdx = -1;
                            this.state.selectHV = -1;
                        } else {
                            this.state.seleIdx = key;
                            this.state.selectHV = uniqueKey;  //记住选择的号码的下标(必须唯一的)

                            dict['sltIdx'] = key;   //当前按钮所在的行数
                            dict['d_key'] = this.props.d_key;
                            dict['kTit'] = queue;     //底部工具栏要显示的问题
                            dict['team'] = teamName;  //数据源的字段名，例如:H,V等等
                            dict['slthv'] = uniqueKey;  //当前选择号码的按钮标识


                            if (this.props.d_key == 'HC' || this.props.d_key == 'HHC' || this.props.d_key == 'DCBTS' || this.props.d_key == '1X2BTS' || this.props.d_key == 'WM'){

                                let newKeyIdx = this.props.d_key == '1X2BTS' || this.props.d_key == 'DCBTS' ? uniqueKey == 'Yes' ? 0 : 1 : key;
                                let subKey =  this.props.d_key == '1X2BTS' || this.props.d_key == 'DCBTS' ? teamName : uniqueKey;

                                Object.assign(dict, data[subKey][newKeyIdx]); //回调改变数据源，刷新底部选择号码文字描述
                            }
                            else {
                                Object.assign(dict, data[key]);
                            }
                        }
                        this.props.ballClick ? this.props.ballClick([dict]) : null;

                        this.setState({
                            seleIdx: this.state.seleIdx,
                            selectHV: this.state.selectHV,
                        });
                    }}
                >
                    {dataObject.k.indexOf('-') == 0 ? <CusBaseText style = {{fontSize:Adaption.Font(16,13), color:'#22ac38'}}>
                        {dataObject.k ? dataObject.k.substr(1,dataObject.k.length - 1) : ''}
                    </CusBaseText> : null}
                    <CusBaseText style = {{fontSize:Adaption.Font(16,13)}}>
                        {lastPeilv}
                    </CusBaseText>
                </TouchableOpacity>
            </View>
        </View>
    }


    render() {

        let hTit = this.props.nowGameData['h'], vTit = this.props.nowGameData['v'];
        let tit = '';//主标题
        let rightTit = '';//副标题

        switch (this.props.d_key){
            case 'HC':
                tit = '让球';
                break;
            case 'HHC':
                tit = '让球';
                rightTit = ' - 上半场';
                break;
            case '1X2':
                tit = '独赢';
                break;
            case 'H1X2':
                tit = '独赢';
                rightTit = ' - 上半场';
                break;
            case 'HFT':
                tit = '半场 / 全场';
                break;
            case 'DC':
                tit = '双重机会';
                break;
            case 'CNS':
                tit = '零失球';
                break;
            case 'WFB':
                tit = '落后反超获胜';
                break;
            case 'WEH':
                tit = '赢得任一半场';
                break;
            case 'WBH':
                tit = '赢得所有半场';
                break;
            case 'SBH':
                tit = '双半场进球';
                break;
            case '1X2BTS':
                tit = '独赢&双方进球';
                break;
            case 'DCBTS':
                tit = '双重机会 & 双方球队进球';
                break;
            case 'HMG':
                tit = '最多进球的半场';
                break;
            case 'FGM':
                tit = '首个进球方式';
                break;
            case 'TFG':
                tit = '首个进球时间';
                break;
            case 'TFG3W':
                tit = '首个进球时间';
                rightTit = ' - 3项';
                break;
            case 'R2G':
                tit = '先进2球的一方';
                break;
            case 'R3G':
                tit = '先进3球的一方';
                break;
            case 'WTN':
                tit = '零失球获胜';
                break;
            case 'FLG':
                tit = '最先 / 最后进球';
                break;
            case 'WM':
                tit = '净胜球数';
                break;
            case 'DCFTS':
                tit = '双重机会 & 最先进球';
                break;
            case '1X2FG':
                tit = '独赢&最先进球';
                break;
        }

        return (
            <View>
                {/* 灰 顶部 */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={this.props.style.b}
                    onPress={()=>{

                        this.setState({isClickFold:!this.state.isClickFold});  //展开或者折叠
                    }}
                >
                    <View style = {{flex:0.9, justifyContent:'center', marginLeft:Adaption.Width(20)}}>
                        <Text allowFontScaling={false} style={{ fontSize: 17}}>
                            {tit}<Text allowFontScaling={false} style = {{color:COLORS.appColor, fontSize:17}}>
                            {rightTit}
                        </Text>
                        </Text>
                    </View>
                    <View style = {{flex:0.1, justifyContent:'center',}}>
                        <Image style = {{width:15,width:15, resizeMode:'contain'}} source={this.state.isClickFold == true ? require('../../img/arrowUp.png') : require('../../img/arrowDown.png')}/>
                    </View>
                </TouchableOpacity>

                {this.state.isClickFold == true ?  this._newItemViews(this.props.d_key, hTit, vTit) : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({


})