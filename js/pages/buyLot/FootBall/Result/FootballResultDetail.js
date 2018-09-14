import React, {Component} from 'react';
import {
    StyleSheet,
    WebView,
    StatusBar,
    TouchableOpacity,
    View,
    Text,
    Image,
    ImageBackground,
} from 'react-native';

// import createInvoke from 'react-native-webview-invoke/native'

export default class FootballResultDetail extends Component {


    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText={"比赛详情"}
                leftClick={() => navigation.goBack()}
            />
        ),

    });

    componentWillMount() {
        this.item = this.props.navigation.state.params.item;
        this.type = this.props.navigation.state.params.type;
        this.legue = this.props.navigation.state.params.legue;
    }


    render() {
        let time = this.item.begin_time;
        var newDate = new Date();
        newDate.setTime(time);
        time = newDate.toJSON();
        let date = time.slice(0, 10);
        let timeTwo = time.slice(11, 16);

        return (
            <View style={{flex: 1, backgroundColor: '#f6f6f6'}}>

                <ImageBackground style={{width: SCREEN_WIDTH, height: 130, alignItems: 'center',}}
                                 source={require('../img/ic_football_result_detail.jpg')}>
                    <CusBaseText style={{
                        backgroundColor: 'transparent',
                        color: '#ffffff',
                        fontSize: Adaption.Font(18, 16),
                        marginTop: 25
                    }}>{this.legue}</CusBaseText>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>

                        <CusBaseText style={{
                            backgroundColor: 'transparent',
                            color: '#fefefe',
                            fontSize: Adaption.Font(18, 16),
                            flex: 0.43,
                            textAlign: 'right'
                        }}>{this.item.h}</CusBaseText>

                        <View style={{flex: 0.14, alignItems: 'center'}}>
                            <Image style={{width: 30, height: 30}}
                                   source={require('../img/ic_football_result_vs.png')}/>
                        </View>
                        <CusBaseText style={{
                            backgroundColor: 'transparent',
                            color: '#fefefe',
                            fontSize: Adaption.Font(18, 16),
                            flex: 0.43
                        }}>{this.item.v}</CusBaseText>
                    </View>

                    <CusBaseText style={{
                        backgroundColor: '#rgba(0,0,0,0.5)',
                        color: '#ffffff',
                        fontSize: 15,
                        marginTop: 10,
                        lineHeight: 30,
                    }}>    {date} {timeTwo}    </CusBaseText>

                </ImageBackground>

                <View style={{flexDirection: 'row', alignItems: 'center', height: 45}}>
                    <CusBaseText style={{
                        color: '#313131',
                        fontSize: 16,
                        flex: 0.3,
                        marginLeft: 15
                    }}>{(this.item.is_corner == 0 ? '进球数' : '角球数')}</CusBaseText>
                    <CusBaseText style={{
                        color: '#313131',
                        fontSize: Adaption.Font(16, 14),
                        flex: 0.4,
                        textAlign: 'center'
                    }}>{this.item.h}</CusBaseText>
                    <CusBaseText style={{
                        color: '#313131',
                        fontSize: Adaption.Font(16, 14),
                        flex: 0.35,
                        textAlign: 'center'
                    }}>{this.item.v}</CusBaseText>

                </View>


                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    height: 40,
                    borderBottomWidth: 1,
                    borderColor: '#rgba(210,210,210,1)'
                }}>
                    <CusBaseText style={{color: '#676767', fontSize: 16, flex: 0.4, marginLeft: 15}}>半场</CusBaseText>
                    <CusBaseText style={{
                        color: '#000000',
                        fontSize: 16,
                        flex: 0.3,
                        textAlign: 'center'
                    }}>{this.item.result_data.SC.H.HTG}</CusBaseText>
                    <CusBaseText style={{
                        color: '#000000',
                        fontSize: 16,
                        flex: 0.3,
                        textAlign: 'center'
                    }}>{this.item.result_data.SC.V.HTG}</CusBaseText>

                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', height: 40}}>
                    <CusBaseText style={{color: '#676767', fontSize: 16, flex: 0.4, marginLeft: 15}}>全场</CusBaseText>
                    <CusBaseText style={{
                        color: '#000000',
                        fontSize: 16,
                        flex: 0.3,
                        textAlign: 'center'
                    }}>{this.item.result_data.SC.H.TG}</CusBaseText>
                    <CusBaseText style={{
                        color: '#000000',
                        fontSize: 16,
                        flex: 0.3,
                        textAlign: 'center'
                    }}>{this.item.result_data.SC.V.TG}</CusBaseText>

                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
    },
})
