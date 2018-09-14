import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
  Animated,
  Easing,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native';

const { width, height } = Dimensions.get('window');
const [aWidth] = [width];
const [left, top] = [0, 0];
const [middleLeft] = [(width - aWidth) / 2];

let iphoneX = global.iOS ? (SCREEN_HEIGHT == 812 ? true : false) : 0; //是否是iphoneX

// let iphoneX = SCREEN_HEIGHT == 812 ? true : false;
let iphone5S = global.iOS ? (SCREEN_WIDTH == 320 ? true : false) : 0;



export default class PopStateMent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.Value(0),
      opacity: new Animated.Value(0),
      title: "",
      choose0: "",
      choose1: "",
      hide: true,
      tipTextColor: '	#551A8B',
      aHeight: 210,
    };
    this.entityList = [];//数据源
    this.entityListFandian = ["11选5", "PK拾", "排列三", "六合彩", "幸运28", "时时彩", "快三"];//数据源
    this.callback = function () {
    };//回调方法
  }

  render() {
    if (this.state.hide) {
      return (<View />)
    } else {
      return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.mask}
            // style={styles.button}
            underlayColor={'#f0f0f0'}
            onPress={this.cancel.bind(this)}
          >
          </TouchableOpacity>
          <Animated.View style={[{
            width: aWidth,
            height: this.state.aHeight,
            left: middleLeft,
            ...Platform.select({
              ios: {
                bottom: - 20,
              },
            }),
            alignItems: "center",
            justifyContent: "space-between",
          }, {
            transform: [{
              translateY: this.state.offset.interpolate({
                inputRange: [0, 1],
                outputRange: [height, (height - this.state.aHeight - 86)]
              }),
            }]
          }]}>
            <View style={{ width: aWidth, height: height, backgroundColor: 'white' }}>
              <View style={{ height: 40, flexDirection: 'row', backgroundColor: 'white' }}>
                <View style={{ flex: 0.7 }}>
                  <Text allowFontScaling={false} style={{ marginTop: 5, fontSize: 20, fontWeight: '300', color: '#808080' }}>{this.state.title}</Text>
                </View>
                <TouchableHighlight
                  style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}
                  underlayColor={'#f0f0f0'}
                  onPress={this.cancel.bind(this)}
                >
                  <Text allowFontScaling={false} style={{ textAlign: 'right', fontSize: 20, fontWeight: '300', color: '#0084ff' }}>确定</Text>
                </TouchableHighlight>
              </View>

              <View style={{ flexDirection: 'row'}}>
                <View style={{ flex: 0.7}}>
                  <View>
                    {
                      this.entityListFandian.map((item, i) => this.renderItemFandian(item, i))
                    }
                  </View>
                </View>
                <View style={{ flex: 0.3 }}>
                  <View>
                    {
                      this.entityList.map((item, i) => this.renderItem(item, i))
                    }
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      );
    }
  }

  renderItemFandian(item, i) {
    return (
      <View key = {i}  style={styles.tipContentView}>
        <View style={{ height: 0.5, backgroundColor: '#a9a9a9', width: aWidth }} />
        <TouchableOpacity
          key={i}
          onPress={this.choose.bind(this, i, item)}
        >
          <View style={styles.item}>
            <Text allowFontScaling={false} style={{
              color: this.state.tipTextColor,
              fontSize: 17,
              marginLeft: 20,
              marginTop: 4,
            }}>{item}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }


  renderItem(item, i) {
    return (
      <View key = {i} style={styles.tipContentView}>
        <View style={{ height: 0.5, backgroundColor: '#a9a9a9', width: aWidth }} />
        <TouchableOpacity
          key={i}
          onPress={this.choose.bind(this, i, item)}
        >
          <View style={styles.item}>
            <Text allowFontScaling={false} style={{
              color: this.state.tipTextColor,
              fontSize: 17,
              marginLeft:20,
              marginTop: 4,
            }}>{item}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
    this.chooseTimer && clearTimeout(this.chooseTimer);
  }

  //显示动画
  in() {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          easing: Easing.linear,//一个用于定义曲线的渐变函数
          duration: 200,//动画持续的时间（单位是毫秒），默认为200。
          toValue: 0.8,//动画的最终值
        }
      ),
      Animated.timing(
        this.state.offset,
        {
          easing: Easing.linear,
          duration: 200,
          toValue: 1,
        }
      )
    ]).start();
  }

  //隐藏动画
  out() {
    Animated.parallel([
      Animated.timing(
        this.state.opacity,
        {
          easing: Easing.linear,
          duration: 200,
          toValue: 0,
        }
      ),
      Animated.timing(
        this.state.offset,
        {
          easing: Easing.linear,
          duration: 200,
          toValue: 0,
        }
      )
    ]).start((finished) => this.setState({ hide: true }));
  }

  //取消
  cancel(event) {
    if (!this.state.hide) {
      this.out();
    }
  }

  //选择
  choose(i, value) {
    if (!this.state.hide) {
      this.out();
      this.chooseTimer = setTimeout(() => {
        this.callback(i, value);
      }, 200);
    }
  }

  /**
  * 弹出控件，最多支持3个选项(包括取消)
  * titile: 标题
  * entityList：选择项数据  数组
  * tipTextColor: 字体颜色
  * callback：回调方法
  */
  showFandian(title: string, entityList: Array, tipTextColor: string, callback: Object) {

    let rowG = iphoneX ? 275 : 246;

    this.entityList = entityList;
    this.callback = callback;
    if (this.state.hide) {
      if (entityList && entityList.length > 0) {
        let len = entityList.length;
        if (len === 1) {
          this.setState({ title: title, choose0: entityList[0], hide: false, tipTextColor: tipTextColor, aHeight: 90 }, this.in);
        } else if (len === 2) {
          this.setState({ title: title, choose0: entityList[0], choose1: entityList[1], hide: false, tipTextColor: tipTextColor, aHeight: 120 }, this.in);
        } else if (len === 3) {
          this.setState({ title: title, choose0: entityList[0], choose1: entityList[1], hide: false, tipTextColor: tipTextColor, aHeight: 150 }, this.in);
        } else if (len === 4) {
          this.setState({ title: title, choose0: entityList[0], choose1: entityList[1], hide: false, tipTextColor: tipTextColor, aHeight: 180 }, this.in);
        } else if (len === 5) {
          this.setState({ title: title, choose0: entityList[0], choose1: entityList[1], hide: false, tipTextColor: tipTextColor, aHeight: 210 }, this.in);
        } else if (len === 6) {
          this.setState({ title: title, choose0: entityList[0], choose1: entityList[1], hide: false, tipTextColor: tipTextColor, aHeight: 240 }, this.in);
        } else if (len === 7) {//marginBottom: iphoneX ? 34 : 0
          this.setState({ title: title, choose0: entityList[0], choose1: entityList[1], hide: false, tipTextColor: tipTextColor, aHeight: rowG }, this.in);
        }
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: width,
    height: height,
    left: left,
    top: top,
  },
  mask: {
    justifyContent: "center",
    backgroundColor: "#000000",
    opacity: 0.3,
    position: "absolute",
    width: width,
    height: height,
    left: left,
    top: top,
  },
  // 提示标题
  tipTitleView: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  // 提示文字
  tipTitleText: {
    color: "#808080",
    fontSize: 18,
  },
  // 分割线
  tipContentView: {
    width: aWidth,
    height: 30,
    backgroundColor: '#fff',
    // borderBottomLeftRadius: 5,
    // borderBottomRightRadius: 5,
  },
  item: {
    width: aWidth,
    height: 30,
    flexDirection: 'row',
    // borderRadius: 5,
  },
  button: {
    height: 30,
    backgroundColor: '#fff',
    alignSelf: 'stretch',
    justifyContent: 'center',
    // borderRadius: 5,
    marginLeft: 140,
    marginTop: 5,
  },
  // 取消按钮
  buttonText: {
    fontSize: 17,
    color: "#0084ff",
    textAlign: "center",
  },
  content: {
    backgroundColor: '#fff',
    // borderRadius: 5,
  }
});
