/**
 * Created by Ward on 2018/04/11.
 */

import React, { Component } from 'react'
import {
    View,
    TouchableOpacity,
    Image,
} from 'react-native'


export default class FBShopCarHeader extends Component {


    constructor(props) {
        super(props);
    }

    render() {

        return (<View style = {this.props.style}>
           <View style = {{height:60, backgroundColor:'#fff', flexDirection:'row', alignItems:'center'}}>
               <View style = {{flex:0.1}}/>
               <TouchableOpacity activeOpacity={0.7} style={{flex:0.3, height: 35, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderWidth: 1,
                   borderColor: '#e6e6e6', borderRadius: 5, backgroundColor: '#f6f6f6'}}
                                 onPress={() => {
                                     this.props.goBackToAddRace ? this.props.goBackToAddRace() : null
                                 }}>
                   <Image style={{width: Adaption.Width(18), height: Adaption.Width(18)}} source={require('../../img/ic_buyLotGoBack.png')}></Image>
                   <CusBaseText style={{ color: '#6a6a6a', fontSize: Adaption.Font(17, 14) }}> 添加比赛</CusBaseText>
               </TouchableOpacity>
               <View style = {{flex:0.2}}/>
               <TouchableOpacity activeOpacity={0.7} style={{flex:0.3, height: 35, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', borderWidth: 1,
                   borderColor: '#e6e6e6', borderRadius: 5, backgroundColor: '#f6f6f6'}}
                                 onPress={() => {
                                     this.props.clearShopCarList ? this.props.clearShopCarList() : null
                                 }}>
                   <Image style={{width: Adaption.Width(18), height: Adaption.Width(18)}} source={require('../../img/ic_buy_car_delete.png')}></Image>
                   <CusBaseText style={{ color: '#6a6a6a', fontSize: Adaption.Font(17, 14) }}> 清空列表</CusBaseText>
               </TouchableOpacity>
               <View style = {{flex:0.1}}/>
           </View>
        </View>);
    }
}