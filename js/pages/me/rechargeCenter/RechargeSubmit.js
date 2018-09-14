'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';

class RechargeSubmit extends Component {

	static navigationOptions = ({navigation}) => ({

        header: (
			<CustomNavBar
				centerText = {"充值成功"}
				leftClick={() =>  navigation.goBack() }
			/>
        ),

    });

    componentWillMount() {
		this.order = this.props.navigation.state.params.order;
        this.recharNumber = this.props.navigation.state.params.recharNumber;
	}

    render() {
	    return (
	    	<View style={styles.container}>
	    		<View style={styles.topView}>
	    			<Image 
	    				source={require('./img/ic_recharge_succse.png')}
	    				style={{height:25,width:25}}
	    			/>
                    <CusBaseText style={{fontSize:22,marginLeft:3}}>充值成功！</CusBaseText>
	    		</View>
                <View style={{alignItems:'center',marginTop:15}}>
                    <CusBaseText style={{fontSize:15,color:'#f5acb2'}}>{this.recharNumber}元</CusBaseText>
                </View>
                <View style={{marginTop:15,marginBottom:17,height:1,backgroundColor:'rgb(240,240,240)'}} />
                <CusBaseText style={{fontSize:16,marginLeft:15,marginRight:15}}>  您的充值申请已经成功提交审核，如核实您的金额将会在3分钟内更新，若届时仍未更新，请联系在线客服！</CusBaseText>
	    		<TouchableOpacity
	    		  activeOpacity={1}
	    		  onPress={() => this._backPress()}
	    		  style={styles.submitBtn}
	    		>
	    		  <CusBaseText style={{color:'white'}}>返回继续赚钱</CusBaseText>
	    		</TouchableOpacity>
	    	</View>
	    );
    }

    _backPress = () => {
    	
    	if (global.RechargeInfoRouteKey) {
    		this.props.navigation.goBack(global.RechargeInfoRouteKey);
    		return;
    	}

    	if (global.BankTransferInfoRouteKey) {
    		this.props.navigation.goBack(global.BankTransferInfoRouteKey);
    		return;
    	}

    }

    componentWillUnmount() {
        global.RechargeInfoRouteKey = null;
        global.BankTransferInfoRouteKey = null;
    }
 
}

const styles = StyleSheet.create({

	container:{
		flex:1,
		backgroundColor:'white',
	},

    topView:{
	    flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginTop:35,
    },

	submitBtn:{
		backgroundColor:COLORS.appColor,
		borderRadius:5,
		justifyContent:'center',
		alignItems: 'center',
		marginLeft: 20,
		marginRight: 20,
		height:40,
		marginTop: 40,
	},

});

export default RechargeSubmit;