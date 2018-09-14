'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  ListView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';

const blaColor = 'rgb(4,4,4)';//黑色字体

const borderR = 5;//边框半径
const borderW = 1;//边框宽度

const col = 4;
const blankW = 10;//块之间的宽度
const marginLeftRight = 5;
const blockW = (SCREEN_WIDTH - marginLeftRight * 2 - col * 2 * blankW) / col;//块宽度
const blockH = global.Adaption.Width(35);//块高度

var ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class RechaAmountSelectView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allList: props.dataSource,
      selecteIndex: props.selecteIndex,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      allList: nextProps.dataSource,
      selecteIndex: nextProps.selecteIndex,
    });
  }

  render() {

    if (this.state.allList.length > 0) {

      return (
        <ListView
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          dataSource={ds.cloneWithRows(this.state.allList)}
          renderRow={this._renderRow}
          contentContainerStyle={styles.listViewStyle}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={[{ backgroundColor: 'white' }, this.props.style]}
        />
      );

    } else {
      return (<View style={styles.container} />);
    }

  }

  _renderRow = (rowData, sectionID, rowID) => {

    return (
      <TouchableOpacity
        style={[styles.itemStyle, this.state.selecteIndex == rowID ? { backgroundColor: COLORS.appColor } : { backgroundColor: 'white' }]}
        activeOpacity={1}
        onPress={() => this.props.onPress ? this.props.onPress(rowData, rowID) : null}>
        <CusBaseText style={[styles.amount, this.state.selecteIndex == rowID ? { color: 'white' } : { color: blaColor }]}>{'¥'+rowData}</CusBaseText>
      </TouchableOpacity>
    );

  }

}

const styles = StyleSheet.create({

  listViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingLeft: marginLeftRight,
    paddingRight: marginLeftRight,
  },

  itemStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: blockW,
    height: blockH,
    marginLeft: blankW,
    marginRight: blankW,
    marginBottom: blankW,
    borderRadius: borderR,
    borderColor: '#ececec',
    borderWidth: borderW,
  },

  amount: {
    fontSize: 15,
  },

});