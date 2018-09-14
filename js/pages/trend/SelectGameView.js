/**
 Created by Money on 2017/11/02
 选择彩种的列表
 */
import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';

// var dataList=[];
export default class SelectGameView extends Component {

  constructor(props) {
      super(props);

      this.state = ({
          isClose: props.isClose,
      });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isClose: nextProps.isClose,
    })
  }

  _renderItemView(item) {
    return(
      <TouchableOpacity activeOpacity={0.5} style = {{
        backgroundColor:this.props.currentGameid == item.item.game_id ? '#e33939':'#fff', width:SCREEN_WIDTH * 0.26, height:Adaption.Width(38), justifyContent:'center', alignItems:'center',
        marginLeft:(SCREEN_WIDTH * 0.17)/4.0, marginTop:Adaption.Height(15), borderRadius:3, borderColor:'#aaa', borderWidth: this.props.currentGameid == item.item.game_id ? 0 : 0.5}}
        onPress = {() => {
          if (item.item.js_tag.includes('lhc')) {
            global.yearId = item.item.yearid;
          }
          this.props.caiZhongClick ? this.props.caiZhongClick(item.item) : null
        }}>
        <CusBaseText style = {{ fontSize: Adaption.Font(18, 14), color:this.props.currentGameid == item.item.game_id ? '#fff':'#535353'}}>{item.item.game_name}</CusBaseText>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Modal
        visible={this.state.isClose}
        animationType={'none'}
        transparent={true}
        onRequestClose={() => { }}
        >
          <TouchableOpacity activeOpacity={1}
            style = {{width:SCREEN_WIDTH, height:SCREEN_HEIGHT,
              justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.4)'}}
            onPress = {() => {
              this.props.close ? this.props.close() : null
            }}>

            <TouchableOpacity activeOpacity={1} style = {{width:SCREEN_WIDTH - Adaption.Width(20), height:SCREEN_HEIGHT * (SCREEN_HEIGHT == 812 ? 0.7 : 0.8), backgroundColor:'#fff', borderRadius:5, paddingBottom:10}}>

              <View style={{ flexDirection: 'row', height: Adaption.Width(50) }}>
                <View style={{ flex: 0.1 }}></View>
                <View style={{ flex: 0.9, justifyContent: 'center', alignItems: 'center' }}>
                    <CusBaseText style={{ color: '#505050', fontSize: Adaption.Font(18, 15) }}>彩种选择</CusBaseText>
                </View>
                <TouchableOpacity activeOpacity={0.8} style={{ flex: 0.1, justifyContent: 'center' }}
                    onPress={() => {
                        this.props.close ? this.props.close() : null;
                    }}>
                    <Image style={{ width: Adaption.Width(17), height: Adaption.Width(17) }} source={require('../buyLot/buyLotDetail/touzhu2.0/img/ic_buyLot_Close.png')} />
                </TouchableOpacity>
              </View>

              <Image style={{ marginLeft:Adaption.Width(10), height: Adaption.Width(1), width: SCREEN_WIDTH - Adaption.Width(40) }} source={require('../buyLot/img/ic_dottedLine.png')} />
              
              <FlatList
                automaticallyAdjustContentInsets={false}
                alwaysBounceHorizontal = {false}
                data = {global.AllPlayGameList}
                renderItem = {(item)=>this._renderItemView(item)}
                keyExtractor = {(item,index)=>{return String(index)}} 
                horizontal = {false}
                numColumns = {3}
                >
              </FlatList>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
    )
  }
}
