/**
 Created by Ward on 2018/08/18
  TCS 波胆三列布局视图的itemView,例如下面的布局
   -----------------------------------
  |  ------    -------     ------    |
  | | 1.80 |  | 1.80 |    | 1.80 |   |
  |  ------    -------     ------    |
   -----------------------------------
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';


export default class ItemView_TCSView extends Component {

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

        let hDataArr = [];  //主队的数据数组
        let vDataArr = [];  //客队的数据数组
        let oDataArr = [];  //其他的数据数组
        let xDataArr = [];  //和的数据数组
        let itemViewArr = [];  //视图View的数组
        let titleDescArr = [];  //头部文字描述数组
        let data = this.props.data;

        if (d_key == 'TCS' || d_key == 'HTCS'){

            hDataArr = data['H'] ? data['H'] : [];
            vDataArr = data['V'] ? data['V'] : [];
            xDataArr = data['X'] ? data['X'] : [];
            oDataArr = data['O'] ? data['O'] : [];
            titleDescArr = ['主', '和', '客'];

            for (let i = 0; i < hDataArr.length; i ++){

                let hObject = hDataArr[i];
                let xObject = xDataArr[i];
                let vObject = vDataArr[i];
                let isSelect = this.state.seleIdx == i && this.state.selectHV == 'H';  //主
                let isSelect1 = this.state.seleIdx == i && this.state.selectHV == 'X'; //客
                let isSelect2 = this.state.seleIdx == i && this.state.selectHV == 'V'; //和

                if (i == 0){
                    itemViewArr.push(<View key = {i - 1} style = {{flexDirection:'row', backgroundColor:'#f8f8f7', height:30}}>
                        <View style = {styles.itemCellStyle}>
                            <CusBaseText style = {{color:'#494949', fontSize:Adaption.Font(16,13)}}>
                                {titleDescArr[0]}
                            </CusBaseText>
                        </View>
                        <View style = {styles.itemCellStyle}>
                            <CusBaseText style = {{color:'#494949', fontSize:Adaption.Font(16,13)}}>
                                {titleDescArr[1]}
                            </CusBaseText>
                        </View>
                        <View style = {styles.itemCellStyle}>
                            <CusBaseText style = {{color:'#494949', fontSize:Adaption.Font(16,13)}}>
                                {titleDescArr[2]}
                            </CusBaseText>
                        </View>
                    </View>)
                }

                itemViewArr.push(<View key = {i} style = {{height:60, backgroundColor:'#feffff', flexDirection:'row'}}>
                    {this._singleItemView(isSelect, data, hObject, '主',  'H', i, 'H', 60, SCREEN_WIDTH * 0.33)}
                    {this._singleItemView(isSelect1, data, xObject, '和',  'X', i, 'X', 60, SCREEN_WIDTH * 0.33)}
                    {this._singleItemView(isSelect2, data, vObject, '客',  'V', i, 'V', 60, SCREEN_WIDTH * 0.33)}
                </View>)

                if (i == hDataArr.length - 1){

                    itemViewArr.push(<View key = {i + 1} style={{width:SCREEN_WIDTH, height:60, backgroundColor:'#f8f8f7', flexDirection:'row'}}>
                        <View style = {{flex:0.67, justifyContent:'center'}}>
                            <CusBaseText style = {{ color:'#494949', marginLeft:20, fontSize:Adaption.Font(18,15)}}>
                                其他
                            </CusBaseText>
                        </View>
                        <View style = {{flex:0.33, alignItems:'center', justifyContent:'center'}}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style = {{
                                    borderWidth:.5,
                                    borderColor:this.state.seleIdx == i && this.state.selectHV == 'O' ? '#f00' : '#d3d3d3',
                                    borderRadius:5,
                                    width:Adaption.Width(70),
                                    height:45,
                                    alignItems:'center',
                                    justifyContent:'center',
                                    backgroundColor:'#fff'
                                }}
                                onPress={() => {

                                    let dict = {};
                                    if (this.state.seleIdx == i && this.state.selectHV == 'O' == true) {
                                        this.state.seleIdx = -1;
                                        this.state.selectHV = -1;
                                    } else {
                                        this.state.seleIdx = i;
                                        this.state.selectHV = 'O';

                                        dict['sltIdx'] = i;
                                        dict['d_key'] = this.props.d_key;
                                        dict['kTit'] = '其他';
                                        dict['team'] = 'O';
                                        dict['slthv'] = 'O';

                                        if (this.props.d_key == 'TCS' || this.props.d_key == 'HTCS'){
                                            Object.assign(dict, data['O'][0]); //回调改变数据源，刷新底部选择号码文字描述
                                        }
                                    }
                                    this.props.ballClick ? this.props.ballClick([dict]) : null;

                                    this.setState({
                                        seleIdx: this.state.seleIdx,
                                        selectHV: this.state.selectHV,
                                    });
                                }}
                            >
                                <CusBaseText style = {{fontSize:Adaption.Font(16,13)}}>
                                    {oDataArr[0].p ? oDataArr[0].p : ''}
                                </CusBaseText>
                            </TouchableOpacity>
                        </View>
                    </View>)
                }
            }
        }
        else if (d_key == '1X2GL' || d_key == 'DCGL'){

            titleDescArr = d_key == '1X2GL' ? ['主', '和', '客'] : ['主/和','客/和','主/客'];
            let hkey = d_key == '1X2GL' ? 'H' : 'HV';
            let vkey = d_key == '1X2GL' ? 'V' : 'HX';
            let xkey = d_key == '1X2GL' ? 'X' : 'VX';
            let hovDataArr = data[hkey]['OV'] ? data[hkey]['OV'] : [];  //主队大的赔率
            let hunDataArr = data[hkey]['UN'] ? data[hkey]['UN'] : [];  //主队小的赔率
            let vovDataArr = data[vkey]['OV'] ? data[vkey]['OV'] : [];  //客队大的赔率
            let vunDataArr = data[vkey]['UN'] ? data[vkey]['UN'] : [];  //客队小的赔率
            let xovDataArr = data[xkey]['OV'] ? data[xkey]['OV'] : [];  //和局大的赔率
            let xunDataArr = data[xkey]['UN'] ? data[xkey]['UN'] : [];  //和局小的赔率


            //主，客，和的大小赔率数组长度相等才行
            if (hovDataArr.length == vovDataArr.length && vovDataArr.length == xovDataArr.length){

                for (let i = 0 ; i < hovDataArr.length; i ++){

                    let isSelect = this.state.seleIdx == i && this.state.selectHV == `HOV${i}`;  //主大赔率
                    let isSelect1 = this.state.seleIdx == i && this.state.selectHV == `XOV${i}`; //和大赔率
                    let isSelect2 = this.state.seleIdx == i && this.state.selectHV == `VOV${i}`; //客大赔率
                    let isSelect3 = this.state.seleIdx == i && this.state.selectHV == `HUN${i}`;  //主小赔率
                    let isSelect4 = this.state.seleIdx == i && this.state.selectHV == `XUN${i}`; //和小赔率
                    let isSelect5 = this.state.seleIdx == i && this.state.selectHV == `VUN${i}`; //客小赔率

                    itemViewArr.push(<View key = {i} style = {{height:150, backgroundColor:'#feffff'}}>
                        <View style = {{flexDirection:'row', backgroundColor:'#f8f8f7', height:30}}>
                            <View style = {styles.itemCellStyle}>
                                <CusBaseText style = {{color:'#494949', fontSize:Adaption.Font(16,13)}}>
                                    {titleDescArr[0]}
                                </CusBaseText>
                            </View>
                            <View style = {styles.itemCellStyle}>
                                <CusBaseText style = {{color:'#494949', fontSize:Adaption.Font(16,13)}}>
                                    {titleDescArr[1]}
                                </CusBaseText>
                            </View>
                            <View style = {styles.itemCellStyle}>
                                <CusBaseText style = {{color:'#494949', fontSize:Adaption.Font(16,13)}}>
                                    {titleDescArr[2]}
                                </CusBaseText>
                            </View>
                        </View>
                        <View style = {{height:60, backgroundColor:'#feffff', flexDirection:'row'}}>
                            {this._singleItemView(isSelect, data, hovDataArr[i],  '大', hkey, i, `HOV${i}`, 60, SCREEN_WIDTH * 0.33)}
                            {this._singleItemView(isSelect1, data, vovDataArr[i], '大', vkey, i, `XOV${i}`, 60, SCREEN_WIDTH * 0.33)}
                            {this._singleItemView(isSelect2, data, xovDataArr[i], '大', xkey, i, `VOV${i}`, 60, SCREEN_WIDTH * 0.33)}
                        </View>
                        <View style = {{height:60, backgroundColor:'#feffff', flexDirection:'row'}}>
                            {this._singleItemView(isSelect3, data, hunDataArr[i],  '小', hkey, i, `HUN${i}`, 60, SCREEN_WIDTH * 0.33)}
                            {this._singleItemView(isSelect4, data, vunDataArr[i],  '小', vkey, i, `XUN${i}`, 60, SCREEN_WIDTH * 0.33)}
                            {this._singleItemView(isSelect5, data, xunDataArr[i],  '小', xkey, i, `VUN${i}`, 60, SCREEN_WIDTH * 0.33)}
                        </View>
                    </View>)
                }
            }
        }

        return <View>
            {itemViewArr}
        </View>


    }

    //创建单行item视图 isSelect:选中的状态 data:需要改变的数据源, dataObject:赔率和描述的对象, queue:主客队, teamName:投注参数拼接的team。有些需要传'', key:改变数据源下标 ,unqueKey:选择号码唯一下标,单行多个按钮需要用
    _singleItemView(isSelect, data, dataObject, queue, teamName, key, unqueKey, viewHeight, viewWidth){

        if (dataObject){

            return <View style = {{height:viewHeight, width:viewWidth, alignItems:'center', justifyContent:'center'}}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style = {{
                            borderWidth:.5,
                            borderColor:isSelect ? '#f00' : '#d3d3d3',
                            borderRadius:5,
                            width:Adaption.Width(70),
                            height:viewHeight - 15,
                            alignItems:'center',
                            justifyContent:'center',
                        }}
                        onPress={() => {

                            let dict = {};
                            if (isSelect) {
                                this.state.seleIdx = -1;
                                this.state.selectHV = -1;
                            } else {
                                this.state.seleIdx = key;
                                this.state.selectHV = unqueKey;

                                let subKeyStr = '';

                                switch (queue){
                                    case '大':
                                        subKeyStr = 'OV';
                                        break;
                                    case '小':
                                        subKeyStr = 'UN';
                                        break;
                                }

                                dict['sltIdx'] = key;      //当前按钮所在的行数
                                dict['d_key'] = this.props.d_key;
                                dict['kTit'] = queue;      //底部工具栏要显示的问题
                                dict['team'] = teamName;   //数据源的字段名，例如:H,V等等
                                dict['slthv'] = unqueKey;  //当前选择号码的按钮标识
                                dict['ATit'] = queue;
                                dict['subkey'] = subKeyStr; //投注需要拼接的参数

                                if (this.props.d_key == 'TCS' || this.props.d_key == 'HTCS'){
                                    Object.assign(dict, data[unqueKey][key]); //回调改变数据源，刷新底部选择号码文字描述
                                }
                                else if (this.props.d_key == '1X2GL' || this.props.d_key == 'DCGL'){
                                    Object.assign(dict, data[teamName][dict['subkey']][key]);
                                }
                            }
                            this.props.ballClick ? this.props.ballClick([dict]) : null;

                            this.setState({
                                seleIdx: this.state.seleIdx,
                                selectHV: this.state.selectHV,
                            });
                        }}
                    >
                        {this.props.d_key == '1X2GL' || this.props.d_key == 'DCGL' ? <View style = {{flexDirection:'row'}}>
                            <View style = {{flex:0.4, alignItems:'center', justifyContent:'center'}}>
                                <CusBaseText style = {{fontSize:Adaption.Font(15,12)}}>
                                    {queue}
                                </CusBaseText>
                            </View>
                            <View style = {{flex: 0.6}}>
                                <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:'#22ac38'}}>
                                    {dataObject.k ? dataObject.k : ''}
                                </CusBaseText>
                                <CusBaseText style = {{fontSize:Adaption.Font(15,12)}}>
                                    {dataObject.p ? dataObject.p : ''}
                                </CusBaseText>
                            </View>
                        </View> : <View style = {{justifyContent:'center', alignItems:'center'}}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:'#22ac38'}}>
                                {dataObject.k ? dataObject.k : ''}
                            </CusBaseText>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12)}}>
                                {dataObject.p ? dataObject.p : ''}
                            </CusBaseText>
                        </View>}
                    </TouchableOpacity>
            </View>
        }
        else {
            return <View style = {{height:viewHeight, width:viewWidth}}/>
        }
    }


    render() {

        let hTit = this.props.nowGameData['h'], vTit = this.props.nowGameData['v'];
        let tit = '';//主标题
        let rightTit = '';//副标题

        switch (this.props.d_key){
            case 'TCS':
                tit = '波胆';
                break;
            case 'HTCS':
                tit = '波胆';
                rightTit = ' - 上半场';
                break;
            case '1X2GL':
                tit = '独赢 & 进球 / 大小';
                break;
            case 'DCGL':
                tit = '双重机会 & 进球/大小';
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

    itemCellStyle:{
        flex:0.33,
        alignItems:'center',
        justifyContent:'center',
    }
})