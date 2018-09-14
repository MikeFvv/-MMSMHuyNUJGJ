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
const circleWidth = 26 * KAdaptionWith; //圆大小

// // 在这里设置每个布局的属性
// const styles = StyleSheet.create({
//   // TODO: 开奖
//
// )};
