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

export default class GameListView extends Component {

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
          this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.item.value.game_id) : null
        }}>

         {item.item.value.game_id == this.props.selectedGameID
           ? <ImageBackground style={{
             width: SCREEN_WIDTH * 0.25,
             height:Adaption.Height(38),
             justifyContent: 'center',
             alignItems: 'center', 
          }}
            resizeMode={'stretch'}
            source={ require('../../me/img/ic_select_box.png') }
          >
            <CusBaseText style = {{}}>{item.item.value.game_name}</CusBaseText>
          </ImageBackground>
        : <View style={{
             width: SCREEN_WIDTH * 0.25,
             height:Adaption.Height(38),
             justifyContent: 'center',
             alignItems: 'center', 
             borderColor: '#E0E0E0',
             borderWidth:1
          }}  
          >
            <CusBaseText style = {{}}>{item.item.value.game_name}</CusBaseText>
          </View>
         }
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
            }}
            onPress = {() => {
              this.props.close ? this.props.close() : null
            }}>         
            <TouchableOpacity activeOpacity={1} style = {{backgroundColor:'#fff',width:SCREEN_WIDTH,height:SCREEN_HEIGHT- (iphoneX ? 260 :230),marginTop:iphoneX ? 90 :65,paddingBottom:15}}>
            <View style = {{height: Adaption.Width(50), justifyContent: 'center', borderColor:'#E0E0E0', borderBottomWidth:1}}>
             <CusBaseText style = {{textAlign:'center', fontSize:Adaption.Font(18, 15)}}>选择彩种</CusBaseText>
              </View>
             
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
            <View style={{width:SCREEN_WIDTH,height:iphoneX ? this.props.isHightX : this.props.isHight6,backgroundColor:'rgba(0,0,0,0.4)'}}>
            </View>
          </TouchableOpacity>
        </Modal>
    )
  }
}
