/**
 * Created by Allen on 2018/4/18.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableOpacity,
    Text,
    Image,
    Animated,
    Easing
} from 'react-native';
let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
export default class AllenKeyboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            moneyText: global.ZhuiQiShu,
            moneyText2:global.BeiShu,
            whichText:'1'
        };
        this.animatedValue = new Animated.Value(1);
        this.Top = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [iphoneX?SCREEN_HEIGHT - Adaption.Height(270) -10 :SCREEN_HEIGHT - Adaption.Height(270) , SCREEN_HEIGHT]
        })
    }

    componentWillMount() {

    }


    _renderItemView(item) {
        return (
            <TouchableOpacity activeOpacity={0.5} style={{
                backgroundColor: (item.index == 9 || item.index == 11) ? 'rgba(0,0,0,0)' : '#fff',
                width: SCREEN_WIDTH * 0.31,
                height: Adaption.Height(47),
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: (SCREEN_WIDTH * 0.07) / 4,
                marginTop: Adaption.Height(6.4),
                borderRadius: 5
            }}
                              onPress={() => {
                                  // console.log(item);
                                  if(this.state.whichText == '1') {
                                      // 限制输入长度为7
                                      if (this.state.moneyText.length >= 4 && item.index != 11) {
                                          return;
                                      }

                                      // 限制只有输入一位小数
                                      // if (this.state.moneyText.includes('.')) {
                                      //     let arr = this.state.moneyText.split('.');
                                      //     let lastStr = arr[1];
                                      //     if (lastStr.length >= 1 && item.index != 11) {
                                      //         return;
                                      //     }
                                      // }

                                      let tempMoneyText = this.state.moneyText;
                                      if (item.index == 9) {
                                          // 小数点。
                                          // 已经输入了小数点就不能再输入了。 限制长度为6后不能再输入小数点
                                          // if (!this.state.moneyText.includes('.') && this.state.moneyText.length < 6 && this.state.moneyText.length > 0) {
                                          //     tempMoneyText = this.state.moneyText + item.item.tit;
                                          // } else {
                                          //     return;
                                          // }
                                      } else
                                          if (item.index == 11) {
                                          // 删除
                                          if (this.state.moneyText.length > 0) {
                                              tempMoneyText = this.state.moneyText.substr(0, this.state.moneyText.length - 1);
                                          }
                                      } else {
                                          if (this.state.moneyText.length == 1 && this.state.moneyText == '0' && item.index == 10) {
                                              return;
                                          } else {
                                              if (this.state.moneyText == '0') {
                                                  tempMoneyText = `${item.item.tit}`;
                                              } else {
                                                  tempMoneyText = this.state.moneyText + item.item.tit;
                                              }
                                          }
                                      }

                                      this.setState({
                                          moneyText: tempMoneyText,
                                      })

                                      this.props.spitout(tempMoneyText);

                                  }else{
                                      // 限制输入长度为7
                                      if (this.state.moneyText2.length >= 4 && item.index != 11) {
                                          return;
                                      }

                                      // 限制只有输入一位小数
                                      // if (this.state.moneyText2.includes('.')) {
                                      //     let arr = this.state.moneyText2.split('.');
                                      //     let lastStr = arr[1];
                                      //     if (lastStr.length >= 1 && item.index != 11) {
                                      //         return;
                                      //     }
                                      // }

                                      let tempMoneyText = this.state.moneyText2;
                                      if (item.index == 9) {
                                          // 小数点。
                                          // 已经输入了小数点就不能再输入了。 限制长度为6后不能再输入小数点
                                          // if (!this.state.moneyText2.includes('.') && this.state.moneyText2.length < 6 && this.state.moneyText2.length > 0) {
                                          //     tempMoneyText = this.state.moneyText2 + item.item.tit;
                                          // } else {
                                          //     return;
                                          // }
                                      } else if (item.index == 11) {
                                          // 删除
                                          if (this.state.moneyText2.length > 0) {
                                              tempMoneyText = this.state.moneyText2.substr(0, this.state.moneyText2.length - 1);
                                          }
                                      } else {
                                          if (this.state.moneyText2.length == 1 && this.state.moneyText2 == '0' && item.index == 10) {
                                              return;
                                          } else {
                                              if (this.state.moneyText2 == '0') {
                                                  tempMoneyText = `${item.item.tit}`;
                                              } else {
                                                  tempMoneyText = this.state.moneyText2 + item.item.tit;
                                              }
                                          }
                                      }

                                      this.setState({
                                          moneyText2: tempMoneyText,
                                      })
                                      this.props.spitout2(tempMoneyText);
                                  }
                                  // this._resetSinglePrie(tempMoneyText == '' ? 0 : this.state.isYuan?tempMoneyText:(tempMoneyText*0.1).toFixed(2));



                              }}>
                {item.index == 11
                    ? <Image resizeMode={'contain'} style={{width: Adaption.Width(40), height: Adaption.Width(40)}}
                             source={require('../pages/buyLot/img/ic_keyboardDelete.png')}/>
                    : <Text allowFontScaling={false}
                            style={{fontSize: Adaption.Font(22, 19), color: '#000'}}>{item.item.tit}</Text>
                }
            </TouchableOpacity>
        )
    }



    showAllenKeyboard(title){
        this.state.whichText = title;
        this.animatedValue.setValue(1);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 0,
                duration: 400,
                easing: Easing.easeOut
            }
        ).start()
    }



    hideAllenKeyBoard(title){
        // this.state.whichText = title;
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 400,
                easing: Easing.easeOut
            }
        ).start()
    }


    setWhichText(title,content){
        // console.log('标题:',title,"....内容:",content)
        // this.state.whichText = title;
        if(title  == '1'){
            this.state.moneyText = content;
        }else{
            this.state.moneyText2 = content;
        }
    }


    getKeyBoardValue(){
        return this.state.moneyText;
    }


    // 键盘显示的文本
    _keyboardTitle() {
        var array = [];
        for (let i = 1; i <= 12; i++) {
            if (i == 10) {
                array.push({key: i, tit: ' '});
            } else if (i == 11) {
                array.push({key: i, tit: '0'});
            } else if (i == 12) {
                array.push({key: i, tit: 'delete'});
            } else {
                array.push({key: i, tit: i});
            }
        }
        return array;
    }

    render() {


        return (<View style={{backgroundColor:'red'}}><Animated.View style={{
                position: 'absolute',
                backgroundColor: '#bababf',
                height: iphoneX?Adaption.Height(270) + 34:Adaption.Height(270),
                width: SCREEN_WIDTH,
                top: this.Top
            }}>
                <View style={{backgroundColor: '#f6f6f7', flexDirection: 'row', height: Adaption.Height(50)}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}><Text
                        allowFontScaling={false}
                        style={{fontSize: Adaption.Font(17, 15), color: '#999'}}>{this.state.whichText=='1'?'请输入期数':'请输入倍数'}</Text></View>
                    <TouchableOpacity activeOpacity={1}
                                      style={{
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          height: Adaption.Height(50),
                                          position: 'absolute',
                                          top: 0,
                                          left: SCREEN_WIDTH - Adaption.Width(70)
                                      }}
                                      onPress={() => {
                                          // this.animatedValue.setValue(0);
                                          // Animated.timing(
                                          //     this.animatedValue,
                                          //     {
                                          //         toValue: 1,
                                          //         duration: 400,
                                          //         easing: Easing.easeOut
                                          //     }
                                          // ).start()
                                          this.hideAllenKeyBoard();
                                          this.props.hideKeboardCallBack?this.props.hideKeboardCallBack(this.state.whichText):null;
                                      }}
                    >
                        <Text allowFontScaling={false}
                              style={{fontSize: Adaption.Font(17, 15), color: '#000', fontWeight: '900'}}>完成</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                                      style={{
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          height: Adaption.Height(50),
                                          position: 'absolute',
                                          top: 0,
                                          left: 10
                                      }}
                                      onPress={() => {
                                          // this.animatedValue.setValue(0);
                                          // Animated.timing(
                                          //     this.animatedValue,
                                          //     {
                                          //         toValue: 1,
                                          //         duration: 400,
                                          //         easing: Easing.easeOut
                                          //     }
                                          // ).start()
                                          this.hideAllenKeyBoard();
                                          this.props.hideKeboardCallBack?this.props.hideKeboardCallBack(this.state.whichText):null;
                                          setTimeout(()=>{
                                              this.props.comfirmBet?this.props.comfirmBet():null;
                                          },300);
                                      }}
                    >
                        <Text allowFontScaling={false}
                              style={{fontSize: Adaption.Font(17, 15), color: '#000', fontWeight: '900'}}>确认投注</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceHorizontal={false}
                    data={this._keyboardTitle()}
                    renderItem={(item) => this._renderItemView(item)}
                    horizontal={false}
                    numColumns={3}
                    scrollEnabled={false}
                >
                </FlatList>
            </Animated.View></View>
        );
    }

    componentDidMount() {
        // this.animate()
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

    hideAllenKeyboard(){
        // console.log(this.animatedValue._value);
        if(this.animatedValue._value == 0) {
            this.hideAllenKeyBoard();
            this.props.hideKeboardCallBack ? this.props.hideKeboardCallBack(this.state.whichText) : null;
        }
    }

    animate() {
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 500,
                easing: Easing.linear
            }
        ).start()
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

});