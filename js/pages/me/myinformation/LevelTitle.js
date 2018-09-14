'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  FlatList,
} from 'react-native';

import CusProgressView from './CusProgressView'

class LevelTitle extends Component {

	constructor(props) {
	  super(props);

	  this.loginObject = global.UserLoginObject;

	  this.state = {
	  	userRise:null,
	  };

	}

	componentDidMount() {
        this._fetchUserEventRise();
	}

	//获取等级信息
    _fetchUserEventRise() {

    	this.refs.LoadingView && this.refs.LoadingView.showLoading('');

        let params = new FormData();
        params.append("ac", "GetUserEventRiseInfo");
        params.append("uid", global.UserLoginObject.Uid);
        params.append("token",global.UserLoginObject.Token);
        params.append("sessionkey",global.UserLoginObject.session_key);

        var promise = GlobalBaseNetwork.sendNetworkRequest(params);
        promise
          .then((responseData) => {

            if (responseData.msg == 0) {

            	this.refs.LoadingView && this.refs.LoadingView.cancer();

                this.setState({
                    userRise:responseData.data,
                });
                
            }else {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(responseData.param);
            }

          })
        .catch((err) => {

           if (err && typeof(err) === 'string' && err.length > 0) {
                this.refs.LoadingView && this.refs.LoadingView.showFaile(err);
            }

        });
    }

  	render() {

		let jinduPecent = 0;

		if (this.state.userRise){

            jinduPecent = ((this.state.userRise.exp - this.state.userRise.prevExp) / (this.state.userRise.nextExp - this.state.userRise.prevExp)) * 100;
		}

	    return (
	    	<View style={styles.container}>
	    		<ImageBackground style={styles.headView} source={require('./img/ic_levelTitle_userbj.png')}>
	    			<View style={styles.headTopView}>
	    				<Image
	    					style={styles.headImg}
	    					source={(this.loginObject && this.loginObject.UserHeaderIcon!='')? {uri:this.loginObject.UserHeaderIcon} : require('./img/ic_levelTitle_aver.png')}
	    				/>
	    				<View style={styles.headTopRightView}>
	    					<View style={{flexDirection:'row',marginBottom:10}}>
	    						<CusBaseText style={{color:'white',fontSize:global.FONT_SIZE(15)}}>{this.loginObject?this.loginObject.UserName:''}</CusBaseText>
		    					<Image style={{width:25,height:18,marginLeft:7,marginRight:7,}} source={require('./img/ic_levelTitle_cown.png')}/>
		    					<CusBaseText style={{color:'rgb(255,240,54)',fontSize:global.FONT_SIZE(15)}}>{this.state.userRise?('VIP'+this.state.userRise.prevVip):''}</CusBaseText>
	    					</View>
	    					<View style={{flexDirection:'row'}}>
	    						<CusBaseText style={{color:'white',marginRight:4,fontSize:global.FONT_SIZE(15)}}>{this.state.userRise?('头衔:'+this.state.userRise.title):''}</CusBaseText>
		    					<CusBaseText style={{color:'rgb(255,240,54)',fontSize:global.FONT_SIZE(15)}}>{this.state.userRise?('成长值:'+this.state.userRise.exp+'分'):''}</CusBaseText>
	    					</View>
	    				</View>
	    			</View>
	    			<View style={styles.headMidView}>
	    				<CusBaseText style={{color:'white',fontSize:global.FONT_SIZE(15)}}>{this._nextLevel()}</CusBaseText>
	    				<CusBaseText style={{color:'white',fontSize:global.FONT_SIZE(15)}}>每充值1元加1分</CusBaseText>
	    			</View>
	    			<View style={styles.headBottomView}>
	    				<CusBaseText style={{color:'white',marginRight:3,fontSize:global.FONT_SIZE(15)}}>{this.state.userRise?('VIP'+this.state.userRise.vip):''}</CusBaseText>
	    				<CusProgressView progress={this.state.userRise?jinduPecent:0} style={{flex:1}}/>
	    				<CusBaseText style={{color:'white',marginLeft:3,fontSize:global.FONT_SIZE(15)}}>{this._nextVip()}</CusBaseText>
	    			</View>
	    		</ImageBackground>
	    		<View style={styles.tipView}>
	    			<Image style={{width:16,height:20}} source={require('./img/ic_levelTitle_V.png')}/>
	    			<CusBaseText style={{fontSize:17,marginLeft:3,}}>等级制度</CusBaseText>
	    		</View>
	    		<FlatList
			          data={this.state.userRise?this.state.userRise.rise_list:[]}
			          renderItem={this._renderItem}
			          ItemSeparatorComponent={this._renderSeparator}
			          keyExtractor={this._keyExtractor}
			          showsVerticalScrollIndicator={false}
			          ListHeaderComponent={this._renderListHeader}
			     />
			     <LoadingView ref="LoadingView"/>
	    	</View>
	    );
  	}

  	_nextLevel = () => {

  		let nextLevel = '';

  		if (this.state.userRise) {

            let jindu = this.state.userRise.nextExp - this.state.userRise.exp;
  			nextLevel = `距离下一级还需要${jindu}分`;
  		}

  		return nextLevel;
  	}

  	_nextVip = () => {

  		if (!this.state.userRise) {
  			return '';
  		}

  		if (this.state.userRise.vip == this.state.userRise.rise_list.length) {
  			return '';
  		}

  		return 'VIP'+this.state.userRise.nextVip;
  	}

  	_keyExtractor = (item,index) => {
		return String(index);
	}

	_renderItem = (info) => {

		let item = info.item;

        return (
		    <View style={{flexDirection:'row',height:40,backgroundColor:'white'}}>
		    	<View style={[styles.itemView,styles.itemBorder]}>
		    		<CusBaseText style={styles.itemText}>{'VIP'+item.ranks}</CusBaseText>
		    	</View>
		    	<View style={[styles.itemView,styles.itemBorder]}>
		    		<CusBaseText style={styles.itemText}>{item.title}</CusBaseText>
		    	</View>
		    	<View style={styles.itemView}>
		    		<CusBaseText style={styles.itemText}>{item.score}</CusBaseText>
		    	</View>
		    </View>
       );
    }

	_renderSeparator = () => {
		return(
			<View style={styles.itemSeparator}/>
		);
	}

	_renderListHeader = () => {
		return(
			<View style={{flexDirection:'row',height:40}}>
				<View style={styles.itemView}>
					<CusBaseText style={styles.itemText}>等级</CusBaseText>
		    	</View>
		    	<View style={styles.itemView}>
		    		<CusBaseText style={styles.itemText}>头衔</CusBaseText>
		    	</View>
		    	<View style={styles.itemView}>
		    		<CusBaseText style={styles.itemText}>成长积分</CusBaseText>
		    	</View>
	    	</View>
		);
	}

	componentWillUnmount() {
		// console.log('LevelTitle-->componentWillUnmount');
	}
}

const styles = StyleSheet.create({

	container:{
		flex:1,
		backgroundColor:'rgb(244,244,244)',
	},

	headView:{
		backgroundColor:'rgba(0,0,0,0)',
	},

	headTopView:{
		flexDirection: 'row',
	    marginLeft:25,
		marginTop:25,
	},

	headImg:{
		width:65,
		height:65,
    	borderRadius:65/2,
	},

	headTopRightView:{
		marginLeft:15,
		justifyContent: 'center',
	},

	headMidView:{
	    marginLeft:15,
		marginTop:20,
	},

	headBottomView:{
		flexDirection: 'row',
	    marginLeft:15,
	    marginRight:15,
		marginTop:10,
		marginBottom:15,
	},

	tipView:{
		height:50,
		backgroundColor:'white',
		paddingLeft:25,
		alignItems:'center',
		flexDirection:'row',
		marginTop:15,
	},

	itemView:{
		flex:1,
		justifyContent:'center',
		alignItems:'center',
	},

	itemBorder:{
		borderRightWidth:1,
		borderColor:'#ccc',
	},

	itemText:{
		fontSize:16,
		textAlign: 'center',
	},

	itemSeparator:{
		height:1,
		backgroundColor:'#ccc',
	},

});


export default LevelTitle;
