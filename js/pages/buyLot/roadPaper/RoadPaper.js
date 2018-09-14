
/**
 Created by Money on 2018/05/10
 路纸图
 */

import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import RoadTimeView from './RoadTimeView';
import RoadMapDetail from './RoadMapDetail';

export default class RoadPaper extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: (
      <CustomNavBar
        centerText={navigation.state.params.game_name + '路纸图'}
        leftClick={() => {
          global.isInBuyLotVC = true;  //返回时改为true,可以摇了
          navigation.goBack()
        }}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      dx_ds_hz_wdx: {},
      ba123_hz_hr_wdx: {},
      selectIndex: 0,
      sectionData: [{'sectionID': 0, 'title': '双面长龙排行', 'isHide': true, 'data': ['000']}, {'sectionID': 1, 'title': '双面路纸图', 'isHide': false, 'data': ['111']}],
    }

    this.tag = props.navigation.state.params.tag;
    this.js_tag =  props.navigation.state.params.js_tag;
    this.data = [];
    this.ba_ov = 0;   // 单个号码的大小 ， 大于ba_ov 则为大。
    this.bahz_ov = 0; // 和值的大小
  }

  componentDidMount() {

    this._getKjCpLogData();
  }


  //获取历史开奖数据接口
  _getKjCpLogData() {

    let params = new FormData();
    params.append('ac', 'getKjCpLog');
    params.append('tag', this.tag);
    params.append('pcount', 120);

    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then((response) => {

        if (response.msg == 0 && response.data.length > 0) {

          if (response.data[0]['balls'] == '' && this.data.length > 0) {
            // 没结果是吧，那就再来过咯
            setTimeout(() => {
              this._getKjCpLogData();
            }, (this.tag.includes('ff') ? 3000 : this.tag.includes('sf') ? 5000 : 20000));
            return;

          } else {
            this.data = response.data;
          }

          this._allData(this.data);

        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch((err) => {

        this.setState({ isLoading: false });
      })
  }

  _allData(data) {
    console.log('当前总数据 === ', data);
    let dx_ds_hz_wdx = this._handleChangLongPaiHang(data);
    let ba123_hz_hr_wdx = this._handleData(data);
    this.setState({
      isLoading: false,
      dx_ds_hz_wdx: dx_ds_hz_wdx,
      ba123_hz_hr_wdx: ba123_hz_hr_wdx,
    })
  }

  _handleData(data) {

    let ba123_hz_hr_wdx = {};
    for (let i = 0; i < data.length; i++) {
      // 先判断balls字段
      let ballsArr = data[i].balls && data[i].balls.length > 1  ? data[i].balls.split('+') : [];
      let sumHZ = this._sumResults(ballsArr);  // 总和值

      let len = this.js_tag == 'pk10' && ballsArr.length > 5 ? 5 : ballsArr.length;
      for (let j = (this.js_tag == 'pcdd' ? 3 : 0); j < len; j++) {
        if (ba123_hz_hr_wdx[`ba_${j+1}`] == null) {
          ba123_hz_hr_wdx[`ba_${j+1}`] = [parseInt(ballsArr[j])];
        } else {
          ba123_hz_hr_wdx[`ba_${j+1}`].push(parseInt(ballsArr[j]));
        }

        if (this.js_tag == 'pk10') {
          let lh = `${ballsArr[j] > ballsArr[10-j-1] ? '龙' : '虎'}`;
          if (ba123_hz_hr_wdx[`ba_${j+1}lh`] == null) {
            ba123_hz_hr_wdx[`ba_${j+1}lh`] = [lh];
          } else {
            ba123_hz_hr_wdx[`ba_${j+1}lh`].push(lh);
          }
        }

        if (j == ballsArr.length - 1 && this.js_tag != 'pcdd' && this.js_tag != 'pk10') {
          // 总和值
          if (ba123_hz_hr_wdx['bahz'] == null) {
            ba123_hz_hr_wdx['bahz'] = [sumHZ];
          } else {
            ba123_hz_hr_wdx['bahz'].push(sumHZ);
          }

          if (this.js_tag == '11x5') {
            // 和值尾大小， 后二和值
            if (ba123_hz_hr_wdx['hzwdx'] == null) {
              ba123_hz_hr_wdx['hzwdx'] = [parseInt(`${sumHZ}`.substr(-1))];
              ba123_hz_hr_wdx['hrhz'] = [parseInt(ballsArr[3]) + parseInt(ballsArr[4])];
            } else {
              ba123_hz_hr_wdx['hzwdx'].push(parseInt(`${sumHZ}`.substr(-1)));
              ba123_hz_hr_wdx['hrhz'].push(parseInt(ballsArr[3]) + parseInt(ballsArr[4]));
            }
          }
        }

      }
    }
    
    console.log(ba123_hz_hr_wdx);
    return ba123_hz_hr_wdx;
  }

  // 处理长龙排行的数据。
  _handleChangLongPaiHang(data) {

    let ba_dx_ds_hz_wdx = {};
    let titleArr = ['第一球', '第二球', '第三球', '第四球', '第五球'];

    if (this.js_tag == 'k3') {
      this.ba_ov = 4; // 小：0-3， 大：4-6 // 总和 小：3-10，大：11-18
      this.bahz_ov = 11;
      titleArr = ['号码一', '号码二', '号码三'];

    } else if (this.js_tag == '3d') {
      this.ba_ov = 5; // 小：0-4， 大：5-9  // 总和 小：0-13，大：14-27
      this.bahz_ov = 14;

    } else if (this.js_tag == 'pcdd') {
      this.ba_ov = 14; // 特码 小：0-13，大：14-27
      this.bahz_ov = 14;
      titleArr = ['', '', '', '特码'];

    } else if (this.js_tag == 'ssc') {
      this.ba_ov = 5; // 小：0-4， 大：5-9  // 总和 小：0-22，大：23-45
      this.bahz_ov = 23;

    } else if (this.js_tag == '11x5') {
      this.ba_ov = 6;  // 小：1-5， 大：6-11 // 总和 小：15-29，大：30-45
      this.bahz_ov = 30;

    } else if (this.js_tag == 'pk10') {
      this.ba_ov = 6; // 小：1-5， 大：6-10 
      this.bahz_ov = 6;
      titleArr = ['冠军', '亚军', '季军', '第四名', '第五名'];
    }

    let len = data.length > (this.js_tag == 'k3' ? 40 : 20) ? (this.js_tag == 'k3' ? 40 : 20) : data.length;
    for (let i = 0; i < len; i++) {  // 这里循环20次够了，快三变态一点就40次了。
      // 先判断balls字段
      let ballsArr = data[i].balls && data[i].balls.length > 1  ? data[i].balls.split('+') : [];
      let sumHZ = this._sumResults(ballsArr);  // 总和值

      let len = this.js_tag == 'pk10' && ballsArr.length > 5 ? 5 : ballsArr.length;
      for (let j = (this.js_tag == 'pcdd' ? 3 : 0); j < len; j++) {
        let ball = ballsArr[j];

        // 记录每一位号码的大小单双状态。
        let dx = `${ball < this.ba_ov ? '小' : '大'}`;   // 大小
        let ds = `${ball % 2 == 0 ? '双' : '单'}`;  // 单双
        let lh = ''; // 龙虎
        if (this.js_tag == 'pk10') {
          lh = `${ball > ballsArr[10-j-1] ? '龙' : '虎'}`;
        }

        if (ba_dx_ds_hz_wdx[`dx_${j+1}`] == null) {
          // 最新一期的开奖号码，直接赋值给ba_dx_ds_hz_wdx
          ba_dx_ds_hz_wdx[`dx_${j+1}`] = i == len-1 ? `${titleArr[j]}-${dx}：1` : `${dx}1`;
          ba_dx_ds_hz_wdx[`ds_${j+1}`] = i == len-1 ? `${titleArr[j]}-${ds}：1` : `${ds}1`;

          if (this.js_tag == 'pk10') {
            ba_dx_ds_hz_wdx[`lh_${j+1}`] = i == len-1 ? `${titleArr[j]}-${lh}：1` : `${lh}1`;
          }

        } else {
          // 往期的开奖号码对比，改变ba_dx_ds_hz_wdx的值。
          if (!ba_dx_ds_hz_wdx[`dx_${j+1}`].includes('：')) { // 包含：冒号的是已经对比到结果了。
            if (ba_dx_ds_hz_wdx[`dx_${j+1}`].includes(dx)) {
              // 包含这一期的dx，但不包含：冒号
              ba_dx_ds_hz_wdx[`dx_${j+1}`] = i == len-1 ? `${titleArr[j]}-${dx}：${parseInt(ba_dx_ds_hz_wdx[`dx_${j+1}`].substr(1)) + 1}` : `${dx}${parseInt(ba_dx_ds_hz_wdx[`dx_${j+1}`].substr(1)) + 1}`;
            } else {
              // 碰到不同的了。加个冒号来区分吧。
              ba_dx_ds_hz_wdx[`dx_${j+1}`] = `${titleArr[j]}-${ba_dx_ds_hz_wdx[`dx_${j+1}`].substr(0, 1)}：${ba_dx_ds_hz_wdx[`dx_${j+1}`].substr(1)}`;
            }
          }

          if (!ba_dx_ds_hz_wdx[`ds_${j+1}`].includes('：')) {
            if (ba_dx_ds_hz_wdx[`ds_${j+1}`].includes(ds)) {
              ba_dx_ds_hz_wdx[`ds_${j+1}`] = i == len-1 ? `${titleArr[j]}-${ds}：${parseInt(ba_dx_ds_hz_wdx[`ds_${j+1}`].substr(1)) + 1}` : `${ds}${parseInt(ba_dx_ds_hz_wdx[`ds_${j+1}`].substr(1)) + 1}`;
            } else {
              ba_dx_ds_hz_wdx[`ds_${j+1}`] = `${titleArr[j]}-${ba_dx_ds_hz_wdx[`ds_${j+1}`].substr(0, 1)}：${ba_dx_ds_hz_wdx[`ds_${j+1}`].substr(1)}`;
            }
          }

          if (this.js_tag == 'pk10') {
            if (!ba_dx_ds_hz_wdx[`lh_${j+1}`].includes('：')) {
              if (ba_dx_ds_hz_wdx[`lh_${j+1}`].includes(lh)) {
                ba_dx_ds_hz_wdx[`lh_${j+1}`] = i == len-1 ? `${titleArr[j]}-${lh}：${parseInt(ba_dx_ds_hz_wdx[`lh_${j+1}`].substr(1)) + 1}` : `${lh}${parseInt(ba_dx_ds_hz_wdx[`lh_${j+1}`].substr(1)) + 1}`;
              } else {
                ba_dx_ds_hz_wdx[`lh_${j+1}`] = `${titleArr[j]}-${ba_dx_ds_hz_wdx[`lh_${j+1}`].substr(0, 1)}：${ba_dx_ds_hz_wdx[`lh_${j+1}`].substr(1)}`;
              }
            }
          }
        }


        if (j == ballsArr.length - 1 && this.js_tag != 'pcdd' && this.js_tag != 'pk10') {
          // 记录总和值大小单双，和值尾大小，后二和值，状态
          let hzdx = `${sumHZ < this.bahz_ov ? '小' : '大'}`;  // 和值大小
          let hzds = `${sumHZ % 2 == 0 ? '双' : '单'}`;  // 和值单双

          let dxdsKeyArr = ['hzdx', 'hzds'];
          let dxdsValueArr = [hzdx, hzds];

          if (this.js_tag == '11x5' && ballsArr.length == 5) {
            // 11x5,有尾大小，后二大小单双
            let hzwdx = `${parseInt(`${sumHZ}`.substr(-1)) >= 5 ? '尾大' : '尾小'}`; // 和值尾大尾小
            let hrhzInt = this._sumResults([ballsArr[3], ballsArr[4]]);
            let hrhzdx = hrhzInt < 12 ? '小' : '大';       // 后二和值大小； 小：3-11，大：12-21
            let hrhzds = hrhzInt % 2 == 0 ? '双' : '单';   // 后二和值单双

            dxdsKeyArr = ['hzdx', 'hzds', 'hrhzdx', 'hrhzds', 'hzwdx'];
            dxdsValueArr = [hzdx, hzds, hrhzdx, hrhzds, hzwdx];
          }

          for (let x = 0; x < dxdsKeyArr.length; x++) {
            let tit = dxdsKeyArr[x].includes('hr') ? '后二和' : '总和';
            if (ba_dx_ds_hz_wdx[dxdsKeyArr[x]] == null) {
              // 最新一期的开奖号码
              ba_dx_ds_hz_wdx[dxdsKeyArr[x]] = i == len-1 ? `${tit}-${dxdsValueArr[x]}：1` : `${dxdsValueArr[x]}1`;

            } else {
              // 往期的开奖号码对比，改变ba_dx_ds_hz_wdx的值。 截取的长度是value值的长度。
              if (!ba_dx_ds_hz_wdx[dxdsKeyArr[x]].includes('：')) {
                if (ba_dx_ds_hz_wdx[dxdsKeyArr[x]].includes(dxdsValueArr[x])) {
                  ba_dx_ds_hz_wdx[dxdsKeyArr[x]] = i == len-1 ? `${tit}-${dxdsValueArr[x]}：${parseInt(ba_dx_ds_hz_wdx[dxdsKeyArr[x]].substr(dxdsValueArr[x].length)) + 1}` : `${dxdsValueArr[x]}${parseInt(ba_dx_ds_hz_wdx[dxdsKeyArr[x]].substr(dxdsValueArr[x].length)) + 1}`;

                } else {
                  ba_dx_ds_hz_wdx[dxdsKeyArr[x]] = `${tit}-${ba_dx_ds_hz_wdx[dxdsKeyArr[x]].substr(0, dxdsValueArr[x].length)}：${ba_dx_ds_hz_wdx[dxdsKeyArr[x]].substr(dxdsValueArr[x].length)}`;
                }
              }
            }
          }
        }

      }
    }

    return ba_dx_ds_hz_wdx;
  }

  // 计算数组里 值的总和
  _sumResults(ballsAr) {
    let sumBall = 0;
    for (let a = 0; a < ballsAr.length; a++) {
        let ball = parseInt(ballsAr[a]);
        sumBall += ball;
    }
    return sumBall;
  }

  // 长龙排行的item视图
  _changLongPaiHangView(ba_dx_ds_hz_wdx) {
    console.log(ba_dx_ds_hz_wdx);

    let values = Object.values(ba_dx_ds_hz_wdx); // 拿value出来 冒泡排序吧，那个多的就放前面。
    for (let i = 0; i < values.length - 1; i++) {
      for (let j = 0; j < values.length - 1 - i; j++) {

        let v1 = values[j].split('：')[1];
        let v2 = values[j+1].split('：')[1];

        if (parseInt(v1) < parseInt(v2)) {
          let tempv = values[j];
          values[j] = values[j+1];
          values[j+1] = tempv;
        }
      }
    }

    let viewArr = [], rowView = [];
    for (let a = 0; a < values.length; a++) {

      rowView.push(
        <View key={a} style={{ width: SCREEN_WIDTH * 0.5, height: Adaption.Height(32), justifyContent: 'center', alignItems: 'center' }}>
          <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(16, 13), color: '#494949' }}>{values[a]}</Text>
        </View>
      )

      if (a % 2 == 1 || a == values.length - 1) {
        viewArr.push(
          <View key={a}>
            <View style={{ backgroundColor: '#e5e5e5', height: 0.7}}></View>
            <View style={{ flexDirection:'row' }}>{rowView}</View>
          </View>
        )
        rowView = [];  // 换行 清空。
      }
    }
    return viewArr;
  }


  // item视图
  _renderItem(item) {

    if (item.section.isHide || this.data.length <= 0 || Object.keys(this.state.ba123_hz_hr_wdx).length <= 0) {
      return null;
    }

    console.log('二货item又来了。' + item.section.sectionID);

    if (item.section.sectionID == 0) {
      return(
        <View style={{ backgroundColor: '#fff'}}>
          {this._changLongPaiHangView(this.state.dx_ds_hz_wdx)}
        </View>
      )

    } else {

      let btnTitArr = [];
      if (this.js_tag == 'k3') {
        btnTitArr = ['总和-大小', '总和-单双', '号码一-大小', '号码一-单双', '号码二-大小', '号码二-单双', '号码三-大小', '号码三-单双'];
      } else if (this.js_tag == '3d') {
        btnTitArr = ['总和-大小', '总和-单双', '第一球-大小', '第一球-单双', '第二球-大小', '第二球-单双', '第三球-大小', '第三球-单双'];
      } else if (this.js_tag == 'pcdd') {
        btnTitArr = ['特码-大小', '特码-单双'];
      } else if (this.js_tag == 'ssc') {
        btnTitArr = ['总和-大小', '总和-单双', '第一球-大小', '第一球-单双', '第二球-大小', '第二球-单双', '第三球-大小', '第三球-单双', '第四球-大小', '第四球-单双', '第五球-大小', '第五球-单双'];
      } else if (this.js_tag == '11x5') {
        btnTitArr = ['总和-大小', '总和-单双', '总和-尾大小', '第一球-大小', '第一球-单双', '第二球-大小', '第二球-单双', '第三球-大小', '第三球-单双', '第四球-大小', '第四球-单双', '第五球-大小', '第五球-单双'];
      } else if (this.js_tag == 'pk10') {
        btnTitArr = ['冠军-大小', '冠军-单双', '冠军-龙虎', '亚军-大小', '亚军-单双', '亚军-龙虎', '季军-大小', '季军-单双', '季军-龙虎', '第四名-大小', '第四名-单双', '第四名-龙虎', '第五名-大小', '第五名-单双', '第五名-龙虎'];
      }

      return(
        <RoadMapDetail style={{ }}
          data={this.state.ba123_hz_hr_wdx}
          selectIdx={this.state.selectIndex}
          btnTitArr={btnTitArr}
          bahz_ov={this.bahz_ov}  // 判断和值大小。
          ba_ov={this.ba_ov}  // 判断单个号码大小。
          clickBtnIdx={(idx) => {
            this.state.selectIndex = idx;
          }}
        >
        </RoadMapDetail>
      )
    }
  }


  // 分区头
  _renderSectionHeader(section) {
    return (
      <TouchableOpacity activeOpacity={0.8} style={{ height: Adaption.Height(38), width: SCREEN_WIDTH, backgroundColor: '#f3f3f3', alignItems: 'center', flexDirection: 'row',
      borderColor: '#e5e5e5', borderTopWidth: 1 }}
          onPress={() => {
              this.state.sectionData[section.section.sectionID].isHide = !this.state.sectionData[section.section.sectionID].isHide;
              this.setState({
                  sectionData: this.state.sectionData,
              })
          }}>
          <View style={{ flex: 0.08 }}></View>
          <View style={{ flex: 0.84, justifyContent: 'center', alignItems: 'center' }}>
              <Text allowFontScaling={false} style={{ fontSize: Adaption.Font(18, 15), color:'#494949', fontWeight: '500' }}>{section.section.title}</Text>
          </View>
          <View style={{ flex: 0.08 }}>
              <Image style={{ width: 13, height: 13 }} source={section.section.isHide ? require('../FootBall/img/arrowDown.png') : require('../FootBall/img/arrowUp.png')}></Image>
          </View>
      </TouchableOpacity>
    )
  }

  _loadingView() {
    return (
      <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', height: Adaption.Width(80), width: Adaption.Width(100), borderRadius: 5, justifyContent: 'center', alignItems: 'center',position: 'absolute', left: SCREEN_WIDTH / 2 - Adaption.Width(50), top: SCREEN_HEIGHT / 2 - Adaption.Width(100) }}>
        <ActivityIndicator color="white"/>
        <Text allowFontScaling={false} style={{ marginTop: 10, fontSize: Adaption.Font(14, 12), color: 'white' }}>数据请求中...</Text>
      </View> 
    )
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <RoadTimeView style={{ height: Adaption.Height(35), justifyContent: 'center', alignItems: 'center' }}
          finishTime={this.props.navigation.state.params.finishTime}
          nextData={this.props.navigation.state.params.nextData}
          tag={this.tag}
          enterNextQi={() => {
            // 进入下一期。去请求新的开奖记录
            // 分分的延迟4秒去请求。其它的延迟1多分钟
            setTimeout(() => {
              this._getKjCpLogData();
            }, (this.tag.includes('ff') ? 4000 : this.tag.includes('sf') ? 35000 : 70000));

          }}
        >
        </RoadTimeView>

        {!this.state.isLoading
          ? <SectionList style={{}}
            renderSectionHeader={(section) => this._renderSectionHeader(section)} // 分区头视图
            renderItem={(item) => this._renderItem(item)}
            sections={this.state.sectionData}
            keyExtractor={(item, index) => String(index)}
          >
          </SectionList>
          : this._loadingView()
        }
      </View>
    );
  }
}