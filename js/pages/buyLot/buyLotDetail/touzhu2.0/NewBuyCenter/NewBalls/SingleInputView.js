/**
 Created by Money on 2018/03/27

  单式输入的视图

  请不要格式化代码，谢谢！。
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
} from 'react-native';


export default class SingleInputView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputBalls: '',
        }
    }

    componentWillReceiveProps(nextProps) {
        // 清空
        if (nextProps.clearAllBalls && this.state.inputBalls.length > 0) {
          this.setState({
            inputBalls: '',
          })
          this.props.ballClick ? this.props.ballClick({ [this.props.playname]: [] }) : null;
        }
    }

    _inputTextHandle(text) {
        // 先赋值
        this.setState({
            inputBalls: text,
        });

        // substr(起始下标，长度)
        let lastStr = text.substr(text.length - 1, 1);

        let preg = /^[\d\ \,]{0,}$/;    // 匹配 0-9 空格 逗号
        let is = preg.test(lastStr);

        // 如果输入错的了 延迟再改变
        if (!is) {
            text = text.substr(0, text.length - 1);
            setTimeout(() => {
                this.setState({
                    inputBalls: text,
                })
            }, 50);
        }
    }

    _inputTextSubmit(){

        let ballsArr = this.state.inputBalls.split(/[\,]/); // 按逗号拆分

        // 编程干掉多余空字符
        for (let z = 0; z < ballsArr.length; z++) {
            let ba = ballsArr[z];
            if (ba.length == 0 || ba == ' ') {
                ballsArr.splice(z, 1);
                z -= 1;

            } else {
                let bls = ba.split(' ');
                for (let i = 0; i < bls.length; i++) {
                    let bs = bls[i];
                    if (bs.length == 0 || bs == '') {
                        bls.splice(i, 1);
                        i -= 1;
                    }
                }
                ballsArr[z] = bls.join('|');
            }
        }

        let ballsData = { [this.props.playname]: ballsArr };
        this.props.ballClick ? this.props.ballClick(ballsData) : null;
    }

    render() {

        return (
            <View style={[this.props.style, {margin: Adaption.Width(10)}]}>
                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16), color: '#707070' }}>{this.props.playTitle}</Text>
                <TextInput allowFontScaling={false}
                    style={{
                        height: Adaption.Height(100), fontSize: Adaption.Font(21, 19),
                        marginTop: 10, borderColor: '#a0a0a0', borderWidth: 1, borderRadius: 3,
                    }}
                    keyboardType={'numbers-and-punctuation'}
                    multiline={true} // 多行
                    placeholder={`例如：${this.props.defaultBalls}`}
                    defaultValue={this.state.inputBalls}
                    returnKeyType = 'done'
                    blurOnSubmit = {true}  //true 表示点击Done放弃键盘不会换行
                    onChangeText={(text) => {
                        this._inputTextHandle(text);
                    }}
                    onBlur={() => { // 输入结束
                        this._inputTextSubmit();
                    }}>
                </TextInput>

                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(18), marginTop: 20, color: '#ff7c34' }}>{`注意`}</Text>
                <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(17), marginTop: 5, color: '#535353' }}>
                    {`   每一个号码之间请用一个空格隔开；每一注号码之间请用一个逗号[,]隔开`}
                </Text>
            </View>
        )
    }

}
