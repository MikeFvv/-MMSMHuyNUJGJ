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

import LotBlockCell from './LotBlockCell';
import NewLotBlockCell from "./NewLotBlockCell";
let leftW = SCREEN_WIDTH * 0.25;
let rightW = SCREEN_WIDTH * 0.75;

const cols = 3;
const cellW = rightW / cols;

const cellH = Platform.OS === 'ios' ? 135 : 145;

class NewLotBlockView extends Component {

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

        let  newDataArray = this.props.dataSource;
        let i = 0;
        if (newDataArray && newDataArray.length > 0 )
        {
            newDataArray.map((item) => {
                if (item.js_tag === '3d')
                {
                    this.fucaiList.push(item);
                }
                else if (item.js_tag === 'ssc')
                {
                    this.shishicaiList.push(item);
                }
                else if (item.js_tag === 'k3')
                {
                    this.kuaisanList.push(item);
                }

                else if(item.js_tag === 'pk10')
                {
                    this.pkshiList.push(item);
                }
                else if(item.js_tag === 'lhc')
                {
                    this.liuhecaiList.push(item);
                }
                else if(item.js_tag === 'pcdd')
                {
                    this.erbaList.push(item);
                }
                else if(item.js_tag === '11x5')
                {
                    this.shiyixuanwuList.push(item)
                }
                else
                {
                    this.otherList.push(item)
                }
                i++;
            })
        }


        this.state = {
            dataSource: this.shishicaiList,
            leftSelectIndex:0,
            allDate:[],
        };

    }

    componentWillReceiveProps(nextProps) {

        this.shishicaiList = [];
        this.kuaisanList = [];
        this.pkshiList = [];
        this.shiyixuanwuList = [];
        this.liuhecaiList = [];
        this.fucaiList = [];
        this.erbaList = [];
        this.otherList= [];

        let i = 0;
        let  newDataArray = nextProps.dataSource;

        if (newDataArray && newDataArray.length > 0 )
        {
            newDataArray.map((item) => {
                if (item.js_tag === '3d')
                {
                    this.fucaiList.push(item);
                }
                else if (item.js_tag === 'ssc')
                {
                    this.shishicaiList.push(item);
                }
                else if (item.js_tag === 'k3')
                {
                    this.kuaisanList.push(item);
                }

                else if(item.js_tag === 'pk10')
                {
                    this.pkshiList.push(item);
                }
                else if(item.js_tag === 'lhc')
                {
                    this.liuhecaiList.push(item);
                }
                else if(item.js_tag === 'pcdd')
                {
                    this.erbaList.push(item);
                }
                else if(item.js_tag === '11x5')
                {
                    this.shiyixuanwuList.push(item)
                }
                else if(item.js_tag === 'sport_key')
                {
                    // this.shiyixuanwuList.push(item)
                }
                else
                {
                    this.otherList.push(item)
                }
                i++;
            })


            let currentData =[];
            if(this.state.leftSelectIndex == 0)
            {
                currentData = this.shishicaiList;
            }
            else if(this.state.leftSelectIndex == 1)
            {
                currentData = this.kuaisanList;
            }
            else if(this.state.leftSelectIndex == 2)
            {
                currentData = this.pkshiList;
            }
            else if(this.state.leftSelectIndex == 3)
            {
                currentData = this.liuhecaiList;
            }
            else if(this.state.leftSelectIndex == 4)
            {
                currentData = this.shiyixuanwuList;
            }
            else if(this.state.leftSelectIndex == 5)
            {
                currentData = this.erbaList;
            }
            else if(this.state.leftSelectIndex == 6)
            {
                currentData = this.fucaiList;
            }
            else if(this.state.leftSelectIndex == 7)
            {
                currentData = this.otherList;
            }

            this.setState({
                dataSource: currentData,
            });
        }
    }

    // 左边View的item
    _renderItemView(item) {

        return (
            <TouchableOpacity activeOpacity={1}

                              onPress={() => {
                                  if (this.state.leftSelectIndex != item.index)
                                  {
                                      let currentData =[];
                                      if(item.index == 0)
                                      {
                                          currentData = this.shishicaiList;
                                      }
                                      else if(item.index == 1)
                                      {
                                          currentData = this.kuaisanList;
                                      }
                                      else if(item.index == 2)
                                      {
                                          currentData = this.pkshiList;
                                      }
                                      else if(item.index == 3)
                                      {
                                          currentData = this.liuhecaiList;
                                      }
                                      else if(item.index == 4)
                                      {
                                          currentData = this.shiyixuanwuList;
                                      }
                                      else if(item.index == 5)
                                      {
                                          currentData = this.erbaList;
                                      }
                                      else if(item.index == 6)
                                      {
                                          currentData = this.fucaiList;
                                      }
                                      else if(item.index == 7)
                                      {
                                          currentData = this.otherList;
                                      }
                                      this.setState({
                                          leftSelectIndex:item.index,
                                          dataSource:currentData,
                                      })
                                  }

                              }}
            >
                <ImageBackground
                    resizeMode={'contain'}
                    source={this.state.leftSelectIndex == item.index ? require('./buyLotDetail/touzhu2.0/img/new_ic_selectClick.png') : require('./buyLotDetail/touzhu2.0/img/ic_defaultClick.png')}
                    style={{ width: leftW - Adaption.Width(15), height: Adaption.Width(10 > 7 ? 50 : 55), marginLeft: 5, justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text allowFontScaling={false} style={{backgroundColor: 'rgba(0,0,0,0)', color: this.state.leftSelectIndex == item.index ? 'white' : '#707070', marginLeft: 0, fontSize: Adaption.Font(15) }}>
                        {item.item.title}
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        )
    }


    render() {


        if (this.state.dataSource && this.state.dataSource.length > 0) {

            return (
                <View style={styles.container}>

                    <View style={{width:leftW,backgroundColor:'rgb(242,243,244)'}} >
                        <FlatList style={{flex: SCREEN_WIDTH < 350 ? 0.78 : 0.82}}
                                  automaticallyAdjustContentInsets={false}
                                  scrollEnabled={false}
                                  alwaysBounceHorizontal={false}
                                  data={[{title: '时时彩'}, {title: '快三'},{title: 'PK拾'},{title: '六合彩'},{title: '11选5'},{title: 'PC蛋蛋'},{title: '3D'},{title: '其它'}]}
                                  renderItem={(item) => this._renderItemView(item)}
                                  horizontal={false}
                                  numColumns={1}
                        >
                        </FlatList>
                    </View>

                    <FlatList
                        style={{backgroundColor: 'white',width:rightW}}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        numColumns={3}
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
            global.isInBuyLotVC = true;
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
        width: cellW,
        height: SCREEN_WIDTH == 320 ? cellW + 25: cellW + 10,
        alignItems: 'center',
        // borderRightWidth: 0.5,
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


export default NewLotBlockView;
