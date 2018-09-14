/**
 * Created by Allen on 2018/4/18.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    Keyboard, Animated,
} from 'react-native';

class AllenBottomTool extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            slectMutiple: global.BeiShu,   //使用缓存的倍数
            slectQiShu: global.ZhuiQiShu,  //使用缓存的期数
            isStop: true,
            isBeiShuSlect: true,   //  是否选择了倍数
            textInputOneIsFocus: true,
            textInputTwoIsFocus: true,
            keyboardisShow: false,
            isFirstShow: true,
            isShowBottomContent: false,
            defaultQishuText: '',
            defaultBeishuText: '',
            isShowKeyboardView: false,
            keyboardHiden1:true,
            keyboardHiden2:true,
            wenziWidth:0,
            wenziWidth2:0
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

        // this.keyboardDidShowListener =  Keyboard.addListener('keyboardWillShow',this.updateKeyboardSpace.bind(this));
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide',this.resetKeyboardSpace.bind(this));
        // this.keyboardDiddHideListener = Keyboard.addListener('keyboardDidHide',this.resetKeyboardSpacee.bind(this));
    }

    // updateKeyboardSpace(frames){
    //
    //
    //     if(!this.state.keyboardisShow){
    //         this.props.fatherView.setNativeProps({
    //             style: {marginTop: -56},
    //         });
    //
    //     }else{
    //         if(this.state.textInputTwoIsFocus&&(!this.state.textInputOneIsFocus)){
    //             Keyboard.dismiss();
    //             setTimeout(()=>{this.refs.tp2.focus()},500);
    //         }else if(this.state.textInputOneIsFocus&&(!this.state.textInputTwoIsFocus)){
    //             Keyboard.dismiss();
    //             setTimeout(()=>{this.refs.tp1.focus()},500);
    //         }else{
    //
    //         }
    //     }
    //
    //     // })
    //     this.state.keyboardisShow = true;
    // }
    // resetKeyboardSpace(frames){
    //
    //     this.props.fatherView.setNativeProps({
    //         style: {marginTop:0},
    //     });
    //     this.state.keyboardisShow = false;
    //     this.state.isShowBottomContent=false;
    // }
    //
    // resetKeyboardSpacee(){
    //     this.state.isShowBottomContent=false;
    // }


    componentWillUnmount() {
        if (typeof (this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        if (typeof (this.keyboardWillHideSub) == 'object') {
            this.keyboardWillHideSub && this.keyboardWillHideSub.remove();
        }

        // this.keyboardDidShowListener.remove();
        // this.keyboardDidHideListener.remove();
        // this.keyboardDiddHideListener.remove();
    }


    render() {

        //手动保留小数点后面两位
        let price = this.props.totalPrice;
        if (typeof (this.props.totalPrice) == 'number') {
            price = this.props.totalPrice.toFixed(2);
        }

        return (
            <View style={[this.props.style, {marginTop: this.state.isShowBottomContent ? 0 : 0}]}>
                <View
                    style={{flexDirection: 'row', justifyContent: 'space-around', height: 40}}>

                    {/* 追期。 低频彩 不显示追期 */}
                    {this.props.speed == 1 ?
                        <View style={{flex: 0.5, justifyContent: 'center', flexDirection: 'row'}}>
                            <CusBaseText style={{marginTop: 10, fontSize: Adaption.Font(17, 15)}}>追 </CusBaseText>
                            <TouchableOpacity activeOpacity={1} style={{
                                borderColor: '#d3d3d3',
                                borderWidth: 1,
                                borderRadius: 3,
                                alignItems: 'center',
                                flexDirection: 'row',
                                height: 30,
                                width: Adaption.Width(80),
                                marginTop: 5
                            }}
                                              onPress={() => {
                                                  // this.setState({
                                                  //     isShowKeyboardView:true,
                                                  // })
                                                  this.state.keyboardHiden2= true;
                                                  this.AllenFadeInView.setNativeProps({ style: {left:Adaption.Width(10)*2 + this.state.wenziWidth }});
                                                  this.state.keyboardHiden1 = false;
                                                  this.state.isShowBottomContent = true;
                                                  this.state.isBeiShuSlect = false;
                                                  this.props.keyboardCallBack(true, '1');
                                                  let isMutiple0 = this.state.slectMutiple == '' || this.state.slectMutiple == '0';
                                                  // this.setState({slectMutiple:isMutiple0?'1':this.state.slectMutiple});
                                                  this.props.changeOrginl ? this.props.changeOrginl('2', isMutiple0 ? '1' : this.state.slectMutiple) : null;
                                                  this.state.slectMutiple = isMutiple0 ? '1' : this.state.slectMutiple;
                                                  this.props.multipleClick ? this.props.multipleClick(isMutiple0 ? '1' : this.state.slectMutiple) : null;
                                                  this.setState({});

                                              }}>
                                <AllenFadeInView ref={(c) => this.AllenFadeInView = c}
                                                 hasContent={this.state.keyboardHiden1? true : false}
                                                 style={{
                                    position: 'absolute',
                                    left: Adaption.Width(10),
                                    width: 2,
                                    height: 16,
                                    top: 6,
                                    backgroundColor: '#456FEE'
                                }}>
                                </AllenFadeInView>
                                <Text allowFontScaling={false} onLayout={(e) => { this._onlayout(e);


                                }} style={{
                                    color: this.state.slectQiShu.length <= 0 ? '#888' : '#000',
                                    marginLeft: 15,
                                    fontSize: Adaption.Font(16, 13)
                                }}>
                                    <Text style={{}} onLayout={(e) => {
                                        // console.log(e);
                                    }}>{this.state.slectQiShu.length <= 0 ? this.state.defaultQishuText : this.state.slectQiShu}</Text>
                                </Text>
                            </TouchableOpacity>
                            {/*<TextInput*/}
                            {/*ref='tp1'*/}
                            {/*style={{ padding: 0, width: Adaption.Width(80), fontSize: Adaption.Font(17, 15), height: 30, borderColor: 'lightgrey', borderWidth: 1, backgroundColor: '#fff', marginTop: 5, borderRadius: 3, textAlign: 'center' }}*/}
                            {/*keyboardType={'number-pad'}*/}
                            {/*returnKeyType="done"*/}
                            {/*maxLength={4}*/}
                            {/*defaultValue={this.state.slectQiShu}*/}
                            {/*onChangeText={(text) => {*/}
                            {/*// 期数  这里不需要一直用setState赋值。*/}
                            {/*if (text == '' || text == '0') {*/}
                            {/*this.setState({*/}
                            {/*slectQiShu: text,*/}
                            {/*});*/}
                            {/*} else {*/}
                            {/*this.state.slectQiShu = text;*/}
                            {/*}*/}
                            {/*}}*/}
                            {/*onFocus={() => { // 文本框获取到焦点*/}

                            {/*this.setState({*/}
                            {/*isBeiShuSlect: false,*/}
                            {/*});*/}


                            {/*}}*/}
                            {/*onBlur={() => {*/}

                            {/*// 文本框失去焦点*/}
                            {/*// 如果输入了 空格或0，那就直接给1*/}
                            {/*let isQiShu0 = this.state.slectQiShu == '' || this.state.slectQiShu == '0';*/}
                            {/*if (isQiShu0) {*/}
                            {/*this.setState({*/}
                            {/*slectQiShu: '1',*/}
                            {/*});*/}
                            {/*}*/}

                            {/*this.props.qishuClick ? this.props.qishuClick(isQiShu0 ? '1' : this.state.slectQiShu) : null;  //回调输入的倍数*/}
                            {/*}}*/}
                            {/*>*/}
                            {/*</TextInput>*/}
                            <CusBaseText style={{marginTop: 10, fontSize: Adaption.Font(17, 15)}}> 期</CusBaseText>
                        </View>
                        : null
                    }

                    {/* 投倍 */}
                    <View style={{flex: 0.5, justifyContent: 'center', flexDirection: 'row'}}>
                        <CusBaseText style={{marginTop: 10, fontSize: Adaption.Font(17, 15)}}>投 </CusBaseText>
                        <TouchableOpacity activeOpacity={1} style={{
                            borderColor: '#d3d3d3',
                            borderWidth: 1,
                            borderRadius: 3,
                            alignItems: 'center',
                            flexDirection: 'row',
                            height: 30,
                            width: Adaption.Width(80),
                            marginTop: 5
                        }}
                                          onPress={() => {
                                              // this.setState({
                                              //     isShowKeyboardView:true,
                                              // })
                                              this.state.keyboardHiden1 = true;
                                              this.AllenFadeInView2.setNativeProps({ style: {left:Adaption.Width(10)*2 + this.state.wenziWidth2 }});
                                              this.state.keyboardHiden2 = false;
                                              this.state.isShowBottomContent = true;
                                              this.state.isBeiShuSlect = true;
                                              //'1' 表示text1 '2'表示text2
                                              this.props.keyboardCallBack(true, '2');
                                              let isQiShu0 = this.state.slectQiShu == '' || this.state.slectQiShu == '0';
                                              // this.setState({slectQiShu:isQiShu0?'1':this.state.slectQiShu});
                                              this.props.changeOrginl ? this.props.changeOrginl('1', isQiShu0 ? '1' : this.state.slectQiShu) : null;
                                              this.state.slectQiShu = isQiShu0 ? '1' : this.state.slectQiShu;
                                              this.props.qishuClick ? this.props.qishuClick(isQiShu0 ? '1' : this.state.slectQiShu) : null;
                                              this.setState({});
                                          }}>
                            <AllenFadeInView
                                ref={(c) => this.AllenFadeInView2 = c}
                                hasContent={this.state.keyboardHiden2? true : false}
                                style={{
                                position: 'absolute',
                                left: Adaption.Width(10),
                                width: 2,
                                height: 16,
                                top: 6,
                                backgroundColor: '#456FEE'
                            }}>
                            </AllenFadeInView>
                            <Text allowFontScaling={false}
                                  onLayout={(e) => { this._onlayout2(e);


                                  }}
                                  style={{
                                color: this.state.slectMutiple.length <= 0 ? '#888' : '#000',
                                marginLeft: 15,
                                fontSize: Adaption.Font(16, 13)
                            }}>
                                <Text onLayout={(e) => {
                                    // console.log(e);
                                }}>{this.state.slectMutiple.length <= 0 ? this.state.defaultBeishuText : this.state.slectMutiple}</Text>
                            </Text>
                        </TouchableOpacity>

                        {/*<TextInput*/}
                        {/*ref='tp2'*/}
                        {/*style={{ padding: 0, width: Adaption.Width(80), fontSize: Adaption.Font(17, 15), height: 30, borderColor: 'lightgrey', borderWidth: 1, backgroundColor: '#fff', marginTop: 5, borderRadius: 3, textAlign: 'center' }}*/}
                        {/*keyboardType={'number-pad'}*/}
                        {/*returnKeyType="done"*/}
                        {/*maxLength={5}*/}
                        {/*defaultValue={this.state.slectMutiple}*/}
                        {/*onChangeText={(text) => {*/}
                        {/*// 倍数 这里不需要一直用setState赋值。*/}
                        {/*if (text == '' || text == '0') {*/}
                        {/*this.setState({*/}
                        {/*slectMutiple: text,*/}
                        {/*});*/}
                        {/*} else {*/}
                        {/*this.state.slectMutiple = text;*/}
                        {/*}*/}
                        {/*}}*/}
                        {/*onFocus={() => {*/}
                        {/*// this.state.textInputTwoIsFocus = true;*/}
                        {/*this.state.textInputTwoIsFocus=true;*/}
                        {/*this.state.isShowBottomContent = true;*/}
                        {/*this.setState({*/}
                        {/*isBeiShuSlect: true,*/}
                        {/*});*/}
                        {/*// console.log('你哦麻痹2',this.props.fatherView);*/}
                        {/*// setTimeout(()=>{*/}
                        {/*//     console.log("超市",this.props.fatherView);*/}
                        {/*//     this.props.fatherView.setNativeProps({*/}
                        {/*//         style: {marginTop:0},*/}
                        {/*//     });*/}
                        {/*// },1000);*/}
                        {/*}}*/}
                        {/*onBlur={() => {*/}
                        {/*// console.log('你哦麻痹22',this.props.fatherView);*/}
                        {/*this.state.textInputTwoIsFocus=false;*/}
                        {/*this.state.isShowBottomContent = false;*/}
                        {/*// Keyboard.dismiss();*/}
                        {/*// this.refs.tp2.focus();*/}
                        {/*// setTimeout(()=>{*/}
                        {/*//     this.refs.tp1.focus();*/}
                        {/*// },300);*/}

                        {/*// if(this.state.textInputOneIsBlur){*/}
                        {/*//     Keyboard.dismiss();*/}
                        {/*//     setTimeout(()=>{*/}
                        {/*//             this.refs.tp1.focus();*/}
                        {/*//         },300);*/}
                        {/*//*/}
                        {/*// }*/}
                        {/*let isMutiple0 = this.state.slectMutiple == '' || this.state.slectMutiple == '0';*/}
                        {/*if (isMutiple0) {*/}
                        {/*this.setState({*/}
                        {/*slectMutiple: '1',*/}
                        {/*});*/}
                        {/*}*/}
                        {/*// this.state.textInputTwoIsFocus = false;*/}
                        {/*// console.log('你哦麻痹22',this.state.textInputOneIsFocus,this.state.textInputTwoIsFocus);*/}
                        {/*this.props.multipleClick ? this.props.multipleClick(isMutiple0 ? '1' : this.state.slectMutiple) : null;  //回调输入的倍数*/}
                        {/*}}*/}
                        {/*>*/}
                        {/*</TextInput>*/}
                        <CusBaseText style={{marginTop: 10, fontSize: Adaption.Font(17, 15)}}> 倍</CusBaseText>
                    </View>
                </View>

                {this.state.isShowBottomContent ? (<View style={{height: 60}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        height: this.props.speed == 1 ? 30 : 50
                    }}>
                        {this._qishu_beishuBtnViews_isBeishu(this.state.isBeiShuSlect)}
                    </View>

                    {/* 倍数 不显示中奖停追 */}
                    {this.props.speed == 1
                        ? <View style={{height: 30, flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity activeOpacity={1} style={styles.check_Box}
                                              onPress={() => {
                                                  this.props.isRunStopClick ? this.props.isRunStopClick(!this.state.isStop) : null;
                                                  this.setState({isStop: !this.state.isStop});
                                              }}>
                                {this.state.isStop
                                    ? <Image style={{width: 20, height: 20, borderColor: '#a5a5a5', borderWidth: 1}}
                                             source={require('../../touzhu2.0/img/ic_smart_checkBox.png')}/>
                                    : <View style={{borderColor: '#a5a5a5', borderWidth: 1, width: 20, height: 20}}/>
                                }
                                <CusBaseText
                                    style={{fontSize: Adaption.Font(17, 15), marginLeft: 5}}>中奖后停止追号</CusBaseText>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                </View>) : null}


                {/*清空按钮*/}
                <View style={{flexDirection: 'row', height: 50, borderColor: "#d5d5d5", borderTopWidth: 1}}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.clearAllNumOnPress ? this.props.clearAllNumOnPress() : null;
                        }}>
                        <View style={{
                            flexDirection: 'row',
                            width: 80,
                            height: 48,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image source={require('../../../img/ic_buy_car_delete.png')}
                                   style={{width: 20, height: 20}}/>
                            <Text allowFontScaling={false} style={{color: '#6a6a6a'}}> 清空</Text>
                        </View>
                    </TouchableOpacity>

                    {/*分割线*/}
                    <View style={{backgroundColor: '#dbdbdb', height: 35, marginTop: 7, width: 0.5}}/>

                    <View style={{height: 48, flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                        <CusBaseText style={{
                            paddingLeft: (SCREEN_WIDTH == 320 ? 4 : 12),
                            color: '#6a6a6a',
                            fontSize: Adaption.Font(17, 15)
                        }}> 共
                            <CusBaseText style={{color: 'red'}}> {this.props.zhuShu} </CusBaseText>注
                            <CusBaseText style={{color: 'red'}}> {price} </CusBaseText>元
                        </CusBaseText>
                    </View>
                    {/* 确认投注按钮 */}
                    <TouchableOpacity activeOpacity={0.5} style={{
                        width: 100,
                        height: 49,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#e33a38'
                    }}

                                      onPress={() => {
                                          this.props.comformOnPress ? this.props.comformOnPress() : null;
                                      }}>
                        <CusBaseText
                            style={{backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 17}}>确认投注</CusBaseText>
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
                <TouchableOpacity key={i} style={[styles.multiple_Box, {
                    flex: 1.0 / (titArr.length + 1),
                    height: Adaption.Width(this.props.speed == 1 ? 30 : 38)
                }]}
                                  onPress={() => {
                                      if (isBeishu) {
                                          this.props.changeOrginl ? this.props.changeOrginl('2', titArr[i]) : null;
                                          this.setState({
                                              slectMutiple: titArr[i],
                                          });
                                          this.props.multipleClick ? this.props.multipleClick(titArr[i]) : null;
                                      } else {
                                          this.props.changeOrginl ? this.props.changeOrginl('1', titArr[i]) : null;
                                          this.setState({
                                              slectQiShu: titArr[i],
                                          });
                                          this.props.qishuClick ? this.props.qishuClick(titArr[i]) : null;
                                      }
                                  }}>
                    <CusBaseText style={{
                        color: 'black',
                        fontSize: Adaption.Font(16, 14)
                    }}>{isBeishu ? `${titArr[i]}倍` : `${titArr[i]}期`}</CusBaseText>
                </TouchableOpacity>
            )
        }
        return viewArr;
    }


    _onlayout(e){
        // console.log("什么几把毛")
        let width = e.nativeEvent.layout.width;
        this.state.wenziWidth = width;

        if(this.state.keyboardHiden1&&!this.state.isBeiShuSlect) return;
        if(this.state.keyboardHiden2&&this.state.isBeiShuSlect) return;
        // console.log("什么几把",e, e.nativeEvent.layout,this.AllenFadeInView.state);

        let that = this;

            // AllenFadeInView
            // console.log("你麻痹",e,width, this.AllenFadeInView);
            this.AllenFadeInView.setNativeProps({
                style: {left:Adaption.Width(10)*2 + width },
            });


            // this.AllenFadeView.props.style.left = Adaption.Width(10) + width;
            // console.log("你麻痹",e,width, this.AllenFadeInView);


            // this.refs.AllenFadeView.style = {
            //    left:Adaption.Width(10) + width
            // }




    }



    _onlayout2(e){
        // console.log("什么几把毛")
        let width = e.nativeEvent.layout.width;
        this.state.wenziWidth2 = width;

        if(this.state.keyboardHiden1&&!this.state.isBeiShuSlect) return;
        if(this.state.keyboardHiden2&&this.state.isBeiShuSlect) return;
        // console.log("什么几把",e, e.nativeEvent.layout,this.AllenFadeInView2.state);

        let that = this;

        // AllenFadeInView
        // console.log("你麻痹",e,width, this.AllenFadeInView2);
        this.AllenFadeInView2.setNativeProps({
            style: {left:Adaption.Width(10)*2 + width },
        });


        // this.AllenFadeView.props.style.left = Adaption.Width(10) + width;
        // console.log("你麻痹",e,width, this.AllenFadeInView2);


        // this.refs.AllenFadeView.style = {
        //    left:Adaption.Width(10) + width
        // }




    }

    componentWillReceiveProps(nextProps) {
        this.props.fatherView = nextProps.fatherView;
    }


    updateTextOne(textValue1) {
        // let isQiShu0 = textValue1 == '' || textValue1 == '0';
        //
        // this.setState({slectQiShu:isQiShu0?'1':textValue1});
        // this.props.qishuClick ? this.props.qishuClick(isQiShu0 ? '1' : textValue1) : null;
        this.setState({slectQiShu: textValue1});
    }


    updateTextTwo(textValue2) {
        // let isMutiple0 = textValue2 == '' || textValue2 == '0';
        // this.setState({slectMutiple:isMutiple0?'1':textValue2});
        // this.props.multipleClick ? this.props.multipleClick(isMutiple0 ? '1' : textValue2) : null;
        this.setState({slectMutiple: textValue2});
    }


    lastUpdateText() {

    }

    hideBottomContent(whichOne) {
        // console.log("我来打印一下吧", whichOne);
        // let isQiShu0 = this.state.slectQiShu;
        // let isMutiple0 =  this.state.slectMutiple;
        if (whichOne == '1') {
            let isQiShu0 = this.state.slectQiShu == '' || this.state.slectQiShu == '0';
            this.state.keyboardHiden1 = true;
            // this.setState({slectQiShu:isQiShu0?'1':this.state.slectQiShu});
            this.props.changeOrginl ? this.props.changeOrginl(whichOne, isQiShu0 ? '1' : this.state.slectQiShu) : null;
            this.state.slectQiShu = isQiShu0 ? '1' : this.state.slectQiShu;
            this.props.qishuClick ? this.props.qishuClick(isQiShu0 ? '1' : this.state.slectQiShu) : null;
        } else {
            let isMutiple0 = this.state.slectMutiple == '' || this.state.slectMutiple == '0';
            this.state.keyboardHiden2 = true;
            // this.setState({slectMutiple:isMutiple0?'1':this.state.slectMutiple});
            this.props.changeOrginl ? this.props.changeOrginl(whichOne, isMutiple0 ? '1' : this.state.slectMutiple) : null;
            this.state.slectMutiple = isMutiple0 ? '1' : this.state.slectMutiple;
            this.props.multipleClick ? this.props.multipleClick(isMutiple0 ? '1' : this.state.slectMutiple) : null;
        }
        this.setState({isShowBottomContent: true});
    }
}


// AllenFadeInView.js


class AllenFadeInView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fadeAnim: new Animated.Value(0),          // 透明度初始值设为0
            isStop: false,
            hasContent: props.hasContent,
            hasStart: true,
            AnativePropsLeft: Adaption.Width(10)
        };
    }

    setNativeProps(nativeProps) {
        // console.log('nativeProps',this,this._root);
        if(this._root) {
            this._root.setNativeProps(
                nativeProps);
        }else{
            this.state.AnativePropsLeft = nativeProps.style.left;
        }
        // this.state.AnativePropsLeft = nativeProps.style.left;
    }

    componentDidMount() {
        this.startAnimation();                             // 开始执行动画
    }

    startAnimation() {
        // console.log("还敢执行吗");
        if (this.state.isStop || this.state.hasContent) {
            this.state.hasStart = false;
            return;
        }
        this.state.fadeAnim.setValue(0);
        Animated.timing(                            // 随时间变化而执行的动画类型
            this.state.fadeAnim,                      // 动画中的变量值
            {
                duration: 1000,
                toValue: 1,                             // 透明度最终变为1，即完全不透明
            }
        ).start(() => this.startAnimation());
    }

    render() {
        // console.log("有在几把",!this.state.hidden);
        return !this.state.hidden ? (
            <Animated.View                            // 可动画化的视图组件
                ref={(c) => this._root = c}
                style={{
                    ...this.props.style,
                    opacity: this.state.fadeAnim,          // 将透明度指定为动画变量值
                    left:this.state.AnativePropsLeft
                }}
            >
                {this.props.children}
            </Animated.View>
        ) : null;
    }

    componentWillUnmount() {

        this.state.isStop = true;
        // console.log('销毁呼呼');

    }





    test(){
        // console.log('你麻痹....');
    }


    componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps",nextProps);
        this.state.hasContent = nextProps.hasContent;
        this.state.hidden = nextProps.hasContent;

        if (!this.state.hidden && !this.state.hasStart) {

            this.state.hasStart = true;
            this.startAnimation();
        }
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

export default AllenBottomTool;
