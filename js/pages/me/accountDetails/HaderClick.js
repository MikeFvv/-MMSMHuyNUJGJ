/**
 选择彩种的列表
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

var dataList=[];

export default class HaderClick extends Component {

  constructor(props) {
      super(props);

      this.state = ({
          isClose: props.isClose,
      });
      
     dataList = [];
     this.props.gameList.map((item,i)=>{
        dataList.push({key:i,value:item});
    })
      
  }

  componentWillReceiveProps(nextProps) {

    this.setState({
      isClose: nextProps.isClose,
    })


    dataList=[];
    nextProps.gameList.map((item,i)=>{
        dataList.push({key:i,value:item});
    })
  }

  _renderItemView(item) {
    return(
      <TouchableOpacity activeOpacity={0.5} style = {{
        justifyContent:'center', alignItems:'center',
        width: SCREEN_WIDTH * 0.25,
        height: Adaption.Height(38),
        marginLeft:(SCREEN_WIDTH * 0.15)/2.25,
        marginTop:Adaption.Height(15),
      }}
        onPress = {() => {
            
          this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.item.value.game_id
          ) : null
        }}>
         <ImageBackground style={{
             width: SCREEN_WIDTH * 0.25,
             height:Adaption.Height(38),
             justifyContent: 'center',
             alignItems: 'center', 
             alignSelf: 'center',
             borderColor:(item.item.value.game_id==this.props.selectedGameID)?'white':'#aaa',
             borderWidth:1
            
          }}   resizeMode={'stretch'} //center repeat
          source={(item.item.value.game_id==this.props.selectedGameID)?require('../img/ic_select_box.png'):''}
         >
        <CusBaseText style = {{}}>{item.item.value.game_name}</CusBaseText>
        </ImageBackground>
      </TouchableOpacity>
    )
  }

  render() {
     let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX
    return (
      <Modal
        visible={this.state.isClose}
        animationType={'none'}
        transparent={true}
        onRequestClose={() => { }}
        >
          <TouchableOpacity activeOpacity={1}
            style = {{ 
              height:SCREEN_HEIGHT,
              width:SCREEN_WIDTH,
              marginTop:SCREEN_HEIGHT == 812?90:65,
             // height:SCREEN_HEIGHT- (iphoneX ? 160 :130),marginTop:iphoneX ? 90 :65}}>
            }}
            onPress = {() => {
              this.props.close ? this.props.close() : null
            }}>         
            <TouchableOpacity activeOpacity={1} style = {{backgroundColor:'#fff',width:SCREEN_WIDTH,}}>
              <FlatList
                automaticallyAdjustContentInsets={false}
                alwaysBounceHorizontal = {false}
                data = {dataList}
                renderItem = {(item)=>this._renderItemView(item)}
                horizontal = {false}
                numColumns = {3}
                >
              </FlatList>
            </TouchableOpacity>
            <View style={{width:SCREEN_WIDTH,height:15,backgroundColor:'#fff'}}>
            </View>
          </TouchableOpacity>
        </Modal>
    )
  }
}
