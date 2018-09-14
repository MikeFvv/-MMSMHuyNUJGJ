/**
 Author Ward
 Created by on 2018-08-14
 pk10牛牛游戏底部工具栏
 **/

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    TextInput,
} from 'react-native';

export default class PK10NiuNiuBottomView extends Component {

    constructor(props){
        super(props);

        this.state = ({
            isEnableClick:props.ZhuShuPicker == 0 ? false : true,
            toTalZhuShu:props.ZhuShuPicker,
            slectNumDesc:'请选择号码',  //选择的号码描述
            singlePrice:'',  //每注单价
            willWinPrice:'0.00', //预计盈利金额
            willWinTotalPeilv:'0', //预计盈利总赔率
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.ZhuShuPicker != this.state.toTalZhuShu){
            this.setState({toTalZhuShu:nextProps.ZhuShuPicker, isEnableClick:nextProps.ZhuShuPicker == 0 ? false : true,});
        }

        if (nextProps.singlePrice != this.state.singlePrice){
            this.setState({singlePrice:nextProps.singlePrice});
        }

        this.setState({slectNumDesc:nextProps.pickerNumDesc == '' ? '请选择号码' : nextProps.pickerNumDesc, willWinTotalPeilv:nextProps.pickerNumPeilv});
        this._caculateWillWinMoney(this.state.singlePrice, nextProps.pickerNumPeilv);
    }

    _caculateWillWinMoney(singleprice, totalPeilv){

        let winPrice = parseInt(singleprice == '' ? 0 : singleprice, 10) * parseFloat(totalPeilv);
        this.setState({willWinPrice:`${winPrice.toFixed(2)}`});

    }


    render (){

        return <View style = {this.props.style}>
            <View style = {{height:45, backgroundColor:'#eaeaea', flexDirection:'row'}}>
               <View style = {{flex:0.55, justifyContent:'center'}}>
                   <CusBaseText style = {{marginLeft:15, color:'#313131', fontSize:Adaption.Font(14,11)}} numberOfLines={2}>
                       {global.UserLoginObject.Uid != '' ? this.state.slectNumDesc : '请选择号码'}
                   </CusBaseText>
               </View>
               <View style = {{flex:0.45, justifyContent:'center', alignItems:'center'}}>
                   {global.UserLoginObject.Uid != '' ? <CusBaseText style = {{color:'#313131', fontSize:Adaption.Font(16,13)}}>
                       预计盈利 <CusBaseText style = {{color:'#e33939'}}>
                       {this.state.willWinPrice}
                   </CusBaseText>元
                   </CusBaseText> : null}
               </View>
            </View>
            <View style = {{height: 45, backgroundColor: '#434343', flexDirection: 'row'}}>
                <TouchableOpacity onPress = {() => {this.props.MoreFuctionClick ? this.props.MoreFuctionClick() : null}} activeOpacity={0.7} style = {{flex:0.25,flexDirection:'row', alignItems:'center'}}>
                    <Image style = {styles.newBottomImage} source = {require('../../../img/ic_tzMore.png')} />
                    <CusBaseText style = {styles.newBottomText}>更多</CusBaseText>
                </TouchableOpacity>
                <View style = {{marginTop:5, width:1, height:35, backgroundColor:'#525252'}}/>
                <View style = {{flex:0.5, alignItems:'center', justifyContent:'center'}}>
                    <View style = {{height:34, width:Adaption.Width(160), backgroundColor:'#fff', borderRadius:5, alignItems:'center', justifyContent:'center'}}>
                        <TextInput
                            style = {{width:Adaption.Width(140), height:30, textAlign:'center', fontSize:Adaption.Font(16,13)}}
                            keyboardType={'number-pad'}
                            placeholder={'请输入购买金额'}
                            placeholderTextColor={'#aaaaaa'}
                            returnKeyType={'done'}
                            defaultValue={this.state.singlePrice}
                            onChangeText = {(text) => {

                                this.state.singlePrice = text;
                                this._caculateWillWinMoney(text, this.state.willWinTotalPeilv);

                                this.props.priceInputBlock ? this.props.priceInputBlock(text) : null;
                            }}/>
                    </View>
                </View>
                <TouchableOpacity onPress = {() => {

                    if (this.state.isEnableClick == true){

                        this.props.xiaZhuClick ? this.props.xiaZhuClick() : null
                    }
                }}
                    activeOpacity={0.7} style = {{flex:0.25, backgroundColor:this.state.isEnableClick == false ? '#949596' : '#e33939', alignItems:'center', justifyContent:'center'}}>
                    <CusBaseText style = {styles.newBottomText}>下 注 </CusBaseText>
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    //图片样式
    newBottomImage:{
        width:Adaption.Width(24),
        height:Adaption.Width(24),
        marginLeft:10,
    },

    //文字颜色
    newBottomText:{
        color:'white',
        fontSize:Adaption.Font(18,16),
        marginLeft:10
    },
})