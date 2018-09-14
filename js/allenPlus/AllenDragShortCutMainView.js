/**
 * Created by Allen on 2018/2/01.
 */

import React, {Component} from 'react';
import {Modal, Image, TouchableOpacity, View, Dimensions, AsyncStorage, StyleSheet, Animated} from 'react-native';
import LocalImg from "../res/img";
import GetSetStorge from "../skframework/component/GetSetStorge";
import AllenDragAndReplaceView from './AllenDragAndReplace';
let {height, width} = Dimensions.get('window');


export default class AllenShortCutMainView extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({

        headerTintColor: "white",
        headerStyle: {
            backgroundColor: COLORS.appColor,
            marginTop: Android ? (parseFloat(global.versionSDK) > 19 ? StatusBar.currentHeight : 0) : 0
        },
        title: navigation.state.params.title,
        headerTitleStyle: {alignSelf: 'center'},
        //加入右边空视图,否则标题不居中  ,alignSelf:'center'
        headerRight: (
            <View style={GlobalStyles.nav_blank_view}/>
        ),
        headerLeft: (
            <TouchableOpacity
                style={GlobalStyles.nav_headerLeft_touch}
                activeOpacity={1}
                onPress={() => {
                    navigation.goBack()
                    setTimeout(() => {
                        PushNotification.emit('allenReceiveSc', {});
                    }, 200)


                }}>
                <View style={GlobalStyles.nav_headerLeft_view}/>
            </TouchableOpacity>
        ),
    });

    constructor(props) {
        super(props);
        this.numbers = [0, 1, 2, 3, 4, 5]

        this.state = {
            animation: new Animated.Value(0),
            modalVisible: false,
            AllViews: [],
            defaultViews: [],
            showGaide: false,
            showDelete:false
        };

        //是否第一次进入这个界面
        let key0 = 'fristEntor';
        AsyncStorage.getItem(key0, (error, result) => {

            if (!error) {
                if (result !== '' && result !== null) {
                    this.setState({
                        showGaide: false
                    });
                }
                else {
                    AsyncStorage.setItem(key0, 'YES', (error) => {
                        // console.log('保存成功');
                    });
                    this.setState({

                        showGaide: true
                    });
                }
            }
            else {
                this.setState({

                    showGaide: false
                });
            }
        });


    }


    getColor() {
        let r = this.randomRGB()
        let g = this.randomRGB()
        let b = this.randomRGB()
        return 'rgb(' + r + ', ' + g + ', ' + b + ')'
    }

    randomRGB = () => 160 + Math.random() * 85

    startCustomAnimation = () => {
        console.log("Custom animation started!")

        Animated.timing(
            this.state.animation,
            {toValue: 100, duration: 500}
        ).start(() => {

            Animated.timing(
                this.state.animation,
                {toValue: 0, duration: 500}
            ).start()

        })
    }

    getDragStartAnimation = () => {
        // console.log("animation======", this.state.animation);
        return {
            transform: [
                {
                    scaleX: this.state.animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, -1.5],
                    })
                },
                {
                    scaleY: this.state.animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, 1.5],
                    })
                },
                {
                    rotate: this.state.animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0 deg', '450 deg']
                    })
                }
            ]
        }
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    componentWillMount() {

        let key = 'defalutFunc';
        AsyncStorage.getItem(key, (error, result) => {

            if (!error) {
                if (result !== '' && result !== null) {
                    // console.log("result1", result);
                    var arr = JSON.parse(result);
                    this.defalutFunc = [];
                    arr.map((letter, index) => {
                        this.defalutFunc.push({
                            key: `${index}`,
                            title: letter
                        });
                    });

                    this.createDefalutContent();
                    this.setState({});

                } else {
                    this.defalutFunc = [{'key': '0', 'title': '充值'}, {'key': '1', 'title': '提现'},
                        {'key': '2', 'title': '活动'},
                        {'key': '3', 'title': '签到'},
                        {'key': '4', 'title': '现金交易'},
                        {'key': '5', 'title': '购彩大厅'}];

                    this.createDefalutContent();
                    this.setState({});
                }
            } else {
                this.defalutFunc = [{'key': '0', 'title': '充值'}, {'key': '1', 'title': '提现'},
                    {'key': '2', 'title': '活动'},
                    {'key': '3', 'title': '签到'},
                    {'key': '4', 'title': '现金交易'},
                    {'key': '5', 'title': '购彩大厅'}];
                this.createDefalutContent();
                this.setState({});
            }
        });

        let key2 = 'defalutAllFunc';
        AsyncStorage.getItem(key2, (error, result) => {

            if (!error) {
                if (result !== '' && result !== null) {
                    // console.log("result2", result);
                    var arr = JSON.parse(result);
                    this.defalutAllFunc = arr;
                    this.createAllContent();
                    this.setState({});

                } else {
                    this.defalutAllFunc = ['代理中心', '安全中心', '投注记录', '客服', '提款记录', '中奖记录', '个人消息', '充值记录', '账户明细'];
                    this.createAllContent();
                    this.setState({});
                }
            } else {
                this.defalutAllFunc = ['代理中心', '安全中心', '投注记录', '客服', '提款记录', '中奖记录', '个人消息', '充值记录', '账户明细'];
                this.createAllContent();
                this.setState({});
            }
        });
    }


    render() {

        let imageName = null;
        if (SCREEN_WIDTH == 320) {
            imageName = require('./gaide5s.png');
        }
        else if (SCREEN_WIDTH == 375) {
            if (SCREEN_HEIGHT == 812) {
                imageName = require('./gaideX.png');
            }
            else {
                imageName = require('./gaide6.png');
            }
        }
        else {
            imageName = require('./gaide6sp.png');
        }


        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.showGaide}
                    onRequestClose={() => {
                        alert("Modal has been closed.")
                    }}
                >
                    <View style={{backgroundColor: 'rgba(0,0,0,0.7)', flex: 1}}>

                        <TouchableOpacity activeOpacity={1} onPressOut={() => this.setState({showGaide: false})}>
                            <View style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT}}>

                                <Image style={{width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'contain'}}
                                       source={imageName}/>

                            </View>
                        </TouchableOpacity>
                    </View>

                </Modal>

                <View
                    style={{
                        alignItems: 'center',
                        padding: 15,
                        paddingVertical: 20,
                        paddingBottom: 12,
                        flexDirection: 'row'
                    }}><CusBaseText
                    style={{
                        color: '#414141',
                        fontSize: Adaption.Font(20, 19),
                        flex: 1
                    }}>我添加的功能</CusBaseText><TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {

                        let finalDefalutFunc = this.defalutFunc.map((letter, index) => {
                            return letter.title;
                        });

                        GetSetStorge.setStorgeAsync('defalutFunc', JSON.stringify(finalDefalutFunc));
                        GetSetStorge.setStorgeAsync('defalutAllFunc', JSON.stringify(this.defalutAllFunc));
                        this.props.navigation.goBack()
                        setTimeout(() => {
                            PushNotification.emit('allenReceiveSc', {});
                        }, 200)
                    }}
                ><View style={{
                    height: 30,
                    width: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 16.5,
                    borderColor: '#ff7c34',
                    borderWidth: 1
                }}><CusBaseText
                    style={{
                        fontSize: Adaption.Font(18, 15),
                        color: '#ff7c34'
                    }}>保存</CusBaseText></View></TouchableOpacity></View>
                <View>
                    {/*{this.state.defaultViews}*/}
                    {(this.defalutFunc && this.defalutFunc.length) ? <AllenDragAndReplaceView
                        blockTransitionDuration={300}
                        activeBlockCenteringDuration={200}
                        dragActivationTreshold={0}
                        itemsPerRow={3}
                        onDragStart={()=>{}}
                        dragStartAnimation={this.getDragStartAnimation()}
                        onDragRelease={(itemOrder) => {

                            this.defalutFunc = [];

                            for (let i = 0; i < itemOrder.itemOrder.length; i++) {
                                let item = itemOrder.itemOrder[i];
                                this.defalutFunc.push({'key': (item.key - 10000), 'title': item.ref});
                            }

                        }}
                        ref={'SortableGrid'}
                    >
                        {

                            // ref={letter.title} key={parseInt(letter.key) + 10000}
                            this.defalutFunc.map((letter, index) => {
                                // console.log('letter:', letter, 'index:', index);
                                return (<View
                                    ref={letter.title}
                                    key={parseInt(letter.key) + 10000}
                                    style={[
                                        styles.block,
                                        {borderRadius: 5, backgroundColor: '#f3f3f3'}
                                    ]}
                                >
                                    <CusBaseText style={{
                                        fontSize: Adaption.Font(16, 13),
                                        color: '#5f5f5f'
                                    }}>{letter.title}</CusBaseText><TouchableOpacity
                                    onPress={() => {

                                        let newid = this.defalutFunc.findIndex(function (v, i) {

                                            if (v.title == letter.title) {
                                                return i;
                                            }

                                        })


                                        this.defalutFunc.splice((newid == -1 ? 0 : newid), 1);

                                        // console.log("点击删除后数据源", letter, this.defalutFunc)
                                        this.defalutAllFunc.push(letter.title);
                                        this.createAllContent();
                                        this.setState({});
                                    }}
                                    activeOpacity={0.7} style={{
                                    position: 'absolute',
                                    right: -(width / 3.0 - 10 * 3) / 2.2 / 2.0 / 3.0 + 3,
                                    top: -(width / 3.0 - 10 * 3) / 2.2 / 2.0 / 3.0
                                }}><Image source={LocalImg.ic_page_delete}
                                          style={{
                                              width: (width / 3.0 - 10 * 3) / 2.2 / 2.0,
                                              height: (width / 3.0 - 10 * 3) / 2.2 / 2.0
                                          }}/></TouchableOpacity>
                                </View>)
                            })
                        }
                    </AllenDragAndReplaceView> : null}

                </View>
                <View
                    style={{
                        alignItems: 'center',
                        padding: 15,
                        paddingVertical: 20,
                        paddingBottom: 28,
                        flexDirection: 'row'
                    }}><CusBaseText
                    style={{color: '#414141', fontSize: Adaption.Font(20, 19), flex: 1}}>全部功能</CusBaseText></View>

                <View>
                    {this.state.AllViews}
                </View>

            </View>


        );
    }

    allenNeedGoback = () => {
        // console.log("什么几把鬼");
        this.props.navigation.goBack();
    }


    createDefalutContent() {
        let column = Math.ceil(this.defalutFunc.length / 3.0);
        let row = 3;
        let columnArray = [];
        for (let j = 0; j < column; j++) {
            columnArray.push([]);
        }
        let currentArray = [];
        for (let i = 0; i < this.defalutFunc.length; i++) {
            if (i % 3 == 0) {
                currentArray = columnArray[i / 3];
            }
            currentArray.push(<View style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                width: (width - 30 * 3) / 3.0,
                height: (width - 30 * 3) / 3.0 / 2.2,
                marginHorizontal: 15,
                backgroundColor: '#f3f3f3',
            }} key={i + ""}>
                <CusBaseText style={{
                    fontSize: Adaption.Font(16, 13),
                    color: '#5f5f5f'
                }}>{this.defalutFunc[i]}</CusBaseText><TouchableOpacity
                onPress={() => {
                    this.defalutAllFunc.push(this.defalutFunc[i]);
                    this.removeArrayItem(this.defalutFunc, this.defalutFunc[i]);

                    this.createDefalutContent();
                    this.createAllContent();
                    this.setState({})
                }}
                activeOpacity={0.7} style={{
                position: 'absolute',
                right: -(width / 3.0 - 10 * 3) / 2.2 / 2.0 / 3.0,
                top: -(width / 3.0 - 10 * 3) / 2.2 / 2.0 / 3.0
            }}><Image source={LocalImg.ic_page_delete}
                      style={{width: (width / 3.0 - 10 * 3) / 2.2 / 2.0, height: (width / 3.0 - 10 * 3) / 2.2 / 2.0}}/></TouchableOpacity></View>);

        }
        this.state.defaultViews = [];
        // console.log(columnArray);
        for (let k = 0; k < column; k++) {

            this.state.defaultViews.push(<View key={k + ""}
                                               style={{flexDirection: 'row', height: 60}}>
                {columnArray[k]}
            </View>);


        }
    }


    createAllContent() {

        let column = Math.ceil(this.defalutAllFunc.length / 3.0);
        let columnArray = [];
        for (let j = 0; j < column; j++) {
            columnArray.push([]);
        }
        let currentArray = [];
        for (let i = 0; i < this.defalutAllFunc.length; i++) {
            if (i % 3 == 0) {
                currentArray = columnArray[i / 3];
            }
            currentArray.push(<View style={{
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                width: (width - 30 * 3) / 3.0,
                height: (width - 30 * 3) / 3.0 / 2.2,
                marginHorizontal: 15,
                backgroundColor: '#f3f3f3',
            }} key={i + ""}><TouchableOpacity activeOpacity={0.7}
                                              onPress={() => {

                                                  let max = 0;

                                                  for (let i = 0; i < this.defalutFunc.length; i++) {
                                                      if (max < this.defalutFunc[i].key) {
                                                          max = parseInt(this.defalutFunc[i].key);
                                                      }
                                                  }
                                                  max += 1;

                                                  this.defalutFunc.push({
                                                      key: `${max}`,
                                                      title: this.defalutAllFunc[i]
                                                  });
                                                  this.removeArrayItem(this.defalutAllFunc, this.defalutAllFunc[i], true);
                                                  this.createAllContent();
                                                  this.setState({});


                                              }

                                              }
            >
                <View style={{
                    flexDirection: 'row',
                    shadowColor: '#cdcdcd',
                    shadowOffset: {h: 50, w: 50},
                    shadowRadius: 5,
                    shadowOpacity: 0.9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    width: width / 3.0 - 8 * 3,
                    height: (width / 3.0 - 10 * 3) / 2.2,
                    backgroundColor: 'white',
                }}>
                    <Image source={LocalImg.ic_page_plus} style={{width: 12, height: 12, marginRight: 5}}/><CusBaseText
                    style={{
                        fontSize: Adaption.Font(16, 13),
                        color: '#5f5f5f'
                    }}>{this.defalutAllFunc[i]}</CusBaseText></View></TouchableOpacity></View>);

        }

        this.state.AllViews = [];
        for (let k = 0; k < column; k++) {

            this.state.AllViews.push(<View key={k + ""}
                                           style={{flexDirection: 'row', height: 60}}>
                {columnArray[k]}
            </View>);

        }

    }

    removeArrayItem(array, item, isAllen) {
        // var index = array.indexOf(item);
        var index = this.allenIndexOf(array, item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    allenIndexOf(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == item) return i;
        }
        return -1;
    };


}

const styles = StyleSheet.create({
    block: {
        flex: 1,
        margin: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});