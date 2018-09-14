/**
 * Created by Ward on 2018/05/25.
 * 防止首页刷新界面太厉害而封装出来
 */

import React, { Component } from 'react';

import {
    Modal,
    View,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';


export default class HomeRedPacketView extends Component {

    constructor(props) {
        super(props);

        this.state = ({
            isShowDaliyGiftView:false, //是否显示每日彩金
            everyDayWinPrice:0,  //红包的彩金
            everyDayDesc:'',  //红包的描述
        })
    }


    //点击弹出首页红包视图
    showRedPacketView(giftDescStr, giftPrice){

        this.setState({isShowDaliyGiftView:true, everyDayWinPrice:giftPrice, everyDayDesc:giftDescStr});
    }

    //点击确定关闭首页红包视图
    closeRedPacketView(){
        this.setState({isShowDaliyGiftView:false});
    }

    render() {

        return   <Modal
            visible={this.state.isShowDaliyGiftView}
            animationType={'slide'}
            transparent={true}
            onRequestClose={() => {
            }}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.3)',
                alignItems:'center'
            }}>
                <ImageBackground style={{ width: SCREEN_WIDTH - 50, height: 380, marginTop:60}}
                                 source={require('./img/ic_home_jiajiangBack.png')}>
                    {this.state.everyDayWinPrice != 0 ?  <CusBaseText style = {{fontSize:Adaption.Font(17,14), color:'#000000', marginTop:160, textAlign:'center'}}>
                        {`恭喜您\n获得`}<CusBaseText  style = {{fontSize:Adaption.Font(22,19), color:'#e53f3f'}}>
                        {this.state.everyDayWinPrice}
                    </CusBaseText>{`元现金红包\n请注意查收!`}
                    </CusBaseText> : <CusBaseText style = {{fontSize:Adaption.Font(17,14), color:'#000000', marginTop:170, textAlign:'center'}}>
                        {this.state.everyDayDesc}
                    </CusBaseText>}
                    <CusBaseText style = {{color:'#fff', fontSize:Adaption.Font(16,12), marginTop:this.state.everyDayWinPrice != 0 ? 60 : 100, marginLeft:40}}>
                        {this.state.everyDayWinPrice != 0 ? this.state.everyDayDesc : ''}
                    </CusBaseText>
                    <TouchableOpacity
                        onPress = {() => {this.closeRedPacketView()}}
                        activeOpacity={0.7}
                        style = {{alignItems:'center',
                            marginTop:20,
                            width:100,
                            height:30,
                            backgroundColor:'#fff',
                            borderRadius:5,
                            justifyContent:'center',
                            marginLeft:(SCREEN_WIDTH - 60 - 100)/2}}
                    >
                        <CusBaseText style = {{fontSize:Adaption.Font(15,12), color:'#ff0737'}}>
                            确定
                        </CusBaseText>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        </Modal>
    }
}