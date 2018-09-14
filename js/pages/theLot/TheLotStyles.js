import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Dimensions,

} from 'react-native';

import Adaption from '../../skframework/tools/Adaption';

const { width, height } = Dimensions.get('window');
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;
const blankWidth = 4 * KAdaptionWith; //间距
const circleWidth = 28 * KAdaptionWith; //圆大小


// 在这里设置每个布局的属性
const styles = StyleSheet.create({
  // TODO: 开奖
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  cellStyle: {
    width: width,
    height: 100,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    flexDirection: 'row',
  },

  colorRoundView: {
    marginLeft: 2 * KAdaptionWith,
    marginRight: 0,
    width: circleWidth,
    height: circleWidth,
    borderRadius: circleWidth * 0.5,   // 四边的框宽
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },

  textRound: {
    fontSize: Adaption.Font(18, 15),
    color: '#eb344a',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'center',
    marginTop:2,
  },


  circleView: {
    flexDirection: 'row',
    width: circleWidth + blankWidth,
    height: circleWidth,
  },

  circleText: {
    color: 'white',
    fontSize: Adaption.Font(18, 15),
    textAlign: 'center',
    backgroundColor: 'red',
    width: circleWidth,
    height: circleWidth,
    borderRadius: circleWidth / 2,
    marginTop: 5 * KAdaptionHeight,
    overflow: 'hidden',
  },

  blankView: {
    width: blankWidth,
    height: circleWidth,
  },

  imagSize: {
    width: 30 * KAdaptionWith,
    height: 30 * KAdaptionWith,
   
  },

  imgUrlSize: {
    width: 60,
    height: 60,
  },

  roundSizeView: {
    width: 310 * KAdaptionWith,
    height: 30 * KAdaptionHeight,
    flexDirection: 'row',
    marginTop: 8 * KAdaptionHeight,
    // marginLeft: 2*KAdaptionWith,
  },

  roundSizeViewRight: {
    width: 310 * KAdaptionWith,
    height: 30 * KAdaptionHeight,
    flexDirection: 'row',
    marginTop: 8 * KAdaptionHeight,
    marginLeft: 60,
  },

  circleTextRed: {
    color: 'red',
    fontSize: Adaption.Font(16, 14),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderStyle: null,
    borderWidth: 1,
    width: circleWidth,
    height: circleWidth,
    borderRadius: circleWidth / 2,
    marginTop: 5 * KAdaptionHeight,
    overflow: 'hidden',
  },

  theLotDatailCell: {
    width: width,
    height: Adaption.Height(80),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    flexDirection: 'row',
  },

  theLotDatailPcddView: {

    marginLeft: 3,
    marginRight: 0,
    width: circleWidth,
    height: circleWidth,
    borderRadius: circleWidth * 0.5,   // 四边的框宽
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
    borderStyle: null,
    borderWidth: 1,
  },

  k3BallView: {

    width: 310 * KAdaptionWith,
    height: 35 * KAdaptionHeight,
    marginTop: 15 * KAdaptionHeight,
  },

  k3BallImage: {
    flexDirection: 'row',
  },

  //圆的属性设置
  roundView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  Pk10BallView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2 * KAdaptionWith,
    marginRight: 0,
    width: circleWidth,
    height: circleWidth,
  },

  textRoundWhite: {
    fontSize: Adaption.Font(18, 15),
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0)',
    textAlign: 'center'
  },

});


module.exports = styles;
