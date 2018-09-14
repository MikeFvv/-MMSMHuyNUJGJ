
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

export default class SmartBtn extends Component {

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
        width: SCREEN_WIDTH * 0.40,
        height: Adaption.Height(55),
        marginLeft:12,
        marginTop:Adaption.Height(26),
        borderRadius:5,
      }}
        onPress = {() => {
          this.props.caiZhongClick ? this.props.caiZhongClick(item.item.value,item.index) : null
        }}>

         {item.index  == this.props.selectedGameID
           ? <ImageBackground style={{
             width: SCREEN_WIDTH * 0.40,
             height:Adaption.Height(55),
             justifyContent: 'center',
             alignItems: 'center', 
          }}
            resizeMode={'stretch'}
            source={ require('../../../../me/img/ic_select_box.png') }
          >
            <CusBaseText style = {{}}>{item.item.value.qiShu}</CusBaseText>
          </ImageBackground>
        : <View style={{
             width: SCREEN_WIDTH * 0.40,
             height:Adaption.Height(55),
             justifyContent: 'center',
             alignItems: 'center', 
             borderColor: '#E0E0E0',
             borderWidth:1,
             borderRadius:5,
          }}  
          >
            <CusBaseText style = {{}}>{item.item.value.qiShu}</CusBaseText>
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
            onPress = {() => {
              this.props.close ? this.props.close() : null
            }}>   

            <TouchableOpacity activeOpacity={1} style = {{backgroundColor:'#fff',
            width:SCREEN_WIDTH-40,
            height:320,
            paddingBottom:15,
            borderColor: '#9d9d9d',
            borderWidth: 1,
            marginLeft:20,
            marginTop:162,
            borderRadius:5,
            }}>
              <FlatList
                automaticallyAdjustContentInsets={false}
                alwaysBounceHorizontal = {false}
                data = {dataList}
                renderItem = {(item)=>this._renderItemView(item)}
                horizontal = {false}
                numColumns = {2}
                >
              </FlatList>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
    )
  }
}
