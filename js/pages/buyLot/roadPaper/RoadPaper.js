
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
        leftClick={() => navigation.goBack()}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      game_id: props.navigation.state.params.game_id,
      tag: props.navigation.state.params.tag,
      isLoading: true,
      dx_ds_hz_wdx: {},
      ba123_hz_hr_wdx: {},
      selectIndex: 0,
      sectionData: [{'sectionID': 0, 'title': '双面长龙排行', 'isHide': true, 'data': ['000']}, {'sectionID': 1, 'title': '双面路纸图', 'isHide': false, 'data': ['111']}],
    }

    this.js_tag =  props.navigation.state.params.js_tag;
    this.data = [];
    this.pageid = 0;
  }

  componentDidMount() {

    this._getKjCpLogData(this.state.tag, this.pageid);
  }


  //获取历史开奖数据接口
  _getKjCpLogData(tag, pageid, isNextQi) {

    let params = new FormData();
    params.append('ac', 'getKjCpLog');
    params.append('tag', tag);
    params.append('pcount', 20);
    params.append('pageid', pageid);

    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then((response) => {

        if (response.msg == 0 && response.data.length > 0) {

          if (isNextQi == true) {
            // 进入下一期了
            if (response.data[0]['qishu'] == this.data[0]['qishu']) {
              return;
            } else {
              this.data = [];
            }
          }

          console.log('第'+pageid+'页数据 ==== ',response.data);
          
          this.data = [...this.data, ...response.data]; // 合并
          
          if (this.pageid == 5) {  // 请求多少页数据。。。
            this.pageid = 0; // 重置。
            this._allData(this.data);

          } else {
            this.pageid += 1;
            this._getKjCpLogData(this.state.tag, this.pageid);
          }

        } else {
          
          if (this.data.length > 0) { 
            this._allData(this.data);
          }

          this.setState({
            isLoading: false,
          })
        }
      })
      .catch((err) => {

        if (this.data.length > 0) {
          this._allData(this.data);
        }

        this.setState({
          isLoading: false,
        })
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

      for (let j = (this.js_tag == 'pcdd' ? 3 : 0); j < (this.js_tag == 'pk10' ? 5 : ballsArr.length); j++) {
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
    let keyArr = [];  // 后面取值时用。通过key取值比较准确

    let ba_ov = 0; // 大于ov 则为大。
    let baZH_ov = 0;
    if (this.js_tag == 'k3') {
      ba_ov = 4; // 小：0-3， 大：4-6
      baZH_ov = 11; // 总和 小：3-10，大：11-18，单双
      titleArr = ['号码一', '号码二', '号码三'];
      keyArr = ['dx_1', 'ds_1', 'dx_2', 'ds_2', 'dx_3', 'ds_3', 'hzdx', 'hzds'];

    } else if (this.js_tag == '3d') {
      ba_ov = 5; // 小：0-4， 大：5-9 
      baZH_ov = 14; // 总和 小：0-13，大：14-27，单双
      keyArr = ['dx_1', 'ds_1', 'dx_2', 'ds_2', 'dx_3', 'ds_3', 'hzdx', 'hzds'];

    } else if (this.js_tag == 'pcdd') {
      ba_ov = 14; // 特码 小：0-13，大：14-27
      titleArr = ['', '', '', '特码'];
      keyArr = ['dx_4', 'ds_4'];

    } else if (this.js_tag == 'ssc') {
      ba_ov = 5; // 小：0-4， 大：5-9 
      baZH_ov = 23; // 总和 小：0-22，大：23-45，单双
      keyArr = ['dx_1', 'ds_1', 'dx_2', 'ds_2', 'dx_3', 'ds_3', 'dx_4', 'ds_4', 'dx_5', 'ds_5', 'hzdx', 'hzds'];

    } else if (this.js_tag == '11x5') {
      ba_ov = 6;  // 小：1-5， 大：6-11 
      baZH_ov = 30; // 总和 小：15-29，大：30-45，尾小0-4，尾大5-9，单双
      keyArr = ['dx_1', 'ds_1', 'dx_2', 'ds_2', 'dx_3', 'ds_3', 'dx_4', 'ds_4', 'dx_5', 'ds_5', 'hzdx', 'hzds', 'hrhzdx', 'hrhzds', 'hzwdx'];

    } else if (this.js_tag == 'pk10') {
      ba_ov = 6; // 小：1-5， 大：6-10 
      titleArr = ['冠军', '亚军', '季军', '第四名', '第五名'];
      keyArr = ['dx_1', 'ds_1', 'lh_1', 'dx_2', 'ds_2', 'lh_2', 'dx_3', 'ds_3', 'lh_3', 'dx_4', 'ds_4', 'lh_4', 'dx_5', 'ds_5', 'lh_5'];
    }

    let len = data.length > 20 ? 20 : data.length;
    for (let i = 0; i < len; i++) {  // 这里循环20次够了。
      // 先判断balls字段
      let ballsArr = data[i].balls && data[i].balls.length > 1  ? data[i].balls.split('+') : [];
      let sumHZ = this._sumResults(ballsArr);  // 总和值

      for (let j = (this.js_tag == 'pcdd' ? 3 : 0); j < (this.js_tag == 'pk10' ? 5 : ballsArr.length); j++) {
        let ball = ballsArr[j];

        // 记录每一位号码的大小单双状态。
        let dx = `${ball < ba_ov ? '小' : '大'}`;   // 大小
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
          let hzdx = `${sumHZ < baZH_ov ? '小' : '大'}`;  // 和值大小
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

    ba_dx_ds_hz_wdx['allKey'] = keyArr;
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

    let keyArr = ba_dx_ds_hz_wdx['allKey']; // 因为是字典，通过key去拿值比较确实

    let viewArr = [], rowView = [];
    for (let a = 0; a < keyArr.length; a++) {

      rowView.push(
        <View key={a} style={{ width: SCREEN_WIDTH * 0.5, height: Adaption.Height(32), justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: Adaption.Font(16, 13), color: '#494949' }}>{ba_dx_ds_hz_wdx[keyArr[a]]}</Text>
        </View>
      )

      if (a % 2 == 1 || a == keyArr.length - 1) {
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

    if (item.section.isHide || this.data.length <= 0) {
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
      let ba_ov = 0, bahz_ov = 0;
      if (this.js_tag == 'k3') {
        ba_ov = 4; // 小：0-3， 大：4-6 // 总和 小：3-10，大：11-18
        bahz_ov = 11;
        btnTitArr = ['总和-大小', '总和-单双', '号码一-大小', '号码一-单双', '号码二-大小', '号码二-单双', '号码三-大小', '号码三-单双'];
      } else if (this.js_tag == '3d') {
        ba_ov = 5; // 小：0-4， 大：5-9  // 总和 小：0-13，大：14-27
        bahz_ov = 14;
        btnTitArr = ['总和-大小', '总和-单双', '第一球-大小', '第一球-单双', '第二球-大小', '第二球-单双', '第三球-大小', '第三球-单双'];
      } else if (this.js_tag == 'pcdd') {
        ba_ov = 14; // 特码 小：0-13，大：14-27
        bahz_ov = 14;
        btnTitArr = ['特码-大小', '特码-单双'];
      } else if (this.js_tag == 'ssc') {
        ba_ov = 5; // 小：0-4， 大：5-9  // 总和 小：0-22，大：23-45
        bahz_ov = 23;
        btnTitArr = ['总和-大小', '总和-单双', '第一球-大小', '第一球-单双', '第二球-大小', '第二球-单双', '第三球-大小', '第三球-单双', '第四球-大小', '第四球-单双', '第五球-大小', '第五球-单双'];
      } else if (this.js_tag == '11x5') {
        ba_ov = 6;  // 小：1-5， 大：6-11 // 总和 小：15-29，大：30-45
        bahz_ov = 30;
        btnTitArr = ['总和-大小', '总和-单双', '总和-尾大小', '第一球-大小', '第一球-单双', '第二球-大小', '第二球-单双', '第三球-大小', '第三球-单双', '第四球-大小', '第四球-单双', '第五球-大小', '第五球-单双'];
      } else if (this.js_tag == 'pk10') {
        ba_ov = 6; // 小：1-5， 大：6-10 
        bahz_ov = 6;
        btnTitArr = ['冠军-大小', '冠军-单双', '冠军-龙虎', '亚军-大小', '亚军-单双', '亚军-龙虎', '季军-大小', '季军-单双', '季军-龙虎', '第四名-大小', '第四名-单双', '第四名-龙虎', '第五名-大小', '第五名-单双', '第五名-龙虎'];
      }

      return(
        <RoadMapDetail style={{ }}
          data={this.state.ba123_hz_hr_wdx}
          selectIdx={this.state.selectIndex}
          btnTitArr={btnTitArr}
          bahz_ov={bahz_ov}  // 判断和值大小。
          ba_ov={ba_ov}  // 判断单个号码大小。
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
        <Text style={{ marginTop: 10, fontSize: Adaption.Font(14, 12), color: 'white' }}>数据请求中...</Text>
      </View> 
    )
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <RoadTimeView style={{ height: Adaption.Height(35), justifyContent: 'center', alignItems: 'center' }}
          nextData={this.props.navigation.state.params.nextData}
          fengPanTime={this.props.navigation.state.params.fengPanTime}
          openTime={this.props.navigation.state.params.openTime}
          tag={this.state.tag}
          enterNextQi={() => {
            // 进入下一期。去请求新的开奖记录
            // 分分的延迟2秒去请求。其它的延迟1分钟
            setTimeout(() => {
              this._getKjCpLogData(this.state.tag, this.pageid, true);
            }, (this.state.tag.includes('ff') ? 2000 : 60000));

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