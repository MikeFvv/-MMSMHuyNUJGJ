/**
 * Created by Money on 2018/06/08
 */

import React, { Component } from 'react'
import {
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    Alert,
    Animated,
    Easing,
} from 'react-native'

export default class FBGameBottom extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            isBetter: true,  //是否自动接受最佳赔率　
            singlePrice: '2',  //单注价格，默认为最小下注金额
            willWinMoney: '0.00',  //预计能赢的钱
        });

        this.min_stake = props.nowGameData.min_stake;
        this.max_stake = props.nowGameData.max_stake;

        this.animatedValue = new Animated.Value(1);
        let outputLenth = SCREEN_HEIGHT - 154 - (SCREEN_HEIGHT == 812 ? 54 : 0);
        this.top = this.animatedValue.interpolate({ inputRange: [0, 1], outputRange: [outputLenth, SCREEN_HEIGHT] });
    }


    //接受将要改变的属性
    componentWillReceiveProps(nextProps) {

        if (nextProps.isShowView) {
            Animated.timing(this.animatedValue, { toValue: 0, duration: 300, easing: Easing.easeOut }).start();
        } else {
            Animated.timing(this.animatedValue, { toValue: 1, duration: 300, easing: Easing.easeOut }).start();
        }
    }

    _handleTouZhuParams() {
        // 非综合的，下注参数拼接。
        let sltData = this.props.sltBallData[0];
        let gameData = this.props.nowGameData;

        let paramDic = {
            sport_id: this.props.sport_id,
            history_id: gameData.history_id,
            schedule_id: gameData.schedule_id,
            price: this.state.singlePrice,
            play_method: sltData.d_key,
            k: sltData['k'],
            p: sltData['p'],
            team: sltData['team'] ? sltData['team'] : '',
            subkey: sltData['subkey'] ? sltData['subkey'] : '',
            team_score: gameData.team_score,
            is_all_method: '1',   // 所有玩法 为1。
        };

        let paramData = { is_better: this.state.isBetter, data: [paramDic] };
        return paramData;
    }

    render() {

        let descStr = ''; //选择号码详情
        let peilvStr = ''; //赔率 

        if (this.props.isShowView) {  // 为true有选择的数据

            let sltData = this.props.sltBallData[0];

            if (sltData['kTit'] == null) {
                descStr = sltData['k'];

            } else {
                descStr = sltData['kTit'];  // kTit存在就先取。再判断要不要k

                let preg = /^[a-zA-Z]+$/;
                if (!preg.test(sltData['k'])) { // 如果k都是纯字母的，不要。取反

                    if (!sltData['kTit'].includes(sltData['k']) && sltData['kTit'].length < 7) {  // kTit中包含了 k，也不要。
                        descStr = descStr + sltData['k'];
                    }
                }
            }

            // 再看看ATit有没有，有就要显示。 
            if (sltData['ATit'] != null) {
                let aTit = sltData['ATit'];
                aTit = aTit.replace(/ /g, '');
                aTit = aTit.replace(/（/g, '(');
                aTit = aTit.replace(/）/g, ')');
                descStr = aTit + ' & ' + descStr;
            }

            peilvStr = ' @' + sltData.p;


            /**
             * 可赢金额
             * 让球HC、大小GL： 本金 * 显示赔率
             * 其他都是： 本金 * (显示赔率-1)
             */
            let peilv = 0;
            if (sltData.d_key == 'HC' || sltData.d_key == 'GL' || sltData.d_key == 'HHC' || sltData.d_key == 'HGL') {

                switch (this.props.selectPanKou){
                    case '香港盘':
                        peilv = parseFloat(sltData.HK, 10);  //香港盘盈利等于赔率 X 本金
                        break;
                    case '马来盘':
                        peilv = 1.00;  //马来盘盈利等于本金
                        break;
                    case '印尼盘':
                        peilv = 1.00;   //印尼盘盈利等于本金
                        break;
                    case '欧洲盘':
                        peilv = parseFloat(sltData.DEC, 10) - 1;  //欧洲盘盈利等于赔率 - 1
                }

            } else {
                peilv = parseFloat(sltData.p) - 1;
            }

            this.state.willWinMoney = (parseInt(this.state.singlePrice == '' ? 0 : this.state.singlePrice) * peilv).toFixed(2);
        }

        return (
            <Animated.View style={{ position: 'absolute', width: SCREEN_WIDTH, top: this.top, height: 90 + (SCREEN_HEIGHT == 812 ? 34 : 0), backgroundColor: '#f3f3f3' }}>

                <View style={{ height: 40, backgroundColor: '#eaeaea', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 0.58 }}>
                        <CusBaseText style={{ marginLeft: Adaption.Width(10), fontSize: Adaption.Font(16, 13), color: '#313131' }}>{descStr}
                            <CusBaseText style={{ color: '#e33933' }}>{peilvStr}</CusBaseText>
                        </CusBaseText>
                    </View>
                    <View style={{ flex: 0.42, height: 35, justifyContent: 'center' }}>
                        <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => {
                                this.setState({
                                    isBetter: !this.state.isBetter,
                                })
                            }}>
                            <ImageBackground style={{ width: 16, height: 16 }} source={require('../../img/ic_NormalBox.png')}>
                                {this.state.isBetter ? <Image style={{ width: 15, height: 15 }} source={require('../../img/ic_TickOff.png')} /> : null}
                            </ImageBackground>
                            <CusBaseText style={{ fontSize: Adaption.Font(17, 14), left: 3 }}>自动接受最佳赔率</CusBaseText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 50, backgroundColor: '#434343', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 0.78, flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput
                            style={{ marginLeft: Adaption.Width(10), backgroundColor: '#fff', borderRadius: 3, width: 84, height: 32, color: '#e33933', textAlign: 'center', fontSize: Adaption.Font(17, 14) }}
                            defaultValue={this.state.singlePrice}
                            returnKeyType="done"
                            keyboardType={'number-pad'}
                            maxLength={7}
                            onChangeText={(text) => {
                                this.setState({ singlePrice: text });
                            }}
                            onFocus={() => {  // 获取到焦点 清空输入框内容。
                                this.setState({ singlePrice: '' });
                            }}
                        />
                        <CusBaseText style={{ marginLeft: Adaption.Width(10), fontSize: Adaption.Font(18, 15), color: '#fff' }}>元, 可赢
                            <CusBaseText style={{ color: '#e33933' }}>{this.state.willWinMoney}</CusBaseText>元
                        </CusBaseText>
                    </View>
                    <View style={{ flex: 0.22 }}>
                        <TouchableOpacity activeOpacity={0.7}
                            style={{ height: 50, backgroundColor: '#e33933', justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                // 下注按钮事件
                                if (parseInt(this.state.singlePrice) < this.min_stake) {
                                    Alert.alert('温馨提示', `最低下注金额为${this.min_stake}元`, [{ text: '确定', onPress: () => { } }])

                                } else if (parseInt(this.state.singlePrice) > this.max_stake) {
                                    Alert.alert('温馨提示', `最高下注金额为${this.max_stake}元`, [{ text: '确定', onPress: () => { } }])

                                } else if (this.props.sltBallData.length > 0 && this.props.sltBallData[0].d_key != null) {
                                    let paramData = this._handleTouZhuParams();
                                    this.props.xiaZhuClick ? this.props.xiaZhuClick(paramData) : null;
                                }
                            }}>
                            <CusBaseText style={{ color: 'white', fontSize: Adaption.Font(18, 15) }}>下 注</CusBaseText>
                        </TouchableOpacity>
                    </View>
                </View>

            </Animated.View>
        );
    }
}
