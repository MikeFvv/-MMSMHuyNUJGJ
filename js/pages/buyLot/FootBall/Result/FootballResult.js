/**
 Created by Money on 2018/03/21
 足球玩法的 投注总界面
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Alert,
    SectionList,
    Text,
    Animated,
    Easing,
    ActivityIndicator,
} from 'react-native';

import HuoCalendar from '../../../me/welfareTask/HuoCalendar';

import Canlender from "../footballTool/Canlender";
import ScorceDropView from './FootballResultTitleView';
import Adaption from "../../../../skframework/tools/Adaption";  //足彩下拉框

export default class FootballResult extends Component {

    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                leftClick={() => navigation.goBack()}

                centerView={
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={navigation.state.params ? navigation.state.params.navTitlePress : null}>
                        <View style={{
                            width: SCREEN_WIDTH - 30 - 65 - 20,
                            height: 44,
                            marginTop: SCREEN_HEIGHT == 812 ? 40 : 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginLeft: 20,
                            backgroundColor: 'transparent',
                        }}>
                            <CusBaseText style={{
                                fontSize: 18,
                                color: 'white',
                            }}>{navigation.state.params ? navigation.state.params.navfirstTitle : null}</CusBaseText>
                            <Image style={{width: 15, height: 15,}}
                                   source={require("../../../theLot/img/xuansan.png")}/>
                        </View>
                    </TouchableOpacity>
                }

                rightView={
                    <TouchableOpacity activeOpacity={1} style={{
                        width: 60,
                        marginTop: SCREEN_HEIGHT == 812 ? 38 : 14,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 0
                    }}
                                      onPress={() => {
                                          navigation.state.params ? navigation.state.params.navRightPress() : null
                                      }}>
                        <Image style={{width: 24, height: 24}} source={require('../img/ic_rili.png')}/>
                    </TouchableOpacity>
                }
            />
        ),
    });


    _rightBtnPress = () => {

        // this.getNetDate();
        this.refs.Canlender && this.refs.Canlender.showView();    //日历选择控件
    }

    _navTitleBtnPress = () => {
        this.refs.ScorceDropDownView && this.refs.ScorceDropDownView.show();//足彩下拉选择控件
    }

    constructor(props) {

        super(props);

        this.state = {
            dataSourceList: [],
            // currentSelectPlayIndex: 0,   //0联赛 1冠军
            isLoadMore: false,  // 是否在加载更多
            footStateText: '上拉加载更多',

            isBeginLoading: true,
            sport_Id:props.navigation.state.params.sportID ? props.navigation.state.params.sportID : 2001, //体彩ID


            // current_year: HuoCalendar.getFullYear(),   //当前年份
            // current_month: HuoCalendar.getMonth() + 1,   //当前月份
            // current_day: HuoCalendar.getDate(),        //当前日期
            // current_week: '',
        };

        this.currentSelectPlayIndex = 0 ; //0联赛 1冠军
        // this.current_year

        this.current_year = HuoCalendar.getFullYear();  //当前年份
        this.current_month = HuoCalendar.getMonth() + 1;   //当前月份
        this.current_day = HuoCalendar.getDate();        //当前日期
        this.current_week = 0;


        this.nextRefreshData = '';      //加载更多起始日期
        //当前日历
        this.todayYear = HuoCalendar.getFullYear();
        this.todayMonth = HuoCalendar.getMonth() + 1;
        this.todayDay = HuoCalendar.getDate();

        this.cellDatas = [
            // {
            //     key: 0,
            //     league_name: "假数据联赛",
            //     isHide: true,
            //     league_id: 123,
            //     data: [
            //         {
            //             begin_time: 152131144,
            //             h: "V瓦人长期",
            //             v: "大阪飞脚",
            //             is_corner: 1,
            //             is_live: 0,
            //             is_master: 0,
            //             is_neutral: 0,
            //             result_data: {
            //                 //HTG：半场进球   TG：总进球
            //                 SC: {
            //                     V: {HTG: "1", TG: "3", q1: "0", q2: "1", q3: "0", q4: "1", q5: "1", q6: "0"},
            //                     H: {HTG: "0", TG: "0", q1: "0", q2: "0", q3: "0", q4: "0", q5: "0", q6: "0"}
            //                 },
            //             },
            //
            //         },
            //
            //         {
            //             begin_time: 152131144,
            //             h: "V22瓦人长期",
            //             v: "大222阪飞脚",
            //             is_corner: 0,
            //             is_live: 0,
            //             is_master: 0,
            //             is_neutral: 0,
            //             result_data: {
            //                 //HTG：半场进球   TG：总进球
            //                 SC: {
            //                     V: {HTG: "1", TG: "3", q1: "0", q2: "1", q3: "0", q4: "1", q5: "1", q6: "0"},
            //                     H: {HTG: "0", TG: "0", q1: "0", q2: "0", q3: "0", q4: "0", q5: "0", q6: "0"}
            //                 },
            //             },
            //         },
            //     ]
            // },

        ]
    }

    componentDidMount() {

        this.props.navigation.setParams({
            navRightPress: this._rightBtnPress,
            navTitlePress: this._navTitleBtnPress,
            navfirstTitle: '联赛',
        });

        //获取当天周几
        let Weetk = HuoCalendar.getCurrentWeek();
        //转换成week
        this.numTurnWeek(Weetk);

        this.getNetDate();
    }

    //num转换星期
    numTurnWeek(num) {
        let week = '';
        switch (num) {
            case 0:
                week = '星期日';
                break;
            case 1:
                week = '星期一';
                break;
            case 2:
                week = '星期二';
                break;
            case 3:
                week = '星期三';
                break;
            case 4:
                week = '星期四';
                break;
            case 5:
                week = '星期五';
                break;
            case 6:
                week = '星期六';
                break;
        }

        this.current_week = week;
        this.setState({});
    }


    getNetDate() {


        this.setState({

            isBeginLoading: true,
            footStateText: '上拉加载更多',
        });
        /**
         * Returns the number of milliseconds between midnight, January 1, 1970 Universal Coordinated Time (UTC) (or GMT) and the specified date.
         * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
         * @param month The month as an number between 0 and 11 (January to December).
         * @param date The date as an number between 1 and 31.
         * @param hours Must be supplied if minutes is supplied. An number from 0 to 23 (midnight to 11pm) that specifies the hour.
         * @param minutes Must be supplied if seconds is supplied. An number from 0 to 59 that specifies the minutes.
         * @param seconds Must be supplied if milliseconds is supplied. An number from 0 to 59 that specifies the seconds.
         * @param ms An number from 0 to 999 that specifies the milliseconds.
         */
            // UTC(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;

        let params = new FormData();
        params.append("ac", "getRaceResList");
        params.append("sport_id", this.state.sport_Id);
        params.append("result_type", this.currentSelectPlayIndex);
        // params.append("start_time", `${this.current_year}-${this.current_month}-${this.current_day}`);
        var stringTime = `${this.current_year}-${this.current_month}-${this.current_day} 00:00:00`;
        var timestamp2 = Date.UTC(this.current_year, (this.current_month - 1), this.current_day, "00", "00", "00", "000");
        params.append("start_time", timestamp2);


        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {

                this.setState({

                    isBeginLoading: false,
                });
                //处理数据
                if (responseData.msg == 0) {

                    this.nextRefreshData = responseData.data.next_time;
                    if (responseData.data.result != null) {
                        let dataArray = responseData.data.result;
                        let dataSourceArray = [];

                        console.log('数据源', dataArray);
                        if (dataArray.length > 0)
                        {
                            dataArray.map((item, index) => {
                                item.key = index;
                                item.isHide = false;
                                item.nextTime = item.nextTime / 1000;
                                item.data = item.game_result;
                                dataSourceArray.push(item);

                            });
                            this.cellDatas = dataSourceArray;
                            let newArray = JSON.parse(JSON.stringify(this.cellDatas));
                            this.setState({
                                dataSourceList: newArray
                            });
                        }
                        else
                        {
                            this.setState({
                                dataSourceList: [],
                            });

                        }
                    }
                    else
                    {
                        this.setState({
                            dataSourceList: [],
                        });

                    }


                }
            })

            .catch((err) => {

                this.setState({
                    isBeginLoading: false,
                });

            })

    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>

                {/*顶部切换天数按钮*/}
                <View style={{flexDirection: 'row', height: 45}}>


                    <View style={{flex: 0.15}}/>

                    {/*减一天按钮*/}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}

                        onPress={() => {

                            //当前天数大于一天则不用判断其它  换月
                            if (this.current_day > 1) {
                                let week2 = new Date(this.current_year, (this.current_month - 1), (this.current_day - 1)).getDay();
                                this.numTurnWeek(week2);
                                //
                                // this.setState({
                                //     current_day: (this.state.current_day - 1),
                                // });

                                this.current_day = this.current_day - 1;
                            }
                            else {

                                let secYear = 0;
                                let secMonth = 0;
                                let secDay = 0;
                                if (this.current_month > 1) {
                                    secMonth = this.current_month - 1;
                                    //根据月份计算
                                    switch (secMonth) {
                                        case 1:
                                        case 3:
                                        case 5:
                                        case 7:
                                        case 8:
                                        case 10:
                                        case 12:
                                            secDay = 31
                                            break;

                                        case 4:
                                        case 6:
                                        case 9:
                                        case 11:
                                            secDay = 30
                                            break;
                                        case 2:
                                            if (HuoCalendar.isLeapYear(this.current_year)) {
                                                secDay = 29;
                                            }
                                            else {
                                                secDay = 28;
                                            }
                                            break;
                                    }

                                    let week2 = new Date(this.current_year, (secMonth - 1), secDay).getDay();
                                    this.numTurnWeek(week2);

                                    this.current_month = secMonth;
                                    this.current_day = secDay;
                                    // this.setState({
                                    //     current_month: secMonth,
                                    //     current_day: secDay,
                                    // });
                                }
                                // XXXX年1.1号情况  换年
                                else {

                                    // XXXX年12月31号
                                    let week2 = new Date((this.current_year - 1), 11, 31).getDay();
                                    this.numTurnWeek(week2);
                                    // this.setState({
                                    //     current_year: this.state.current_year - 1,
                                    //     current_month: 12,
                                    //     current_day: 31,
                                    // });
                                    //
                                    this.current_day = 31;
                                    this.current_month = 12;
                                    this.current_year = this.current_year - 1;
                                }
                            }

                            //请求数据
                            this.getNetDate();
                        }
                        }
                    >
                        <Image style={{width: 13, height: 13}} source={require('../img/shangyiyue.png')}/>

                    </TouchableOpacity>

                    <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                        <CusBaseText style={{color: 'black', fontSize: Adaption.Font(17, 16)}}>
                            {this.current_year}-{this.current_month}-{this.current_day} {this.current_week}
                        </CusBaseText>
                    </View>

                    {/*加一天按钮*/}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => {

                            //根据当前月份来处理
                            let secYear = this.current_year;
                            let secMonth = this.current_month;
                            //先加一天
                            let secDay = this.current_day;

                            if (secYear == this.todayYear && secMonth == this.todayMonth && this.todayDay == secDay) {
                                return;
                            }

                            secDay += 1;

                            //根据月份来判断加月
                            switch (this.current_month) {
                                case 2:
                                    if (HuoCalendar.isLeapYear(this.current_year)) {
                                        if (secDay == 30) {
                                            secDay = 1;
                                            secMonth += 1;
                                        }
                                    }
                                    else {
                                        if (secDay == 29) {
                                            secDay = 1;
                                            secMonth += 1;
                                        }
                                    }
                                    break;
                                case 1:
                                case 3:
                                case 5:
                                case 7:
                                case 8:
                                case 10:

                                    if (secDay == 32) {
                                        secDay = 1;
                                        secMonth += 1;
                                    }

                                    break;

                                case 4:
                                case 6:
                                case 9:
                                case 11:
                                    if (secDay == 31) {
                                        secDay = 1;
                                        secMonth += 1;
                                    }
                                    break;

                                case 12:
                                    if (secDay == 32) {
                                        secDay = 1;
                                        secMonth += 1;
                                        secYear += 1;
                                    }
                                    break;
                            }

                            let week2 = new Date(secYear, (secMonth - 1), secDay).getDay();
                            this.numTurnWeek(week2);

                            this.current_day = secDay;
                            this.current_month = secMonth;
                            this.current_year = secYear;


                            // this.setState({
                            //     current_year: secYear,
                            //     current_month: secMonth,
                            //     current_day: secDay,
                            // });
                            //请求数据
                            this.getNetDate();
                        }
                        }
                    >

                        {/*当天的时候，下一天隐藏*/}
                        {(this.current_year == this.todayYear && this.current_month == this.todayMonth && this.todayDay == this.current_day) ?null:

                         <Image style={{width: 13, height: 13}} source={require('../img/xiayiyue.png')}/> }

                    </TouchableOpacity>

                    <View style={{flex: 0.15}}/>

                </View>


                {this.state.isBeginLoading ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                    <ActivityIndicator animating={this.state.isBeginLoading} size="large"></ActivityIndicator>
                </View> : (this.state.dataSourceList.length != 0 ? this.creatListView() :
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 45}}>
                        <CusBaseText style={{fontSize: 30}}>
                            暂无数据!
                        </CusBaseText>
                    </View>)}

                {/* 日历 */}
                <Canlender ref='Canlender'

                    // year = {this.state.current_year}
                    // month = {this.state.current_month}
                    // day = {this.state.current_day}
                    // week = {this.state.current_week}
                           comformClick={(year, month, day) => {

                               let week2 = new Date(year, (month - 1), day).getDay();
                               this.numTurnWeek(week2);

                               this.current_day = day;
                               this.current_month = month;
                               this.current_year = year;

                               // this.setState({
                               //     current_year: year,
                               //     current_month: month,
                               //     current_day: day,
                               // });

                               //请求数据
                               this.getNetDate();
                           }}
                />

                {/* 头部下拉 */}
                <ScorceDropView
                    ref='ScorceDropDownView'
                    selectIndex={this.currentSelectPlayIndex}
                    itemTitleSelect={(item) => {
                        this.props.navigation.setParams({
                            navfirstTitle: item.item.title,
                        });

                        this.currentSelectPlayIndex=item.index;


                        //请求数据 这里title会延时
                        this.getNetDate();
                    }}
                />

            </View>
        );
    }

    // 尾部视图
    _listFooterComponent() {
        return (
            <View style={{
                height: 40,
                width: SCREEN_WIDTH,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                {this.state.isLoadMore ?
                    <ActivityIndicator animating={this.state.isLoadMore} size="small"></ActivityIndicator> : null}
                {this.state.dataSourceList.length != 0 ? <CusBaseText style={{
                    fontSize: Adaption.Font(18),
                    marginLeft: 10
                }}>{this.state.footStateText}</CusBaseText> : null}
            </View>
        )
    }

    creatListView() {

        return (
            <View style={{flex: 1}}>
                <SectionList
                    // renderSectionHeader={this._renderSectionHeader}
                    renderSectionHeader={(section) => this._renderSectionHeader(section)} // section头部的视图
                    renderItem={this.renderItem}
                    sections={this.state.dataSourceList}
                    // extraData={this.state}
                    refreshing={false}
                    ItemSeparatorComponent={() => <View style={{height: 0.1}}></View>}  //必须写，不然section不能展开收起
                    // onRefresh={() => this._onRefresh()}
                    onEndReachedThreshold={-0.2}   // 距离底部多远触发onEndReached，范围0.0-1.0
                    onEndReached={(info) => this._onEndReached(info)}
                    ListFooterComponent={() => this._listFooterComponent()} // 尾部视图
                    style={{marginBottom: SCREEN_HEIGHT == 812 ? 34 : 0}}
                />
            </View>
        );
    }

    // 上拉加载更多
    _onEndReached(info) {

        //锁死没数据时还下拉请求
        if (this.state.footStateText == '没有更多数据了') {
            return;
        }

        this.setState({
            isLoadMore: true,
            footStateText: '正在加载更多数据',
        });

        let title = this.props.navigation.state.params.navfirstTitle;
        let params = new FormData();
        params.append("ac", "getRaceResList");
        params.append("sport_id", this.state.sport_Id);
        params.append("result_type", (title == "联赛" ? 0 : 1));
        params.append("start_time", this.nextRefreshData);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
            .then((responseData) => {
                //处理数据
                if (responseData.msg == 0) {


                    //时间相同后  就不加数据了
                    if (responseData.data.next_time && this.nextRefreshData == responseData.data.next_time)
                    {
                        console.log(this.state.dataSourceList)

                        console.log('时间相同了')
                        console.log(this.state.dataSourceList)

                        this.setState({
                            isLoadMore: false,
                            footStateText: '没有更多数据了',
                        })
                        return;
                    }
                    else
                    {

                        if (responseData.data.next_time)
                        {
                            this.nextRefreshData = responseData.data.next_time;

                        }

                        if (responseData.data.result != null)
                        {
                            let dataArray = responseData.data.result;
                            let dataSourceArray = this.state.dataSourceList;
                            let keyNum = dataSourceArray.length;

                            // console.log('新请求的数据源', dataArray);
                            if (dataArray.length > 0)
                            {
                                dataArray.map((item, index) => {
                                    item.key = keyNum + index;
                                    item.isHide = false;
                                    item.nextTime = item.nextTime / 1000;
                                    item.data = item.game_result;
                                    dataSourceArray.push(item);

                                });
                                let newArray = JSON.parse(JSON.stringify(dataSourceArray));

                                this.setState({
                                    isLoadMore: false,
                                    footStateText: '上拉加载更多',
                                    dataSourceList: newArray
                                })

                                // console.log('合并后的数据源', newArray);
                            }
                            else
                            {
                                this.setState({
                                    isLoadMore: false,
                                    footStateText: '没有更多数据了',
                                })

                            }
                        }
                        else
                        {
                            this.setState({
                                isLoadMore: false,
                                footStateText: '没有更多数据了',
                            })
                            return;
                        }


                    }
                }
            })

            .catch((err) => {

                this.setState({
                    isLoading: false,
                    footStateText: '上拉加载更多',
                });

            })


    }


    renderItem = (info) => {

        // 如果是隐藏 返回null
        if (info.section.isHide) {
            return null;
        }
        else {


            //是否为冠军赛事
            // let isCHP = (info.item.is_master == 1 ? true : false);
            // let isCore = info.item.is_corner == 1 ? true : false;
            let time = info.item.begin_time;
            var newDate = new Date();
            newDate.setTime(time);
            time = newDate.toJSON();
            let date = time.slice(5, 10);
            let timeTwo = time.slice(11, 16);


            //四个值

            let quanchangzhu = info.item.result_data.SC.H.TG ?info.item.result_data.SC.H.TG:'0';
            let banchangzhu = info.item.result_data.SC.H.TG ?info.item.result_data.SC.H.HTG:'0';

            let quanchangke = info.item.result_data.SC.H.TG ?info.item.result_data.SC.V.TG:'0';
            let banchangke = info.item.result_data.SC.H.TG ?info.item.result_data.SC.V.HTG:'0';


            return <View  key={info.index} style={{
                flexDirection: 'row', height: 88, borderBottomWidth: 0.5, borderColor: '#d2d2d2',
                alignItems: 'center', backgroundColor: 'white'
            }}>

                {/*时间*/}
                <View style={{
                    flex: 0.2,
                    borderRightWidth: 1,
                    borderColor: '#d2d2d2',
                    height: 88,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <CusBaseText style={{fontSize: 14, color: '#959595'}}>{date}</CusBaseText>
                    <CusBaseText style={{fontSize: 14, color: '#959595'}}>{timeTwo}</CusBaseText>

                </View>

                <View style={{
                    flex: 0.8,
                    flexDirection: 'row',
                    // borderRightWidth: 1,
                    // borderColor: '#d2d2d2',
                    height: 88,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                    <View style={{flex: 0.9}}>

                        {/*/!*<Text {...this.props} allowFontScaling={false}>*!/
                        {info.item.is_corner == 1 ? <CusBaseText style={{color:'blue'}} >  角球数</CusBaseText>:null}
                        {/*主队数据*/}
                        <View style={{marginLeft: 10, flexDirection: 'row'}}>
                            <CusBaseText  style={{flex: 0.6, fontSize: Adaption.Font(15, 14)}}>{info.item.h}</CusBaseText>

                            {/*<CusBaseText   style={{flex: 0.2,backgroundColor:'yellow'}} adjustsFontSizeToFit = {true} minimumFontScale = {0.5} >{info.item.result_data.SC.H.TG ?info.item.result_data.SC.H.TG:'0'}</CusBaseText>*/}
                            {/*<CusBaseText  adjustsFontSizeToFit = {true} style={{flex: 0.2,backgroundColor:'yellow'}}>{info.item.result_data.SC.H? info.item.result_data.SC.H.HTG : null}</CusBaseText>*/}

                            <CusBaseText   style={{flex: 0.2,fontSize: Adaption.Font(15, 14)}} adjustsFontSizeToFit = {true} minimumFontScale = {0.85} >{quanchangzhu}</CusBaseText>
                            <CusBaseText   style={{flex: 0.2,fontSize: Adaption.Font(15, 14)}} adjustsFontSizeToFit = {true} minimumFontScale = {0.85} >{banchangzhu}</CusBaseText>

                        </View>


                        {/*客队数据*/}
                        <View style={{marginLeft: 10, flexDirection: 'row', marginTop: 10}}>
                            <CusBaseText style={{flex: 0.6, fontSize: Adaption.Font(15, 14)}}>{info.item.v}</CusBaseText>

                            {/*<CusBaseText style={{flex: 0.2}}>{info.item.result_data.SC.V ? info.item.result_data.SC.V.TG :null}</CusBaseText>*/}
                            {/*<CusBaseText style={{flex: 0.2}}>{info.item.result_data.SC.V ? info.item.result_data.SC.V.HTG :null}</CusBaseText>*/}

                            <CusBaseText style={{flex: 0.2,fontSize: Adaption.Font(15, 14)}} adjustsFontSizeToFit = {true} minimumFontScale = {0.85}>{quanchangke}</CusBaseText>
                            <CusBaseText style={{flex: 0.2,fontSize: Adaption.Font(15, 14)}} adjustsFontSizeToFit = {true} minimumFontScale = {0.85} >{banchangke}</CusBaseText>

                        </View>

                    </View>


                    {this.currentSelectPlayIndex == 0?
                        <TouchableOpacity activeOpacity={0.6} style={{
                            flex: 0.1,
                            marginRight: (SCREEN_WIDTH == 414 ? 8 : (SCREEN_WIDTH == 320 ? 14 : 12))
                        }}

                                          onPress={() => {
                                              const {navigate} = this.props.navigation;
                                              navigate('FootballResultDetail', {
                                                  item: info.item,
                                                  legue: info.section.league_name
                                              });

                                          }}
                        >
                            <CusBaseText style={{
                                textAlignVertical: 'center',
                                textAlign: 'center',
                                width: 23,
                                height: 55,
                                writingDirection: 'rtl',
                                fontSize: 14,
                                color: '#959595',
                                borderColor: '#d2d2d2',
                                borderWidth: 1,
                                borderRadius: 11,
                                lineHeight: 25,
                            }}>详情</CusBaseText>
                        </TouchableOpacity>:null}

                </View>
            </View>;

        }
    }

    //
    // handlerSectionHeader = (info) => {
    //
    //     if (info.section.isHide) {
    //         this.state.dataSourceList.map((item, index) => {
    //             if (item === info.section) {
    //                 item.isHide = !item.isHide;
    //                 item.data = [{key: 'close'}];
    //             }
    //         });
    //
    //     }
    //     else {
    //         this.cellDatas.map((item, index) => {
    //             if (item.key === info.section.key) {
    //                 let data = item.data;
    //                 this.state.dataSourceList.map((cellItem, i) => {
    //                     if (cellItem === info.section) {
    //                         cellItem.isHide = !cellItem.isHide;
    //                         cellItem.data = data;
    //                     }
    //                 });
    //             }
    //         });
    //     }
    //
    //     let newArray = JSON.parse(JSON.stringify(this.state.dataSourceList));
    //
    //     this.setState({
    //         dataSourceList: newArray
    //     })
    // };


    // 分组头部
    _renderSectionHeader(section) {
        return (
            <TouchableOpacity activeOpacity={0.8} style={{
                height: Adaption.Height(45),
                width: SCREEN_WIDTH,
                backgroundColor: '#f6f6f6',
                alignItems: 'center',
                flexDirection: 'row'
            }}
                              onPress={() => {

                                  this.state.dataSourceList[section.section.key].isHide = !this.state.dataSourceList[section.section.key].isHide;
                                  this.setState({
                                      dataSourceList: this.state.dataSourceList,
                                  })
                              }}>
                <View style={{flex: 0.9, marginLeft: 10, flexDirection: 'row'}}>

                    <CusBaseText allowFontScaling={false} style={{
                        fontSize: Adaption.Font(18, 16),
                        fontWeight: '500',
                        flex: 0.58
                    }}>{section.section.league_name}</CusBaseText>
                    <CusBaseText style={{flex: 0.22, textAlign: 'center'}}>全场</CusBaseText>
                    <CusBaseText style={{flex: 0.2, textAlign: 'center', marginRight: 10}}>上半场</CusBaseText>
                </View>

                <View style={{flex: 0.1}}>
                    <Image style={{width: 13, height: 13}}
                           source={section.section.isHide ? require('../img/arrowDown.png') : require('../img/arrowUp.png')}
                    />
                </View>
            </TouchableOpacity>
        )
    }


    // //section头部
    // _renderSectionHeader = (item) => {
    //     return (
    //         <OpenCellHader
    //             info={item}
    //             handlerSectionHeader01={this.handlerSectionHeader.bind(this)}
    //         />
    //     );
    // };


    //
    // _renderSectionHeader = (info) => {
    //     return (
    //         <TouchableOpacity activeOpacity={0.8} style={{
    //             height: Adaption.Height(45),
    //             width: SCREEN_WIDTH,
    //             backgroundColor: '#f6f6f6',
    //             alignItems: 'center',
    //             flexDirection: 'row'
    //         }}
    //                           onPress={() => {
    //                               this.state.dateSource[info.section.sectionID].isHide = !this.state.dateSource[info.section.sectionID].isHide;
    //                               this.setState({dateSource: this.state.dateSource});
    //                    -       }}>
    //             <View style={{flex: 0.68, marginLeft: 10}}>
    //                 <Text style={{fontSize: Adaption.Font(18, 16), fontWeight: '500'}}>{info.section.title}</Text>
    //             </View>
    //
    //             <Text style={{flex: 0.1, marginLeft: 10}}>全场</Text>
    //             <Text style={{flex: 0.15, marginLeft: 10}}>上半场</Text>
    //             <View style={{flex: 0.07}}>
    //                 <Image style={{width: 13, height: 13}}
    //                        source={info.section.isHide ? require('../img/arrowDown.png') : require('../img/arrowUp.png')}
    //                 />
    //             </View>
    //         </TouchableOpacity>
    //     )
    // }


}


class OpenCellHader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rotateValue: new Animated.Value(0),
        };
    }

    handlerSectionHeader01 = (info) => {
        this.props.handlerSectionHeader01(info);
        if (info.section.isHide) {
            this.state.rotateValue.setValue(180);
            Animated.timing(this.state.rotateValue, {
                toValue: 0,
                duration: 400,
                easing: Easing.linear
            }).start();// 开始spring动画

        } else {
            this.state.rotateValue.setValue(0);
            Animated.timing(this.state.rotateValue, {
                toValue: 180,
                duration: 400,
                easing: Easing.linear
            }).start();// 开始spring动画
        }

    };

    render() {
        const {info} = this.props;
        return (
            <View style={styles.container01}>
                <TouchableOpacity
                    onPress={() => this.handlerSectionHeader01(info)}
                    style={styles.subView}
                    activeOpacity={1}
                >
                    <View
                        style={{
                            flex: 0.98,
                            marginLeft: 15,
                            height: 55,
                            justifyContent: "flex-start",
                            flexDirection: 'row',
                            alignItems: "center"
                        }}>
                        <CusBaseText style={{flex: 0.65, fontSize: 16}}>{info.section.league_name}</CusBaseText>
                        <CusBaseText
                            style={{flex: 0.15, marginLeft: 10, color: '#7d7d7d', fontSize: 16}}>全场</CusBaseText>
                        <CusBaseText
                            style={{flex: 0.2, marginLeft: 10, color: '#7d7d7d', fontSize: 16}}>上半场</CusBaseText>
                    </View>

                    <Animated.Image
                        style={[styles.image,
                            {
                                transform: [{
                                    rotate:
                                        this.state.rotateValue.interpolate({
                                            inputRange: [0, 180],
                                            outputRange: ['0deg', '180deg']
                                        })
                                }]
                            }
                        ]}
                        source={require("../img/arrowUp.png")}>
                    </Animated.Image>
                </TouchableOpacity>
            </View>

        );

    };

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
    },
    container01: {
        height: 45,
        backgroundColor: '#f6f6f6',
        // marginLeft:5,
        width: SCREEN_WIDTH,
        // alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#d2d2d2',

    },
    subView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    image: {

        width: 14,
        height: 14,
        marginRight: 20,

    },
    textStyle: {
        flex: 1,
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
    },
    lineStyle: {
        width: SCREEN_WIDTH / 4,
        height: 2,
        backgroundColor: '#FF0000',
    },

    content: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EBEBEB',
        flex: 1,
    }

});