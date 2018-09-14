/**
 * @author kim
 * des 自定义弹出窗
 */
import React from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
    ImageBackground, Image
} from 'react-native'

let mwidth = 70;
let mheight = 200;
const bgColor = '#F3F3F3';
let dataArray;
let index;

export default class MenuPopWindow extends React.Component {

    static props = {
        //回调函数
        clickButtonCallback: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            isVisible: this.props.show,
        }
        //记录点击状态容器
        this.states = [];
        mwidth = this.props.width || 70;
        mheight = this.props.height;
        //字典格式
        dataArray = this.props.dataArray;
        //当前的位置
        index = this.props.index;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({isVisible: nextProps.show});

    }

    componentWillMount() {
        this.initData();
    }

    componentDidMount() {

    }

    closeModal(key) {
        this.setState({
            isVisible: false
        });
        this.props.closeModal(false);
        // console.log("position", key);
        //重置容器
        this.restartClearData(key);
    }

    /**
     * 重置容器
     * @param key
     */
    restartClearData(key) {

        if (key === undefined) {
            return;
        }
        //进行清空数据
        this.states = [];
        // console.log("清空数据", this.states.length)
        dataArray.map((item, i) => {
            if (item === key) {
                this.states.push({key: key, vlaue: true});
                if (this.props.clickButtonCallback != null) {
                    this.props.clickButtonCallback(i);
                }

            } else {
                this.states.push({key: item, vlaue: false});
            }
        });
        this.initView();
    }

    render() {

        let topHeight = 0;

        if (global.Android){
            topHeight = 58;
        }
        else {

            if (SCREEN_HEIGHT == 812){
                topHeight = 88;
            }
            else {
                topHeight = 64;
            }

        }

        return (
            <View style={styles.container}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}>
                    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.closeModal()}>
                        <View style={[styles.modal, {height: mheight, top: topHeight}]}>
                            {this.initView()}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }

    /**
     * 初始化数据
     */
    initData = () => {
        // console.log("初始化数据");
        dataArray.map((item, i) => {
            //判断数据是否为空
            if (this.states.length < dataArray.length) {
                // console.log('初始化数据', item + "--" + i);
                if (i === index) {
                    this.states.push({key: item, vlaue: true});
                } else {
                    this.states.push({key: item, vlaue: false});
                }
            }
        })
    }


    /**
     * 初始化界面
     * @returns {Array}
     */
    initView = () => {
        var views = [];
        for (let i = 0, l = dataArray.length; i < l; i++) {
            // console.log("value", this.states[i]);
            // console.log("i", i);
            if (this.states.length === 0) {
                return;
            }
            if (!this.states[i].vlaue) {
                views.push(
                    <TouchableOpacity key={i} activeOpacity={1} onPress={() => this.closeModal(this.states[i].key)}
                                      style={styles.itemView}>
                        <View style={
                            styles.bordStyle_item}>
                            <Text allowFontScaling={false} style={styles.textStyle}>{dataArray[i].value}</Text>
                        </View>
                    </TouchableOpacity>
                )
            } else {
                views.push(
                    <ImageBackground key={i} style={{
                        width: SCREEN_WIDTH / 4 + 20,
                        height: 35, justifyContent: 'center', marginTop: 10,
                        alignItems: 'center', alignSelf: 'center',
                    }}resizeMode='contain' source={require('../img/ic_select_box.png')}
                           onPress={() => this.closeModal(this.states[i].key)}>
                        <Text allowFontScaling={false} style={styles.textStyle}>{dataArray[i].value}</Text>
                    </ImageBackground>
                )
            }
        }
        // console.log("view", views);
        return views;
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modal: {
        flexDirection: 'row',
        backgroundColor: bgColor,
        // opacity:0.8,
        width: SCREEN_WIDTH,
        position: 'absolute',
        left: 0,
        //space-around
        //'space-between'
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    itemView: {
        marginTop: 10,
        alignSelf: "center",
        width: SCREEN_WIDTH / 4 + 20,
        height: 35
    },
    itemStyle: {
        width: SCREEN_WIDTH,
        height: 25
    },
    textStyle: {
        color: 'black',
        fontSize: 12,
        marginLeft: 2,
    },

    bordStyle_item: {
        width: SCREEN_WIDTH / 4 + 20,
        height: 35,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#BEBEBE',
        justifyContent: 'center',
        alignItems: 'center',

    },
    bordStyle_item_sele: {
        width: 100,
        height: 25,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',

    }

});
