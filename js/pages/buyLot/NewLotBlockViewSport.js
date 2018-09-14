import React, {Component} from 'react';

import {
    StyleSheet,
    FlatList,
    View,
    Platform,
    TouchableOpacity,
    Alert,
    Image,
    ImageBackground,
    Text,
} from 'react-native';

import NewLotBlockCell from "./NewLotBlockCell";



const cellH = Platform.OS === 'ios' ? 135 : 145;

class NewLotBlockViewSport extends Component {

    constructor(props) {
        super(props);

        this.shishicaiList = [];
        this.kuaisanList = [];
        this.pkshiList = [];
        this.shiyixuanwuList = [];
        this.liuhecaiList = [];
        this.fucaiList = [];
        this.erbaList = [];
        this.otherList= [];


        this.state = {
            dataSource: this.props.dataSource,
            leftSelectIndex:0,
            allDate:[],
        };

    }

    componentWillReceiveProps(nextProps) {

            this.setState({
                dataSource: nextProps.dataSource,
            });

    }


    render() {


        if (this.state.dataSource && this.state.dataSource.length > 0) {

            return (
                <View style={styles.container}>


                    <FlatList
                        style={{backgroundColor: 'white'}}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        numColumns={4}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections={true}
                    />
                </View>
            );

        } else {
            return (
                <View style={styles.container}/>
            );
        }

    }

    _keyExtractor = (item, index) => {
        return String(index);
    }


    _renderItem = (info) => {
        return (
            <View style={styles.itemStyle}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={
                        () => this._jumpBuyLotDetail(info)

                    }
                >
                    <NewLotBlockCell
                        item={info.item}
                        countDownFinished={() => this.props.countDownFinished ? this.props.countDownFinished() : null}
                        countDown={(nextIndex, jiezhitime, leftTime, prevTime) => this.props.countDown ? this.props.countDown(info.index, nextIndex, jiezhitime, leftTime, prevTime) : null}
                        index={info.index}
                    />
                </TouchableOpacity>
            </View>
        );
    }


    // 点击cell跳转投注页
    _jumpBuyLotDetail(info) {
        if (info.item.enable == 2)
        {

            Alert.alert(
                '提示',
                '该彩种正在维护',
                [
                    {
                        text: '确定', onPress: () => {
                        }
                    },
                ]
            )
            return;
        }
        //足彩入口
        else if (info.item.js_tag === 'sport_key')
        {
            //  //进入体彩的入口
            this.props.navigator.navigate('FootballGame',  {
                gameId: info.item.game_id,
                backAction: this.props.backAction
            })
        }
        else
        {
            this.props.navigator.navigate('BuyLotDetail', {
                gameId: info.item.game_id,
                indexList: info.index,
            })
        }
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection:'row',
    },

    itemStyle: {
        backgroundColor: 'white',
        width: SCREEN_WIDTH / 4,
        height: SCREEN_WIDTH == 320 ? SCREEN_WIDTH / 4 + 25: SCREEN_WIDTH / 4 + 10,
        alignItems: 'center',

        borderBottomWidth: 0.5,
        borderColor: '#cccccc',
    },


    // zucaiitemStyle:{
    //     backgroundColor: 'white',
    //     width: cellW,
    //     height: SCREEN_WIDTH == 320 ? cellW + 5: cellW - 10,
    //     alignItems: 'center',
    //     borderRightWidth: 0.5,
    //     borderBottomWidth: 0.5,
    //     borderColor: '#cccccc',
    // },


});


export default NewLotBlockViewSport;
