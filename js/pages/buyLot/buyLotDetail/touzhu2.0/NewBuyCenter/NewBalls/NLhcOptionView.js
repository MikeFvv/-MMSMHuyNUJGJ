/**
 Created by Money on 2018/05/20
 六合彩 自选下注
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
} from 'react-native';

import GetBallStatus from '../../newBuyTool/GetBallStatus';  // 赔率小数点处理

export default class NLhcOptionView extends Component {
  constructor(props) {
    super(props);

    this.selectIdxs = [];  // 存放机选的号码
    this.balls = props.balls;
    this.iskeyboardHide = true;
  }

  componentWillReceiveProps(nextProps) {
    // 清空
    if (nextProps.clearAllBalls) {
      this.balls = nextProps.balls; // 重置
      this.selectIdxs = [];
      this.props.ballClick ? this.props.ballClick({ [this.props.title]: [] }) : null;
    }

    // 机选
    if (nextProps.isBallsChange) {
      // 摇一摇 把之前选择的号码清空。 现在如果键盘没收起直接摇一摇 没能把之前的号码清空。
      this.balls = nextProps.balls; // 重置
      this._arcBallsMethod(nextProps);
    }
  }

  _arcBallsMethod(nextProps) {

    let arcNumArr = this._returnArcBallArr(1);  // 随机要选择的数。
    this.selectIdxs = arcNumArr; // 直接把之前的覆盖

    for (let a = 0; a < arcNumArr.length; a++) {
      let idx = arcNumArr[a];
      this.balls[idx]['price'] = '2';  // 机选的默认给2元
    }
    this._handleSelectBalls(this.balls);
  }

  // 传入个数，返回随机的数组。不重复！
  _returnArcBallArr(count, lenght) {
    let arcArr = [];
    for (let i = 0; i < 100; i++) {
      let arcInt = Math.floor(Math.random() * (lenght ? lenght : this.props.balls.length));
      // 如果存在，就不加入数组。
      if (!arcArr.includes(arcInt)) {
        arcArr.push(arcInt);
        if (arcArr.length >= count) {
          break; // 个数够了，就退出循环。
        }
      }
    }
    return arcArr;
  }


  _handleSelectBalls(balls) {
    let sltBallData = {};

    let ballArr = [], ballNumArr = [], peilvArr = [], priceArr = [];
    let preg = /^([\d]|[\d][\d])$/; // [\d] === [0-9] 查找数字

    for (let x = 0; x < balls.length; x++) {

      if (balls[x]['price'] && parseInt(balls[x]['price']) > 0) {
        // 有输入价格的。
        ballArr.push(balls[x].ball);
        peilvArr.push(balls[x].peilv ? balls[x].peilv : '0');
        priceArr.push(balls[x].price);

        if (!preg.test(balls[x].ball)) {
          if (this.props.tpl == '6' || this.props.tpl == '8') {
            // 特肖、平特一肖 || 五行 下标从1开始
            ballNumArr.push(`${x + 1}`);
          } else {
            ballNumArr.push(`${x}`);
          }
        }
      } 
    }

    sltBallData[this.props.title] = ballArr;
    if (ballNumArr.length > 0) {
      sltBallData[`${this.props.title}^^01`] = ballNumArr;
    }
    sltBallData['赔率'] = peilvArr;
    sltBallData['LhcPrice'] = priceArr;

    this.props.ballClick ? this.props.ballClick(sltBallData) : null;
  }

  _renderItemView(item) {

    let numColumn = this.props.numColumn;
    let peilvHeight = (this.props.playid == 2 || this.props.playid == 6) ? 18 : 0;  // 不和ball放在一行的赔率高   // 特码两面、特半半波
    let ballWidth = Adaption.Width(numColumn == 2 ? 120 : (numColumn == 3 ? 85 : 63));
    let ballHeight = Adaption.Width(20 + 30 + peilvHeight); // ball高+输入框高
    let row = Math.ceil(this.props.balls.length / numColumn);  // 行
    let spaceW = (this.props.style.width - (ballWidth * numColumn)) / (numColumn + 1);
    let spaceH = (this.props.style.height - ballHeight * row) / (row + 1);

    let isSelect = this.selectIdxs.includes(item.index);  // 是不是选机到的号码。

    return (
      <View style={{ width: ballWidth, height: ballHeight, marginLeft: spaceW, marginTop: spaceH, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ height: Adaption.Width(20), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(peilvHeight > 0 || numColumn < 4 ? numColumn == 3 ? 17 : 18 : 16), color: '#434343' }}>{item.item.ball}</Text>
          {peilvHeight <= 0 ?
            <Text allowFontScaling={false} style={{ marginLeft: 3, fontSize: Adaption.Font(numColumn < 4 ? 16 : 14), color: '#e33939' }}>{GetBallStatus.peilvHandle(item.item.peilv)}</Text>
            : null
          }
        </View>

        <TextInput allowFontScaling={false} keyboardType={'numeric'} maxLength={6}
          style={{ textAlign: 'center', width: ballWidth, height: Adaption.Width(30), borderRadius: 3, borderColor: '#ccc', borderWidth: 1, fontSize: Adaption.Font(18) }}
          defaultValue={isSelect ? item.item.price : ''}  // 值置为空。
          //value={this.props.clearAllBalls ? '' : null}
          onFocus={()=>{ // 获取到焦点
            this.iskeyboardHide = false;
          }}
          onBlur={(e) => { // 失去焦点
            this.iskeyboardHide = true;
            this.balls[item.index]['price'] = e.nativeEvent.text ? e.nativeEvent.text : '0';
            this.selectIdxs.push(item.index);  // 下标存起

            setTimeout(() => {  // 延迟一下，看它有没有 真正收起键盘，如果继续在另一个输入框输入 就不处理数据回调了。
              if (this.iskeyboardHide == true) {
                this._handleSelectBalls(this.balls);
              }
            }, 20);
          }}
        >
        </TextInput>

        {peilvHeight > 0 ?
          <View style={{ height: Adaption.Width(peilvHeight) }}>
            <Text allowFontScaling={false} style={{ textAlign: 'center', fontSize: Adaption.Font(17), color: '#e33939' }}>{GetBallStatus.peilvHandle(item.item.peilv)}</Text>
          </View>
          : null
        }
      </View>
    )
  }

  render() {

    return (
      <View style={this.props.style}>
        <FlatList style={{ width: this.props.style.width }}
          automaticallyAdjustContentInsets={false}
          alwaysBounceHorizontal={false}
          data={this.balls}
          renderItem={(item) => this._renderItemView(item)}
          keyExtractor={(item, index) => { return String(index) }}
          horizontal={false}
          numColumns={this.props.numColumn}
          scrollEnabled={false}
        >
        </FlatList>
      </View>
    )
  }

}
