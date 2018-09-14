'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const rowHeight = 40;

class DrawalSelectBankList extends Component {

	static defaultProps = {
	   dataSource:[],
	   visible:false,
	}

	constructor(props) {
	  super(props);
	  this.state = {
	  	visible:this.props.visible,
	  };
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			visible:nextProps.visible,
		});
	}

	render() {
	    return (
      		<Modal
		        visible={this.state.visible}
		        animationType={'none'}
		        transparent={true}
		        onRequestClose={()=>{}}
              >
			    	<TouchableOpacity
			    		activeOpacity={1}
			    		style={styles.modalBg}
			    		onPress={()=>{
			    			this.props.onCancel?this.props.onCancel():null;
			    		}}
			    	>

					    <FlatList
                   			  automaticallyAdjustContentInsets={false}
                    		  alwaysBounceHorizontal = {false}
					          data={this.props.dataSource}
					          renderItem={this._renderItem}
					          ItemSeparatorComponent={this._renderSeparator}
					          keyExtractor={this._keyExtractor}
					          showsVerticalScrollIndicator={false}
					          style={[styles.listStyle,{height:((rowHeight*this.props.dataSource.length<=200)?rowHeight*this.props.dataSource.length:200),marginTop:Android?(SCREEN_HEIGHT-(rowHeight*this.props.dataSource.length>200?200:rowHeight*this.props.dataSource.length))-rowHeight/2:(SCREEN_HEIGHT-(rowHeight*this.props.dataSource.length>200?200:rowHeight*this.props.dataSource.length))}]}
					      />
			    	</TouchableOpacity>
             </Modal>
	    );
	}

    _renderItem = (info) => {
        return (
        	<TouchableOpacity
        		activeOpacity={1}
        		style={styles.itemStyle}
        		onPress={()=>{
        			this.props.onPress?this.props.onPress(info.item):null;
	            }}
        	>
	        	<CusBaseText style={styles.itemText}>{info.item.name?info.item.name:(info.item.bank_typename+'(尾号:'+info.item.card+')')}</CusBaseText>
        	</TouchableOpacity>
       );
    }

    _getItemLayout = (data, index) => {
    	return {length: rowHeight, offset: (rowHeight+1)*index, index: index};
	}

	_renderSeparator = () => {
		return(<View style={styles.itemSeparator}/>);
	}

	_keyExtractor = (item,index) => {
		return String(index);
	}
}

const styles = StyleSheet.create({

	modalBg:{
		flex:1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		flexDirection: 'column-reverse',
	},

	listStyle:{
		backgroundColor:'white',
	},

	itemSeparator:{
    	backgroundColor:'#cccccc',
    	width:SCREEN_WIDTH,
    	height:1,
    },


	itemStyle:{
    	justifyContent: 'center',
    	alignItems: 'center',
        width: SCREEN_WIDTH,
	    height: rowHeight,
    },

    itemText:{
    	fontSize:15,
    	color:'rgb(160,160,160)',
    },

});


export default DrawalSelectBankList;
