
/**
 Created by Money on 2018/03/21
 足球玩法 投注选号中心
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    SectionList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';
import DyRqDxItemView from './ItemViews/DyRqDxItemView'; // 独赢 让球 大小
import BodanItemView from './ItemViews/BodanItemView';  // 波胆
import BQChangItemView from './ItemViews/BQChangItemView'; // 半/全场
import ZRQiuItemView from './ItemViews/ZRQiuItemView';   // 总入球
import GuanJunItemview from './ItemViews/GuanJunItemview'; // 冠军
import RqDxItemView from './ItemViews/RqDxItemView'; // 让球 / 大小
import ScrocePickList from '../footballTool/ScorcePickListView'; //下拉视图
import PanKouChangeTool from '../footballTool/ScorcePanKouPeilvChange'; //盘口转换的工具

let lastTabIdx = -1;

export default class FBGameCenter extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sectionData: [],  // 当前玩法的数据
            ballsDict: {},  // 选择的号码
            isloading: true,  // 是否显示加载框
            isRefreshing: false,  // 是否在刷新
            isLoadMore: false,  // 是否在加载更多
            footStateText: '',  // '上拉加载更多',
            isHaveData: true,  // 是否有数据
            isLoadFinish: false, // 是否加载完全部数据
            orderIndex: this.props.orderIndex, //排序ID，默认按时间排序
            leagueIds: [], // 联盟IDs
            sport_Id:props.sportID ? props.sportID : 2001, //体彩sportId
            lastTabIdx:props.tabIdx, //记住当前的下标
            currentPickerPanKou:'香港盘', //默认选择的盘口为香港盘
            datePickerList:[],  //日期下拉框数组
            currentDate:'',  //默认请求的全部日期。综合过关需要传
        };

        this.lastLastSItemIdx = '-1+-1';
        this.isUpPullLoadFinish = true;  // 上拉加载是否成功。 防止第一次请求的数据没填充满界面 而触发上拉加载的方法 请求n次第一次成功的时间戳
        this.nextTime = 0;  // 上拉加载 请求用的start_time时间
        this.isReloadDyRqDx = false; // 按联盟 时间 筛选 排序时 重载独赢视图
        this.carBackClearSItemId = []; // 购物车点添加返回的，记录在那边删除的sitemid
        this.currentClickIndex = null;  //当前点击的Item下标
        lastTabIdx = props.tabIdx;
    }

    componentWillReceiveProps(nextProps) {

        // 切换tabbar时 要清空已选数据 和联盟ids 请求新数据
        if (lastTabIdx != nextProps.tabIdx) {
            lastTabIdx = nextProps.tabIdx;
            this.currentClickIndex = null;  //重置状态
            this.state.currentDate = '';  //重置选择的日期
            this.state.lastTabIdx = lastTabIdx;
            this.state.leagueIds = []; // 切换了清空联盟ids

            this.setState({
                ballsDict: {}, // 清空已选数据。
            })
            this._getSportGameList(true, false);// 请求数据
        }

        if (nextProps.currentPanKou != this.state.currentPickerPanKou){
            this.setState({
                currentPickerPanKou:nextProps.currentPanKou,
            })
        }
    }

    componentDidMount() {

        this._getSportGameList(true);// 请求数据

        //体彩界面倒计时结束或者点击重置倒计时
        this.subscription1 = PushNotification.addListener('RefreshFootBallViewDataNotificaiton', (index, leagueIds, tabIndex, isReloadUI)=>{
            this.state.orderIndex = index;
            this.state.leagueIds = leagueIds;

            if (tabIndex == this.props.tabIdx) {

                // 用于按联盟或时间排序时 重载
                // if (isReloadUI) {
                this.state.ballsDict = {}; // 清空。
                this.isShowItemIds = []; // 先置空
                this.isReloadDyRqDx = true;

                /*
                // 默认是展开时，才要重置这个偏移量，现在是不展开，所以这个先预留着。
                if (this.state.sectionData.length > 0) {
                    this.refs.FBSectionList && this.refs.FBSectionList._wrapperListRef._listRef.scrollToOffset({
                        offset: 0,
                        animated: true,
                    });
                }
                */

                this._getSportGameList(true);

                // } else {
                //     this.nextTime2 = 0; // 刷新时重置
                //     //this._getShowItemIds();   // 切换tab 走一次 存住展开的section的标识
                //     this._getSportGameList(true, true);
                // }

                this.setState({
                    isloading: true, // 显示加载框
                })
            }
        });

        //下注成功或者清空号码时收到的通知清空选号界面
        this.subscription2 = PushNotification.addListener('ClearFootBallGameViewBallNotification', (noShopCar) => {
            if (noShopCar == true) {
                // 不是购物车里面发出的通知，不重载。
                this.isReloadDyRqDx = false;
            } else {
                this.isReloadDyRqDx = true;
            }
            this.setState({
                ballsDict: {}, // 清空已选数据。
            })

        });

        // 综合过关 有删除过item后点添加比赛返回的
        this.subscription3 = PushNotification.addListener('RefreshFootBallGameViewBallNotification', (clearSItemId) => {
            this.carBackClearSItemId = clearSItemId;

            for (let a = 0; a < clearSItemId.length; a++) {
                delete this.state.ballsDict[clearSItemId[a]];  // 删除掉在购物车里面删除的货；
            }
            this.setState({
                ballsDict: this.state.ballsDict, // 重新赋值；
            })
        });

        //倒计时组件刷新重新请求的通知
        this.subscription4 = PushNotification.addListener('FBGameCenterTimeLinFreshAPINotification', ()=> {
            // this.currentClickIndex = null;  //重新刷新UI

            if (this.currentClickIndex == null){
                this._getSportGameList(true);
            }
            else {
                this._getLeagueIDListData(this.state.sectionData[this.currentClickIndex]);
            }
        })

    }

    //移除组件
    componentWillUnmount() {

        if (typeof(this.subscription1) == 'object') {
            this.subscription1 && this.subscription1.remove();
        }

        if (typeof(this.subscription2) == 'object'){
            this.subscription2 && this.subscription2.remove();
        }

        if (typeof(this.subscription3) == 'object') {
            this.subscription3 && this.subscription3.remove();
        }

        if (typeof(this.subscription4) == 'object') {
            this.subscription4 && this.subscription4.remove();
        }

        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state,callback) => {
            return;
        }
    }


    // 运彩请求 tabIdx={下标} play_group={群组ID} game_typeID={玩法}
    // isRefresh, isLoadMorePage 都成立 先判断isLoadMorePage。
    _getSportGameList(isRefresh, isLoadMorePage) {


        let params = new FormData();

        params.append('ac', 'getSportLeagueList2');
        params.append("league_id", this.state.leagueIds.length > 0 ? this.state.leagueIds.join(',') : '');
        params.append("game_type",  this.props.game_typeID);
        params.append("sport_id", this.state.sport_Id);
        params.append("play_group", this.props.play_group == 1 ? 4 : this.props.play_group == 2 ? 5 : this.props.play_group);
        params.append("order", this.state.orderIndex);
        params.append('date', '');


        console.log('运彩请求 params == ', isLoadMorePage, params);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                let result = [];
                let dateList = this.state.datePickerList;

                if (responseData.msg == 0) {

                    result = responseData.data.result ? responseData.data.result : [];

                    //初始化时没有赋值的话,日期数组
                    if (dateList.length == 0){
                        dateList = [...['全部日期'], ...responseData.data.date ? responseData.data.date : []];
                        this.setState({datePickerList:dateList});
                    }

                    if (result.length != 0){

                        for (let i = 0; i < result.length; i++){

                            if (this.currentClickIndex == i) {
                                result[i].isHide = false;  // 包含有就展开吧。如果有相同的league_id就出事了，不管了 就这样了；
                            } else {
                                result[i].isHide = true; // 默认都是隐藏
                            }

                            result[i].sectionID = i;  //判断展开的标识
                            result[i].data = [];  // sectionList 好像一定要用data这个字段
                        }

                    }

                } else {
                    this.refs.Toast && this.refs.Toast.show(responseData.param, 2000);
                }

                this.setState({
                    isloading: false,
                    sectionData: result,
                    isRefreshing: false,
                    isHaveData: this.state.sectionData.length > 0 ? true : false,
                });

            })
            .catch((err) => {
                this.isReloadDyRqDx = false;
                this.setState({
                    isloading: false,
                    isRefreshing: false,
                    isLoadMore: false,
                    isHaveData: this.state.sectionData.length > 0 ? true : false,
                    footStateText:  this.state.sectionData.length > 0 ? '上拉加载更多' : '',
                });
            })
    }

    //获取某个联赛的比赛盘口
    _getLeagueIDListData(section){

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在加载数据...');

        let params = new FormData();
        params.append('ac', 'getSportMobileGameList2');
        params.append('league_id', section.section ? section.section.league_id : section.league_id);
        params.append("game_type",  this.props.game_typeID);
        params.append("sport_id", this.state.sport_Id);
        params.append("play_group", this.props.play_group == 1 ? 4 : this.props.play_group == 2 ? 5 : this.props.play_group);
        params.append("order", this.state.orderIndex);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                this.refs.LoadingView && this.refs.LoadingView.dissmiss();

                if (responseData.msg == 0){

                    if (responseData.data.result && responseData.data.result.length != 0){

                        //点击Item展开时的参数多一层
                        if (section.section){

                            section.section.data = this._changeSectiondData(responseData.data.result[0].schedule);

                        }
                        else {

                            //倒计时刷新的参数
                            section.data =  this._changeSectiondData(responseData.data.result[0].schedule);
                        }
                    }
                    else {

                        section.section ? section.section.data = [] : section.data = [];
                        section.section ? section.section.isHide = true : section.isHide = true;  //如果请求不到数据则还是折叠状态
                        this.currentClickIndex = null;  //改为null
                        setTimeout(()=> {this.refs.Toast && this.refs.Toast.show('当前联赛的盘口数据为空!', 3000);}, 1000)
                    }

                    this.setState({
                        sectionData: this.state.sectionData,
                    })

                }

            })

            .catch((error) => {

            })

    }

    //增加HC,GL下相应盘口的字段HK:香港盘,IND:印尼盘,DEC:欧洲盘,MY:马来盘
    _changeSectiondData(data){

        if (data.length != 0){

            for (let i = 0; i < data.length; i++){

                let sportModel = data[i].bet_data; //取到bet_data这一层数据
                let hcData = sportModel.HC ?  sportModel.HC : null;
                let glData = sportModel.GL ? sportModel.GL : null;

                if (hcData){

                    let hchModel = hcData.H[0];
                    let hcvModel = hcData.V[0];

                    hchModel.HK = hchModel.p; //让分HC主香港盘的赔率
                    hchModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '印尼盘');//让分HC主印尼盘的赔率
                    hchModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '马来盘');//让分HC主马来盘的赔率
                    hchModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(hchModel.p, '欧洲盘');//让分HC主欧洲盘的赔率

                    hcvModel.HK = hcvModel.p; //让分HC客香港盘的赔率
                    hcvModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '印尼盘');//让分HC客印尼盘的赔率
                    hcvModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '马来盘');//让分HC客马来盘的赔率
                    hcvModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(hcvModel.p, '欧洲盘');//让分HC客欧洲盘的赔率

                }

                if (glData){

                    let glovModel = glData.OV[0];
                    let glunModel = glData.UN[0];

                    glovModel.HK = glovModel.p; //大小GL主香港盘的赔率
                    glovModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '印尼盘');//大小GL主印尼盘的赔率
                    glovModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '马来盘');//大小GL马来盘的赔率
                    glovModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(glovModel.p, '欧洲盘');//大小GL主欧洲盘的赔率

                    glunModel.HK = glunModel.p; //大小GL客香港盘的赔率
                    glunModel.IND = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '印尼盘');//大小GL客印尼盘的赔率
                    glunModel.MY = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '马来盘');//大小GL客马来盘的赔率
                    glunModel.DEC = PanKouChangeTool.getScorcePankouChangePeilv(glunModel.p, '欧洲盘');//大小GL客欧洲盘的赔率
                }
            }
        }

        return data;
    }

    // 每个section之间的分隔组件
    _sectionSeparatorComponent() {
        return <View style={{ height: 1, width: SCREEN_WIDTH, backgroundColor: '#fff' }} />
    }

    // 分组头部
    _renderSectionHeader(section) {

        if (section.section.sectionID == this.currentClickIndex || this.currentClickIndex == null) {

            return (
                <View style={{height: this.currentClickIndex == null ? Adaption.Height(55) : Adaption.Height(45), backgroundColor: '#fff', width: SCREEN_WIDTH}}>
                    <TouchableOpacity activeOpacity={0.5} style={{
                        borderColor:'#d1d2d3',
                        borderWidth:this.currentClickIndex == null ?  .8 : 1,
                        borderRadius:this.currentClickIndex == null ?  5 : 0,
                        height: Adaption.Height(45),
                        marginLeft: this.currentClickIndex == null ? 10 : 0,
                        width: this.currentClickIndex == null ? SCREEN_WIDTH - 20 : SCREEN_WIDTH,
                        backgroundColor: '#f5f6f7',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                          onPress={() => {

                              if (this.state.sectionData && this.state.sectionData[section.section.sectionID] != null) {
                                  this.state.sectionData[section.section.sectionID].isHide = !this.state.sectionData[section.section.sectionID].isHide;

                                  if (this.state.sectionData[section.section.sectionID].isHide == false){
                                      this.currentClickIndex = section.section.sectionID;
                                      this._getLeagueIDListData(section);

                                  }
                                  else {
                                      this.currentClickIndex = null;
                                      this.setState({
                                          sectionData: this.state.sectionData,
                                      })
                                  }
                              }
                          }}>
                        <View style={{flex: 0.90}}>
                            <Text allowFontScaling={false} style={{
                                marginLeft: 10,
                                fontSize: Adaption.Font(18, 16),
                                fontWeight: '500'
                            }}>{section.section.league_name}</Text>
                        </View>
                        {this.currentClickIndex == null ? <View style={{
                            flex: 0.15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ebebec',
                            height: Adaption.Height(45)
                        }}>
                            <Text allowFontScaling={false} style={{color: '#000', fontWeight: '500', fontSize: Adaption.Font(19, 17)}}>
                                {section.section.game_cnt}
                            </Text>
                        </View> : <View style = {{flex:0.10, alignItems:'flex-end'}}>
                            <Image style = {{height:15, width:15, marginRight:10}} source={require('../img/arrowUp.png')}/>
                        </View>}
                    </TouchableOpacity>
                </View>)
        }
        else {
            return null;
        }

    }

    _renderItemView = (item) =>{
        // 如果是隐藏 返回null
        if (item.section.isHide) {
            return null;

        } else {

            let cuntSItemIdx =`${item.section.sectionID}+${item.index}`; // 当前的SectionID+Item.index
            let lastSItemIdx = Object.values(this.state.ballsDict)[0] ? Object.values(this.state.ballsDict)[0].sectionItemiId : '-1+-1'; // 上次选择的SectionID+Item.index
            let lastIdx = Object.values(this.state.ballsDict)[0] ? Object.values(this.state.ballsDict)[0].sltIdx : -1; // 上次选择的下标

            {/* 0独赢， 1波胆， 2半场/全场，3总入球 */}
            if (this.props.play_group == 2) {
                // 冠军
                let chpData = item.item.bet_data['CHP'];
                if (chpData == null) {
                    return null;
                }

                let row = Math.ceil(chpData.length / 2.0);  // 行
                return (
                    <GuanJunItemview data={item.item} style={{ height: Adaption.Height(40 + row * 50) }}
                                     cuntSItemId={cuntSItemIdx}
                                     lastSItemId={lastSItemIdx}
                                     lastLastSItemIdx={this.lastLastSItemIdx}
                                     lastIdx={lastIdx}
                                     ballsClick={(ballsDic) => {
                                         this._handleBallsDict(ballsDic, item);
                                     }}
                    >
                    </GuanJunItemview>
                )

            } else if (this.props.play_group == 0 || this.props.play_group == 1) {
                // 独赢 让球 大小
                let values = Object.values(this.state.ballsDict);
                let sectionItemiIdArr = [], sltIdxArr = [], isFulltimeArr = [];
                for (let a = 0; a < values.length; a++) {
                    sectionItemiIdArr.push(values[a].sectionItemiId);
                    sltIdxArr.push(values[a].sltIdx);
                    isFulltimeArr.push(values[a].isFullTime);
                }
                if (values.length <= 0)  {
                    sectionItemiIdArr = ['-1+-1'], sltIdxArr = [-1], isFulltimeArr = true;
                }

                let callback = false;
                if (this.callbackSItemId && this.callbackSItemId == cuntSItemIdx) {
                    this.callbackSItemId = ''; // 执行后 赋空值。
                    callback = true;  // 回调回来的 重置这个itemview的界面
                }

                if (this.carBackClearSItemId.length > 0) {
                    // 购物车点添加返回的，清空这个item界面
                    if (this.carBackClearSItemId.includes(cuntSItemIdx)) {
                        callback = true;
                    }
                }

                // 40 + 140(格高50) + 40.
                return(
                    <RqDxItemView data={item.item} style={{ height: Adaption.Height(220) }}
                                  isReload={this.isReloadDyRqDx}
                                  game_typeID={this.props.game_typeID}
                                  tabIdx={this.state.lastTabIdx}
                                  cuntSItemId={cuntSItemIdx}
                                  lastSItemIdArr={sectionItemiIdArr}
                                  lastIdxArr={sltIdxArr}
                                  isAllBetCallback={callback}
                                  selectPanKou={this.state.currentPickerPanKou}
                                  lastLastSItemIdx={this.lastLastSItemIdx}
                                  allPlayClick={() => {
                                      this._allGameClick(item);
                                  }}
                                  ballsClick={(ballsDic) => {
                                      this._handleBallsDict(ballsDic, item);
                                  }}
                    >
                    </RqDxItemView>
                )

            } else {
                return <View></View>
            }
        }
    }

    _allGameClick = (item) => {
        // 所有玩法。

        let cuntSItemIdx =`${item.section.sectionID}+${item.index}`; // 当前的SectionID+Item.index
        let sltData = this.state.ballsDict[cuntSItemIdx];
        let sltDic = {};
        if (sltData != null && this.props.game_typeID == 3) {  // 综合过关呢 要把选择状态记下 过去要显示出来。

            sltDic['d_key'] = sltData['playMethod'];

            // 记录选择的idx
            if (0) {
                // 旧的进这里（独赢/让球/大小）
                if (sltData['allbetSltIdx']) { // 如果有所有玩法里面的sltIdx就直接用它
                    sltDic['sltIdx'] = sltData['allbetSltIdx'];
                } else if (sltDic['d_key'].includes('1X2')) {
                    sltDic['sltIdx'] = sltData['sltIdx']; // 独赢
                } else if (sltDic['d_key'].includes('HC')) {
                    sltDic['sltIdx'] = sltData['sltIdx'] == 3 ? 0 : 1; // 让球
                } else if (sltDic['d_key'].includes('GL')) {
                    sltDic['sltIdx'] = sltData['sltIdx'] == 6 ? 0 : 1;  // 大小
                } else if (sltDic['d_key'].includes('TGOE')) {
                    sltDic['sltIdx'] = sltData['sltIdx'] == 9 ? 0 : 1;  // 单双
                } else {
                    sltDic['sltIdx'] = 0;
                }

            } else {
                // 新的进这里（让球/大小）
                if (sltData['allbetSltIdx']) { // 如果有所有玩法里面的sltIdx就直接用它
                    sltDic['sltIdx'] = sltData['allbetSltIdx'];
                } else if (sltDic['d_key'].includes('HC')) {
                    sltDic['sltIdx'] = sltData['sltIdx']; // 让球
                } else if (sltDic['d_key'].includes('GL')) {
                    sltDic['sltIdx'] = sltData['sltIdx'] == 2 ? 0 : 1;  // 大小
                } else {
                    sltDic['sltIdx'] = 0;
                }
            }
        }

        let backupSltDic = {};
        // if (this.props.game_typeID == 3) {
        //     // 把这个盘口的基本数据传进去 供有选择号码后使用。 然后剩下的事情 就在FBGamePassBottom里面搞了。
        //     backupSltDic = {
        //         data: item.item, sectionItemiId: cuntSItemIdx,
        //         league_id: this.state.sectionData[item.section.sectionID].league_id,
        //         league_name: this.state.sectionData[item.section.sectionID].league_name,
        //         playMethod: '', isFullTime: true, isHVXO: '', k: '', p: '', sltIdx: -1, // 这几个都是不确定的，选择号码才能确定。
        //     };
        // }

        this.props.navigate('FBAllGame', {
            sport_id: this.state.sport_Id, nowGameData: item.item, game_type: this.props.game_typeID,
            sltDic: sltDic,
            allSltDic: this.props.tabIdx == 1 ? this.state.ballsDict : null, //综合过关
            backupSltDic: this.props.tabIdx == 1 ? backupSltDic : null,
            leagueData:item.section.league_name,
            tabIdx:this.props.tabIdx,
            play_group:this.props.play_group,
            selecctPanKou:this.state.currentPickerPanKou,
            callback: (data, callbackSItemId) => {
                console.log('回调 === ', callbackSItemId, data);
                this.callbackSItemId = callbackSItemId;  // 从所有玩法回调回去的，独赢界面要按照传进去的lastidx的值去改变选择状态。
                this.props.ballsDictClick ? this.props.ballsDictClick(data) : null;
                this.props.AllDataBlock ? this.props.AllDataBlock() : null;
                this.setState({
                    ballsDict: data,
                })
            },
        });
    }

    _handleBallsDict(ballsDic, item) {

        this.lastLastSItemIdx = Object.values(this.state.ballsDict)[0] ? Object.values(this.state.ballsDict)[0].sectionItemiId : '-1+-1'; // 上上次选择的SectionID+Item.index

        this.isReloadDyRqDx = false; // 选择过号码后 重置。
        let key = Object.keys(ballsDic)[0];
        if (key) {
            ballsDic[key]['data'] = item.item;
            ballsDic[key]['sectionItemiId'] = `${item.section.sectionID}+${item.index}`;
            ballsDic[key]['league_id'] = this.state.sectionData[item.section.sectionID].league_id;
            ballsDic[key]['league_name'] = this.state.sectionData[item.section.sectionID].league_name;
        }

        if (this.props.tabIdx == 1) {
            // 综合过关
            if (key == null) {
                key = `${item.section.sectionID}+${item.index}`;
            }
            delete this.state.ballsDict[key]; // 不直接assign，因为他会保留前面存的那个值。
            Object.assign(ballsDic, this.state.ballsDict);
        }

        console.log('ballsDic == ', ballsDic);

        this.props.ballsDictClick ? this.props.ballsDictClick(ballsDic) : null;

        this.setState({
            ballsDict: ballsDic,
        })
    }

    _listEmptyComponent() {
        if (!this.state.isHaveData) {
            return (
                <View style={{ height: 300, justifyContent: 'center', alignItems: 'center'}}>
                    <Text allowFontScaling={false} style={{fontSize: 30}}>暂无数据！</Text>
                </View>
            );
        } else {
            return <View />
        }
    }

    render() {

        if (this.props.maintenance && this.state.sectionData.length <= 0 && this.state.isloading == false) {
            return (
                <View style = {{width:SCREEN_WIDTH, height:SCREEN_HEIGHT - 110, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style = {{width: Adaption.Width(250), height: Adaption.Width(200), resizeMode: 'contain'}} source={require('../img/ic_sportVerbSystem.png')} />
                    <CusBaseText style = {{margin: Adaption.Width(20), marginTop: Adaption.Width(50), fontSize:Adaption.Font(20, 16), color: '#4d4e4f', lineHeight: Adaption.Width(30)}}>
                        {`抱歉！系统正在维护，暂停下注！如有什么疑问请联系客服！\n预计维护时间：`}
                        <CusBaseText style = {{color:'#fd730a', lineHeight: Adaption.Width(35)}}>{this.props.maintenanceTime}</CusBaseText>
                    </CusBaseText>
                </View>
            )
        }


        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>

                {this.state.isloading
                    ? <ActivityIndicator animating={true} size="large" color={'#000'}
                                         style={{
                                             position: 'absolute',
                                             left: SCREEN_WIDTH / 2 - 18,
                                             top: Adaption.Height(200),
                                         }}/>
                    : <SectionList style={{marginTop:this.props.tabIdx == 2 || this.currentClickIndex != null ? 0 : 70}}
                                   ref='FBSectionList'
                                   SectionSeparatorComponent={() => this._sectionSeparatorComponent()} // section的顶底部视图
                                   renderSectionHeader={(section) => this._renderSectionHeader(section)} // section头部的视图
                                   renderItem={(item) => this._renderItemView(item)}
                                   sections={this.state.sectionData}
                                   keyExtractor={(item,index)=>{return String(index)}}
                                   refreshing={this.state.isRefreshing}  // 是否处于刷新状态。
                                   ListEmptyComponent={() => this._listEmptyComponent()}
                                   extraData={this.state} //有时候setState界面没刷新。需要强制刷新
                    >
                    </SectionList>
                }

                {this.currentClickIndex == null ? this.props.tabIdx == 0 ? <View style = {{backgroundColor:'#fff', position:'absolute',}}>
                    <ScrocePickList
                        viewType={'rollingType'}
                        style = {{marginLeft:10, width:SCREEN_WIDTH - 20, height:50}} dataSource={['时间筛选','联盟筛选']}
                        dropDownItemSelect = {(itemObject)=>{
                            this.state.orderIndex = itemObject.index;
                            this._getSportGameList(true);// 请求数据
                        }}
                    />
                </View> : this.props.tabIdx == 1 ? <View style = {{flexDirection:'row', position:'absolute'}}>
                    <ScrocePickList
                        viewType={'dateType'}
                        style = {{marginLeft:10, width:SCREEN_WIDTH/2 - 20, height:50}} dataSource={this.state.datePickerList}
                        dropDownItemSelect = {(itemObject)=>{

                            if (itemObject.index == 0){
                                this.state.currentDate = '';
                            }
                            else {
                                this.state.currentDate = itemObject.item;
                            }
                            this._getSportGameList(true);// 请求数据
                        }}
                    />
                    <ScrocePickList
                        viewType={'todayType'}
                        style = {{marginLeft:20, width:SCREEN_WIDTH/2 - 20, height:50}} dataSource={['时间筛选','联盟筛选']}
                        dropDownItemSelect = {(itemObject)=>{
                            this.state.orderIndex = itemObject.index;
                            this._getSportGameList(true);// 请求数据
                        }}
                    />
                </View> : null : null}
                <LoadingView ref='LoadingView'/>
                <Toast ref="Toast" position='center'/>
            </View>
        );
    }
}