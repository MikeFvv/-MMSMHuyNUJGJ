'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import OrderBlockView from './OrderBlockView.js';

const blaColor = 'rgb(4,4,4)';//黑色字体
const leftCircleH = 10;

export default class SubMenuSingleView extends Component {

	static defaultProps = {
	  name: '',
	  values: [],
	}

	constructor(props) {
	  super(props);
	  this.state = {
	  	lineTH:0,
	  	lineBH:0,

      selectedBlockIndex:this.props.selectedBlockIndex,
	  };
	}

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedBlockIndex:nextProps.selectedBlockIndex,
		});
  }

	render() {
      return (
          <TouchableOpacity activeOpacity={1} style={styles.container}>
             <View style={styles.leftView}>
             	<View style={styles.leftViewCircle}>
             	</View>
             </View>

             <View style={styles.rightView}>
	             <View style={styles.rightViewTop}>
	             	<CusBaseText ref='rightViewName' style={styles.rightViewName}>
	             	    {this.props.name}
	             	</CusBaseText>
	             	<OrderBlockView
			            style={styles.orderBlockView}
			            blocks={this.props.values}
			            selectedIndex={this.props.resetState?this.state.selectedBlockIndex:-1}
			            onChange={(block,blockIndex)=>{
		                    this.setState({
		                      selectedBlockIndex:blockIndex,
		                	});
			            	this.props.onChange?this.props.onChange(block,blockIndex):null;
			            }}
	                />
	             </View>
	             <View style={styles.rightViewBottom}/>
             </View>
          </TouchableOpacity>
      );
    }

}

const styles = StyleSheet.create({

	container:{
		width:SCREEN_WIDTH,
		flexDirection: 'row',
	},

	leftView:{
		flexDirection: 'column',
		alignItems: 'center',
		width:25,
	},

	leftViewCircle:{
		width:leftCircleH,
		height:leftCircleH,
		borderRadius:leftCircleH/2,
		borderColor:'rgb(166,166 ,166)',
		borderWidth:2,
		marginTop: 22,
	},

	leftViewTopLine:{
		width:1,
		backgroundColor:'rgb(166,166 ,166)',
	},

	leftViewBottomLine:{
	    width:1,
		backgroundColor:'rgb(166,166 ,166)',
	},

	rightView:{
		width:SCREEN_WIDTH-25,
	},

	rightViewTop:{
		flexDirection: 'row',
	},

	rightViewName:{
		marginTop:20,
		marginRight:0,
		color:blaColor,
		fontSize:Adaption.Font(16, 13),
	},

	orderBlockView:{
		flex:1,
	},

	rightViewBottom:{
		height:1,
		backgroundColor:'rgb(166,166 ,166)',
	},

});
