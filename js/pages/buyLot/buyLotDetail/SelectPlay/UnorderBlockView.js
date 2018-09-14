'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

const orgColor = COLORS.appColor;//橙色
const graColor = 'rgb(169,169,169)';//灰色边框
const blaColor = 'rgb(4,4,4)';//黑色字体
const borderR = 5;//边框半径
const borderW = 1;//边框宽度

const blankW = Adaption.Width(10);//块之间的宽度
const blockH = Adaption.Height(40);//块高度

const blockSW = Adaption.Width(70);//小型块宽度  length <= 2
const blockMW = Adaption.Width(75);//中型块宽度  length == 3
const blockLW = Adaption.Width(94);//大型块宽度  length > 3

import SubMenuView from './SubMenuView.js';

export default class UnorderBlockView extends Component {

    static defaultProps = {
      blocks: [],
    }

    constructor(props) {
      super(props);
      this.state = {
        selectedIndex:this.props.selectedIndex,
        currentOneName:this.props.blocks.length > 0 ? (this.props.blocks[this.props.selectedIndex]?this.props.blocks[this.props.selectedIndex].name:'') : null,
        currentWanfaIndex:this.props.wanfaIndex,

        tempTwoIndex:TwoMenu,
        tempThreeIndex:ThreeMenu,
      };
    }

    componentWillReceiveProps(nextProps) {
      // 这个方法，是重新给PropTypes的属性赋值时走，而不会走constructor的
      this.setState({
        selectedIndex:nextProps.selectedIndex,
        currentOneName:nextProps.blocks.length > 0 ? nextProps.blocks[nextProps.selectedIndex].name : null,
        currentWanfaIndex:nextProps.wanfaIndex,

        tempTwoIndex:TwoMenu,
        tempThreeIndex:ThreeMenu,
      });
    }

    render() {
      return (

        <TouchableOpacity activeOpacity={1} style={[styles.container,this.props.style]}>
          <View style={styles.unorderBlockView}>
            {this._renderBlocks()}
          </View>
          <View style = {{height:1, width:SCREEN_WIDTH, backgroundColor:'#d3d3d3'}}></View>
          {this._renderSubMenuView()}
        </TouchableOpacity>
      );
    }


    _renderBlocks = () => {

      if (this.props.blocks.length <= 0) {
        return null;
      }

      let viewsArr = [];
      let blockW = 0;

      this.props.blocks.map((block,position)=>{

        if ((block.name?block.name:block).length == 0) {
            blockW = 0;
        }else if ((block.name?block.name:block).length <= 2) {
            blockW = blockSW;
        }else if ((block.name?block.name:block).length == 3) {
            blockW = blockMW;
        }else {
            blockW = blockLW;
        }

        viewsArr.push(
          <UnorderBlock
            key={position}
            block={block}
            blockW={blockW}
            style={{marginBottom: blankW,marginRight: blankW}}
            selected={this.state.selectedIndex==position?true:false}
            onPress={(selected, name)=>{
              if (selected) { //被选中
                this.setState({
                  selectedIndex:position,
                  currentOneName:name,
                  // 如果当前选择的一级菜单，没有选择到三级菜单，又点到了保存起来的一级，二三级就从保存的拿
                  tempTwoIndex:position == OneMenu ? TwoMenu : -1, // -1：一个都不选择。
                  tempThreeIndex:position == OneMenu ? ThreeMenu : -1,
                });
              }
            }}
          />
        );

      });

      return viewsArr;
    }

    _renderSubMenuView = () => {

       let value = this.props.blocks[this.state.selectedIndex];

       if (!value || !value.submenu || (value.submenu.length <= 0)) {
          return null;
       }

       return (
          <SubMenuView
            values = {value.submenu}
            singleViewIndex={this.state.tempTwoIndex}
            blockIndex={this.state.tempThreeIndex}
            onChange={(block,blockIndex,singleViewIndex)=>{
              this.props.onChange?this.props.onChange(block,blockIndex,singleViewIndex, this.state.selectedIndex, this.state.currentOneName, this.state.currentWanfaIndex):null;
            }}
          />
       );
    }
}

class UnorderBlock extends Component {

  static defaultProps = {
    block: null,
    blockW: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      selected:this.props.selected?this.props.selected:0,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected:nextProps.selected,
    });
  }

  render() {

    return (
        <TouchableOpacity
          style={[styles.unorderBlock,this.props.style,
                 {backgroundColor:this.state.selected?orgColor:'white',
                  width:this.props.blockW,
                  borderWidth:this.state.selected?0:borderW}
                 ]}
          activeOpacity={1}
          onPress={()=>{
            this.props.onPress?this.props.onPress(!this.state.selected, this.props.block.name):null;
          }}
        >
          <CusBaseText style={[styles.unorderBlockText,{color:this.state.selected?'white':blaColor}]}>{this.props.block.name}</CusBaseText>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container:{
  },

  unorderBlockView:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft:10,
    paddingTop:10,
  },

  unorderBlock:{
    height:blockH,
    borderRadius:borderR,
    borderColor: graColor,
    justifyContent:'center',
    alignItems:'center',
  },

  unorderBlockText:{
    fontSize:Adaption.Font(16, 13),
  },

});
