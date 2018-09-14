import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Keyboard,
} from 'react-native';

class NormalBottomTool extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            slectMutiple: global.BeiShu,   //使用缓存的倍数
            slectQiShu: global.ZhuiQiShu,  //使用缓存的期数
            isStop: false,
            isBeiShuSlect: true,   //  是否选择了倍数
            textInputOneIsFocus:true,
            textInputTwoIsFocus:true,
            keyboardisShow:false,
            isFirstShow:true,
            isShowBottomContent:false
        });
    }

    //清空号码时重置倍数，期数数据
    componentWillMount() {

        this.subscription = PushNotification.addListener('ClearAllBalls', () => {
            this.setState({
                slectMutiple: global.BeiShu,   //使用缓存的倍数
                slectQiShu: global.ZhuiQiShu,  //使用缓存的期数
            })
        });

        // 键盘收回
        // this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', (event) => {
        //     // onBlur处也行
        //     // this.setState({
        //     //     isShowToolView: false,
        //     // });
        //     this.props.isDisplayView ? this.props.isDisplayView(false) : null;
        // });

        this.keyboardDidShowListener =  Keyboard.addListener('keyboardWillShow',this.updateKeyboardSpace.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide',this.resetKeyboardSpace.bind(this));
        this.keyboardDiddHideListener = Keyboard.addListener('keyboardDidHide',this.resetKeyboardSpacee.bind(this));
    }

    updateKeyboardSpace(frames){


        if(!this.state.keyboardisShow){
            this.props.fatherView.setNativeProps({
                        style: {marginTop: -56},
        });

        }else{
            if(this.state.textInputTwoIsFocus&&(!this.state.textInputOneIsFocus)){
                    Keyboard.dismiss();
                    setTimeout(()=>{this.refs.tp2.focus()},500);
            }else if(this.state.textInputOneIsFocus&&(!this.state.textInputTwoIsFocus)){
                Keyboard.dismiss();
                setTimeout(()=>{this.refs.tp1.focus()},500);
            }else{

            }
        }

        // })
        this.state.keyboardisShow = true;
    }
    resetKeyboardSpace(frames){

        this.props.fatherView.setNativeProps({
            style: {marginTop:0},
        });
        this.state.keyboardisShow = false;
        this.state.isShowBottomContent=false;
    }

    resetKeyboardSpacee(){
        this.state.isShowBottomContent=false;
    }


    componentWillUnmount() {
        if (typeof (this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        if (typeof (this.keyboardWillHideSub) == 'object') {
            this.keyboardWillHideSub && this.keyboardWillHideSub.remove();
        }

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.keyboardDiddHideListener.remove();
    }


    render() {

        //手动保留小数点后面两位
        let price = this.props.totalPrice;
        if (typeof (this.props.totalPrice) == 'number') {
            price = this.props.totalPrice.toFixed(2);
        }

        return (
            <View style={[this.props.style, {marginTop:this.state.isShowBottomContent?10:60}]} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', height: 40 }}>
                    
                    {/* 追期。 低频彩 不显示追期 */}
                    {this.props.speed == 1 ?
                        <View style={{ flex: 0.5, justifyContent: 'center', flexDirection: 'row' }}>
                            <CusBaseText style={{ marginTop: 10, fontSize: Adaption.Font(17, 15) }}>追 </CusBaseText>
                            <TextInput
                                ref='tp1'
                                style={{ padding: 0, width: Adaption.Width(80), fontSize: Adaption.Font(17, 15), height: 30, borderColor: 'lightgrey', borderWidth: 1, backgroundColor: '#fff', marginTop: 5, borderRadius: 3, textAlign: 'center' }}
                                keyboardType={'number-pad'}
                                returnKeyType="done"
                                maxLength={4}
                                defaultValue={this.state.slectQiShu}
                                onChangeText={(text) => {
                                    // 期数  这里不需要一直用setState赋值。
                                    if (text == '' || text == '0') {
                                        this.setState({
                                            slectQiShu: text,
                                        });
                                    } else {
                                        this.state.slectQiShu = text;
                                    }
                                }}
                                onFocus={() => { // 文本框获取到焦点
                                    this.state.textInputOneIsFocus=true;
                                    this.state.isShowBottomContent = true;
                                    this.setState({
                                        isBeiShuSlect: false,
                                    });
                                    // console.log('你哦麻痹1',this.props.fatherView);
                                    // setTimeout(()=>{ this.props.fatherView.setNativeProps({
                                    //     style: {marginTop:-60},
                                    // });},1000);

                                }}
                                onBlur={() => {
                                    this.state.textInputOneIsFocus=false;
                                    this.state.isShowBottomContent = false;
                                    // console.log('你哦麻痹11',this.props.fatherView);
                                    // this.props.fatherView.setNativeProps({
                                    //     style: {marginTop:0},
                                    // });
                                    // Keyboard.dismiss();
                                    // // this.refs.tp2.focus();
                                    // setTimeout(()=>{
                                    //     this.refs.tp2.focus();
                                    // },300);

                                    // if(this.state.textInputTwoIsBlur){
                                    //     Keyboard.dismiss();
                                    //     setTimeout(()=>{
                                    //         this.refs.tp2.focus();
                                    //     },300);
                                    //
                                    // }

                                    // 文本框失去焦点
                                    // 如果输入了 空格或0，那就直接给1
                                    let isQiShu0 = this.state.slectQiShu == '' || this.state.slectQiShu == '0';
                                    if (isQiShu0) {
                                        this.setState({
                                            slectQiShu: '1',
                                        });
                                    }
                                    this.state.textInputOneIsFocus = false;
                                    // console.log('你哦麻痹11',this.state.textInputOneIsFocus,this.state.textInputTwoIsFocus);
                                    this.props.qishuClick ? this.props.qishuClick(isQiShu0 ? '1' : this.state.slectQiShu) : null;  //回调输入的倍数
                                }}
                            >
                            </TextInput>
                            <CusBaseText style={{ marginTop: 10, fontSize: Adaption.Font(17, 15) }}> 期</CusBaseText>
                        </View> 
                        : null
                    }

                    {/* 投倍 */}
                    <View style={{ flex: 0.5, justifyContent: 'center', flexDirection: 'row' }}>
                        <CusBaseText style={{ marginTop: 10, fontSize: Adaption.Font(17, 15) }}>投 </CusBaseText>
                        <TextInput
                            ref='tp2'
                            style={{ padding: 0, width: Adaption.Width(80), fontSize: Adaption.Font(17, 15), height: 30, borderColor: 'lightgrey', borderWidth: 1, backgroundColor: '#fff', marginTop: 5, borderRadius: 3, textAlign: 'center' }}
                            keyboardType={'number-pad'}
                            returnKeyType="done"
                            maxLength={5}
                            defaultValue={this.state.slectMutiple}
                            onChangeText={(text) => {
                                // 倍数 这里不需要一直用setState赋值。
                                if (text == '' || text == '0') {
                                    this.setState({
                                        slectMutiple: text,
                                    });
                                } else {
                                    this.state.slectMutiple = text;
                                }
                            }}
                            onFocus={() => {
                                // this.state.textInputTwoIsFocus = true;
                               this.state.textInputTwoIsFocus=true;
                                this.state.isShowBottomContent = true;
                                this.setState({
                                    isBeiShuSlect: true,
                                });
                                // console.log('你哦麻痹2',this.props.fatherView);
                                // setTimeout(()=>{
                                //     console.log("超市",this.props.fatherView);
                                //     this.props.fatherView.setNativeProps({
                                //         style: {marginTop:0},
                                //     });
                                // },1000);
                            }}
                            onBlur={() => {
                                // console.log('你哦麻痹22',this.props.fatherView);
                                this.state.textInputTwoIsFocus=false;
                                this.state.isShowBottomContent = false;
                                // Keyboard.dismiss();
                                // this.refs.tp2.focus();
                                // setTimeout(()=>{
                                //     this.refs.tp1.focus();
                                // },300);

                                // if(this.state.textInputOneIsBlur){
                                //     Keyboard.dismiss();
                                //     setTimeout(()=>{
                                //             this.refs.tp1.focus();
                                //         },300);
                                //
                                // }
                                let isMutiple0 = this.state.slectMutiple == '' || this.state.slectMutiple == '0';
                                if (isMutiple0) {
                                    this.setState({
                                        slectMutiple: '1',
                                    });
                                }
                                // this.state.textInputTwoIsFocus = false;
                                // console.log('你哦麻痹22',this.state.textInputOneIsFocus,this.state.textInputTwoIsFocus);
                                this.props.multipleClick ? this.props.multipleClick(isMutiple0 ? '1' : this.state.slectMutiple) : null;  //回调输入的倍数
                            }}
                        >
                        </TextInput>
                        <CusBaseText style={{ marginTop: 10, fontSize: Adaption.Font(17, 15) }}> 倍</CusBaseText>
                    </View>
                </View>

                {this.state.isShowBottomContent?(<View style={{ height: 60 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', height: this.state.isBeiShuSlect ? 50 : 30}}>
                        {this._qishu_beishuBtnViews_isBeishu(this.state.isBeiShuSlect)}
                    </View>

                    {/* 倍数 不显示中奖停追 */}
                    {this.state.isBeiShuSlect == false
                        ? <View style={{ height: 30, flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity activeOpacity={1} style={styles.check_Box}
                                onPress={() => {
                                    this.props.isRunStopClick ? this.props.isRunStopClick(!this.state.isStop) : null;
                                    this.setState({ isStop: !this.state.isStop });
                                }}>
                                {this.state.isStop
                                    ? <Image style={{ width: 20, height: 20, borderColor: '#a5a5a5', borderWidth: 1 }} source={require('../../touzhu2.0/img/ic_smart_checkBox.png')} />
                                    : <View style={{ borderColor: '#a5a5a5', borderWidth: 1, width: 20, height: 20 }} />
                                }
                                <CusBaseText style={{ fontSize: Adaption.Font(17, 15), marginLeft: 5 }}>中奖后停止追号</CusBaseText>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                </View>):null}


                {/*清空按钮*/}
                <View style={{ flexDirection: 'row', height: 50, borderColor: "#d5d5d5", borderTopWidth: 1 }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.clearAllNumOnPress ? this.props.clearAllNumOnPress() : null;
                        }}>
                        <View style={{ flexDirection: 'row', width: 80, height: 48, alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={require('../../../img/ic_buy_car_delete.png')} style={{ width: 20, height: 20 }} />
                            <Text allowFontScaling={false} style={{ color: '#6a6a6a' }} >  清空</Text>
                        </View>
                    </TouchableOpacity>

                    {/*分割线*/}
                    <View style={{ backgroundColor: '#dbdbdb', height: 35, marginTop: 7, width: 0.5 }} />

                    <View style={{ height: 48, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <CusBaseText style={{ paddingLeft: (SCREEN_WIDTH == 320 ? 4 : 12), color: '#6a6a6a', fontSize: Adaption.Font(17, 15) }}> 共
                           <CusBaseText style={{ color: 'red' }}> {this.props.zhuShu} </CusBaseText>注
                           <CusBaseText style={{ color: 'red' }}> {price} </CusBaseText>元
                       </CusBaseText>
                    </View>
                    {/* 确认投注按钮 */}
                    <TouchableOpacity activeOpacity={0.5} style={{ width: 100, height: 49,  justifyContent: 'center', alignItems: 'center', backgroundColor: '#e33a38' }}

                                      onPress={() => {
                            this.props.comformOnPress ? this.props.comformOnPress() : null;
                        }}>
                        <CusBaseText style={{ backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 17 }}>确认投注</CusBaseText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _qishu_beishuBtnViews_isBeishu(isBeishu) {
        let titArr = isBeishu ? ['5', '10', '20', '50', '100'] : ['5', '10', '20', '50', '100'];
        var viewArr = [];
        for (let i = 0; i < titArr.length; i++) {
            viewArr.push(
                <TouchableOpacity key={i} style={[styles.multiple_Box, { flex: 1.0 / (titArr.length + 1), height: Adaption.Width(isBeishu ? 38 : 30) }]}
                    onPress={() => {
                        if (isBeishu) {
                            this.setState({
                                slectMutiple: titArr[i],
                            });
                            this.props.multipleClick ? this.props.multipleClick(titArr[i]) : null;
                        } else {
                            this.setState({
                                slectQiShu: titArr[i],
                            });
                            this.props.qishuClick ? this.props.qishuClick(titArr[i]) : null;
                        }
                    }}>
                    <CusBaseText style={{ color: 'black', fontSize: Adaption.Font(16, 14) }}>{isBeishu ? `${titArr[i]}倍` : `${titArr[i]}期`}</CusBaseText>
                </TouchableOpacity>
            )
        }
        return viewArr;
    }


    componentWillReceiveProps(nextProps) {
        this.props.fatherView = nextProps.fatherView;
    }
}

const styles = StyleSheet.create({

    check_Box: {
        height: 20,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    multiple_Box: {
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NormalBottomTool;
