/**
 * Created by Ward on 2018/03/20.
 */
import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Modal,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native'

import HuoCalendar from '../../../me/welfareTask/HuoCalendar';

export default class Canlender extends Component {

    constructor(props) {
        super(props);

        this.state = ({

            isShow: false,
            current_year: HuoCalendar.getFullYear(),   //当前年份
            current_month: HuoCalendar.getMonth() + 1,   //当前月份
            current_day: HuoCalendar.getDate(),        //当前日期
            date_num_array: [],
            current_week:'',   //当前选中日期的星期
            showWeek:true, //是否显示
        })



        this.weekArray = [{key: 0, value: '日'}, {key: 1, value: '一'}, {key: 2, value: '二'}, {
            key: 3,
            value: '三'
        }, {key: 4, value: '四'}, {key: 5, value: '五'}, {key: 6, value: '六'}];

        this.currentMonth = ''; //记住当前的月份
        this.currentYear = '';  //记住当前的年份
    }

    /**
     * 组件将要挂载
     * 设置月份数组以及计算出每月的第一天星期几
     */
    componentWillMount() {
        let firstDay = HuoCalendar.weekOfMonth();
        let date_num_array = this._initMonthDayNumber(this.state.current_year, this.state.current_month);
        this.setState({date_num_array: date_num_array, first_day: firstDay});
    }

    //num转换星期
    numTurnWeek(num){
        let  week = '';
        switch (num){
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

        this.setState({
            current_week:week
        });

    }

    //根据每月是星期几判断每月天数
    componentDidMount() {

        this.currentYear = this.state.current_year;
        this.currentMonth = this.state.current_month;

        let Weetk =  HuoCalendar.getCurrentWeek();
        //转换成week
        this.numTurnWeek(Weetk);
        this._jugeMonthDay();

    }

    componentWillReceiveProps(nextProps) {
        // this.setState({
        //     current_year:nextProps.year,
        //     current_month:nextProps.month,
        //     current_day:nextProps.day,
        //     current_week:nextProps.week,
        // })
    }

    showView = () => {
        this.setState({
            isShow: true,
        })
    }

    //判断每个月第一天是星期几
    _jugeMonthDay() {
        let itemArray = [];
        switch (this.state.first_day) {
            case 0:
                itemArray = this.state.date_num_array;
                break;
            case 1:
                itemArray = [{key: 31, value: null}];
                for (var i = 0; i < this.state.date_num_array.length; i++) {
                    itemArray.push(this.state.date_num_array[i]);
                }
                break;
            case 2:
                itemArray = [{key: 31, value: null}, {key: 32, value: null}];
                for (var i = 0; i < this.state.date_num_array.length; i++) {
                    itemArray.push(this.state.date_num_array[i]);
                }
                break;
            case 3:
                itemArray = [{key: 31, value: null}, {key: 32, value: null}, {key: 33, value: null}];
                for (var i = 0; i < this.state.date_num_array.length; i++) {
                    itemArray.push(this.state.date_num_array[i]);
                }
                break;
            case 4:
                itemArray = [{key: 31, value: null}, {key: 32, value: null}, {key: 33, value: null}, {
                    key: 34,
                    value: null
                }];
                for (var i = 0; i < this.state.date_num_array.length; i++) {
                    itemArray.push(this.state.date_num_array[i]);
                }
                break;
            case 5:
                itemArray = [{key: 31, value: null}, {key: 32, value: null}, {key: 33, value: null}, {
                    key: 34,
                    value: null
                }, {key: 35, value: null}];
                for (var i = 0; i < this.state.date_num_array.length; i++) {
                    itemArray.push(this.state.date_num_array[i]);
                }
                break;
            case 6:
                itemArray = [{key: 31, value: null}, {key: 32, value: null}, {key: 33, value: null}, {
                    key: 34,
                    value: null
                }, {key: 35, value: null}, {key: 36, value: null}];
                for (var i = 0; i < this.state.date_num_array.length; i++) {
                    itemArray.push(this.state.date_num_array[i]);
                }
                break;
            default:
                break;
        }
        this.setState({date_num_array: itemArray})
    }

    /**
     * 给月份数组附上每月天数
     * @param year 年份
     * @private
     */
    _initMonthDayNumber(year, month) {
        let _date_array = [];
        for (var i = 0; i < 12; i++) {
            switch (i + 1) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    _date_array = [{key: 0, value: 1}, {key: 1, value: 2}, {key: 2, value: 3}, {
                        key: 3,
                        value: 4
                    }, {key: 4, value: 5}, {key: 5, value: 6}
                        , {key: 6, value: 7}, {key: 7, value: 8}, {key: 8, value: 9}, {key: 9, value: 10}, {
                            key: 10,
                            value: 11
                        }, {key: 11, value: 12}
                        , {key: 12, value: 13}, {key: 13, value: 14}, {key: 14, value: 15}, {
                            key: 15,
                            value: 16
                        }, {key: 16, value: 17}, {key: 17, value: 18},
                        {key: 18, value: 19}, {key: 19, value: 20}, {key: 20, value: 21}, {
                            key: 21,
                            value: 22
                        }, {key: 22, value: 23}, {key: 23, value: 24},
                        {key: 24, value: 25}, {key: 25, value: 26}, {key: 26, value: 27}, {key: 27, value: 28}
                        , {key: 28, value: 29}, {key: 29, value: 30}, {key: 30, value: 31}]

                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    _date_array = [{key: 0, value: 1}, {key: 1, value: 2}, {key: 2, value: 3}, {
                        key: 3,
                        value: 4
                    }, {key: 4, value: 5}, {key: 5, value: 6}
                        , {key: 6, value: 7}, {key: 7, value: 8}, {key: 8, value: 9}, {key: 9, value: 10}, {
                            key: 10,
                            value: 11
                        }, {key: 11, value: 12}
                        , {key: 12, value: 13}, {key: 13, value: 14}, {key: 14, value: 15}, {
                            key: 15,
                            value: 16
                        }, {key: 16, value: 17},
                        {key: 17, value: 18}, {key: 18, value: 19}, {key: 19, value: 20}, {
                            key: 20,
                            value: 21
                        }, {key: 21, value: 22},
                        {key: 22, value: 23}, {key: 23, value: 24}, {key: 24, value: 25}, {
                            key: 25,
                            value: 26
                        }, {key: 26, value: 27}, {key: 27, value: 28}
                        , {key: 28, value: 29}, {key: 29, value: 30}]
                    break;

                case 2:
                    if (HuoCalendar.isLeapYear(year)) {
                        _date_array = [{key: 0, value: 1}, {key: 1, value: 2}, {key: 2, value: 3}, {
                            key: 3,
                            value: 4
                        }, {key: 4, value: 5}, {key: 5, value: 6},
                            {key: 6, value: 7}, {key: 7, value: 8}, {key: 8, value: 9}, {key: 9, value: 10}, {
                                key: 10,
                                value: 11
                            }, {key: 11, value: 12}, {key: 12, value: 13}
                            , {key: 13, value: 14}, {key: 14, value: 15}, {key: 15, value: 16}, {
                                key: 16,
                                value: 17
                            }, {key: 17, value: 18}, {key: 18, value: 19}, {key: 19, value: 20}
                            , {key: 20, value: 21}, {key: 21, value: 22}, {key: 22, value: 23}, {
                                key: 23,
                                value: 24
                            }, {key: 24, value: 25}, {key: 25, value: 26}, {key: 26, value: 27}
                            , {key: 27, value: 28}, {key: 28, value: 29}]

                    } else {
                        _date_array = [{key: 0, value: 1}, {key: 1, value: 2}, {key: 2, value: 3}, {
                            key: 3,
                            value: 4
                        }, {key: 4, value: 5}, {key: 5, value: 6}, {key: 6, value: 7},
                            {key: 7, value: 8}, {key: 8, value: 9}, {key: 9, value: 10}, {key: 10, value: 11}, {
                                key: 11,
                                value: 12
                            }, {key: 12, value: 13}, {key: 13, value: 14},
                            {key: 14, value: 15}, {key: 15, value: 16}, {key: 16, value: 17}, {
                                key: 17,
                                value: 18
                            }, {key: 18, value: 19}, {key: 19, value: 20}, {key: 20, value: 21}
                            , {key: 21, value: 22}, {key: 22, value: 23}, {key: 23, value: 24}, {
                                key: 24,
                                value: 25
                            }, {key: 25, value: 26}, {key: 26, value: 27}, {key: 27, value: 28}]
                    }
                    break;
                default:
                    break;
            }
            if (month == i + 1) {
                return _date_array;
            }
        }
    }

    //头部
    _listHeaderComponent() {
        return (
            <View style={{height: 80}}>
                <View style={{flexDirection: 'row', height: 60}}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{flex: 0.25, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => {
                            let secYear = 0;
                            let secMonth = 0;

                            //往前减小于1月则年份减1
                            if (this.state.current_month > 1) {
                                secMonth = this.state.current_month - 1;
                                secYear = this.state.current_year;
                            }
                            else {
                                secYear = this.state.current_year - 1;
                                secMonth = 12;
                            }


                            //判断当前月份的第一天是周几
                            this.state.first_day = HuoCalendar.weekOfMonth(new Date(secYear, secMonth, 0));

                            this.state.date_num_array = this._initMonthDayNumber(secYear, secMonth);
                            this.setState({
                                date_num_array: this.state.date_num_array,
                                current_month: secMonth,
                                current_year: secYear,
                                first_day: this.state.first_day,
                                current_day:(secYear == this.currentYear && secMonth == this.currentMonth) ? HuoCalendar.getDate() : -1,   //改变时重置内容
                                showWeek:(secYear == this.currentYear && secMonth == this.currentMonth)?true:false,
                            })
                            this._jugeMonthDay();

                        }
                        }
                    >
                        <Image style={{width: 15, height: 15}} source={require('../img/shangyiyue.png')}/>


                    </TouchableOpacity>
                    <View style={{flex: 0.5, alignItems: 'center', justifyContent: 'center'}}>
                        <CusBaseText style={{color: 'black', fontSize: Adaption.Font(17, 15)}}>
                            {this.state.current_year} 年 {this.state.current_month} 月
                        </CusBaseText>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{flex: 0.25, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => {
                            let secYear = 0;
                            let secMonth = 0;


                            if(this.currentYear == this.state.current_year && this.currentMonth == this.state.current_month )
                            {
                                return;
                            }
                            //往后增加大于12月则年份加1
                            if (this.state.current_month < 12) {
                                secMonth = this.state.current_month + 1;
                                secYear = this.state.current_year;
                            }
                            else {
                                secYear = this.state.current_year + 1;
                                secMonth = 1;
                            }

                            //判断当前月份的第一天是周几, 参数为年份，月份
                            this.state.first_day = HuoCalendar.weekOfMonth(new Date(secYear, secMonth, 0));
                            this.state.date_num_array = this._initMonthDayNumber(secYear, secMonth);
                            this.setState({
                                date_num_array: this.state.date_num_array,
                                current_month: secMonth,
                                current_year: secYear,
                                first_day: this.state.first_day,
                                current_day:(secYear == this.currentYear && secMonth == this.currentMonth) ? HuoCalendar.getDate() : -1,   //改变时重置内容
                                showWeek:(secYear == this.currentYear && secMonth == this.currentMonth)?true:false,
                            })
                            this._jugeMonthDay();
                        }
                        }
                    >

                        {(this.currentYear == this.state.current_year && this.currentMonth == this.state.current_month ) ?null:

                        <Image style={{width: 15, height: 15}} source={require('../img/xiayiyue.png')}/>}

                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row',}}>
                    {this._onHeaderView()}
                </View>
            </View>
        );
    }

    _onHeaderView() {
        var marqueeViewArr = [];
        for (var i = 0; i < this.weekArray.length; i++) {
            marqueeViewArr.push(
                <View key={i} style={{
                    width: (SCREEN_WIDTH - (SCREEN_WIDTH == 320 ? 30 : 50)) / 7,
                    borderRadius: (SCREEN_WIDTH - 40) / 7 / 2,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <CusBaseText style={{fontSize: Adaption.Font(17, 14), textAlign: 'center', color: '#666666'}}>
                        {this.weekArray[i].value}
                    </CusBaseText>
                </View>
            );
        }
        return marqueeViewArr;
    }

    _renderItemView(item) {

        let itemBack = '#ffffff';
        let itemTextColor = 'black';

        //进来默认显示当前日期
        if (this.state.current_day == -1)
        {

            //当前月份的显示
            if (this.state.current_month == this.currentMonth && this.state.current_year == this.currentYear) {

                if ((item.item.value > HuoCalendar.getDate())) { //如果日期大于当前日期则显示灰色
                    itemTextColor = 'gray';
                }
                else if (item.item.value == HuoCalendar.getDate()){ //如果日期等于当前日期则显示白色，背景色为APP主题色

                    itemTextColor = 'white';
                    itemBack = COLORS.appColor;
                }
            }
            else if ((this.state.current_month > this.currentMonth && this.state.current_year == this.currentYear) || this.state.current_year > this.currentYear){
                //选择月份大于当前月份年份不变，或者是选择年份大于当前年份则全部是灰色
                itemTextColor = 'gray';
            }
        }
        else
        {
            //已经选择了日期的逻辑
            //当前选择的月份和年份没有改变,选择了当前月份里的日期
            if (this.state.current_month == this.currentMonth && this.state.current_year == this.currentYear) {

                //选择的日期等于日期球的值
                if (item.item.value <=  HuoCalendar.getDate()){

                    if (item.item.value == this.state.current_day) {

                        itemTextColor = 'white';
                        itemBack = COLORS.appColor;
                    }
                }
                else {//如果日期大于当前日期则显示灰色

                    itemTextColor = 'gray';
                }
            }
            else if ((this.state.current_month < this.currentMonth && this.state.current_year == this.currentYear) || this.state.current_year < this.currentYear){
                //选择月份小于当前月份年份不变，或者是选择年份小于当前年分则随意选择日期
                if (item.item.value == this.state.current_day){
                    itemTextColor = 'white';
                    itemBack = COLORS.appColor;
                }
            }
            else if ((this.state.current_month > this.currentMonth && this.state.current_year == this.currentYear) || this.state.current_year > this.currentYear){
                //选择月份大于当前月份年份不变，或者是选择年份大于当前年份则全部是灰色
                itemTextColor = 'gray';
            }

        }

        return (
            <TouchableOpacity activeOpacity={0.7} style={styles.itemView}


                 onPress={() => {
                //当前没有改变月份和年份的情况下
                if (this.state.current_month == this.currentMonth && this.state.current_year == this.currentYear)
                {

                    //没有改变月份的情况，则只有小于当前日期的天数可以点击
                    if (item.item.value <= HuoCalendar.getDate()){
                        this.setState({
                            current_day: item.item.value,
                        })

                        //符合条件才刷新头部
                        this.refreshHead(this.state.current_year,this.state.current_month,item.item.value);
                    }
                }
                else if ((this.state.current_month < this.currentMonth && this.state.current_year == this.currentYear) || this.state.current_year < this.currentYear)
                {
                    //选择月份小于当前月份年份不变，或者是选择年份小于当前年分则随意选择日期
                    this.setState({
                        current_day: item.item.value,
                    })

                    //符合条件才刷新头部
                    this.refreshHead(this.state.current_year,this.state.current_month,item.item.value);
                }

            }}>
                <View style={{
                    width: (SCREEN_WIDTH - (SCREEN_WIDTH == 320 ? 30 : 50) ) / 7,
                    height: (SCREEN_WIDTH - (SCREEN_WIDTH == 320 ? 30 : 50) ) / 7 - 3,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        width: (SCREEN_WIDTH - (SCREEN_WIDTH == 320 ? 30 : 50) ) / 10,
                        height: (SCREEN_WIDTH - (SCREEN_WIDTH == 320 ? 30 : 50) ) / 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: itemBack,
                        borderRadius: (SCREEN_WIDTH - (SCREEN_WIDTH == 320 ? 30 : 50)) / 7 / 2
                    }}>
                        <CusBaseText
                            style={{fontSize: Adaption.Font(17, 14), textAlign: 'center', color: itemTextColor}}>
                            {item.item.value}
                        </CusBaseText>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }


    //点击日期刷新头部按钮
    refreshHead(year,month,day)
    {

        let newMonth = parseInt(month) - 1;
        let week =  HuoCalendar.weekOfMonth(new Date(year, `${newMonth}`, day));

        this.setState({
           current_day: day,
           showWeek:true,
        });
        let week2 = new Date(year,`${newMonth}`, day).getDay()
        this.numTurnWeek(week2);
    }

    render() {

        let ViewHeight = 500;

        if (SCREEN_WIDTH == 320) {
            ViewHeight = 420;
        }
        else if (SCREEN_WIDTH == 375) {
            ViewHeight = 460;
        }


        return (<Modal
                visible={this.state.isShow}
                animationType={'fade'}
                transparent={true}
                onRequestClose={() => {
                }}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    this.setState({isShow: false})
                }} style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: SCREEN_WIDTH - (SCREEN_WIDTH == 320 ? 30 : 50),
                        height: ViewHeight,
                        backgroundColor: '#fff',
                        borderRadius: 10
                    }}>
                        <View style={{
                            backgroundColor: COLORS.appColor,
                            height: 80,
                            justifyContent: 'center',
                            borderTopLeftRadius: 10,
                            borderTopRightRadius: 10
                        }}>
                            <CusBaseText style={{fontSize: 20, color: 'white', paddingLeft: 15}}>
                                {this.state.current_year}
                            </CusBaseText>
                            <CusBaseText style={{fontSize: 25, color: 'white', paddingLeft: 15}}>

                                {this.state.showWeek ? `${this.state.current_month}月${this.state.current_day}日${this.state.current_week}` :`${this.state.current_month}月`}

                            </CusBaseText>
                        </View>
                        <FlatList
                            automaticallyAdjustContentInsets={false}
                            alwaysBounceHorizontal={false}
                            data={this.state.date_num_array}
                            renderItem={item => this._renderItemView(item)}
                            horizontal={false} //水平还是垂直
                            numColumns={7} //指定多少列
                            ListHeaderComponent={() => this._listHeaderComponent()}
                        />
                        <View style={{flexDirection: 'row', height: 30}}>
                            <View style={{flex: 0.56}}/>
                            <TouchableOpacity activeOpacity={0.7}
                                              style={{
                                                  flex: 0.22,
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  marginTop: -15,

                                              }}
                                              onPress={() => {
                                                  this.setState({isShow: false})
                                              }}>
                                <CusBaseText style={{color: COLORS.appColor, fontSize: Adaption.Font(17, 15)}}>
                                    取消
                                </CusBaseText>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7}
                                              style={{
                                                  flex: 0.22,
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  marginTop: -15
                                              }}
                                              onPress={() => {
                                                  this.setState({isShow: false});
                                                  this.props.comformClick ? this.props.comformClick(this.state.current_year,this.state.current_month,this.state.current_day) : null
                                              }}>
                                <CusBaseText style={{color: COLORS.appColor, fontSize: Adaption.Font(17, 15)}}>
                                    确定
                                </CusBaseText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    }

    showAnimated() {
        this.setState({
            isShow: true,
        })
    }
}

const styles = StyleSheet.create({})
