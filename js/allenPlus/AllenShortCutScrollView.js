/**
 * Created by Allen on 2018/2/03.
 */
import {

    Dimensions,

    View,
    StyleSheet,
    Image,

    TouchableOpacity,
    AsyncStorage,
    ScrollView, PanResponder,

} from 'react-native';

import React, {Component} from 'react';
import Moment from 'moment'; //日期计算控件
import BaseNetwork from '../skframework/component/BaseNetwork';
// import AllenTestView from "./AllenDragAndReplace";


var {width, height} = Dimensions.get('window');
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;
let scrollViewImgs = {
    '个人消息': require('./person_info.png'),
    '充值': require('./chongzhi.png'),
    '提现': require('./tikuan.png'),
    '代理中心': require('./daili_center.png'),
    '安全中心': require('./safe_center.png'),
    '投注记录': require('./touzhu_record.png'),
    '客服': require('./kefu2.png'),
    '提款记录': require('./tikuan_record2.png'),
    '充值记录': require('./chongzhi_record2.png'),
    '活动': require('./huodong.png'),
    '签到': require('./qiandao.png'),
    '现金交易': require('./cashjiaoyi.png'),
    // '每日盈亏': require('./meiriyingkui.png'),
    '账户明细': require('./zhanghumingxi.png'),
    '中奖记录': require('./zhongjiang_record.png'),
    '购彩大厅': require('./goucai.png')
};
export default class AllenShortCutScrollView extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                width: props.width,
                height: props.height,
                selectedImageIndex: 0,
                navigate: props.navigate,
                hideCommonCallBack: props.hideCommonCallBack,
                sign_event: props.sign_event,
                Level: props.Level

            };

        this._index = 0;// 当前正在显示的图片
        this._max = 3;
        this.defalutFunc = [];
    }

    componentWillMount() {
        // this.wrapperPanResponder = PanResponder.create({
        //     onStartShouldSetPanResponder: (e, g) => true,
        //     onPanResponderGrant: () => {
        //         console.log('GRANTED TO WRAPPER');
        //     },
        //     onPanResponderMove: (evt, gestureState) => {
        //         console.log('WRAPPER MOVED');
        //     }
        // });

        this.scollerPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, g) => true,
            onPanResponderGrant: () => {
                console.log('GRANTED TO SCROLLER');
            },
            onPanResponderMove: (evt, gestureState) => {
                console.log('SCROLLER MOVED');
            }
        });
        let key = 'defalutFunc';
        AsyncStorage.getItem(key, (error, result) => {
            //  console.log("我1");
            // console.log("1",error,result);
            if (!error) {
                if (result !== '' && result !== null) {
                    // console.log("result1",result);
                    var arr = JSON.parse(result);
                    this.defalutFunc = arr;
                    //  this.createDefalutContent();
                    this.defalutFunc.push('添加');
                    this.setState({});

                } else {
                    // this.defalutFunc = ['充值', '提现', '活动', '签到', '现金交易', '每日盈亏'];
                    this.defalutFunc = ['充值', '提现', '活动', '签到', '现金交易','购彩大厅'];
                    this.defalutFunc.push('添加');
                    // this.createDefalutContent();
                    this.setState({});
                }
            } else {
                // this.defalutFunc = ['充值', '提现', '活动', '签到', '现金交易', '每日盈亏'];
                this.defalutFunc = ['充值', '提现', '活动', '签到', '现金交易','购彩大厅'];
                this.defalutFunc.push('添加');
                //this.createDefalutContent();
                this.setState({});
            }
        });
    }


    render() {


        // 小圆点指示器
        let circles = [];

        // 小圆点位置居中显示
        let imageLength = 2;
        let circleLength = 6 * imageLength + 5 * 2 * imageLength;
        let center = (this.state.width - circleLength) / 2;


        let pageCount = Math.ceil(this.defalutFunc.length / 8.0);
        let pageArray = [];
        for (let j = 0; j < pageCount; j++) {
            circles.push(<View key={j}
                               style={(j == this.state.selectedImageIndex) ? styles.circleSelected : styles.circle}/>);
            // console.log(this.defalutFunc.slice(j*8,j*8+8));
            pageArray.push(<View key={j + ""} style={[styles.pageStyle, {width: this.state.width}]}><Page
                sendEmoji={this.props.sendEmojiMessage} index={0} dataS={this.defalutFunc.slice(j * 8, j * 8 + 8)}
                hasAdd={j + 1 == pageCount ? true : false} navigate={this.state.navigate}
                hideCommonCallBack={this.state.hideCommonCallBack} Level={this.state.Level}
                sign_event={this.state.sign_event}/></View>)
        }
        // console.log("circle", circles);


        return (
            <View  style={[styles.viewPager,{height: this.state.height}]}>
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    style={[styles.viewPager, {height: this.state.height}]}
                    pagingEnabled={true}
                    // onTouchStart={()=> console.log('开始')}
                    // onTouchEnd={()=>this._onTouchEnd()}
                    // onTouchMove={(e)=>this.onTouchMove()}
                    onMomentumScrollEnd={(e) => this.onAnimationEnd(e)}
                    ref={(scrollView) => {
                        this._scrollView = scrollView;
                    }}
                >

                    {pageArray}
                </ScrollView>
                <View style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: iphone5S ? 10 : 20,
                    left: center
                }}>{circles}</View>
            </View>
        );
    }


    componentDidMount() {

    }


    componentWillUnmount() {


        // if (typeof(this.subscription) == 'object'){
        //     console.log("loginObject 销毁");
        //     this.subscription && this.subscription.remove();
        // }


    }

    _onScroll(e) {
        // console.log(this._scrollView);
        // this._contentOffsetX = this._scrollView.contentOffset.x;
        // this._index = Math.round(this._contentOffsetX / width);
    }

    _onTouchEnd(e) {
        // console.log("end",this._scrollView.contentOffset);
        // 先滑动到指定index位置，再开启定时任务
        // this._scrollView.scrollTo({x:this._index * screenWidth},true);
        // 重置小圆点指示器
        // this._refreshFocusIndicator();
        // this._runFocusImage();
    }

    _refreshFocusIndicator() {
        this.setState({selectedImageIndex: this._index});
    }

    onTouchMove(e) {
        // console.log("move",this._scrollView.contentOffset);
    }


    onAnimationEnd(e) {
        let offSetX = e.nativeEvent.contentOffset.x;
        // console.log(offSetX,width);
        this._index = Math.floor(offSetX / this.state.width);
        // console.log(this._index);
        this._refreshFocusIndicator();
    }


}

class Page extends Component {
    render() {


        return (<View>{this.page}</View>);
    }


    sendEmoji(content) {
        this.props.sendEmojiMessage(content);
    }

    componentWillMount() {
        // console.log("老子社会上的");
        this._gestureHandlers = {
            onStartShouldSetResponderCapture: () => false,
            onResponderTerminationRequest: () => false,
            onStartShouldSetResponder: () => true,  //对触摸进行响应
            onMoveShouldSetResponder: () => false,  //对滑动进行响应
            onResponderGrant: (evt) => {
                // console.log("parent onResponseGrant");
                // console.log(evt);
                // console.log(evt.target);
                // this.setState({showEmoji:false,showMore:false});
                // this.setState({bg: 'red'});
            }, //激活时做的动作
            onResponderMove: () => {
                // console.log("parent onResponderMove");
            },  //移动时作出的动作
            onResponderRelease: function (evt) {
                // console.log("parent onResponseRelease");
                // console.log(evt.locationX);
                // console.log(evt.target);
                // console.log(this);
                // this.setState({bg: 'white'})
                // this.setState({showEmoji:false,showMore:false});
            }, //动作释放后做的动作
        }


        let {sendEmojiMessage, dataS, hasAdd} = this.props;
        // console.log("dataS", dataS, hasAdd);

        let column = Math.ceil(dataS.length / 4.0);

        this.page = [];
        let count = 0;
        for (let j = 0; j < column; j++) {
            var row = [];
            for (let i = 0; i < 4; i++) {
                count++;
                if (dataS.length == count && hasAdd) {
                    row.push(
                        <View id={i} key={i} style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 10,
                            paddingBottom: 10,


                        }}>
                            <TouchableOpacity activeOpacity={0.7} style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }} key={{i}} onPress={(a, b) => {
                                // console.log(this.state.hideCommonCallBack);
                                this.props.hideCommonCallBack ? this.props.hideCommonCallBack() : null;
                                // this.props.navigate('AllenShortCutMainView', {title: '添加快捷方式'})
                                // this.props.navigate('AllenTestView', {title: '添加快捷方式'})
                                this.props.navigate('AllenDragShortCutMainView', {title: '添加快捷方式'})
                                //this.props.sendEmoji?this.props.sendEmoji(smiley.data[i * 7 + j + this.props.index * 20]):null;
                            }}><Image source={require('./add.png')}
                                      style={{width: iphone5S ? 40 : 60, height: iphone5S ? 40 : 60}}/><CusBaseText
                                allowFontScaling={false}
                                style={{
                                    color: '#171717',
                                    marginTop: 10
                                }}>{dataS[count - 1]}</CusBaseText></TouchableOpacity>
                        </View>
                    );

                    // break;


                } else {

                    row.push(
                        <View id={i} key={i} style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 10,
                            paddingBottom: 10,

                        }}>{count <= dataS.length ?
                            <TouchableOpacity activeOpacity={0.7} style={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }} key={{i}} onPress={(a, b) => {
                                //  console.log(count,j*4+i,i);
                                this.switchnavigate(dataS[j * 4 + i], this.props.navigate);
                                //this.props.sendEmoji?this.props.sendEmoji(smiley.data[i * 7 + j + this.props.index * 20]):null;
                                // this.switchnavigate(dataS[count - 1]);
                            }}><View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: iphone5S ? 20 : 30,
                                shadowColor: '#cdcdcd',
                                shadowOffset: {h: 50, w: 50},
                                shadowRadius: 5,
                                shadowOpacity: 0.9,
                                width: iphone5S ? 40 : 60,
                                height: iphone5S ? 40 : 60
                            }}><Image source={scrollViewImgs[dataS[count - 1]]} style={{
                                width: iphone5S ? 20 : 30,
                                height: iphone5S ? 20 : 30
                            }}/></View><CusBaseText
                                allowFontScaling={false}
                                style={{
                                    color: '#171717',
                                    marginTop: 10
                                }}>{dataS[count - 1]}</CusBaseText></TouchableOpacity> : null}
                        </View>
                    );
                }


            }


            this.page.push(
                <View key={"row" + j} style={{flexDirection: 'row'}}>
                    {row}
                </View>
            );
        }


    }

    switchnavigate(item, navigate) {

        this.props.hideCommonCallBack ? this.props.hideCommonCallBack() : null;
        // console.log(item, this.props.sign_event, this.props.Level);
        switch (item) {
            case "提款记录":
                navigate('BuyRecord', {title: '提款记录'});
                break;

            case "充值记录":
                navigate('RechargeRecord', {title: '充值记录'});
                break;

            case "账户明细":
                navigate('AccountDetails', {title: '账户明细'});
                break;

            case "提现":
                let userKey = 'userInfo';
                UserDefalts.getItem(userKey, (error, result) => {
                    if (!error) {
                        if (result !== '' && result !== null) {

                            let loginObject = JSON.parse(result);
                          
                        
                                   if (global.UserLoginObject.Card_num){
                                       navigate('DrawalInfo');
                                   }
                                   else {
                                       navigate('BindBankCard',{callback: () => {},BindBankCardPreviousAction:'DrawalCenter'});
                                   }
                                   return;
                                 
                        }
                    }
                });
                break;

            case "客服":
                navigate('ChatService', {title: '在线客服', callback: () => {}});
                break;

            case "签到":
                if (QianDaoWeiHu==60007) {
                    setTimeout(()=>{
                        Alert.alert(
                            '提示',
                            '该通道未开通',
                            [
                                {
                                    text: '确定', onPress: () => {
                                    }
                                },
                            ]
                        )
                    },100)

                } else {
                    navigate('DailyAttendance',{ callback: () => {
                    }})
                }
                break;

            case "充值":
                navigate('RechargeCenter')
                break;

            case "安全中心":
                navigate('Safetycenter', {title: '安全中心', callback: () => {

                }});
                break;

            case "活动":
                navigate('Preferential');
                break;

            case "投注记录":
                navigate('TouZhuRecord', {wanfa: 1});
                break;

            case "中奖记录":
                navigate('MeWinRecord', {title: '中奖记录'});
                break;

            case "个人消息":
                navigate('PersonalMessage', {
                    callback: () => {
                        this._fetchPersonalMessageData()
                    }
                })
                break;

            case "现金交易":
                let key = 'userInfo';
                UserDefalts.getItem(key, (error, result) => {
                    if (!error) {
                        if (result !== '' && result !== null) {
                            let loginObject = JSON.parse(result);

                         
                                   if (global.UserLoginObject.Card_num){
                                       navigate('CashTrasaAcount');
                                   }
                                   else {
                                       navigate('BindBankCard',{callback: () => {},BindBankCardPreviousAction:'CashTrasaCenter'});
                                   }
                                   return;
                            
                        }
                    }
                });
                break;

            case "每日盈亏":
                navigate('TodayProfitLoss');
                break;

            case "代理中心":
                if (this.props.Level == 0) {
                    navigate('ApplicationAgentDelege')
                } else {
                    navigate('Theagency', {title: '代理中心'})
                }
                break;
            case "购彩大厅":
                navigate('BuyLot');
                break;

        }
    }


    //获取个人消息数据
    _fetchPersonalMessageData() {


        if (global.UserLoginObject.Uid != '' && global.UserLoginObject.Token != '') {
            //请求参数
            let params = new FormData();
            params.append("ac", "getUserMessage");
            params.append("uid", global.UserLoginObject.Uid);
            params.append("token", global.UserLoginObject.Token);
            params.append("bdate", "1970-01-01");
            params.append("edate", Moment().format('YYYY-MM-DD'));
            params.append("type", '1');
            params.append("limit", "20");

            var promise = BaseNetwork.sendNetworkRequest(params);

            promise
                .then(response => {
                    if (response.msg == 0) {
                        let datalist = response.data;
                        if (response.data == null || response.data.length == 0) {
                            this.setState({messageArray: []})
                        } else {
                            let dataBlog = [];
                            let i = 0;
                            datalist.map(dict => {
                                dataBlog.push({key: i, value: dict});
                                i++;
                            });
                            this.setState({messageArray: dataBlog})
                            datalist = null;
                            dataBlog = null;
                        }

                    } else {

                    }

                })
                .catch(err => {
                });
        }
    }
}

const styles = StyleSheet.create({
    viewPager: {

        height: 200,
        // backgroundColor: 'red',
    },
    pageStyle: {
        width: width,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10,
        paddingBottom: 10,
    },
    emojiIcon: {
        width: 30,
        height: 30,
    },
    emojiDelIcon: {
        width: 30,
        height: 24,
    },
    circleContainer: {
        position: 'absolute',
        left: 0,
        top: 120,
    },
    circle: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(229,229,229,1.0)',
        marginHorizontal: 5,
    },
    circleSelected: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(180,180,180,1.0)',
        marginHorizontal: 5,
    }

});
