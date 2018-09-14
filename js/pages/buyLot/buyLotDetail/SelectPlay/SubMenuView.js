'use strict';

import React, { Component } from 'react';

import {
  View,
  TouchableHighlight,
  ScrollView,
} from 'react-native';

import SubMenuSingleView from './SubMenuSingleView.js';

export default class SubMenuView extends Component {

	constructor(props) {
	  super(props);
	  this.state = {
	  	singleViewIndex:this.props.singleViewIndex,//选择的singleView索引
	  	blockIndex:this.props.blockIndex,
	  };
	}

	componentWillReceiveProps(nextProps) {

		this.setState({
		    singleViewIndex:nextProps.singleViewIndex,
		    blockIndex:nextProps.blockIndex,
		});
  }
		
	render() {
	    return (
		    <ScrollView
				key={this.props.values[0].parentid}
		        automaticallyAdjustContentInsets={false}
		        alwaysBounceHorizontal = {false}
		        ref={(c) => this._scrollView = c}
		        onLayout={this._onScrollViewLayout}
			    showsVerticalScrollIndicator={false}
				>
		       {this._renderSubMenuSingleView()}
	        </ScrollView>
	    );
	}

	_renderSubMenuSingleView = () => {

		let viewsArr = [];

		this.props.values.map((item,position)=>{

			viewsArr.push(
        <SubMenuSingleView
          resetState = {this.state.singleViewIndex == position?true:false}
          selectedBlockIndex = {this.state.blockIndex}
          key={position}
          name={item.name}
          values={item.playlist}
          onChange={(block,blockIndex)=>{
            this.props.onChange?this.props.onChange(block,blockIndex,position):null;
            if (this.state.singleViewIndex == position) {
              return;
            }
            this.setState({
              singleViewIndex:position,
            });
          }}
        />
      );

		});
		return viewsArr;
	}

     //onLayout function#
     //当组件挂载或者布局变化的时候调用
     //{nativeEvent: { layout: {x, y, width, height}}}
     //setNativeProps 来直接更改组件的样式  不通过触发render来改样式
	_onScrollViewLayout = (event) => {
	    let layout = event.nativeEvent.layout;
	    if (layout.height > SCREEN_HEIGHT-layout.y - 180 - (SCREEN_HEIGHT == 812 ? 22 : 0)) {
	      this._scrollView.setNativeProps({
	        style:{
	          height: SCREEN_HEIGHT == 812 ? SCREEN_HEIGHT - layout.y - 180 - 34 - 22 : SCREEN_HEIGHT - layout.y - 180,
	        }
	      });
	    }
	}

}
