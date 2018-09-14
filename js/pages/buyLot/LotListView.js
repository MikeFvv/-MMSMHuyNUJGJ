'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';

import LotListCell from './LotListCell';
const cellHeight = 100;

class LotListView extends Component {

	constructor(props) {
	    super(props);

	    this.state = {
	      dataSource:this.props.dataSource,
	    };
	}

	componentWillReceiveProps(nextProps) {
	    this.setState({
	    	dataSource:nextProps.dataSource,
		});
  	}

	render() {

	    if (this.state.dataSource && this.state.dataSource.length > 0) {

		    return (
	            <View style={styles.container}>
		            <FlatList
				        style={{backgroundColor:'white'}}
				        data={this.state.dataSource}
				        renderItem={this._renderRow}
				        ItemSeparatorComponent={this._renderSeparator}
				        keyExtractor={this._keyExtractor}
				        showsVerticalScrollIndicator={false}
				        enableEmptySections={true}
		             />
	           </View>
	       );

	   }else {

		    return (
	           <View style={styles.container}/>
	        );
		}
	}

	_renderRow = (info) => {

	   return (
	      <View style={styles.itemStyle}>
	       <TouchableOpacity
	          activeOpacity={1}
	          style={styles.itemBtn}
	       	  onPress={()=>this.props.navigator.navigate('BuyLotDetail', { gameId:info.item.game_id, indexList:info.index })}
	       >
			    <LotListCell
			        item = {info.item}
			        countDownFinished={() => this.props.countDownFinished?this.props.countDownFinished():null}
			        countDown={(nextIndex,jiezhitime,leftTime,prevTime) => this.props.countDown?this.props.countDown(info.index,nextIndex,jiezhitime,leftTime,prevTime):null}
                    index = {info.index}
				/>
	        </TouchableOpacity>
	      </View>
       );
	}

	_renderSeparator() {

		return (
			<View style={styles.itemSeparator}/>
		);
	}

	_keyExtractor = (item,index) => {
		return String(index);
	}
}

const styles = StyleSheet.create({

	container:{
    	flex:1,
    },

    itemStyle: {
	    backgroundColor: 'white',
	    width: SCREEN_WIDTH,
	    height: cellHeight,
    },

    itemBtn:{
        width: SCREEN_WIDTH,
	    height: cellHeight,
	    alignItems: 'center',
    },

    itemSeparator:{
    	backgroundColor:'#cccccc',
    	width:SCREEN_WIDTH,
    	height:1,
    },

});


export default LotListView;
