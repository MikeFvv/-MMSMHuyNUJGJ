/**
    Author Ward
    Created by on 2017-10-30 15:00
    dec 新版底部工具栏
**/

import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

export default class NewUnnitBottomView extends Component {

    constructor(props) {

        super(props);
        this.state = ({

            isTouZhuClick: false,   // 是否可以点击投注按钮
            // isLockTouZhu: props.isLock,  //是否封盘
        })
    }


    componentWillReceiveProps(nextProps) {

        if (nextProps.selectNumZhuShu != null) {

            this.setState({

                isTouZhuClick: nextProps.selectNumZhuShu != 0 ? true : false,
                // isLockTouZhu: nextProps.isLock,
            })
        }
    }

    componentDidMount() {

        this.subscription = PushNotification.addListener('isLockTimeEnableTouZhu', (isLock) => {

            this.setState({ isLockTouZhu: true });

            setTimeout(() => {
                this.setState({ isLockTouZhu: false });
            }, isLock * 1000)
        });
    }

    componentWillUnmount() {

        if (typeof (this.subscription) == 'object') {
            this.subscription && this.subscription.remove();
        }

        //若组件被卸载，刷新state则直接返回，可以解决警告(倒计时组件可能造成的警告)
        this.setState = (state, callback) => {
            return;
        }
    }


    render() {
        return (
            <View style={this.props.style}>
                <TouchableOpacity activeOpacity={0.7} style={{ flex: 0.23, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                    onPress={() => {
                        this.props.ClearCarClick ? this.props.ClearCarClick() : null
                    }}>
                    <Image style={styles.newBottomImage} source={require('../../img/ic_buyLotClear.png')}></Image>
                    <CusBaseText style={styles.newBottomText}>清空</CusBaseText>
                </TouchableOpacity>

                <View style={{ height: 30, width: 1, backgroundColor: 'lightgrey', marginTop: 10 }}></View>

                <TouchableOpacity activeOpacity={0.7} style={{ flex: 0.33, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                    onPress={() => {
                        this.props.GamePlayClick ? this.props.GamePlayClick() : null
                    }}>
                    <Image style={styles.newBottomImage} source={require('../../img/ic_tzNote.png')}></Image>
                    <CusBaseText style={styles.newBottomText}>投注记录</CusBaseText>
                </TouchableOpacity>

                <View style={{ height: 30, width: 1, backgroundColor: 'lightgrey', marginTop: 10 }}></View>

                <TouchableOpacity activeOpacity={0.7} style={{ flex: 0.23, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                    onPress={() => {
                        this.props.TrendClick ? this.props.TrendClick() : null
                    }}>
                    <Image style={styles.newBottomImage} source={require('../../img/ic_tzMore.png')}></Image>
                    <CusBaseText style={styles.newBottomText}>更多</CusBaseText>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={this.state.isTouZhuClick ? 0.7 : 1}
                    style={{ flex: 0.21, alignItems: 'center', justifyContent: 'center', backgroundColor: this.state.isTouZhuClick ? '#b52e2f' : '#bfbfbf' }}
                    onPress={() => {
                        if (this.state.isTouZhuClick == true) {
                            this.props.XiaZhuClick ? this.props.XiaZhuClick() : null
                        }
                    }}>
                    <CusBaseText style={styles.newBottomText}>下注</CusBaseText>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    //图片样式
    newBottomImage: {
        width: Adaption.Width(24),
        height: Adaption.Width(24),
        marginLeft: 10,
    },

    //文字颜色
    newBottomText: {
        color: 'white',
        fontSize: Adaption.Font(18, 16),
        marginLeft: 5
    },
})
