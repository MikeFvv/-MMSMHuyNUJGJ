
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
        };

        this.isShowItemIds = [];  // 刷新数据时 记录展开的league_id
        this.lastLastSItemIdx = '-1+-1';
        this.isUpPullLoadFinish = true;  // 上拉加载是否成功。 防止第一次请求的数据没填充满界面 而触发上拉加载的方法 请求n次第一次成功的时间戳
        this.nextTime = 0;  // 上拉加载 请求用的start_time时间
        this.nextTime2 = 0;  // 备作 当前不是在第一页时，刷新多页用
        this.backupData = [];
        this.isReloadDyRqDx = false; // 按联盟 时间 筛选 排序时 重载独赢视图
        this.carBackClearSItemId = []; // 购物车点添加返回的，记录在那边删除的sitemid
        lastTabIdx = props.tabIdx;
    }

    componentWillReceiveProps(nextProps) {

        // 切换tabbar时 要清空已选数据 和联盟ids 请求新数据
        if (lastTabIdx != nextProps.tabIdx) {
            lastTabIdx = nextProps.tabIdx;
            this.state.leagueIds = []; // 切换了清空联盟ids
            this.nextTime = 0;  // 重置
            this.nextTime2 = 0; 
            this._getShowItemIds(); // 切换也走一次吧， 存住展开的section的标识

            /*
            // 默认是展开时，才要重置这个偏移量，现在是不展开，所以这个先预留着。
            if (this.state.sectionData.length > 0) {
                // 滚动偏移重置为0
                this.refs.FBSectionList && this.refs.FBSectionList._wrapperListRef._listRef.scrollToOffset({
                    offset: 0,
                    animated: true,
                });
            }
            */

            this.setState({
                ballsDict: {}, // 清空已选数据。
            })
            this._getSportGameList(true, false);// 请求数据 
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
                if (isReloadUI) {
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
                    
                } else {
                    this.nextTime2 = 0; // 刷新时重置
                    this._getShowItemIds();   // 切换tab 走一次 存住展开的section的标识
                    this._getSportGameList(true, true);
                }

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
    }

    _getShowItemIds() {
        // 刷新前 获取是展开的section的标识 league_id，数据请求成功后使用。
        this.isShowItemIds = []; // 先置空
        for (let a = 0; a < this.state.sectionData.length; a++) {
            let leagueDic = this.state.sectionData[a];
            if (leagueDic.isHide == false) { // 把不隐藏 就是展开的联赛ID记下，刷新数据是要把他展开。
                this.isShowItemIds.push(leagueDic.league_id); 
            }
        }
    }

    // 运彩请求 tabIdx={下标} play_group={群组ID} game_typeID={玩法}
    // isRefresh, isLoadMorePage 都成立 先判断isLoadMorePage。
    _getSportGameList(isRefresh, isLoadMorePage) {
        let params = new FormData();
        params.append("ac", "getSportMobileGameList");
        params.append("sport_id", this.state.sport_Id); //体育类型id
        params.append("game_type", this.props.game_typeID); // 0滚球、1今日、2早盘、3综合、4冠军
        params.append("play_group", this.props.game_typeID == 4 ? '' : this.props.play_group);  // 0独赢， 1波胆， 2半场/全场，3总入球 冠军不传入playgroups
        params.append("league_id", this.state.leagueIds.length > 0 ? this.state.leagueIds.join(',') : '');  // 联盟id，逗号隔开
        if (this.props.game_typeID == 0) {
            params.append("start_time", 0);
            params.append("end_time", isLoadMorePage ? this.nextTime2 : isRefresh ? 0 : this.nextTime ? this.nextTime : 0);  // 滚球用 结束时间
        } else {
            params.append("start_time", isLoadMorePage ? this.nextTime2 : isRefresh ? 0 : this.nextTime ? this.nextTime : 0);  // 开始时间
            params.append("end_time", 0);
        }
        params.append("date", "");
        params.append("order", this.state.orderIndex);

        console.log('运彩请求 params == ', isLoadMorePage, params);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                let result = [];
                
                if (responseData.msg == 0) {
                    result = responseData.data.result ? responseData.data.result : [];

                    for (let i = 0; i < result.length; i++) {
                        result[i].sectionID = isLoadMorePage && this.nextTime2 == 0 ? i : isLoadMorePage && this.nextTime2 > 0 ? this.state.sectionData.length + i : isRefresh ? i : this.state.sectionData.length + i;
                        if (this.isShowItemIds.includes(result[i].league_id)) {
                            result[i].isHide = false;  // 包含有就展开吧。如果有相同的league_id就出事了，不管了 就这样了；
                        } else {
                            result[i].isHide = true; // 默认都是隐藏
                        }
                        result[i].data = result[i].schedule;  // sectionList 好像一定要用data这个字段
                        delete result[i].schedule;


                        if (this.props.play_group == 0) { // 独赢

                            let equalCount = 0;
                            for (let j = 0; j < result[i].data.length; j++) {
                                let schedule_id = result[i].data[j]['schedule_id'];
                                let next_schedule_id = result[i].data[j+1] ? result[i].data[j+1]['schedule_id'] : '00000';
                        
                                if (schedule_id == next_schedule_id) {
                                    if (equalCount == 0) {
                                        result[i].data[j]['equal'] = equalCount;  // 0
                                        equalCount += 1;
                                    }
                        
                                    result[i].data[j+1]['equal'] = equalCount;  // 1...
                                    equalCount += 1;
                                    
                                } else {
                                    equalCount = 0;
                                }
                            }
                        }
                    }
                } else {
                    this.refs.Toast && this.refs.Toast.show(responseData.param, 2000);
                }
                
                if (isLoadMorePage && result.length > 0) {
                    
                    if (responseData.data != null) {

                        if (this.nextTime2 <= 0) {
                            this.backupData = this.state.sectionData;
                            this.state.sectionData = [];
                        }

                        this.state.sectionData = [...this.state.sectionData, ...result];
                        this.nextTime2 = responseData.data.next_time;
                        console.log('nextTime2 == ', this.nextTime2);

                        if (this.nextTime2 >= this.nextTime || result.length <= 0) {
                            console.log('LoadMorePage == ', this.state.sectionData);
                            
                            if (this.props.play_group == 0) {
                                this.state.sectionData = this._handleDyPeilvUDE(this.state.sectionData);
                            }

                            this.setState({
                                isloading: false,
                                sectionData: this.state.sectionData,
                                isRefreshing: false,
                            })
                        } else {
                            this._getSportGameList(true, true);
                        }
                    }

                } else {
                    
                    if (result.length <= 0 && this.state.sectionData.length > 0) {
                        // 本次请求为空，并且已请有数据，是加载完了
                        this.state.isLoadFinish = true;
                    } else {
                        this.state.isLoadFinish = false;
                        this.nextTime = responseData.data ? responseData.data.next_time : 0;
                        console.log('nextTime == ', this.nextTime);
                    }

                    if (!isRefresh) {
                        // 上拉加载的 数据要合并。 并且不是加载完毕时
                        result = [...this.state.sectionData, ...result];
                    }

                    this.isReloadDyRqDx = false; 
                    this.isUpPullLoadFinish = true;

                    console.log('运彩请求 result == ', result);
                    this.setState({
                        isloading: false,
                        sectionData: result,
                        isRefreshing: false,
                        isLoadMore: false,
                        isHaveData: result.length > 0 ? true : false,
                        footStateText: this.state.isLoadFinish && result.length > 0 ? '数据已全部加载完' : result.length > 0 ? '上拉加载更多' : '',
                    });
                }
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


    _handleDyPeilvUDE(currentData) {
        // 涨u  跌d  平e
        console.log('backupData == ', this.backupData);

        let isFindOut = false; // 查到相同的 所有旧数据循环都跳出。

        for (let a = 0; a < currentData.length; a++) {
            let dict_a = currentData[a];

            for (let b = 0; b < dict_a.data.length; b++) {
                let dict_b = dict_a.data[b];
                let schedule_id_b = dict_b.schedule_id;
                let bet_data_b = dict_b.bet_data;
                isFindOut = false;

                for (let a1 = 0; a1 < this.backupData.length; a1++) {
                    let dict_a1 = this.backupData[a1];

                    for (let b1 = 0; b1 < dict_a1.data.length; b1++) {
                        let dict_b1 = dict_a1.data[b1];
                        let schedule_id_b1 = dict_b1.schedule_id;
                        let bet_data_b1 = dict_b1.bet_data;

                        if (schedule_id_b == schedule_id_b1) {
                            
                            isFindOut = true;

                            let b_1X2 = bet_data_b['1X2'];
                            let b1_1X2 = bet_data_b1['1X2'];
                            if (b_1X2 && b_1X2.length == 3 && b1_1X2 && b1_1X2.length == 3) {

                                for (let c1 = 0; c1 < b_1X2.length; c1++) {
                                
                                    if (b_1X2[c1]['p'] && b1_1X2[c1]['p']) {
                                        if (parseFloat(b_1X2[c1]['p']) > parseFloat(b1_1X2[c1]['p'])) {
                                            b_1X2[c1]['t'] = 'u';  // 涨
                                        } else if (parseFloat(b_1X2[c1]['p']) < parseFloat(b1_1X2[c1]['p'])) {
                                            b_1X2[c1]['t'] = 'd';  // 跌
                                        } else {
                                            b_1X2[c1]['t'] = 'e';  // 平
                                        } 
                                    }
                                }
                                currentData[a].data[b].bet_data['1X2'] = b_1X2;
                            } 

                            let b_H1X2 = bet_data_b['H1X2'];
                            let b1_H1X2 = bet_data_b1['H1X2'];
                            if (b_H1X2 && b_H1X2.length == 3 && b1_H1X2 && b1_H1X2.length == 3) {

                                for (let c1 = 0; c1 < b_H1X2.length; c1++) {
                                
                                    if (b_H1X2[c1]['p'] && b1_H1X2[c1]['p']) {
                                        if (parseFloat(b_H1X2[c1]['p']) > parseFloat(b1_H1X2[c1]['p'])) {
                                            b_H1X2[c1]['t'] = 'u';  // 涨
                                        } else if (parseFloat(b_H1X2[c1]['p']) < parseFloat(b1_H1X2[c1]['p'])) {
                                            b_H1X2[c1]['t'] = 'd';  // 跌
                                        } else {
                                            b_H1X2[c1]['t'] = 'e';  // 平
                                        } 
                                    }
                                }
                                currentData[a].data[b].bet_data['H1X2'] = b_H1X2;
                            } 

                            let b_HC = bet_data_b['HC'];
                            let b1_HC = bet_data_b1['HC'];
                            if (b_HC && b1_HC) {
                                if (b_HC['H'] && b1_HC['H']) {

                                    if (parseFloat(b_HC['H']['p']) > parseFloat(b1_HC['H']['p'])) {
                                        b_HC['H']['t'] = 'u';  // 涨
                                    } else if (parseFloat(b_HC['H']['p']) < parseFloat(b1_HC['H']['p'])) {
                                        b_HC['H']['t'] = 'd';  // 跌
                                    } else {
                                        b_HC['H']['t'] = 'e';  // 平
                                    }
                                    currentData[a].data[b].bet_data['HC'] = b_HC;
                                }
                                
                                if (b_HC['V'] && b1_HC['V']) {

                                    if (parseFloat(b_HC['V']['p']) > parseFloat(b1_HC['V']['p'])) {
                                        b_HC['V']['t'] = 'u';  // 涨
                                    } else if (parseFloat(b_HC['V']['p']) < parseFloat(b1_HC['V']['p'])) {
                                        b_HC['V']['t'] = 'd';  // 跌
                                    } else {
                                        b_HC['V']['t'] = 'e';  // 平
                                    }
                                    currentData[a].data[b].bet_data['HC'] = b_HC;
                                }
                            }

                            let b_HHC = bet_data_b['HHC'];
                            let b1_HHC = bet_data_b1['HHC'];
                            if (b_HHC && b1_HHC) {
                                if (b_HHC['H'] && b1_HHC['H']) {

                                    if (parseFloat(b_HHC['H']['p']) > parseFloat(b1_HHC['H']['p'])) {
                                        b_HHC['H']['t'] = 'u';  // 涨
                                    } else if (parseFloat(b_HHC['H']['p']) < parseFloat(b1_HHC['H']['p'])) {
                                        b_HHC['H']['t'] = 'd';  // 跌
                                    } else {
                                        b_HHC['H']['t'] = 'e';  // 平
                                    }
                                    currentData[a].data[b].bet_data['HHC'] = b_HHC;
                                }

                                if (b_HHC['V'] && b1_HHC['V']) {

                                    if (parseFloat(b_HHC['V']['p']) > parseFloat(b1_HHC['V']['p'])) {
                                        b_HHC['V']['t'] = 'u';  // 涨
                                    } else if (parseFloat(b_HHC['V']['p']) < parseFloat(b1_HHC['V']['p'])) {
                                        b_HHC['V']['t'] = 'd';  // 跌
                                    } else {
                                        b_HHC['V']['t'] = 'e';  // 平
                                    }
                                    currentData[a].data[b].bet_data['HHC'] = b_HHC;
                                }
                            }

                            let b_GL = bet_data_b['GL'];
                            let b1_GL = bet_data_b1['GL'];
                            if (b_GL && b1_GL) {
                                if (b_GL['OV'] && b1_GL['OV']) {

                                    if (parseFloat(b_GL['OV']['p']) > parseFloat(b1_GL['OV']['p'])) {
                                        b_GL['OV']['t'] = 'u';  // 涨
                                    } else if (parseFloat(b_GL['OV']['p']) < parseFloat(b1_GL['OV']['p'])) {
                                        b_GL['OV']['t'] = 'd';  // 跌
                                    } else {
                                        b_GL['OV']['t'] = 'e';  // 平
                                    }
                                    currentData[a].data[b].bet_data['GL'] = b_GL;
                                }
                                
                                if (b_GL['UN'] && b1_GL['UN']) {

                                    if (parseFloat(b_GL['UN']['p']) > parseFloat(b1_GL['UN']['p'])) {
                                        b_GL['UN']['t'] = 'u';  // 涨
                                    } else if (parseFloat(b_GL['UN']['p']) < parseFloat(b1_GL['UN']['p'])) {
                                        b_GL['UN']['t'] = 'd';  // 跌
                                    } else {
                                        b_GL['UN']['t'] = 'e';  // 平
                                    }
                                    currentData[a].data[b].bet_data['GL'] = b_GL;
                                }
                            }

                            let b_HGL = bet_data_b['HGL'];
                            let b1_HGL = bet_data_b1['HGL'];
                            if (b_HGL && b1_HGL) {
                                if (b_HGL['OV'] && b1_HGL['OV']) {

                                    if (parseFloat(b_HGL['OV']['p']) > parseFloat(b1_HGL['OV']['p'])) {
                                        b_HGL['OV']['t'] = 'u';  // 涨
                                    } else if (parseFloat(b_HGL['OV']['p']) < parseFloat(b1_HGL['OV']['p'])) {
                                        b_HGL['OV']['t'] = 'd';  // 跌
                                    } else {
                                        b_HGL['OV']['t'] = 'e';  // 平
                                    }
                                    currentData[a].data[b].bet_data['HGL'] = b_HGL;
                                }
                                
                                if (b_HGL['UN'] && b1_HGL['UN']) {

                                    if (parseFloat(b_HGL['UN']['p']) > parseFloat(b1_HGL['UN']['p'])) {
                                        b_HGL['UN']['t'] = 'u';  // 涨
                                    } else if (parseFloat(b_HGL['UN']['p']) < parseFloat(b1_HGL['UN']['p'])) {
                                        b_HGL['UN']['t'] = 'd';  // 跌
                                    } else {
                                        b_HGL['UN']['t'] = 'e';  // 平
                                    }
                                    currentData[a].data[b].bet_data['HGL'] = b_HGL;
                                }
                            }


                            let b_TGOE = bet_data_b['TGOE'];
                            let b1_TGOE = bet_data_b1['TGOE'];
                            if (b_TGOE && b_TGOE.length == 2 && b1_TGOE && b1_TGOE.length == 2) {

                                for (let c2 = 0; c2 < b_TGOE.length; c2++) {
                                
                                    if (b_TGOE[c2]['p'] && b1_TGOE[c2]['p']) {
                                        if (parseFloat(b_TGOE[c2]['p']) > parseFloat(b1_TGOE[c2]['p'])) {
                                            b_TGOE[c2]['t'] = 'u';  // 涨
                                        } else if (parseFloat(b_TGOE[c2]['p']) < parseFloat(b1_TGOE[c2]['p'])) {
                                            b_TGOE[c2]['t'] = 'd';  // 跌
                                        } else {
                                            b_TGOE[c2]['t'] = 'e';  // 平
                                        } 
                                    }
                                }
                                currentData[a].data[b].bet_data['TGOE'] = b_TGOE;
                            } 

                            let b_HTGOE = bet_data_b['HTGOE'];
                            let b1_HTGOE = bet_data_b1['HTGOE'];
                            if (b_HTGOE && b_HTGOE.length == 2 && b1_HTGOE && b1_HTGOE.length == 2) {

                                for (let c2 = 0; c2 < b_HTGOE.length; c2++) {
                                
                                    if (b_HTGOE[c2]['p'] && b1_HTGOE[c2]['p']) {
                                        if (parseFloat(b_HTGOE[c2]['p']) > parseFloat(b1_HTGOE[c2]['p'])) {
                                            b_HTGOE[c2]['t'] = 'u';  // 涨
                                        } else if (parseFloat(b_HTGOE[c2]['p']) < parseFloat(b1_HTGOE[c2]['p'])) {
                                            b_HTGOE[c2]['t'] = 'd';  // 跌
                                        } else {
                                            b_HTGOE[c2]['t'] = 'e';  // 平
                                        } 
                                    }
                                }
                                currentData[a].data[b].bet_data['HTGOE'] = b_HTGOE;
                            } 

                            this.backupData[a1].data.splice(b1, 1); // 删除已经比对过的数据。可避免下次拿到重复的schedule_id
                            break;
                        }
                        
                    }

                    if (isFindOut) {
                        break;
                    }
                }
            }
        }

        console.log('currentData t值改变后 ==== == ', currentData);
        return currentData;
    }

    // 下拉刷新
    _onRefresh() {
        this.setState({ isRefreshing: true }); 
        this.state.isLoadFinish = false;
        this.nextTime2 = 0; // 刷新时重置
        this._getShowItemIds(); // 走一次 存住展开的section的标识
        this._getSportGameList(true, true);
        this.props.downPullRefresh ? this.props.downPullRefresh() : null; // 回调改变倒计时
    }

    // 上拉加载更多
    _onEndReached(info) {

        if (this.state.sectionData.length <= 0 || this.state.isLoadFinish) {
            return;
        }

        // 要等上个请求完 才能继续请求这次的上拉请求。
        if (this.isUpPullLoadFinish) {
            this.setState({ 
                isLoadMore: true,
                footStateText: '正在加载更多数据',
            }); 

            this.isUpPullLoadFinish = false;  // 请求成功 给this.nextTime赋后 重置为true
            this._getSportGameList(false);
         }
    }


    // 每个section之间的分隔组件
    _sectionSeparatorComponent() {
        return <View style={{ height: 1, width: SCREEN_WIDTH, backgroundColor: '#fff' }}></View>
    }

    // 尾部视图
    _listFooterComponent() {
        return (
            <View style={{height: 40, width: SCREEN_WIDTH, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                {this.state.isLoadMore ? <ActivityIndicator animating={this.state.isLoadMore} size="small"></ActivityIndicator> : null}
                <Text allowFontScaling={false} style={{fontSize: Adaption.Font(18), marginLeft: 10, color: '#707070'}}>{this.state.footStateText}</Text>
            </View>
        )
    }

    // 分组头部
    _renderSectionHeader(section) {
        return (
            <TouchableOpacity activeOpacity={0.5} style={{ height: Adaption.Height(45), width: SCREEN_WIDTH, backgroundColor: '#f6f6f6', alignItems: 'center', flexDirection: 'row' }}
                onPress={() => {
                    if (this.state.sectionData && this.state.sectionData[section.section.sectionID] != null) {
                        this.state.sectionData[section.section.sectionID].isHide = !this.state.sectionData[section.section.sectionID].isHide;
                        this.setState({
                            sectionData: this.state.sectionData,
                        })
                    }
                }}>
                <View style={{ flex: 0.93, marginLeft: 10 }}>
                    <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(18, 16), fontWeight: '500' }}>{section.section.league_name}</Text>
                </View>
                <View style={{ flex: 0.07 }}>
                    <Image style={{ width: 13, height: 13 }}
                        source={section.section.isHide ? require('../img/arrowDown.png') : require('../img/arrowUp.png')}
                    ></Image>
                </View>
            </TouchableOpacity>
        )
    }

    _renderItemView(item) {
        // 如果是隐藏 返回null
        if (item.section.isHide) {
            return null;

        } else {

            let cuntSItemIdx =`${item.section.sectionID}+${item.index}`; // 当前的SectionID+Item.index
            let lastSItemIdx = Object.values(this.state.ballsDict)[0] ? Object.values(this.state.ballsDict)[0].sectionItemiId : '-1+-1'; // 上次选择的SectionID+Item.index
            let lastIdx = Object.values(this.state.ballsDict)[0] ? Object.values(this.state.ballsDict)[0].sltIdx : -1; // 上次选择的下标

            {/* 0独赢， 1波胆， 2半场/全场，3总入球 */}
            if (this.props.tabLabel == '冠军') {
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

            } else if (this.props.play_group == 0) {
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

                // 新的。。。让球 / 大小。 0滚球、1今日... 现在只能给QA进入
                // if (GlobalConfig.lineBaseIPURL().includes('sg04')) {
                    // 40 + 140(格高50) + 40.
                    return(
                        <RqDxItemView data={item.item} style={{ height: Adaption.Height(220) }} 
                            isReload={this.isReloadDyRqDx}
                            game_typeID={this.props.game_typeID}
                            cuntSItemId={cuntSItemIdx}
                            lastSItemIdArr={sectionItemiIdArr}
                            lastIdxArr={sltIdxArr}
                            isAllBetCallback={callback}
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
                // }

                return (
                    <DyRqDxItemView isReload={this.isReloadDyRqDx} data={item.item} style={{ height: Adaption.Height(260) }}
                        game_typeID={this.props.game_typeID}  // 0滚球、1今日、2早盘、3综合、4冠军
                        lastFullTimeArr={isFulltimeArr}  // 上次选择的是全场/半场
                        cuntSItemId={cuntSItemIdx}
                        lastSItemIdArr={sectionItemiIdArr}
                        lastIdxArr={sltIdxArr}
                        isAllBetCallback={callback}
                        lastLastSItemIdx={this.lastLastSItemIdx}
                        allPlayClick={() => {
                            this._allGameClick(item);
                        }}
                        ballsClick={(ballsDic) => {
                            this._handleBallsDict(ballsDic, item);
                        }}
                    >
                    </DyRqDxItemView>
                )

            } else if (this.props.play_group == 1) {
                // 波胆
                let itemData = item.item.bet_data[this.props.tabIdx == 2 ? 'HTCS' : 'TCS'];
                if (itemData == null) {
                    return null;
                }
                return (
                    <BodanItemView data={item.item} style={{ height: Adaption.Height(310) }}
                        isHalf={this.props.tabIdx == 2 ? true : false} // 是不是半场
                        cuntSItemId={cuntSItemIdx}
                        lastSItemId={lastSItemIdx}
                        lastLastSItemIdx={this.lastLastSItemIdx}
                        lastIdx={lastIdx}
                        ballsClick={(ballsDic) => {
                            this._handleBallsDict(ballsDic, item);
                        }}
                    >
                    </BodanItemView> 
                );

            } else if (this.props.play_group == 2) {
                // 半/全场 
                return (
                    <BQChangItemView data={item.item} style={{ height: Adaption.Height(160) }}
                        cuntSItemId={cuntSItemIdx}
                        lastSItemId={lastSItemIdx}
                        lastLastSItemIdx={this.lastLastSItemIdx}
                        lastIdx={lastIdx}
                        allPlayClick={() => {
                            this._allGameClick(item);
                        }}
                        ballsClick={(ballsDic) => {
                            this._handleBallsDict(ballsDic, item);
                        }}
                    >
                    </BQChangItemView>
                )

            } else if (this.props.play_group == 3) {
                // 总入球
                return (
                    <ZRQiuItemView data={item.item} style={{ height: Adaption.Height(160) }}
                        cuntSItemId={cuntSItemIdx}
                        lastSItemId={lastSItemIdx}
                        lastLastSItemIdx={this.lastLastSItemIdx}
                        lastIdx={lastIdx}
                        allPlayClick={() => {
                           this._allGameClick(item);
                        }}
                        ballsClick={(ballsDic) => {
                            this._handleBallsDict(ballsDic, item);
                        }}
                    >
                    </ZRQiuItemView>
                )

            } else {
                return <View></View>
            }
        }
    }

    _allGameClick = (item) => {
        // 所有玩法。
        // if (!GlobalConfig.lineBaseIPURL().includes('sg04')) {  // 测试阶段，只有QA站可以进入所有玩法。 
        //     this.refs.Toast && this.refs.Toast.show('暂未开放，敬请期待', 1000);
        //     return;
        // }

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
        if (this.props.game_typeID == 3) {
            // 把这个盘口的基本数据传进去 供有选择号码后使用。 然后剩下的事情 就在FBGamePassBottom里面搞了。
            backupSltDic = { 
                data: item.item, sectionItemiId: cuntSItemIdx, 
                league_id: this.state.sectionData[item.section.sectionID].league_id,
                league_name: this.state.sectionData[item.section.sectionID].league_name,
                playMethod: '', isFullTime: true, isHVXO: '', k: '', p: '', sltIdx: -1, // 这几个都是不确定的，选择号码才能确定。
            };
        }

        this.props.navigate('FBAllGame', {
            sport_id: this.state.sport_Id, nowGameData: item.item, game_type: this.props.game_typeID, 
            sltDic: sltDic, 
            allSltDic: this.props.game_typeID == 3 ? this.state.ballsDict : null,
            backupSltDic: this.props.game_typeID == 3 ? backupSltDic : null,
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

        if (this.props.game_typeID == 3) {
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
           return <View></View> 
        }
    }

    render() {

        if (this.props.maintenance && this.state.sectionData.length <= 0 && this.state.isloading == false && this.state.isHaveData == false) {
            return (
                <View style = {{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                    <Image style = {{marginTop: Adaption.Width(-50), width: Adaption.Width(250), height: Adaption.Width(200), resizeMode: 'contain'}} source={require('../img/ic_sportVerbSystem.png')} />
                    <CusBaseText style = {{margin: Adaption.Width(20), marginTop: Adaption.Width(50), fontSize:Adaption.Font(20, 16), color: '#4d4e4f', lineHeight: Adaption.Width(30)}}>
                        {`抱歉！系统正在维护，暂停下注！如有什么疑问请联系客服！\n预计维护时间：`}
                        <CusBaseText style = {{color:'#fd730a', lineHeight: Adaption.Width(35)}}>{this.props.maintenanceTime}</CusBaseText>
                    </CusBaseText>
                </View>
            )
        }
        

        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <SectionList style={{}}
                    ref='FBSectionList'
                    SectionSeparatorComponent={() => this._sectionSeparatorComponent()} // section的顶底部视图
                    ListFooterComponent={() => this._listFooterComponent()} // 尾部视图
                    renderSectionHeader={(section) => this._renderSectionHeader(section)} // section头部的视图
                    renderItem={(item) => this._renderItemView(item)}
                    sections={this.state.sectionData}
                    keyExtractor={(item,index)=>{return String(index)}} 
                    refreshing={this.state.isRefreshing}  // 是否处于刷新状态。
                    onRefresh={() => this._onRefresh()}  
                    onEndReachedThreshold={-0.2}   // 距离底部多远触发onEndReached，范围0.0-1.0
                    onEndReached={(info) => this._onEndReached(info)}
                    ListEmptyComponent={() => this._listEmptyComponent()}
                >
                </SectionList>

                {this.state.isloading
                    ? <ActivityIndicator animating={true} size="large" color={COLORS.appColor}
                        style={{
                            position: 'absolute',
                            left: SCREEN_WIDTH / 2 - 18,
                            top: Adaption.Height(200),
                        }}/>
                    : null
                }
                <Toast ref="Toast" position='center'/>
            </View>
        );
    }
}