'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
} from 'react-native';

const redColor = 'rgb(185,7,30)';//红色
const borderR = 5;//边框半径
const borderW = 1;//边框宽度
const segmentW = 70;
const segmentH = 25;

export default class SegmentedControl extends Component {

	static defaultProps = {
	  values: ['seg1','seg2'],
	  selectedColor:redColor,
	  unSelectedColor:'white',
	  selectedIndex:0,
	}

	constructor(props) {
	  super(props);
	  this.state = {
       selectedIndex: this.props.selectedIndex,
	  };
	}

	render() {
	    return (
	      <View style={[styles.container,{width:segmentW*this.props.values.length},this.props.style]}>
	      {this._renderSegmente()}
	      </View>
	    );
	 }

	 _renderSegmente(){
	 	let viewsArr = [];
	 	this.props.values.map((value,position)=>{
	 		viewsArr.push(
	 			<TouchableHighlight
			    	key={position}
			    	activeOpacity={1}
			    	style={{width:this._itemW(),height:this._itemH()}}
			    	onPress={()=>{
			    		this.setState({
			    			selectedIndex: position,
			    		});
			    		this.props.onChange?this.props.onChange(position):null;
			    	}}>
				    	<View style={[styles.itemView,{backgroundColor: this.state.selectedIndex == position?this.props.selectedColor:this.props.unSelectedColor}]}>
				        	 <CusBaseText style={[styles.itemtText,{color:this.state.selectedIndex == position?this.props.unSelectedColor:this.props.selectedColor}]}>{value}</CusBaseText>
	              		</View>
        	   </TouchableHighlight>
	 		);

	 	});
	 	return viewsArr;
	 }

	 _itemW = () => {
	 	if (this.props.style && this.props.style.width) {
	 		return this.props.style.width/this.props.values.length;
	 	}
	 	return segmentW;
	 }

	 _itemH = () => {
	 	if (this.props.style && this.props.style.height) {
	 		return this.props.style.height;
	 	}
	 	return segmentH;
	 }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selectedIndex: nextProps.selectedIndex,
		});
    }

}

const styles = StyleSheet.create({

	container:{
		flexDirection: 'row',
		height:segmentH,
		borderWidth: borderW,
		borderColor: redColor,
		borderRadius: borderR,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor:'transparent',
		overflow: 'hidden',
	},

	itemView:{
		flex:1,
        alignItems: 'center',
        justifyContent: 'center',
	},

	itemtText:{
		fontSize: 13,
	},

});
