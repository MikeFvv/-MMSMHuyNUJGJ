/**
 * Created by kl on 2018/7/30.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ImageBackground,
    Image,
} from 'react-native';
import CusProgressView from './CusProgressView'

export default class MyInfoHeadView extends Component {

    componentWillMount() {
        this.userRise = this.props.userRise;
        this.loginObject = this.props.loginObject;
    }

    componentWillReceiveProps(nextProps) {
        this.userRise = nextProps.userRise;
        this.loginObject = nextProps.loginObject;
    }

    render() {
        let jinduPecent = 0;
        if (this.userRise){
            jinduPecent = ((this.userRise.exp - this.userRise.prevExp) / (this.userRise.nextExp - this.userRise.prevExp)) * 100;
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
                            <View style={{marginBottom:10}}>
                                <CusBaseText style={{color:'white',fontSize:global.FONT_SIZE(15)}}>{this.loginObject?this.loginObject.UserName:''}</CusBaseText>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <View style={{flexDirection:'row'}}>
                                    <CusBaseText style={{color:'white',marginRight:4,fontSize:global.FONT_SIZE(15)}}>{this.userRise?('等级:'):''}</CusBaseText>
                                    <CusBaseText style={{color:'rgb(255,240,54)',marginRight:4,fontSize:global.FONT_SIZE(15)}}>{this.userRise?('LV.'+this.userRise.prevVip):''}</CusBaseText>
                                </View>
                                <View style={{flexDirection:'row',marginLeft:10}}>
                                    <CusBaseText style={{color:'white',marginRight:4,fontSize:global.FONT_SIZE(15)}}>{this.userRise?('成长值:'):''}</CusBaseText>
                                    <CusBaseText style={{color:'rgb(255,240,54)',fontSize:global.FONT_SIZE(15)}}>{this.userRise?(this.userRise.exp):''}</CusBaseText>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.headMidView}>
                        <CusBaseText style={{color:'white',fontSize:global.FONT_SIZE(15)}}>{this._nextLevel()}</CusBaseText>
                    </View>
                    <View style={styles.headBottomView}>
                        <CusBaseText style={{color:'white',marginRight:3,fontSize:global.FONT_SIZE(15)}}>{this.userRise?('LV.'+this.userRise.vip):''}</CusBaseText>
                        <CusProgressView progress={this.userRise?jinduPecent:0} style={{flex:1}}/>
                        <CusBaseText style={{color:'white',marginLeft:3,fontSize:global.FONT_SIZE(15)}}>{this._nextVip()}</CusBaseText>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    _nextLevel = () => {
        let nextLevel = '';
        if (this.userRise) {
            let jindu = this.userRise.nextExp - this.userRise.exp;
            nextLevel = `距离下一级还需要${jindu}成长值`;
        }
        return nextLevel;
    }

    _nextVip = () => {
        if (!this.userRise) {
            return '';
        }
        return 'LV.'+this.userRise.nextVip;
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    headView:{
        backgroundColor:'rgba(0,0,0,0)',
        height:170,
    },
    headTopView:{
        flexDirection: 'row',
        marginLeft:25,
        marginTop:15,
    },
    headMidView:{
        marginTop:15,
        alignItems:'center',
    },
    headBottomView:{
        marginTop:15,
        marginRight:15,
        marginLeft:15,
        flexDirection: 'row',
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
});