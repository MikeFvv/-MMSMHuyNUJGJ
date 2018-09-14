
import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';


export default class SubAccountModalView extends Component {

  constructor(props) {
    super(props);

    this.state = ({
      isClose: props.isClose,
      invitedCodeId: null,  // 邀请码ID
      dataSource: props.dataSource,
    });
    this.invitedCodeItem = null;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isClose: nextProps.isClose,
      dataSource: nextProps.dataSource,
    })
  }


  // 设置邀请码 图标效果
  _setInvitedCode(item) {
    this.invitedCodeItem = item;
    this.setState({
      invitedCodeId: item.item.value.id,
    });
  }

  _setOddsOk() {

    this.props.modalClick ? this.props.modalClick(this.invitedCodeItem) : null
  }

  // 邀请码
  _invitedCodeList(item) {
    let ddd = this.state.dataSource;
    let codeStr = '';

    let itemValue = item.item.value;
    if (!itemValue.hasOwnProperty("param")) {                 //判断age是否存在于obj里面
      // alert("没有param项");
      return;
    }

    if (itemValue.param && itemValue.param != undefined) {
      codeStr = itemValue.param;
    } else {
      return;
    }

    let markyy = <TouchableOpacity activeOpacity={0.7} style={{
      borderColor: this.state.invitedCodeId == item.item.value.id ? 'red' : '#d2d2d2',
      marginLeft: 25,
      marginTop: 10,
      borderRadius: 5,
      borderWidth: 1,
      width: (SCREEN_WIDTH - 30 * 2 - 30 * 3) / 2,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
    }} onPress={() => this._setInvitedCode(item)}>

      <Text style={{ color: this.state.invitedCodeId == item.item.value.id ? 'red' : '#6e6e6e', fontSize: 14, }}>{codeStr}</Text>
    </TouchableOpacity >;

    return (
      <View>
        {markyy}
      </View>
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
          style={{
            width: SCREEN_WIDTH, height: SCREEN_HEIGHT,
            justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)'
          }}
          onPress={() => {
            this.props.close ? this.props.close() : null
          }}>


          <TouchableOpacity activeOpacity={1} style={{ width: SCREEN_WIDTH - 60, height: 280, backgroundColor: 'white', borderRadius: 10, padding: 10 }}>


            <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <CusBaseText style={{ color: '#505050', fontSize: Adaption.Font(20, 18) }}>请选择邀请码</CusBaseText>
            </View>

            {/* 分割线 */}
            <View style={{ height: 1, backgroundColor: '#f1f1f1', marginLeft: -10, marginRight: -10 }} />

            <FlatList
              extraData={this.state}
              automaticallyAdjustContentInsets={false}
              alwaysBounceHorizontal={false}
              data={this.state.dataSource}
              renderItem={(item) => this._invitedCodeList(item)}
              keyExtractor={(item, index) => { return String(index) }}
              horizontal={false}
              numColumns={2}
            >
            </FlatList>

            {/* 分割线 */}
            <View style={{ height: 1, backgroundColor: '#f1f1f1', marginLeft: -10, marginRight: -10 }} />
            {/* 确定 */}
            <TouchableOpacity activeOpacity={0.7} style={{ justifyContent: 'center', alignItems: 'center', height: 30 }} onPress={() => this._setOddsOk()}>
              <Text style={{ fontSize: 20, color: 'red', textAlign: 'center', marginTop: 5 }}>
                确定
                        </Text>
            </TouchableOpacity>

          </TouchableOpacity>

        </TouchableOpacity>
      </Modal>
    )
  }
}
