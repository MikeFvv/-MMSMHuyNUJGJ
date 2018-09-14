'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Alert,
} from 'react-native';

import SegmentedControl from '../../../../common/SegmentedControl'
import UnorderBlockView from './UnorderBlockView'

export default class SwitchBlocksView extends Component {

	static defaultProps = {
	  values: [],
	}

	constructor(props) {
	  super(props);
	  this.state = {
	  	ruleIndex:this.props.currentIndex, // 0官方玩法；1信用玩法
	  };
	}

	render() {
	    return (
	    	<View style={styles.container}>
				{this.props.tag != 'xglhc' ?
		      <View style={styles.segmentContainer}>
		    	 <SegmentedControl
		              style={styles.segmentedControl}
		              values={this.props.segmentedValues}
		              selectedIndex={this.state.ruleIndex}
		              onChange={(selectedIndex)=>{

                    if (this.props.values.length > 0 && selectedIndex == 1) {
                      if (this.props.values[1].length <= 0) {
                        Alert.alert('温馨提示', '信用玩法暂未开启，敬请期待！',[{text:'确定', onPress:()=>{}}]);
                        this.setState({
    		                  ruleIndex:0,
    		                });
                        return;
                      }
                    }

		                if (this.state.ruleIndex == selectedIndex) {
		                  return;
		                }
		                if (Wanfa_1 != selectedIndex) {
		                  // 官方和信用切换要恢复成默认的。
		                  Wanfa = 0; OneMenu = 0; TwoMenu = 0; ThreeMenu = -1;
		                } else {
		                  // 取消选择玩法的时候，也要重新这样赋值。
		                  Wanfa = Wanfa_1; OneMenu = OneMenu_1; TwoMenu = TwoMenu_1; ThreeMenu = ThreeMenu_1;
		                }

		                this.setState({
		                  ruleIndex:selectedIndex,
		                });
		              }}
		    	  />
		      </View>:null}
	    	  {this.props.tag != 'xglhc' ? <View style={styles.line1}></View> : null}
	          <UnorderBlockView
	            blocks={this.props.values[this.state.ruleIndex]}
	            selectedIndex={OneMenu}
	            wanfaIndex={this.state.ruleIndex}
	            onChange={(block,blockIndex,singleViewIndex, oneSelectIndex, blockName, currentWanfaIndex)=>{
	              this.props.onChange?this.props.onChange(block,blockIndex,singleViewIndex, oneSelectIndex, blockName, currentWanfaIndex):null;
	            }}
	          />
	        </View>
	    );
	}
}

const styles = StyleSheet.create({

	container:{
		backgroundColor:'rgb(235,235,241)',
	},

	segmentContainer:{
		alignItems:'center',
	},

	segmentedControl:{
		marginTop:10,
	},

	line1:{
		width:SCREEN_WIDTH,
		height:1,
		backgroundColor: '#ccc',
		marginTop: 10,
	},
});
