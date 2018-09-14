import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

// import {CachedImage, ImageCacheProvider} from "react-native-img-cache";


import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';


const IMG_HEIGHT = 60;

export default class LotBlockCell extends Component {

    static defaultProps = {
        item: null,
    };

    constructor(props) {
        super(props);

        this.timer = null;//定时器

        // if (props.item && props.item.nextIndex)
        // {
        //     this.nextIndex = props.item.nextIndex;//倒计时next数组
        //     this.leftTime = props.item.leftTime;//倒计时时间
        //     this.prevTime = props.item.prevTime;//倒计时前一个时间
        //     this.getCountDown();
        // } else {
        //     this.nextIndex = 0;
        //     if (props.item && props.item.next && props.item.next[this.nextIndex] && props.item.next[this.nextIndex].jiezhitime) {
        //         this.prevTime = this.props.item.next[this.nextIndex].jiezhitime;
        //         this.leftTime = this.props.item.next[this.nextIndex].jiezhitime;
        //         this.getCountDown();
        //     }
        // }

        this.state = {
            countDownTime: '00:00:00',
            backupCpicon: false,//是否启用备用彩种地址
        };

    }

    componentWillMount() {
        this._endUnmount = false;

        // PushNotification.addListener('Lot_CellTime', (data, index) => {
        //     if (this.props.index === index && global.time !== 0) {
        //         this.leftTime = data;
        //         global.time = 0;
        //     }
        // });
    }

    componentWillUnmount() {
        this._endUnmount = true;
        // this.timer && clearInterval(this.timer);
    }

    render() {

        // let iconImage = '';
        // let iconImageArray = this.props.item.icon.split('.png');
        //
        // if(this.props.item.enable != 2)
        // {
        //     iconImage =this.props.item.icon;
        // }
        // else
        //     {
        //     iconImage = iconImageArray[0] + '_2' + '.png' ;
        // }

        return (

            <View style={styles.container}>

                <ImageCacheProvider>

                    <CachedImage
                        // source={{
                        //     uri: this.state.backupCpicon ? GlobalConfig.backupCpicon() + this.props.item.tag + '.png' : Cpicon + this.props.item.tag + '.png',
                        //     cache: 'force-cache'
                        // }}
                        style={styles.themeImg}

                        source={{
                            uri: this.props.item.icon,
                            cache: 'force-cache'
                        }}
                        onError={({nativeEvent: {error}}) => {
                            this.setState({
                                backupCpicon: true,
                            });
                        }}
                    />
                </ImageCacheProvider>

                <CusBaseText style={styles.themeName}>{this.props.item.game_name ? this.props.item.game_name : ''}</CusBaseText>

                <CusBaseText
                    style={{ fontSize: Adaption.Font(12, 11), fontWeight: "400", color: "#666666", marginTop: 2 }}>
                    {this.props.item.tip}
                </CusBaseText>

            </View>
        );
    }

    // timestamp是秒 getTime()是毫秒
    getCountDown() {

        if (this.timer) {
            return;
        }

        this.timer = setInterval(() => {

            //组件挂载了
            if (this._endUnmount == true) {
                return;
            }

            if (this.leftTime <= 0) {

                this.nextIndex++;

                if (this.nextIndex == this.props.item.next.length) {

                    this.nextIndex = 0;
                    this.props.countDownFinished ? this.props.countDownFinished() : null;

                } else {

                    if (this.props.item && this.props.item.next && this.props.item.next[this.nextIndex] && this.props.item.next[this.nextIndex].jiezhitime)
                    {

                        this.leftTime = this.props.item.next[this.nextIndex].jiezhitime - this.prevTime;

                        let max =  this.props.item.next[5].jiezhitime - parseInt(this.props.item.next[4].jiezhitime);

                        this.leftTime = this.leftTime > max ? `${max}` : this.leftTime;

                        this.prevTime = this.props.item.next[this.nextIndex].jiezhitime;
                        let jiezhitime = this.props.item.next[this.nextIndex].jiezhitime;
                        this.props.countDown ? this.props.countDown(this.nextIndex, jiezhitime, this.leftTime, this.prevTime) : null;
                    }

                }

            } else {

                this.leftTime = this.leftTime - 1;

                if (this.props.item && this.props.item.next && this.props.item.next[this.nextIndex] && this.props.item.next[this.nextIndex].jiezhitime) {
                    let jiezhitime = --this.props.item.next[this.nextIndex].jiezhitime;
                    this.props.countDown ? this.props.countDown(this.nextIndex, jiezhitime, this.leftTime, this.prevTime) : null;
                }

            }

            // var d=Math.floor(t/1000/60/60/24);
            let day = Math.floor((this.leftTime / 60 / 60 / 24) * 100) / 100; //保留两位小数
            let hour = Math.floor(this.leftTime / 60 / 60 % 24);
            let min = Math.floor(this.leftTime / 60 % 60);
            let sec = Math.floor(this.leftTime % 60);

            //大于1天则要乘以24
            if (day >= 1.0) {
                hour = Math.floor(day * 24);
            }

            if (hour < 10) {
                hour = "0" + hour;
            }
            if (min < 10) {
                min = "0" + min;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }
            let countDownTime = hour + ":" + min + ":" + sec;

            this.setState({
                countDownTime: countDownTime
            });

        }, 1000);
    }
};

// 65+10+16+5+10
const styles = StyleSheet.create({

    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },

    themeName: {
        marginTop: 12,
        fontSize: Adaption.Font(15, 13),
    },

    themeImg: {
        width: IMG_HEIGHT,
        height: IMG_HEIGHT,
        borderRadius: IMG_HEIGHT / 2,
        marginTop: 5,
        // backgroundColor: 'red',
    },

    tip: {
        marginTop: 5,
        fontSize: 12,
    },

    lotTime: {
        marginTop: 5,
        fontSize: 11,
        color: '#f3453c',
    }

});