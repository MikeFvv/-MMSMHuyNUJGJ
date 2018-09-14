/**
 Created by Ward on 2018/01/05
 
 */
import React, { Component } from 'react';
import {
    View,
    Modal,
    TouchableOpacity,
    Dimensions
} from 'react-native';

export default class TouZhuHeaderView extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let topHeight = 0;
        if (global.Android) {
            topHeight = 58;

        } else {
            if (SCREEN_HEIGHT == 812) {
                topHeight = 88;
            } else {
                topHeight = 64;
            }
        }

        return (<Modal
            visible={this.props.isClose}
            animationType={'none'}
            transparent={true}
            onRequestClose={() => { }}
        >
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                    this.props.close ? this.props.close() : null;
                }}>
                <View style={{ height: topHeight, width: SCREEN_WIDTH }}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={1}
                style={{ height: SCREEN_HEIGHT - topHeight, backgroundColor: 'rgba(0,0,0,0.4)' }}
                onPress={() => {

                    this.props.close ? this.props.close() : null;
                }}>
                <View style={{ width: SCREEN_WIDTH, height: Adaption.Width(80), backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity activeOpacity={1}
                                      style={{
                                          backgroundColor: this.props.slectIndex == 1 ? '#e03a38' : 'white',
                                          borderRadius: 5,
                                          borderWidth: this.props.slectIndex == 1 ? 0 : 1,
                                          borderColor: 'lightgray',
                                          width: SCREEN_WIDTH/3-20,
                                          height: Adaption.Width(40),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          marginLeft: Adaption.Width(15),
                                      }}
                                      onPress={() => {

                                          if (this.props.slectIndex == 1) {
                                              this.props.close ? this.props.close() : null;
                                          } else {
                                              this.props.onChange ? this.props.onChange(1) : null;
                                          }

                                      }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.props.slectIndex == 1 ? 'white' : 'black' }}>
                            彩票
                        </CusBaseText>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                                      style={{
                                          backgroundColor: this.props.slectIndex == 0 ? '#e03a38' : 'white',
                                          borderRadius: 5,
                                          borderWidth: this.props.slectIndex == 0 ? 0 : 1,
                                          borderColor: 'lightgray',
                                          width: SCREEN_WIDTH/3-20,
                                          height: Adaption.Width(40),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          marginLeft: Adaption.Width(15),
                                      }}
                                      onPress={() => {

                                          if (this.props.slectIndex == 0) {
                                              this.props.close ? this.props.close() : null;
                                          } else {
                                              this.props.onChange ? this.props.onChange(0) : null;
                                          }

                                      }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.props.slectIndex == 0 ? 'white' : 'black' }}>
                            足球
                        </CusBaseText>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1}
                                      style={{
                                          backgroundColor: this.props.slectIndex == 2 ? '#e03a38' : 'white',
                                          borderRadius: 5,
                                          borderWidth: this.props.slectIndex == 2 ? 0 : 1,
                                          borderColor: 'lightgray',
                                          width: SCREEN_WIDTH/3-20,
                                          height: Adaption.Width(40),
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          marginLeft: Adaption.Width(15),
                                      }}
                                      onPress={() => {

                                          if (this.props.slectIndex == 2) {
                                              this.props.close ? this.props.close() : null;
                                          } else {
                                              this.props.onChange ? this.props.onChange(2) : null;
                                          }

                                      }}>
                        <CusBaseText style={{ fontSize: Adaption.Font(19, 15), color: this.props.slectIndex == 2 ? 'white' : 'black' }}>
                            电子游戏
                        </CusBaseText>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>)
    }
}