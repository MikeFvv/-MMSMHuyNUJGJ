/**
 Created by Money on 2017/10/13
 dec - ssc任选底部view
 */

 import React, { Component } from 'react';

 import {
   Text,
   View,
   TouchableOpacity,
   Image,
   FlatList,
 } from 'react-native';

 class SSCRxBottomView extends Component {

   constructor(props) {
     super(props);

     this.state = {
       dataArr:this.props.data,
     };
   }

  _renderItemView(item) {
    return(
      <TouchableOpacity activeOpacity = {1}
        style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', width:this.props.style.width/5}}
        onPress = {() => {
          this.props.data[item.index].state = !this.props.data[item.index].state;
          this.setState({
            dataArr:this.props.data,
          })
          this.props.selectPostionArr? this.props.selectPostionArr(this.props.data):null;
        }}
        >
         {this.props.data[item.index].state
           ? <Image style = {{width:Adaption.Width(18), height:Adaption.Width(18), borderColor:'#d3d3d3', borderWidth:1}} resizeMode={'stretch'} source = {require('../../../../login/img/ic_checkBox.png')}></Image>
           : <View style = {{width:Adaption.Width(18), height:Adaption.Width(18), borderColor:'#d3d3d3', borderWidth:1}}></View>
         }
         <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(15,12), marginLeft:1, color:'#434343'}}>{item.item.title}</Text>
     </TouchableOpacity>
    )
  }

   render() {
     return(
       <View style = {this.props.style}>
         <View style = {{alignItems:'center', justifyContent:'center'}}>
           <Text allowFontScaling={false} style = {{fontSize:Adaption.Font(14, 10), color:'#434343'}}>{this.props.play_title}</Text>
         </View>

         <FlatList style = {{width:this.props.style.width, marginTop:Adaption.Height(10)}}
           automaticallyAdjustContentInsets={false}
           alwaysBounceHorizontal = {false}
           data = {this.props.data}
           renderItem = {(item)=>this._renderItemView(item)}
           horizontal = {false}
           numColumns = {5}
           scrollEnabled={false}
           >
         </FlatList>

       </View>
     )
   }

 }

export default SSCRxBottomView;
