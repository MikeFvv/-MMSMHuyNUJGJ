'use strict';

import React, { Component } from 'react';

import {
  	StyleSheet,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

class CashTrasaSubmit extends Component {

	static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText = {'现金交易'}
                leftClick={() =>  navigation.goBack() }
            />
        ),

    });

    constructor(props) {
      super(props);
      this.info = null;
    }

    componentWillMount() {
      this.info = this.props.navigation.state.params.info;
    }

  	render() {
	    return (
          <View style={styles.container}>
            <View style={styles.view1}>
              <Image style={styles.img} source={require('./img/ic_cashTrasa_submit.png')}/>
              <CusBaseText style={styles.tip}>转账成功</CusBaseText>
            </View>
            <View style={styles.view2}>
              <View>
                <View style={styles.prexView}>
                  <CusBaseText style={styles.prex}>转入账号：</CusBaseText>
                </View>
                <View style={styles.prexView}>
                  <CusBaseText style={styles.prex}>转账金额：</CusBaseText>
                </View>
                <View style={styles.prexView}>
                  <CusBaseText style={styles.prex}>转账时间：</CusBaseText>
                </View>
              </View>
              <View>
                <View style={styles.prexView}>
                  <CusBaseText style={styles.prex}>{this.info.account}</CusBaseText>
                </View>
                <View style={styles.prexView}>
                  <CusBaseText style={styles.prex}>{this.info.price}</CusBaseText>
                </View>
                <View style={styles.prexView}>
                  <CusBaseText style={styles.prex}>{this.info.time}</CusBaseText>
                </View>
              </View>
            </View>
            <TouchableOpacity
                    activeOpacity={1}
                    style={styles.nextBtn}
                    onPress={()=>this._nextBtnClicked()}
                >
                    <CusBaseText style={styles.nextText}>返回继续转账</CusBaseText>
            </TouchableOpacity>
          </View>
	    );
  	}

    _nextBtnClicked = () => {
        this.props.navigation.state.params.cleanUserAcount ? this.props.navigation.state.params.cleanUserAcount() : null;
        this.props.navigation.goBack(global.CashTrasaInfoRouteKey);
    }
}

const styles = StyleSheet.create({

    container:{
      flex:1,
      backgroundColor:'rgb(243,243,243)',
    },

    view1:{
      alignItems: 'center',
      marginTop:25,
    },

    img:{
      width:88,
      height:88,
      borderRadius:44,
      marginBottom:10,
    },

    tip:{
      fontSize:17,
      color: 'rgb(99, 99, 99)',
    },

    view2:{
      backgroundColor: 'white',
      flexDirection: 'row',
      marginTop: 22,
      paddingBottom:5,
      justifyContent:'center',
    },

    prexView:{
      height:35,
      justifyContent:'center',
    },

    prex:{
      fontSize:15,
    },

    nextBtn:{
        backgroundColor:COLORS.appColor,
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop:20,
    },

    nextText:{
        fontSize:15,
        color:'white',
    },

});


export default CashTrasaSubmit;