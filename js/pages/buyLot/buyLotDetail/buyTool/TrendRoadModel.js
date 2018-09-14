/**
    Created by Money on 2018/06/29
    点击底部更多 弹出的modelView
 */
import React, { Component } from 'react';
import {
  View,
  Image,
  Modal,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

export default class TrendRoadModel extends Component {

  constructor(props) {
    super(props);

  }


  render() {

    //modelType 0表示正常彩种,1幸运pk牛牛
    if (this.props.modelType == 0){

        return (
            <Modal
                visible={this.props.isClose}
                transparent={true}
            >
              <TouchableOpacity activeOpacity={1}
                                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.4)' }}
                                onPress={() => {
                                    this.props.close ? this.props.close() : null;
                                }}
              >
                <ImageBackground resizeMode={'contain'} style={{ width: Adaption.Width(180), height: Adaption.Width(163), marginTop: SCREEN_HEIGHT - (SCREEN_HEIGHT == 812 ? 83 : 49) - Adaption.Width(165), marginLeft: Adaption.Width(170) }} source={require('../../img/ic_road_bg.png')}>

                  <TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: Adaption.Width(50) }}
                                    onPress={() => {
                                        this.props.trendsClick ? this.props.trendsClick() : null;
                                    }}>
                    <View style={{ width: Adaption.Width(40) }}>
                      <Image resizeMode={'contain'} style={{ width: Adaption.Width(27), height: Adaption.Width(27) }} source={require('../../img/ic_trend.png')} />
                    </View>
                    <CusBaseText style={{ fontSize: Adaption.Font(18, 16) }}>基本走势</CusBaseText>
                  </TouchableOpacity>

                  <View style={{ backgroundColor: '#e5e5e5', height: 0.7 }}></View>

                  <TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: Adaption.Width(50) }}
                                    onPress={() => {
                                        this.props.shuomingClick ? this.props.shuomingClick() : null;
                                    }}>
                    <View style={{ width: Adaption.Width(40) }}>
                      <Image resizeMode={'contain'} style={{ width: Adaption.Width(27), height: Adaption.Width(27) }} source={require('../../img/ic_playsm.png')} />
                    </View>
                    <CusBaseText style={{ fontSize: Adaption.Font(18, 16) }}>玩法说明</CusBaseText>
                  </TouchableOpacity>

                  <View style={{ backgroundColor: '#e5e5e5', height: 0.7 }}></View>

                  <TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: Adaption.Width(50) }}
                                    onPress={() => {
                                        this.props.roadsClick ? this.props.roadsClick() : null;
                                    }}>
                    <View style={{ width: Adaption.Width(40) }}>
                      <Image resizeMode={'contain'} style={{ width: Adaption.Width(27), height: Adaption.Width(27) }} source={require('../../img/ic_road.png')} />
                    </View>
                    <CusBaseText style={{ fontSize: Adaption.Font(18, 16) }}>路纸图    </CusBaseText>
                  </TouchableOpacity>

                </ImageBackground>
              </TouchableOpacity>
            </Modal>
        )
    }
    else  if (this.props.modelType == 1){

      return  (<Modal
          visible={this.props.isClose}
          transparent={true}
      >
        <TouchableOpacity activeOpacity={1}
                          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.4)' }}
                          onPress={() => {
                              this.props.close ? this.props.close() : null;
                          }}
        >
          <ImageBackground resizeMode={'contain'} style={{ width: Adaption.Width(180), height: Adaption.Width(130), marginTop: SCREEN_HEIGHT - (SCREEN_HEIGHT == 812 ? 83 : 49) - Adaption.Width(130)}} source={require('../../img/ic_road_bg.png')}>

            <TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: Adaption.Width(50) }}
                              onPress={() => {
                                  this.props.touzhuRecord ? this.props.touzhuRecord() : null;
                              }}>
              <View style={{ width: Adaption.Width(40) }}>
                <Image resizeMode={'contain'} style={{ width: Adaption.Width(27), height: Adaption.Width(27) }} source={require('../../img/ic_tzPknnNote.png')} />
              </View>
              <CusBaseText style={{ fontSize: Adaption.Font(18, 16) }}>投注记录</CusBaseText>
            </TouchableOpacity>

            <View style = {{height:0.7, backgroundColor:'#e5e5e5', width:125, marginLeft:25}}/>

            <TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: Adaption.Width(50) }}
                              onPress={() => {
                                  this.props.shuomingClick ? this.props.shuomingClick() : null;
                              }}>
              <View style={{ width: Adaption.Width(40) }}>
                <Image resizeMode={'contain'} style={{ width: Adaption.Width(27), height: Adaption.Width(27) }} source={require('../../img/ic_playsm.png')} />
              </View>
              <CusBaseText style={{ fontSize: Adaption.Font(18, 16) }}>玩法说明</CusBaseText>
            </TouchableOpacity>

            <View style = {{height:0.7, backgroundColor:'#e5e5e5', width:125, marginLeft:25}}/>

          </ImageBackground>
        </TouchableOpacity>
      </Modal>)
    }

  }
}
