'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
} from 'react-native';

const orgColor = COLORS.appColor;//橙色
const graColor = 'rgb(169,169,169)';//灰色边框
const blaColor = 'rgb(4,4,4)';//黑色字体
const borderR = 5;//边框半径
const borderW = 1;//边框宽度

const blankW = Adaption.Width(10);//块之间的宽度
const blockH = Adaption.Height(40);//块高度
const blockLW = Adaption.Width(85);//大型块宽度
const blockLsW = Adaption.Width(110);//大型块宽度
const blockLXW = Adaption.Width(130);//大型块宽度

export default class OrderBlockView extends Component {

    static defaultProps = {
      blocks: [],
    }

    constructor(props) {
      super(props);
      this.state = {
        selectedIndex:this.props.selectedIndex,
      };
    }

   componentWillReceiveProps(nextProps) {

      this.setState({
        selectedIndex:nextProps.selectedIndex,
      });
   }

    render() {

      return (
        <View style={[this.props.style,styles.container]}>
          {this._renderBlocks()}
        </View>
      );

    }

    _renderBlocks = () => {

      let viewsArr = [];

      this.props.blocks.map((block,position)=>{

        let blockW = 0;
        if (block.playname.length > 5) {
            blockW = blockLXW;
        } else if (block.playname.length == 5 && !block.playname.includes('1')) {
          blockW = blockLsW;
        }else {
            blockW = blockLW;
        }

        viewsArr.push(
          <OrderBlock
            key={position}
            block={block}
            blockW={blockW}
            style={{marginBottom: blankW,marginRight: blankW}}
            selected={this.state.selectedIndex==position?true:false}
            onChange={(selected)=>{
              this.props.onChange?this.props.onChange(block,position):null;
              if (selected) { //被选中
                // 不能return；要回调到外面隐藏玩法的视图。
                // if (this.state.selectedIndex == position) {
                //     return;
                // }
                this.setState({
                  selectedIndex:position,
                });
              }
            }}
          />
        );

      });

      return viewsArr;
    }

}

class OrderBlock extends Component {

  static defaultProps = {
    block: null,
    blockW: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      selected:this.props.selected,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected:nextProps.selected,
    });
  }

  render() {

    return (
        <TouchableHighlight
          style={[this.props.style,styles.OrderBlock,
                 {borderColor:this.state.selected?orgColor:graColor,width:this.props.blockW}
                 ]}
          activeOpacity={1}
          underlayColor='white'
          onPress={()=>{
            this.props.onChange?this.props.onChange(!this.state.selected):null;
          }}
        >
          <CusBaseText
            style={[styles.OrderBlockText,{color:this.state.selected?orgColor:blaColor}]}
          >
            {this.props.block.playname}
          </CusBaseText>
        </TouchableHighlight>
    );
  }

}

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft:10,
    paddingTop:10,
  },

  OrderBlock:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white',
    borderRadius:borderR,
    borderWidth:borderW,
    height:blockH,
  },

  OrderBlockText:{
    fontSize:Adaption.Font(15, 13),
  },

});
