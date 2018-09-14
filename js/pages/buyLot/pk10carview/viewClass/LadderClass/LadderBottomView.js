/**
 Author Ward
 Created by on 2018-08-14
 梯子底部选择工具栏
 **/

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';

export default class LadderBottomView extends Component {

    constructor(props){
        super(props);

        this.state = ({
            isEnableClick:props.ZhuShuPicker == 0 ? false : true,
            toTalZhuShu:props.ZhuShuPicker,
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.ZhuShuPicker != this.state.toTalZhuShu){
            this.setState({toTalZhuShu:nextProps.ZhuShuPicker, isEnableClick:nextProps.ZhuShuPicker == 0 ? false : true});
        }
    }

    render (){

        return <View style = {this.props.style}>
            <View style = {{height: 50, backgroundColor: '#434343', flexDirection: 'row'}}>
                <TouchableOpacity onPress = {() => {this.props.clearBallsClick ? this.props.clearBallsClick() : null}} activeOpacity={0.7} style = {{flex:0.25,flexDirection:'row', alignItems:'center'}}>
                    <Image style = {styles.newBottomImage} source = {require('../../../img/ic_buyLotClear.png')} />
                    <CusBaseText style = {styles.newBottomText}>清空</CusBaseText>
                </TouchableOpacity>
                <View style = {{marginTop:10, width:1, height:30, backgroundColor:'#d3d3d3'}}/>
                <TouchableOpacity onPress = {() => {this.props.playDesction ? this.props.playDesction() : null}} activeOpacity={0.7} style = {{flex:0.5, alignItems:'center', flexDirection:'row'}}>
                    <Image style = {styles.newBottomImage} source = {require('../../../img/ic_buyLotGameShuoMing.png')} />
                    <CusBaseText style = {styles.newBottomText}>玩法说明</CusBaseText>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => {

                    if (this.state.isEnableClick == true){
                        this.props.xiaZhuClick ? this.props.xiaZhuClick() : null;
                    }

                }} activeOpacity={0.7} style = {{flex:0.25, backgroundColor:this.state.isEnableClick == false ? '#949596' : '#e33939', alignItems:'center', justifyContent:'center'}}>
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
        marginLeft:5
    },
})