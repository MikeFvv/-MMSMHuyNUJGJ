/**
 Created by Ward on 2018/08/17
 布局是半行，左边描述，右边按钮的视图, 整行左右对称的 的itemView,例如下面的布局

 ---------------------------------------------
 |          ------    |              ------   |
 | 英格兰   | 1.80 |   |     俄罗斯   | 1.80 |  |
 |          ------    |              ------   |
 ---------------------------------------------


 */
import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';


export default class ItemView_HaflView extends Component {

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

        let bigDataArr = [];  //OV的数据数组
        let smallDataArr = [];  //UN的数据数组
        let itemViewArr = [];  //Item视图数组
        let data = this.props.data;

        if (d_key == 'GL' || d_key == 'HGL'){

            bigDataArr = data['OV'] ? data['OV'] : [];
            smallDataArr = data['UN'] ? data['UN'] : [];

            for (let i = 0; i < bigDataArr.length; i ++){

                let bigObject = bigDataArr[i];
                let smallObject = smallDataArr[i];
                let isSelect = this.state.seleIdx == i && this.state.selectHV == 'OV';
                let isSelect1 = this.state.seleIdx == i && this.state.selectHV == 'UN';

                let viewBackColor = i % 2 == 0 ? '#feffff' : '#f8f8f7';
                itemViewArr.push(<View key = {i} style = {{height:60, backgroundColor:viewBackColor, flexDirection:'row'}}>
                    {this._singleItemView(isSelect, data, bigObject, '大',  'OV', i, 60, SCREEN_WIDTH/2)}
                    {this._singleItemView(isSelect1, data, smallObject, '小',  'UN', i, 60, SCREEN_WIDTH/2)}
                </View>)
            }
        }
        else if (d_key == 'BTS' || d_key == 'HBTS'){

            let isSelect = this.state.seleIdx == 0;
            let isSelect1 = this.state.seleIdx == 1;

            itemViewArr.push(<View key = {0} style = {{height:60, backgroundColor:'#feffff', flexDirection:'row'}}>
                {this._singleItemView(isSelect, data, data[0], '是',  '', 0, 60, SCREEN_WIDTH/2)}
                {this._singleItemView(isSelect1, data, data[1], '否', '', 1, 60, SCREEN_WIDTH/2)}
            </View>)
        }
        else if (d_key == 'TGOE' || d_key == 'HTGOE'){
            let isSelect = this.state.seleIdx == 0;
            let isSelect1 = this.state.seleIdx == 1;

            itemViewArr.push(<View key = {0} style = {{height:60, backgroundColor:'#feffff', flexDirection:'row'}}>
                {this._singleItemView(isSelect, data, data[0], '单', '', 0, 60, SCREEN_WIDTH/2)}
                {this._singleItemView(isSelect1, data, data[1], '双', '', 1, 60, SCREEN_WIDTH/2)}
            </View>)
        }
        else if (d_key == 'HGLH' || d_key == 'HGLV' ){
            let isSelect = this.state.seleIdx == 0 && this.state.selectHV == 'OV';
            let isSelect1 = this.state.seleIdx == 0 && this.state.selectHV == 'UN';

            itemViewArr.push(<View key = {0} style = {{height:60, backgroundColor:'#feffff', flexDirection:'row'}}>
                {this._singleItemView(isSelect, data, data['OV'][0], '大', 'OV', 0, 60, SCREEN_WIDTH/2)}
                {this._singleItemView(isSelect1, data, data['UN'][0], '小', 'UN', 0, 60, SCREEN_WIDTH/2)}
            </View>)
        }

        return <View>
            {itemViewArr}
        </View>


    }

    //创建单行item视图 isSelect:选中的状态 data:数据源, dataObject:赔率和描述的对象, queue:主客队, teamName:投注参数拼接的team。有些需要传'', key:改变数据源下标
    _singleItemView(isSelect, data, dataObject, queue, teamName, key, viewHeight, viewWidth){

        let lastPeilv = dataObject.p ? dataObject.p : '';  //默认

        //让分和半场让分需要判断
        if (this.props.d_key == 'GL' || this.props.d_key == 'HGL'){

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

        return  <View style = {{height:viewHeight, width:viewWidth, flexDirection:'row'}}>
            <View style = {{flex:0.4, justifyContent:'center', paddingLeft:15}}>
                <CusBaseText style = {{fontSize:Adaption.Font(16,13)}}>
                    {queue}
                </CusBaseText>
            </View>
            <View style = {{flex:0.6,  justifyContent:'center'}}>
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
                            this.state.selectHV = teamName;

                            let ktit = '';

                            switch (teamName){
                                case 'OV':
                                    ktit = '大';
                                    break;
                                case 'UN':
                                    ktit = '小';
                                    break;
                                case 'Odd':
                                    ktit = '单';
                                    break;
                                case 'Even':
                                    ktit = '双';
                                    break;
                            }

                            dict['sltIdx'] = key;   //当前按钮所在的行数
                            dict['d_key'] = this.props.d_key;
                            dict['kTit'] = queue;     //底部工具栏要显示的问题
                            dict['team'] = teamName;  //数据源的字段名，例如:H,V等等
                            dict['slthv'] = teamName;  //当前选择号码的按钮标识

                            if (this.props.d_key == 'GL' || this.props.d_key == 'HGL' || this.props.d_key == 'HGLH' || this.props.d_key == 'HGLV'){
                                Object.assign(dict, data[teamName][key]);  //回调改变数据源，刷新底部选择号码文字描述
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
                    {this.props.d_key == 'GL' || this.props.d_key == 'HGL' ? <View style = {{flexDirection:'row'}}>
                        <View style = {{alignItems:'center', justifyContent:'center'}}>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:'#22ac38'}}>
                                {dataObject.k ? dataObject.k : ''}
                            </CusBaseText>
                            <CusBaseText style = {{fontSize:Adaption.Font(15,12)}}>
                                {lastPeilv ? lastPeilv : ''}
                            </CusBaseText>
                        </View>
                    </View> : <View style = {{justifyContent:'center', alignItems:'center'}}>
                        <CusBaseText style = {{fontSize:Adaption.Font(15,12)}}>
                            {dataObject.p ? dataObject.p : ''}
                        </CusBaseText>
                    </View>}
                </TouchableOpacity>
            </View>
        </View>
    }


    render() {

        let hTit = this.props.nowGameData['h'], vTit = this.props.nowGameData['v'];
        let tit = '';//主标题
        let rightTit = '';//副标题
        let rightSec = ''; //副标题2
        let rightThird = ''; //副标题3

        switch (this.props.d_key){

            case 'GL':
                tit = '大 / 小';
                break;
            case 'HGL':
                tit = '大 / 小';
                rightTit = ' - 上半场';
                break;
            case 'BTS':
                tit = '双方球队进球';
                break;
            case 'HBTS':
                tit = '双方球队进球';
                rightTit = ' - 上半场';
                break;
            case 'TGOE':
                tit = '单 / 双';
                break;
            case 'HTGOE':
                tit = '单 / 双';
                rightTit = ' - 上半场';
                break;
            case 'GLH':
                tit = '球队进球数:';
                rightTit = `${hTit} - 大/ 小`;
                break;
            case 'GLV':
                tit = '球队进球数:';
                rightTit = `${vTit} - 大/ 小`;
                break;
            case 'HGLH':
                tit = '球队进球数:';
                rightTit = hTit;
                rightSec =  '- 大/ 小';
                rightThird = '- 上半场';
                break;
            case 'HGLV':
                tit = '球队进球数:';
                rightTit = vTit;
                rightSec =  '- 大/ 小';
                rightThird = '- 上半场';
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
                        <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17,14)}}>
                            {tit}
                            <Text allowFontScaling={false} style = {{color:COLORS.appColor, fontSize:Adaption.Font(17,14)}}>
                                {rightTit}
                                <Text allowFontScaling={false} style = {{ color:'#494949',fontSize:Adaption.Font(17,14)}}>
                                    {rightSec}
                                    <Text allowFontScaling={false} style = {{color:COLORS.appColor, fontSize:Adaption.Font(17,14)}}>
                                        {rightThird}
                                    </Text>
                                </Text>
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