import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    TextInput,
} from 'react-native';

class LHCBottomTool extends Component {

    //构造器
    constructor(props)
    {
        super(props);

        this.state = ({

            totalZhu:props.zhuShu ? props.zhuShu : 0,
            totalPrice:props.totalPrice ? props.totalPrice : 0.00,
            singlePrice:props.singlePrice ? props.singlePrice : 0,
            slectMutiple:global.BeiShu,
            isStop:true,
            tag: props.tag ? props.tag : '',
        })
    }

    //将要接收到传过来的数据
    componentWillReceiveProps(nextProps){

        if (nextProps.zhushu != 0)
        {
            this.setState ({

                totalZhu:nextProps.zhuShu,
                totalPrice:nextProps.totalPrice,
                singlePrice:nextProps.singlePrice,
            })
        }
    }

    //清空号码时重置倍数，期数数据
    componentDidMount() {

        this.subscription = PushNotification.addListener('ClearAllBalls', () => {

                this.setState({
                    slectMutiple:global.BeiShu,
                })
        });

    }

    componentWillUnmount(){

        if (typeof (this.subscription) == 'object'){
            this.subscription && this.subscription.remove();
        }
    }

    render() {

        let theTwoButton = (this.props.tag == 'xglhc') ?
            (<View style={{height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <View style={{marginLeft: 20}}>
                    <CusBaseText style={styles.redText}> {this.state.totalZhu}
                        <CusBaseText style={styles.whiteText}> 注 </CusBaseText>
                        <CusBaseText style={styles.redText}> {this.state.slectMutiple} </CusBaseText>
                        <CusBaseText style={styles.whiteText}> 倍 </CusBaseText>
                        <CusBaseText style={styles.redText}> {this.state.totalPrice} </CusBaseText>
                        <CusBaseText style={styles.whiteText}> 元 </CusBaseText>
                    </CusBaseText>
                </View>


                <TouchableOpacity style={{width: 100,height:48}} activeOpacity={0.5}
                                  onPress={() => this.props.comformOnPress ? this.props.comformOnPress() : null}>
                    <View style={{
                        height: 49,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#e33a38',
                        left: 0
                    }}>
                        <CusBaseText
                            style={{backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 17}}>确认投注</CusBaseText>
                    </View>
                </TouchableOpacity>
            </View>
        ) : (<View style={{height: 48, flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => this.props.clearAllNumOnPress ? this.props.clearAllNumOnPress() : null}
                >
                    <View style={{
                        flexDirection: 'row',
                        width: 80,
                        height: 48,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>

                        <Image source={require('../../../img/ic_buy_car_delete.png')} style={{width: 20, height: 20}}/>
                        <Text allowFontScaling={false} style={{color: '#6a6a6a'}}> 清空</Text>
                    </View>
                </TouchableOpacity>

                {/*分割线*/}
                <View style={{backgroundColor: '#dbdbdb', height: 35, marginTop: 7, width: 0.5}}/>

                <View style={{height: 48, flex: 1, flexDirection: 'row', alignItems: 'center'}}>

                    <CusBaseText style={[styles.whiteText, {paddingLeft: (SCREEN_WIDTH == 320 ? 4 : 12)}]}>共
                        <CusBaseText style={[styles.redText]}> {this.state.totalZhu} </CusBaseText>
                        <CusBaseText style={styles.whiteText}> 注 </CusBaseText>
                        <CusBaseText style={styles.redText}> {this.state.slectMutiple} </CusBaseText>
                        <CusBaseText style={styles.whiteText}> 倍 </CusBaseText>
                        <CusBaseText style={styles.redText}> {this.state.totalPrice} </CusBaseText>
                        <CusBaseText style={styles.whiteText}> 元 </CusBaseText>
                    </CusBaseText>
                </View>

                <TouchableOpacity style={{width: 100,height:49}} activeOpacity={0.5}
                                  onPress={() => this.props.comformOnPress ? this.props.comformOnPress() : null}>
                    {/*<ImageBackground source = {require('../../../img/ic_confromTZ.png')} style = {{width:Adaption.Width(80), height:Adaption.Width(36), borderRadius:5, alignItems:'center', justifyContent:'center'}}>*/}
                    <View style={{
                        width: 100,
                        height: 49,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#e33a38',
                        left: 0
                    }}>
                        <CusBaseText
                            style={{backgroundColor: 'rgba(0,0,0,0)', color: 'white', fontSize: 17}}>确认投注</CusBaseText>
                        {/*</ImageBackground>*/}
                    </View>
                </TouchableOpacity>
            </View>)

        return (
            <View style = {this.props.style}>

                {/*总共90 */}
                {/*第一部分倍数View*/}
                <View style = {{height:41, flexDirection:'row', backgroundColor:'#fff', alignItems:'center',justifyContent:'center'}}>
                  <View style = {{flexDirection:'row'}}>
                      <View style = {styles.multuple_Input}>
                      <CusBaseText>投 </CusBaseText>
                      <TextInput allowFontScaling={false} keyboardType = {global.iOS?'number-pad':'numeric'} onChangeText = {(text) => {
                        //输入倍数时的计算
                        this.setState({
                           slectMutiple:text != '' ? (text) : (''),
                        })
                        this.props.multipleClick ? this.props.multipleClick(text) : null;  //回调输入的倍数

                      }}
                      returnKeyType="done"
                      maxLength = {5}
                      style = {{padding:0, width:Adaption.Width(60) ,height:24, borderColor:'lightgrey', borderWidth:1, marginTop:5, borderRadius:3, textAlign:'center'}} underlineColorAndroid ='transparent' defaultValue={this.state.slectMutiple == '0' ? ('') : (this.state.slectMutiple)}></TextInput>
                      <CusBaseText> 倍</CusBaseText>
                      </View>
                      <TouchableOpacity onPress = {() => {this.props.multipleClick ? this.props.multipleClick(1) : null; this.setState({slectMutiple:'1'})}} activeOpacity={0.5} style = {styles.multiple_TextView}><CusBaseText style = {styles.multiple_Text}>1倍</CusBaseText></TouchableOpacity>
                      <TouchableOpacity onPress = {() => {this.props.multipleClick ? this.props.multipleClick(5) : null; this.setState({slectMutiple:'5'})}} activeOpacity={0.5} style = {styles.multiple_TextView}><CusBaseText style = {styles.multiple_Text}>5倍</CusBaseText></TouchableOpacity>
                      <TouchableOpacity onPress = {() => {this.props.multipleClick ? this.props.multipleClick(10) : null; this.setState({slectMutiple:'10'})}} activeOpacity={0.5} style = {styles.multiple_TextView}><CusBaseText style = {styles.multiple_Text}>10倍</CusBaseText></TouchableOpacity>
                      <TouchableOpacity onPress = {() => {this.props.multipleClick ? this.props.multipleClick(20) : null; this.setState({slectMutiple:'20'})}} activeOpacity={0.5} style = {styles.multiple_TextView}><CusBaseText style = {styles.multiple_Text}>20倍</CusBaseText></TouchableOpacity>
                      <TouchableOpacity onPress = {() => {this.props.multipleClick ? this.props.multipleClick(50) : null; this.setState({slectMutiple:'50'})}} activeOpacity={0.5} style = {styles.multiple_TextView}><CusBaseText style = {styles.multiple_Text}>50倍</CusBaseText></TouchableOpacity>
                      <TouchableOpacity onPress = {() => {this.props.multipleClick ? this.props.multipleClick(100) : null; this.setState({slectMutiple:'100'})}} activeOpacity={0.5} style = {styles.multiple_TextView}><CusBaseText style = {styles.multiple_Text}>100倍</CusBaseText></TouchableOpacity>
                  </View>
               </View>

                {theTwoButton}

            </View>
        );
    }
}

const styles = StyleSheet.create({

      multiple_Box:{
        marginLeft:5,
        marginRight:5,
        flex:1.0/6,
        height:26,
        borderWidth:1,
        borderColor:'lightgrey',
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
      },

      multuple_Input:{
        height:32,
        flex:SCREEN_WIDTH == 320 ? 0.3 : 0.35,
          // flex:0.35,

          flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
      },

      multiple_TextView:{
        borderWidth:1,
        borderRadius:5,
        borderColor:'lightgrey',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
        flex:0.13,
        height:30,
        marginRight:3,
      },

      multiple_Text:{
         color:'red',
         fontSize:Adaption.Font(16,5),
      },

      redText:{
        color:'red',
        fontSize:Adaption.Font(16, 14),
      },

      whiteText:{
        color:'#6a6a6a',
        fontSize:Adaption.Font(17, 15),
      },
});

export  default  LHCBottomTool;
