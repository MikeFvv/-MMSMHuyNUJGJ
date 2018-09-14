/**
 * Created by Ward on 2018/04/11.
 */

import React, { Component } from 'react'
import {
    View,
    FlatList,
    ImageBackground,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native'

import FBShopHeaderView from './FBShopCarHeader';  //体彩头部视图
import FBBottomView from '../footballTool/ScorceBottomView'; //体彩底部视图
import Toast, {DURATION} from 'react-native-easy-toast'  //土司视图


export default class FBShopCarList extends Component {

    //导航栏属性设置
    static navigationOptions = ({ navigation }) => ({

        header: (
            <CustomNavBar
                centerText = {"综合过关"}
                leftClick={() =>  navigation.state.params ? navigation.state.params.clearShopCar() : null}
                // rightView = {navigation.state.params ? <View style = {{width:40, height:46, alignItems:'center', justifyContent:'center', marginRight:20, marginTop:SCREEN_HEIGHT == 812 ? 40 : 15}}>
                //      <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(18,15)}}>
                //      {navigation.state.params.navCountDownText ? navigation.state.params.navCountDownText : '0'}
                // </CusBaseText></View> : null}
            />
        ),
    });

    constructor(props) {
        super(props);

        this.state = {
            isArgree:true, //是否同意服务协议
            dataSource:props.navigation.state.params ? props.navigation.state.params.dataDict.dataArr : [],  //选择号码的数组
            dataModel:props.navigation.state.params ? props.navigation.state.params.dataDict : null,  //上个界面传过来的数据
        }

        this.xiaZhuClickWating = false;  //防止快速点击下注按钮
        this.clearSItemId = []; // 记录删除哪条item的。
    }

    //接受将要改变的属性
    // componentWillReceiveProps(nextProps) {
    //
    //     if (nextProps.navigation.state.params.dataDict){
    //         this.setState({dataModel:nextProps.navigation.state.params.dataDict, dataSource:nextProps.navigation.state.params.dataDict.dataArr});
    //     }
    // }

    componentDidMount() {

        this.props.navigation.setParams({
            clearShopCar: this._clearShopCar,
        })

        // this._countDownTime();

    }

    //倒计时刷新开奖数据
    // _countDownTime(){
    //
    //     if (this.timer1) {
    //         return;
    //     }
    //
    //     this.timer1 = setInterval(() => {
    //
    //         if (this.props.navigation.state.params.navCountDownText < 1){
    //             this.props.navigation.state.params.navCountDownText = 10;
    //             this._refreshNewPeilv();
    //         }
    //         else {
    //
    //             this.props.navigation.state.params.navCountDownText -= 1;
    //         }
    //
    //         this.props.navigation.setParams({
    //             navCountDownText: this.props.navigation.state.params.navCountDownText,
    //         });
    //     }, 1000)
    // }

    //每10秒刷新选择赛事的最新赔率
    _refreshNewPeilv(){

        //防止数据为空时去请求
        if (this.state.dataSource.length != 0){

            let scheduleArrStr = ''; //所有赛事

            for (let i = 0 ; i < this.state.dataSource.length; i ++){

                let modelData = this.state.dataSource[i];

                if (i == 0){

                    scheduleArrStr = `${modelData.value.data.schedule_id}`;
                }
                else {
                    scheduleArrStr = scheduleArrStr + ',' + `${modelData.value.data.schedule_id}`;
                }
            }

            let newDataSource = []; //新的数组
            let newZongHePeilv = 0.00; //刷新赔率后重新计算赔率

            let params = new FormData();

            params.append('ac', 'getSportGameData');
            params.append('game_type', this.props.navigation.state.params.gameType);
            params.append('play_group', 0);
            params.append('schedule_id',scheduleArrStr);

            var promise = GlobalBaseNetwork.sendNetworkRequest(params);
            promise
                .then((responseData) => {

                    if (responseData.msg == 0 && responseData.data){

                        for (let i = 0; i < this.state.dataSource.length; i++){

                            let sportModel = this.state.dataSource[i];

                            for (let j = 0; j < responseData.data.length; j++){

                                let zongheModel = responseData.data[j];

                                if (sportModel.value.data.schedule_id == zongheModel.schedule_id){

                                    let newPeilvArr = [];

                                    if (sportModel.value.playMethod == 'HC'){
                                        //让球会出现多个

                                        newPeilvArr  = zongheModel.bet_data[sportModel.value.playMethod][sportModel.value.isHVXO.toUpperCase()];
                                        let idx = sportModel.value.data.equal ? sportModel.value.data.equal : 0; //如果不存在多个盘则取第0个
                                        sportModel.value.p = newPeilvArr[idx].p;
                                    }
                                    else if (sportModel.value.playMethod == 'GL'){
                                        //大小也会出现多个
                                        let isHost = sportModel.value.isHVXO == 'h' ? true : false;
                                        let keyStr = isHost ? 'OV' : 'UN';
                                        newPeilvArr = zongheModel.bet_data[sportModel.value.playMethod][keyStr];
                                        let idx = sportModel.value.data.equal ? sportModel.value.data.equal : 0; //如果不存在多个盘则取第0个
                                        sportModel.value.p = newPeilvArr[idx].p;

                                    }
                                    else {

                                        let peilvArr = zongheModel.bet_data[sportModel.value.playMethod];

                                        for (model of peilvArr){

                                            if (model.k == sportModel.value.k){
                                                sportModel.value.p = model.p;
                                            }
                                        }
                                    }

                                    break;
                                }
                                else {
                                    continue; //如果id不同时则继续下个循环
                                }
                            }

                            if (i == 0){
                                newZongHePeilv = parseFloat(sportModel.value.p, 10);
                            }
                            else {
                                newZongHePeilv = newZongHePeilv * parseFloat(sportModel.value.p, 10);
                            }

                            newDataSource.push(sportModel);
                        }

                        if (newZongHePeilv.toFixed(2) != this.state.dataModel.peilv){
                            this.refs.Toast && this.refs.Toast.show('赔率已发生变化!',500);
                        }

                        this.state.dataModel.peilv = newZongHePeilv.toFixed(2);
                        this.setState({dataSource:newDataSource});
                    }

                })
                .catch((err) => {

                })
        }
    }

    //箭头函数绑定this ,可以拿到state
    _clearShopCar = () => {

        if (this.state.dataSource.length == 0){
            PushNotification.emit('ClearFootBallGameViewBallNotification');//发出通知清空界面
            this.props.navigation.goBack();
        }
        else {

            //没有清空购物车不能点击左键返回
            Alert.alert('温馨提示', '是否清空购物车列表', [{
                text: '确定', onPress: () => {

                    //清空购物车后重置数据模型dataModel
                    this.state.dataModel.peilv = 0;
                    this.state.dataModel.desc = '';
                    this.state.dataModel.dataArr = [];
                    this.setState({dataSource:[], dataModel:this.state.dataModel});
                    PushNotification.emit('ClearFootBallGameViewBallNotification');//发出通知清空界面
                    this.refs.Toast && this.refs.Toast.show('清除购物车成功!', 500);
                    setTimeout(() => {this.props.navigation.goBack()}, 750);
                }
            }, {text: '取消', onPress: () => {

            }}]);
        }
    }

    //移除通知
    // componentWillUnmount(){
    //
    //     //清除定时器
    //     this.timer1 && clearInterval(this.timer1);
    //
    //     //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
    //     this.setState = (state,callback) => {
    //         return;
    //     }
    // }

    //根据对应的缩写转换成中文的描述
    _handlePlayMethodDesc(playMehtod){

        let chineseDesc = '';  //中文描述

        switch (playMehtod){

            case 'HC':
                chineseDesc = '让球';
                break;
            case 'HHC':
                chineseDesc = '半场让球';
                break;
            case '1X2':
                chineseDesc = '独赢';
                break;
            case 'H1X2':
                chineseDesc = '半场独赢';
                break;
            case 'GL':
                chineseDesc = '大小';
                break;
            case 'HGL':
                chineseDesc = '半场大小';
                break;
            case 'TGOE':
                chineseDesc = '单双';
                break;
            case 'HTGOE':
                chineseDesc = '半场单双';
                break;
            case 'TCS':
                chineseDesc = '波胆';
                break;
            case 'HTCS':
                chineseDesc = '半场波胆';
                break;
            case '15M':
                chineseDesc = '15分钟盘口';
                break;
            case 'TG':
                chineseDesc = '总进球数';
                break;
            case 'HTG':
                chineseDesc = '半场总进球数';
                break;
            case 'BTS':
                chineseDesc = '双方球队进球';
                break;
            case 'HBTS':
                chineseDesc = '半场双方球队进球';
                break;
            case 'GLH':
                chineseDesc = '球队进球数大小';
                break;
            case 'HGLH':
                chineseDesc = '半场球队进球数大小';
                break;
            case 'GLV':
                chineseDesc = '球队进球数大小';
                break;
            case 'HGLV':
                chineseDesc = '半场球队进球数大小';
                break;
            case 'FLG':
                chineseDesc = '最先 / 最后进球';
                break;
            case 'HFT':
                chineseDesc = '半场 / 全场';
                break;
            case 'WM':
                chineseDesc = '净胜球数';
                break;
            case 'DC':
                chineseDesc = '双重机会';
                break;
            case 'CNS':
                chineseDesc = '零失球';
                break;
            case 'WTN':
                chineseDesc = '零失球获胜';
                break;
            case '1X2GL':
                chineseDesc = '独赢 & 进球 大 / 小';
                break;
            case '1X2BTS':
                chineseDesc = '独赢 & 双方球队进球';
                break;
            case 'GLBTS':
                chineseDesc = '进球 大 / 小 & 双方球队进球';
                break;
            case '1X2FG':
                chineseDesc = '独赢& 最先进球';
                break;
            case 'R2G':
                chineseDesc = '先进两球的一方';
                break;
            case 'R3G':
                chineseDesc = '先进三球的一方';
                break;
            case 'HMG':
                chineseDesc = '最多进球的半场';
                break;
            case 'HMG1x2':
                chineseDesc = '最多进球的半场(独赢)';
                break;
            case 'SBH':
                chineseDesc = '双半场进球';
                break;
            case 'FGM':
                chineseDesc = '首个进球方式';
                break;
            case 'TFG':
                chineseDesc = '首个进球时间';
                break;
            case 'TFG3W':
                chineseDesc = '首个进球时间(3项)';
                break;
            case 'DCGL':
                chineseDesc = '双重机会 & 进球 大 / 小';
                break;
            case 'DCBTS':
                chineseDesc = '双重机会 & 双方球队进球';
                break;
            case 'DCFTS':
                chineseDesc = '双重机会 & 最先进球';
                break;
            case 'GLTGOE':
                chineseDesc = '进球 大/小 & 进球 单/双';
                break;
            case 'GLFTS':
                chineseDesc = '进球 大 / 小 & 最先进球';
                break;
            case '3WHC':
                chineseDesc = '三项让球投注';
                break;
            case 'WFB':
                chineseDesc = '落后反超获胜';
                break;
            case 'WEH':
                chineseDesc = '赢得任一半场';
                break;
            case 'WBH':
                chineseDesc = '赢得所有半场';
                break;

            default :
                break;
        }

        return chineseDesc;
    }

    //渲染Cell的方法
    _renderItemView = (item) => {

        let wanfaPlay = this._handlePlayMethodDesc(item.item.value.playMethod);//玩法数据
        let kStr = item.item.value.kTit ? item.item.value.kTit : item.item.value.k;
        let hostVSGuestMsg = `${item.item.value.data.h} VS ${item.item.value.data.v}`;
        let cellViewHeight = 80;  //Cell视图的详情高度
        let hostVSMsgHeight = 30;

        if (hostVSGuestMsg.length > 24){
            hostVSMsgHeight = 45;
            cellViewHeight = 100;
        }

        return (<View style = {{height:cellViewHeight, backgroundColor:'#fff', marginLeft: 12, marginRight: 12, marginTop:10}}>
            <View style = {{marginLeft:10, height:20}}>
                <CusBaseText style = {{fontSize:Adaption.Font(17,14), color:'#434343'}}>
                    {item.item.value.league_name}
                </CusBaseText>
            </View>
            <View style = {{flexDirection:'row', height:hostVSMsgHeight}}>
                <View style = {{flex:0.88, height:hostVSMsgHeight}}>
                    <CusBaseText style = {{marginTop:5, marginLeft:10, fontSize:Adaption.Font(16,13), color:'#676767'}}>
                        {hostVSGuestMsg}
                    </CusBaseText>
                </View>
                <TouchableOpacity style={{flex: 0.12, alignItems: 'center'}} activeOpacity={0.5}
                   onPress={() => {

                       //每删除一个Cell,则重新赋值，刷新界面
                       let cutPeiLV = (parseFloat(this.state.dataModel.peilv, 10) / parseFloat(item.item.value.p, 10)).toFixed(2);
                       this.state.dataModel.peilv = cutPeiLV == 1 ? 0 : cutPeiLV;
                       this.state.dataSource.splice(item.index, 1);  //移除对应的数据
                       this.state.dataModel.dataArr = this.state.dataSource;
                       this.state.dataModel.desc = this.state.dataSource.length != 0 ? `${this.state.dataSource.length}串1` : '';

                        this.clearSItemId.push(item.item.value.sectionItemiId); // 记住删除了哪一个，添加比赛返回后刷新界面用到

                       this.setState({
                           dataSource: this.state.dataSource,    //删除某个数据
                           dataModel:this.state.dataModel, //重新赋值模型
                       })
                   }}>
                    <Image style={{width: 25, height: 25}} source={require('../../img/ic_shopCarDelete.png')} />
                </TouchableOpacity>
            </View>
            <View style = {{height:20}}>
                <CusBaseText style = {{marginTop:5, marginLeft:10, fontSize:Adaption.Font(16,13), color:'#676767'}}>
                    {wanfaPlay}: {kStr} <CusBaseText style = {{fontSize:Adaption.Font(16,13), color:'#e33933'}}>
                    @{item.item.value.p}
                </CusBaseText>
                </CusBaseText>
            </View>
            <Image style={{height: 1, width: SCREEN_WIDTH - 40, marginTop: 10}}
                   source={require('../../img/ic_dottedLine.png')}/>
            </View>)
    }

    //每个Cell唯一的Key
    _keyExtractor = (item,index) => {
        return String(index);
    }

    //底部视图
    _listFooterComponent(navigation) {
        return (
            <View style={{
                flexDirection: 'row',
                marginTop: 10,
                paddingBottom: 10,
                height:60,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <TouchableOpacity activeOpacity={1}
                                  style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                                  onPress={() => {
                                      this.setState({isArgree: this.state.isArgree ? false : true});
                                  }}>
                    {this.state.isArgree
                        ? <Image style={{
                            width: Adaption.Width(18),
                            height: Adaption.Width(18),
                            borderColor: 'grey',
                            borderWidth: 1
                        }} source={require('../../img/ic_checkBlue.png')} />
                        : <View style={{
                            borderColor: 'grey',
                            borderWidth: 1,
                            width: Adaption.Width(18),
                            height: Adaption.Width(18)
                        }} />
                    }
                    <CusBaseText style={{fontSize: Adaption.Font(16, 14), color: '#9d9d9d'}}>我已阅读并同意</CusBaseText>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => {
                    navigation.navigate('ServiceArgreement', {title: '体育彩票服务协议'})
                }}>
                    <CusBaseText style={{
                        fontSize: Adaption.Font(15, 13),
                        color: '#00a0e9'
                    }}>《体育彩票服务协议》</CusBaseText>
                </TouchableOpacity>
            </View>
        )
    }

    //体彩下注方法
    _xiaZhuMethod(params){

        this.refs.LoadingView && this.refs.LoadingView.showLoading('下注中...');

        params.append('ac', 'betSport');
        params.append('token', global.UserLoginObject.Token);
        params.append('uid', global.UserLoginObject.Uid);
        params.append('sessionkey', global.UserLoginObject.session_key);
        params.append('game_type', this.props.navigation.state.params.gameType); //gameType 0 默认滚球,1今日，2早盘
        params.append('play_group',  this.props.navigation.state.params.playgroup == 1 ? 4 :  this.props.navigation.state.params.playgroup == 2 ? 5 : this.props.navigation.state.params.playgroup); //playgroup 0让球，4综合过关,5冠军
        params.append('payment_methods', 0);  //默认余额支付

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                this.refs.LoadingView && this.refs.LoadingView.dissmiss();

                if (responseData.msg == 0 && responseData.data){
                    global.UserLoginObject.TotalMoney = responseData.data.price;
                    PushNotification.emit('FBShopCarXiaZhuSuccessNotification');  //下注成功发出通知
                    PushNotification.emit('ClearFootBallGameViewBallNotification');//发出通知清空界面
                    this.props.navigation.goBack();
                }
                else if (responseData.msg == 50012) { //余额不足是否前往充值

                    Alert.alert(
                        '温馨提示',
                        '您的余额不足，是否前往充值',
                        [{
                            text: '确定', onPress: () => {
                                this.props.navigation.navigate('RechargeCenter')
                            }
                        },
                            {
                                text: '取消', onPress: () => {
                            }
                            },
                        ],
                    )
                }
                else {

                    if (responseData.param){
                        this.refs.Toast && this.refs.Toast.show(responseData.param, 1000);
                    }
                }
            })
            .catch((err) => {

            })
    }

    render() {


        let iphoneX = SCREEN_HEIGHT == 812 ? true : false; //是否是iphoneX
        let navHeaderHeight = iphoneX ? 88 : 64;
        let bottomHeight = iphoneX ? 34 : 0;

        return (<View style = {{flex:1, backgroundColor:'#f3f3f3'}}>
            {/* 体彩头部视图 */}
            <FBShopHeaderView
                style = {{height:60, backgroundColor:'#f3f3f3'}}
                goBackToAddRace = {() => {
                    //发出通知清空界面
                    if (this.state.dataSource.length == 0) {
                        PushNotification.emit('ClearFootBallGameViewBallNotification');  // 列表没有数据的；
                    } else if (this.clearSItemId.length > 0) {
                        // 删除掉某几条数据的；
                        PushNotification.emit('RefreshFootBallGameViewBallNotification', this.clearSItemId);  // 列表没有数据的；
                    }
                    this.props.navigation.goBack();
                }}
                clearShopCarList = {() => {

                    if (this.state.dataSource.length == 0){
                        this.refs.Toast &&  this.refs.Toast.show('您的购物车空空如也!', 1000);
                    }
                    else {
                        Alert.alert('温馨提示', '是否清空购物车列表', [{
                            text: '确定', onPress: () => {

                                //清空购物车后重置数据模型dataModel
                                this.state.dataModel.peilv = 0;
                                this.state.dataModel.desc = '';
                                this.state.dataModel.dataArr = [];
                                this.setState({dataSource:[], dataModel:this.state.dataModel});
                                this.refs.Toast && this.refs.Toast.show('清空购物车成功!', 500);
                                PushNotification.emit('ClearFootBallGameViewBallNotification');//发出通知清空界面
                                setTimeout(() => {this.props.navigation.goBack()}, 1000);
                            }
                        }, {text: '取消', onPress: () => {

                        }}]);
                    }
                }}
            />

            {/* 体彩购彩详情列表 */}
            <ImageBackground style = {{marginTop:14, marginLeft:10, marginRight:10, height:SCREEN_HEIGHT  - navHeaderHeight - 60 - bottomHeight - 60 - 110}} source = {require('../../img/ic_NormalHeader.png')} resizeMode="stretch">
                <FlatList
                    style = {{marginTop:10, marginBottom:20}}
                    renderItem={item => this._renderItemView(item)}
                    data={this.state.dataSource.length != 0 ? this.state.dataSource : null}
                    keyExtractor={this._keyExtractor}
                >
                </FlatList>
            </ImageBackground>

            {/* 体彩底部协议视图 */}
            {this._listFooterComponent(this.props.navigation)}

            <FBBottomView  XiaZhuOnPress={(params) => {

                if (global.UserLoginObject.Uid != ''){

                    //综合过关最少要串3关，最多串10关
                    if (this.state.dataSource.length >= 3 && this.state.dataSource.length <= 10) {

                        if (this.xiaZhuClickWating == false){

                            this.xiaZhuClickWating = true;

                            if (params) {

                                this._xiaZhuMethod(params);
                            }

                            setTimeout(()=> {this.xiaZhuClickWating = false},1000);
                        }
                    }
                    else {
                        Alert.alert('温馨提示',  '不符合串关要求,至少要串3关,最大串10关!', [{text:'确定', onPress: () => {}}]);
                    }
                }
                else {
                    Alert.alert(
                        '温馨提示',
                        '您还未登录，是否前往登录页面登录',
                        [
                            {text: '确定', onPress: () => {}},
                            {text: '取消', onPress: () => {}}
                        ])
                }
            }}
            normalPickDataDict = {null}
            zongHePickDataDict = {this.state.dataModel}
            />
            <Toast ref = 'Toast' position='center'/>
            <LoadingView ref='LoadingView'/>
        </View>);
    }
}
