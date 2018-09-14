import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
export default class MeWinRecord extends Component {

    //接收上一个页面传过来的titl  e显示出来
    static navigationOptions = ({ navigation }) => ({

        title: navigation.state.params.title,
        headerStyle: {backgroundColor: COLORS.appColor, marginTop: Android ?(parseFloat(global.versionSDK) > 19?StatusBar.currentHeight:0) : 0},
        headerTitleStyle:{color:'white'},
        headerLeft: (
            <TouchableOpacity
                activeOpacity={1}
                style={GlobalStyles.nav_headerLeft_touch}
                onPress={() => { navigation.goBack() }}>
                <View style={GlobalStyles.nav_headerLeft_view} />
            </TouchableOpacity>
        ),

    });

    render() {
        return (
           <View style={{flex:1,flexDirection:'column'}}>

               <View style={{flexDirection:'row',height:60}}>
                   <View style={{flex:1,justifyContent:'center',alignItems:'center',height:60}}>
                       <Image style={{width:50,height:50,marginTop:28}} source={{uri:'http://uploads.bxvip588.com/qtcai/Uploads/cpicon/'+this.props.navigation.state.params.icon}}
                       />
                   </View>
                   <View style={{flex:3,flexDirection:'column',paddingLeft:10,marginTop:5}}>
                       <View style={{flexDirection:'row'}}>
                           <CusBaseText style={{flex:2,fontSize:17,color:'#606053'}}>{this.props.navigation.state.params.game_name}</CusBaseText>
                           <CusBaseText style={{flex:3,textAlignVertical: 'center',}}>{'第'+this.props.navigation.state.params.qishu+'期'}</CusBaseText>
                       </View>
                       <View style={{marginTop:5,flexDirection:'row'}}>
                           <CusBaseText style={{flex:1}}>{'开奖号码:'}</CusBaseText>
                           <CusBaseText style={{color:'#D6958C',flex:2,marginLeft:-25}}>{this.props.navigation.state.params.kj_balls}</CusBaseText>
                       </View>
                       <View style={{marginTop:5}}>
                           <CusBaseText style={{color:'#7E9980',fontSize:17}}>{'已中奖,赢得'+this.props.navigation.state.params.win+'元'}</CusBaseText>
                       </View>
                   </View>

               </View>

               <View style={{height:0.5,backgroundColor:'black',marginTop:35}}>

               </View>

               <View style={{height:25,paddingLeft:20,textAlignVertical: 'center',marginTop:5}}>
                   <CusBaseText style={{fontSize:17,color:'#606053'}}>{'订单内容'}</CusBaseText>
               </View>


               <View style={{flexDirection:'column',height:200}}>
                   <View style={styles.conview}>
                            <CusBaseText style={styles.contleft}>{'订单号'}</CusBaseText>
                            <CusBaseText style={styles.contright}>{this.props.navigation.state.params.zhudan}</CusBaseText>
                   </View>

                   <View style={styles.conview}>
                       <CusBaseText style={styles.contleft}>{'投注金额'}</CusBaseText>
                       <CusBaseText style={styles.contright}>{this.props.navigation.state.params.price}</CusBaseText>
                   </View>
                   <View style={styles.conview}>
                       <CusBaseText style={styles.contleft}>{'投注注数'}</CusBaseText>
                       <CusBaseText style={styles.contright}>{this.props.navigation.state.params.zhushu}</CusBaseText>
                   </View>
                   <View style={styles.conview}>
                       <CusBaseText style={styles.contleft}>{'投注返点'}</CusBaseText>
                       <CusBaseText style={styles.contright}>{this.props.navigation.state.params.fandian}</CusBaseText>
                   </View>
                   <View style={styles.conview}>
                       <CusBaseText style={styles.contleft}>{'投注赔率'}</CusBaseText>
                       <CusBaseText style={styles.contright}>{'1:'+this.props.navigation.state.params.peilv}</CusBaseText>
                   </View>
                   <View style={styles.conview}>
                       <CusBaseText style={styles.contleft}>{'投注时间'}</CusBaseText>
                       <CusBaseText style={styles.contright}>{this.props.navigation.state.params.tz_time}</CusBaseText>
                   </View>
                   <View style={styles.conview}>
                       <CusBaseText style={styles.contleft}>{'是否中奖'}</CusBaseText>
                       <CusBaseText style={styles.contright}>{'已中奖'}</CusBaseText>
                   </View>
                   <View style={styles.conview}>
                       <CusBaseText style={styles.contleft}>{'开奖时间'}</CusBaseText>
                       <CusBaseText style={styles.contright}>{this.props.navigation.state.params.js_time}</CusBaseText>
                   </View>
                   <View style={styles.conview}>
                       <CusBaseText style={styles.contleft}>{'玩法名称'}</CusBaseText>
                       <CusBaseText style={styles.contright}>{this.props.navigation.state.params.wanfa}</CusBaseText>
                   </View>
               </View>
                   <View style={{height:25,height:30,paddingLeft:20,marginTop:6}}>
                       <CusBaseText style={{fontSize:17,color:'#606053'}}>{'投注号码'}</CusBaseText>
                   </View>

                   <View style={{flexDirection:'row',height:18,marginTop:3}}>
                       <CusBaseText style={{paddingLeft:20}}>{this.props.navigation.state.params.xiangqing}</CusBaseText>
                   </View>

               <TouchableOpacity onPress={this.anotherNote}>
                   <View style={{height:45,backgroundColor:'#F27F52',marginLeft:20,marginRight:20,marginTop:30, borderRadius:5}}>
                       <CusBaseText style={{flex:1,textAlignVertical:'center',flexDirection:'row',textAlign:'center',color:'white'  }}>{'再来一注'}</CusBaseText>
                   </View>
               </TouchableOpacity>

             </View>
        );
    }

    anotherNote(){
        Alert.alert("再来一注")
    }

}

const styles = StyleSheet.create({

    contleft:{
        flex:1,
        textAlign: 'right',
        paddingLeft:25,
        textAlignVertical: 'center',
        color:'#7D7E80'
    },

    contright:{
        flex:3,
        textAlign: 'left',
        paddingLeft:10,
        textAlignVertical: 'center',
        color:'#4B4E4F'
    },

    conview:{
        flex:1,
        flexDirection:'row',
        height:15,
        marginTop:3
    }

})
