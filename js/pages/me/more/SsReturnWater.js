/**
 * Created by kl on 2018/8/29.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import SegmentedControl from "../../../common/SegmentedControl";
import BaseNetwork from "../../../skframework/component/BaseNetwork";
import Toast, {DURATION} from 'react-native-easy-toast'

export default class SsReturnWater extends Component {


    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({


        header: (
            <CustomNavBar
                centerText={"时时返水"}
                leftClick={() => navigation.goBack()}
                rightView={(
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{
                            flexDirection: 'row',
                            height: 30,
                            width: 85,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginRight: 10,
                            marginTop: SCREEN_HEIGHT == 812 ? 50 : 30,
                        }}
                        onPress={() => navigation.state.params.navigateRightPress(navigation)}>
                        <Image style={{ width: 24, height: 24, marginLeft: 5, }}
                               source={require('../newMe/img/ic_newme_refresh.png')} />
                    </TouchableOpacity>
                )}
            />
        ),

    });

    constructor(props) {
        super(props);
        this.state = {btime: '', etime: '', price: 0, baoBiaoView: [], returnCjbHeader: null, returnCjbContent: null};
    }


    _navigateRightPress = (navigation)=>{
        this.requestData();
    }

    componentWillMount() {
        console.log(this.getMyDate(1524728631));
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false} style={{flex: 1, marginTop: 3}}>
                    <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 10, alignItems: 'center'}}><Text
                        style={{color: 'black', fontSize: 14}}>返水总额 (元) </Text><Text
                        style={styles.unusualStyle}>{this.state.btime} 至 {this.state.etime}</Text></View>
                    <View style={{
                        flexDirection: 'row',
                        marginLeft: 15,
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}><Text style={{color: '#db0000', fontSize: 25}}>{this.state.price}</Text><TouchableOpacity
                        onPress={() => {
                            if(this.state.price == 0){
                                this.refs.toast.show('没有可领取的金额', 1000);
                                return;
                            }
                            this.requestPrizeData();
                        }} activeOpacity={0.8} style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 20,
                        backgroundColor: '#db0000',
                        width: 70,
                        height: 30,
                        borderRadius: 5
                    }}><Image
                        source={require('../img/ic_lingqu.png')} style={{width: 15, height: 13}}/><Text
                        style={{color: 'white', marginLeft: 5}}>领取</Text></TouchableOpacity></View>

                    <View style={{
                        flexDirection: 'row',
                        marginLeft: 15,
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}><Text style={styles.unusualStyle}>计算方式: 返率 x 投注额 = 返水额</Text></View>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#f4f2f3',
                        height: 10,
                        marginVertical: 10
                    }}/>
                    <View style={{marginLeft: 15, marginBottom: 10}}><Text
                        style={styles.titleTextStyle}>我的报表</Text><Text onPress={() => {
                        this.props.navigation.navigate('AccountDetails', {title: '账户明细'})
                    }} style={{
                        color: '#5c9fbd',
                        position:
                            'absolute', right: 10, fontSize: 18
                    }}>查看明细></Text></View>
                    <View style={{
                        flexDirection: 'row',
                        backgroundColor: '#f4f2f3',
                        height: 40,
                        alignItems: 'center'
                    }}><View
                        style={{flex: 1, justifyContent: "center", alignItems: 'center'}}><Text
                        style={styles.textStyle}>类型</Text></View><View
                        style={{flex: 1, justifyContent: "center", alignItems: 'center'}}><Text
                        style={styles.textStyle}>返率</Text></View><View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: 'center'
                        }}><Text style={styles.textStyle}>投注额(元)</Text></View><View
                        style={{flex: 1, justifyContent: "center", alignItems: 'center'}}><Text
                        style={styles.textStyle}>返水额</Text></View></View>

                    {this.state.baoBiaoView}


                    <View
                        style={{flexDirection: 'row', backgroundColor: '#f4f2f3', height: 10, marginBottom: 10}}></View>
                    <View style={{marginLeft: 15, marginBottom: 10}}><Text
                        style={styles.titleTextStyle}>返水层级表</Text></View>
                    {this.state.returnCjbHeader}

                    {this.state.returnCjbContent}


                    {/*留白*/}
                    <View style={{height: 50}}></View>


                </ScrollView>
                <Toast
                    ref="toast"
                    position='center'
                />
                <LoadingView ref='LoadingView'/>
            </View>
        );
    }

    //build报表数据
    loadBaobiaoData(data) {
        this.state.baoBiaoView = [];
        for (let i = 0; i < data.length; i++) {
            this.state.baoBiaoView.push(<View key={i} style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                height: 40,
                alignItems: 'center',
                borderBottomColor: '#dbd9da',
                borderBottomWidth: 1
            }}><View
                style={{flex: 1, justifyContent: "center", alignItems: 'center'}}><Text>{data[i][0]}</Text></View><View
                style={{flex: 1, justifyContent: "center", alignItems: 'center'}}><Text>{data[i][1]}%</Text></View><View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: 'center'
                }}><Text>{data[i][2]}</Text></View><View
                style={{flex: 1, justifyContent: "center", alignItems: 'center'}}><Text>{data[i][3]}</Text></View>
            </View>)
        }
    }

    //build返水层级表数据
    loadRetuenWaterData(data, data2) {

        let childC = [];
        let childE = [];
        for (let i = 0; i < data.length; i++) {
            childC.push(<View key={i}
                              style={styles.titleStyle}><Text style={styles.textStyle}>{data[i]}</Text></View>)
        }
        this.state.returnCjbHeader = (<View style={{
            flexDirection: 'row',
            backgroundColor: '#f9f7f8',
            height: 50,
            alignItems: 'center',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderBottomColor: '#dbd9da',
            borderTopColor: '#dbd9da'

        }}>{childC}</View>);

        for (let j = 0; j < data2.length; j++) {
            childE.push(<View style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    height: 40,
                    alignItems: 'center',

                }}>{this.loadChildView(data2[j])}
                </View>
            )
        }


        this.state.returnCjbContent = childE;


        console.log(this.state.returnCjbContent);


    }


    loadChildView(data) {
        let childArr = [];
        for (let i = 0; i < data.length; i++) {
            childArr.push(<View
                style={styles.unitStyle}><Text>{data[i]}{i == 0 ? '元' : '%'}</Text></View>)
        }

        return childArr;

    }


    //获取返水档案
    requestData() {

        this.refs.LoadingView && this.refs.LoadingView.showLoading('正在请求数据..');
        console.log(global.UserLoginObject.Uid, global.UserLoginObject.Token, global.UserLoginObject.session_key);
        //请求参数
        let params = new FormData();
        params.append("ac", "GetUserRebate");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("sessionkey", global.UserLoginObject.session_key);

        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {
                this.refs.LoadingView && this.refs.LoadingView.cancer();
                if (response.msg == 0) {
                    // console.log("射了吗", response);
                    let data = response.data;
                    if (data) {
                        console.log("data.rebate_head", data.rebate_head);
                        console.log("data.rebate_table", data.rebate_table);
                        console.log("data.rebate_config", data.rebate_config);
                        console.log("data.price", data.price);
                        console.log("data.btime", data.btime);
                        this.loadBaobiaoData(data.rebate_table);
                        this.loadRetuenWaterData(data.rebate_head, data.rebate_config);
                        // this.state.returnCjb =  data.rebate_head;
                        this.setState({
                            btime: data.btime,
                            etime: data.etime,
                            price: data.price
                        });
                        // this.setState({
                        //     btime: this.getMyDate(data.btime),
                        //     etime: this.getMyDate(data.etime),
                        //     price: data.price
                        // });
                        // console.log("data.etime", data.etime);
                    }
                } else {
                    NewWorkAlert(response.param)
                }
            })
            .catch(err => {
            });
    }


    //领取返水金额
    requestPrizeData() {
        // this.refs.LoadingView && this.refs.LoadingView.showLoading('正在领取金额..');
        //请求参数
        let params = new FormData();
        params.append("ac", "GetRebatePrice");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token", global.UserLoginObject.Token);
        params.append("sessionkey", global.UserLoginObject.session_key);

        var promise = BaseNetwork.sendNetworkRequest(params);

        promise
            .then(response => {
                // this.refs.LoadingView && this.refs.LoadingView.cancer();
                if (response.msg == 0) {
                    console.log("成功", response);
                    this.refs.toast.show('金额领取成功!', 1000);

                    setTimeout(()=>{
                    this.setState({price:0});
                    },1000);

                } else {
                    NewWorkAlert(response.param)
                }
            })
            .catch(err => {
                // console.log("错误", err);
            });
    }


    componentDidMount() {
        this.props.navigation.setParams({
            navigateRightPress: this._navigateRightPress,

        });
        this.requestData();
    }

    componentWillReceiveProps(nextProps) {

    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return true;
    // }

    componentWillUpdate() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }


    //获得年月日      得到日期oTime
    getMyDate(str) {
        var oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            // oTime = oYear +'-'+ this.getzf(oMonth) +'-'+ this.getzf(oDay) +' '+ this.getzf(oHour) +':'+ this.getzf(oMin) +':'+this.getzf(oSen);//最后拼接时间
            oTime = this.getzf(oMonth) + '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':' + this.getzf(oMin);//最后拼接时间
        return oTime;
    };

    //补0操作
    getzf(num) {
        if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    unitStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        height: 40,
        borderRightWidth: 1, borderRightColor: '#dbd9da', borderBottomColor: '#dbd9da',
        borderBottomWidth: 1
    },
    titleStyle: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        height: 50,
        borderRightWidth: 1,
        borderRightColor: '#dbd9da'
    },
    textStyle: {
        color: '#3e3e3e',
    },
    titleTextStyle: {
        color: '#838383', fontSize: 18
    },


    unusualStyle: {
        color: '#4f4f4f',
        fontSize: 14
    }

});


