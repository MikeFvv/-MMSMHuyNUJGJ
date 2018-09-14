'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

class DrawalSubmit extends Component {

	static navigationOptions = ({navigation}) => ({

        header: (
			<CustomNavBar
				centerText = {"提 款"}
				leftClick={() =>  navigation.goBack() }
			/>
        ),

    });

    render() {
	    return (
	    	<View style={styles.container}>
	    		<View style={styles.view1}>
	    			<Image 
	    				source={require('../rechargeCenter/img/ic_recharge_selected.png')}
	    				style={styles.img}
	    			/>
	    			<CusBaseText style={styles.view12}>您的申请已经提交成功，正在审核中！提款金额:{this.props.navigation.state.params.drawalNumber}元</CusBaseText>
	    		</View>
	    		<View style={styles.view2}/>
	    		<View style={styles.view3}>
	    			<Image 
	    				source={require('../rechargeCenter/img/ic_recharge_money.png')}
	    				style={styles.img}
	    			/>
	    			<CusBaseText style={styles.view32}>提款到账后，我们将在24小时之内充值到您的账号上，若届时仍没有到账，请联系在线客服。</CusBaseText>
	    		</View>
	    		<TouchableOpacity
	    		  activeOpacity={1}
	    		  onPress={() => this._submitClicked()}
	    		  style={styles.submitBtn}
	    		>
	    		  <CusBaseText style={{color:'white'}}>完成</CusBaseText>
	    		</TouchableOpacity>
	    	</View>
	    );
    }

    _submitClicked = () => {
    	this.props.navigation.goBack(global.DrawalinfoViewControllerKey);
    }
}

const styles = StyleSheet.create({

	container:{
		flex:1,
		backgroundColor:'white',
	},

	view1:{
		flexDirection: 'row',
		marginLeft:10,
		marginRight: 10,
		marginTop: 10,
		alignItems: 'center',
		width:SCREEN_WIDTH-10-45,
	},

	view2:{
		width:2,
		height:75,
		marginLeft:32,
		backgroundColor:'green',
	},

	view3:{
		flexDirection: 'row',
		marginLeft:10,
		marginRight: 10,
		alignItems: 'center',
		width:SCREEN_WIDTH-10-45,
	},

	img:{
		width:45,
		height:45,
	},

	view12:{
		fontSize:17,
		paddingLeft:15,
	},

	view32:{
		fontSize:15,
		color: 'rgb(171,171,171)',
		paddingLeft: 15,
	},

	submitBtn:{
		backgroundColor:COLORS.appColor,
		borderRadius:5,
		justifyContent:'center',
		alignItems: 'center',
		marginLeft: 20,
		marginRight: 20,
		height:35,
		marginTop: 20,
	},

});

export default DrawalSubmit;