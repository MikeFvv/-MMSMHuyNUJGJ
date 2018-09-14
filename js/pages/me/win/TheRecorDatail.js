import React, { Component } from 'react';
 import {
   AppRegistry,
   StyleSheet,
   Text,
   Image,
   View,
   Dimensions,
   Platform,
   TouchableOpacity,
   ActivityIndicator,
   StatusBar,
   TouchableHighlight,
   Button,
   FlatList,
   Modal,
   TextInput,
   Alert,
 } from 'react-native';

import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import RefreshListView, {RefreshState} from 'react-native-refresh-list-view'
import Adaption from "../../../skframework/tools/Adaption";
import BaseNetwork from "../../../skframework/component/BaseNetwork"; //网络请求
import * as moment from "moment";

const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
const blankWidth = 50*KAdaptionWith;
const circleWidth = 60*KAdaptionWith;

export default class TheRecorDatail  extends React.Component {
  static navigationOptions = ({ navigation }) => ({

      header:(
          <CustomNavBar
               centerText = {"提款明细"}
               leftClick={() =>  navigation.goBack() }
          />
      ),

  });


  constructor(props) {
    super(props);
    this.state = {
     detialArray:{}, //详情数据
      };

}

componentWillMount() {
  this.setState({
    detialArray: this.props.navigation.state.params.detialArray,
  })
}

render() {

    let statuStr = this.state.detialArray.value.status ;
    let statuIS  = this.state.detialArray.value.status ;   //是否已出款状态
   
    return (
    <View style ={styles.container}>
     <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30}}>{'订单号：'+this.state.detialArray.value.order}</Text>
   <View style={{backgroundColor:'#d3d3d3',height:1}}>

   </View>
        <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30}}>{'出款类型：'+'在线出款'}</Text>
        <View style={{backgroundColor:'#d3d3d3',height:1}}>
   </View>
        <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30}}>{'出款金额：'+this.state.detialArray.value.price}</Text>
        <View style={{backgroundColor:'#d3d3d3',height:1}}>
        </View>
           <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30}}>{'手续费：'+this.state.detialArray.value.price_fee}</Text>
           <View style={{backgroundColor:'#d3d3d3',height:1}}>
           </View>
              <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30}}>{'实际出款：'+this.state.detialArray.value.shiji_price}</Text>
              <View style={{backgroundColor:'#d3d3d3',height:1}}>
              </View>
              <View style={{flexDirection:'row'}}>
                <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30}}>
                出款状态：
                </Text>
                 <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30,color:'red'}}>{statuIS}</Text>
               </View>
                 <View style={{backgroundColor:'#d3d3d3',height:1}}>
                 </View>
                 <View style={{flexDirection:'row'}}>
                   <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30}}>
                    出款时间:
                   </Text>
                      <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30,color:'red'}}>
                        {this.state.detialArray.value.time }
                      </Text>
                 </View>
                    <View style={{backgroundColor:'#d3d3d3',height:1}}>
                    </View>

                    <View style={{flexDirection:'row'}}>
                      <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30}}>
                       备       注:
                      </Text>
                         <Text allowFontScaling={false} style={{marginLeft:10,marginTop:10,height:30,color:'red'}}>
                           {this.state.detialArray.value.index_mark}
                         </Text>
                    </View>
                       <View style={{backgroundColor:'#d3d3d3',height:1}}>
                       </View>

      </View>
       );
     }
}


const styles = StyleSheet.create({

        container:{
            flex:1,
            backgroundColor:'#d3d3d3',
            // flexDirection:'row',
            backgroundColor:'white',
        },
 });
