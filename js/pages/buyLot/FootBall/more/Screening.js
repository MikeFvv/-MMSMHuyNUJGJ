import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Alert,
    ListView,
    Animated,
    Image,
    Easing,
    SectionList,
} from 'react-native';

const {width, height} = Dimensions.get('window');
import HaderButton from './HaderButton';

let widthTow=SCREEN_WIDTH - 15;

export default class Screening extends Component {

    //接收上一个页面传过来的title显示出来
    static navigationOptions = ({navigation}) => ({

        header: (
            <CustomNavBar
                centerText={"筛选联赛"}
                leftClick={() => navigation.goBack()}
            />
        ),
    });


    constructor(props) {
        super(props);

        this.state = {
            allIsChecked: false,
            dataSourceList: [],  // 所有数据
            selectIdnArr: [{}, {}], // 选择的下标
            selectIdx: -1,   // 0 是全部，1是仅热门赛事， 2 仅其他， -1 都不是
            callback:this.props.navigation.state.params.gaBack,
            game_type:this.props.navigation.state.params.game_type,
            play_group:this.props.navigation.state.params.play_group,
            isHaveData: false,  // 是否有数据
            sport_Id:this.props.navigation.state.params.sportID, //体彩的ID
        };
    }


    componentDidMount() {      
        this._fetchSubHeadData();
    }


    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
          return; //因为在组件挂载（mounted）之后进行了异步操作 此时异步操作中callback还在执行，因此setState没有得到值
        };
    }


  //请求当前时间的
  _fetchSubHeadData() {

    let params = new FormData();
    params.append("ac","getSportLeagueList")
    params.append("sport_id", this.state.sport_Id);
    params.append("game_type", this.state.game_type);
    params.append("play_group", this.state.play_group);
    var promise = GlobalBaseNetwork.sendNetworkRequest(params);
    promise
      .then((responseData) => {

        let hotArray = [];
        let oterArray = [];

        let timeJSO = responseData.data;

        if (timeJSO && timeJSO.length > 0) {
        timeJSO.map((value) => {
            if (value.is_hot == '0') {
                hotArray.push(value);
            } else {
                oterArray.push(value);
            }
        });

        this._allResultArray(hotArray, oterArray);

        }else{
 
        this.setState({

            dataSourceList: [],
            isHaveData:true,
        })

        }

      })
      .catch((err) => {
      })
  }



  _allResultArray(hotArray, oterArray) {
   // 源收据
    let listData = [{ name: '仅热门赛事', sectionId: 0, isHide: false, data: hotArray }, { name: '仅其他', sectionId: 1, isHide: false, data: oterArray}];
        this.setState({
            dataSourceList: listData,
            isHaveData:false,
        })

     }  
 

    handlerSectionHeader = (info) => {

        this.state.dataSourceList[info.section.sectionId].isHide = !this.state.dataSourceList[info.section.sectionId].isHide;
        this.setState({
            dataSourceList: this.state.dataSourceList,
        })
    };

   
      // 每个section之间的分隔组件
      _sectionSeparatorComponent() {
        return <View style={{ height: 10, width: SCREEN_WIDTH, backgroundColor: '#F3F3F3' }}></View>
    }

    //cell之间的间隔
    _renderItemSeparatorComponent = (info) => {
        return info.section.isHide ? null :  <View style={{height: 1, backgroundColor: '#E8E8E8'}}></View>
    };
    //section头部
    _renderSectionHeader = (item) => {
        return (
            <OpenCellHader
                info={item}
                handlerSectionHeader01={this.handlerSectionHeader.bind(this)}
            />
        );
    };


     //cell
     _renderItem = (info) => {

        let selectdic = this.state.selectIdnArr[info.section.sectionId][`index${info.index}`];
        let isSelect = selectdic ? selectdic['index'] == info.index : false;

        if (info.section.isHide == true) {
            return null;
        } else {
            return (
                <View style={{
                    marginLeft:5,width:widthTow, height: 40, backgroundColor: "#FFF",
                    justifyContent: "space-between", paddingRight: 20, flexDirection: 'row', alignItems: "center"
                }}>
                    <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row', alignItems: "center",width: width, height: 50}} 
                         onPress={ () => {

                            let isAllSel = false;
                            let dic = this.state.selectIdnArr[info.section.sectionId][`index${info.index}`];
                            if (dic) {
                                delete this.state.selectIdnArr[info.section.sectionId][`index${info.index}`];
                            } else {
                                this.state.selectIdnArr[info.section.sectionId][`index${info.index}`] = {'index': info.index, 'league': info.item};

                                let seltTotal = Object.keys(this.state.selectIdnArr[0]).length + Object.keys(this.state.selectIdnArr[1]).length;
                                let total = this.state.dataSourceList[0].length + this.state.dataSourceList[1].length;
                                
                                if (seltTotal == total) {
                                    isAllSel = true;
                                }
                            }

                            this.setState({
                                selectIdnArr: this.state.selectIdnArr,
                                selectIdx: isAllSel ? 0 : -1, // 0 是全选
                            })
                        }}>

                        <View style={{width:widthTow-widthTow/6,flexDirection: 'row',}}>
                        <Image style={{marginLeft: 10, width: 20, height: 20}}
                               source={isSelect ? require("../img/ic_seleBox.png") :
                                   require("../img/ic_NormalBox.png")}/>
                        <CusBaseText style={{marginLeft: 10, color: isSelect ? COLORS.appColor : '#7d7d7d',marginTop:2}}>
                            {info.item.league_name}
                        </CusBaseText>
                        </View>

                        <View style={{width:widthTow/7,justifyContent: 'center',alignItems: 'center',}}>
                        <CusBaseText style={{color: '#7d7d7d'}}>
                            {info.item.game_cnt}
                        </CusBaseText>

                      </View>
                    </TouchableOpacity>
                </View>
            );
        }
    };


    _listEmptyComponent() {
        if (this.state.isHaveData ==true) {
            return (
                <View style={{ height: 300, justifyContent: 'center', alignItems: 'center'}}>
                    <CusBaseText allowFontScaling={false} style={{fontSize: 30}}>暂无数据！</CusBaseText>
                </View>
            );
        } else {
           return <View></View> 
        }
    }
    
    _sectionListView() {
        return (
            <View style={{marginLeft:5,width:widthTow,flex:1}}>
                <SectionList
                    SectionSeparatorComponent={() => this._sectionSeparatorComponent()} // section的顶底部视图
                    ItemSeparatorComponent={this._renderItemSeparatorComponent}
                    renderSectionHeader={(info) => this._renderSectionHeader(info)}
                    renderItem={this._renderItem}
                    sections={this.state.dataSourceList}
                    keyExtractor={(item,index)=>{return String(index)}} // 每个item的key
                    ListEmptyComponent={() => this._listEmptyComponent()}
                />
            </View>
        )
    }

    render() {
        let isIphoneX = SCREEN_HEIGHT == 812 ? true : false;  //是否为iphoneX
        return (
            <View style={styles.container}>
            <View style={{backgroundColor:'#F3F3F3',height:10}}></View>
                <View style={{
                    marginLeft: 5,
                    backgroundColor: 'white',
                    height:45,
                    borderRadius:45/2,
                    width: widthTow,
                }}>
                    <HaderButton
                        data={[{key:0,title:'全部'}, {key:1,title:'仅热门赛事'}, {key:2,title:'仅其他'}]}
                        selectIdx={this.state.selectIdx}
                        headerClick={(index) => {
                            if (this.state.selectIdx == index) {
                              //  return; // 选择相同 直接退出   //判断是否是相同的 如果是相同的则取反
                              this.setState({
                                selectIdnArr: [{}, {}], // 选择的下标
                                selectIdx: -1, // 0 是全选
                            })

                            } else {

                                this.setState({
                                    selectIdx: index,
                                });
                                this.allhouLianSai(index);
                            }
                        }}
                    />

                </View>
                <View style={{backgroundColor:'#F3F3F3',height:10}}></View>
                {this._sectionListView()}
    
               <View style={{
                    width: width,backgroundColor: "#FFF", flexDirection: 'row',height:50, marginBottom: isIphoneX ? 34 : 0
                }}>
                     <TouchableOpacity style={{
                         width: width / 2,
                        height: 50,
                        // marginBottom: isIphoneX ? 34 : 0,
                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: 'center'
                    }} onPress={() => this.cancelAllSelect()}>
                        <CusBaseText style={{color: '#7d7d7d'}}>取消</CusBaseText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width: width / 2,
                        height: 50,
                        // marginBottom: isIphoneX ? 34 : 0,
                        flexDirection: 'row',
                        backgroundColor: COLORS.appColor,
                        alignItems: "center",
                        justifyContent: 'center'
                    }} onPress={() => this.goBackItemArray()}>
                        <CusBaseText style={{color: "#FFF"}}>确定</CusBaseText>
                    </TouchableOpacity>
                </View> 
            </View>
        );
    }


    
    allhouLianSai(index) {

        if (this.state.dataSourceList.length < 2) {
            return;
        }

        if (index == 0) {
            // 全选
            for (let a = 0; a < 2; a++) {
                let array = this.state.dataSourceList[a].data;
                for (let b = 0; b < array.length; b++) {
                    this.state.selectIdnArr[a][`index${b}`] = {'index': b, 'league': array[b]};
                }   
            }

        } else if (index == 1) {
            // 仅热门
            let array = this.state.dataSourceList[0].data;
            for (let b = 0; b < array.length; b++) {
                this.state.selectIdnArr[0][`index${b}`] = {'index': b, 'league': array[b]};
            }   
            this.state.selectIdnArr[1] = {};
        } else {
            // 仅其他
            let array = this.state.dataSourceList[1].data;
            for (let b = 0; b < array.length; b++) {
                this.state.selectIdnArr[1][`index${b}`] = {'index': b, 'league': array[b]};
            }   
            this.state.selectIdnArr[0] = {};
        }

        this.setState({
            selectIdnArr: this.state.selectIdnArr,
        })
    }



    cancelAllSelect = () => {  //取消

      this.props.navigation.goBack()
    }

    goBackItemArray = () => { 
        let arrayList= this.state.selectIdnArr;
        let seltIdx = [];
        
        for (let a = 0; a < arrayList.length; a++) {
            let dic = arrayList[a];
            
            for (let b in dic) {
                seltIdx.push(dic[b].league.league_id);
            }
        }

        console.log('===========',seltIdx);
        this.state.callback(seltIdx);
        this.props.navigation.goBack()



    };


};


class OpenCellHader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rotateValue: new Animated.Value(0),
        };
    }

    handlerSectionHeader01 = (info) => {
        this.props.handlerSectionHeader01(info);
        if (info.section.isHide) {
            this.state.rotateValue.setValue(180);
            Animated.timing(this.state.rotateValue, {
                toValue: 0,
                duration: 300,
                easing: Easing.linear
            }).start();// 开始spring动画

        } else {
            this.state.rotateValue.setValue(0);
            Animated.timing(this.state.rotateValue, {
                toValue: 180,
                duration: 300,
                easing: Easing.linear
            }).start();// 开始spring动画
        }

    };

    render() {
        const {info} = this.props;
        let imageSection = '';
        if (info.section.sectionId == '0'){
            imageSection =  require('../img/ic_hot.png');

        } else if( info.section.sectionId == '1'){
            imageSection =  require('../img/ic_Other.png');
        }
        return (
            <View style={styles.container01}>
                <TouchableOpacity
                    onPress={() => this.handlerSectionHeader01(info)}
                    style={styles.subView}
                    activeOpacity={0.7} 
                >
                    <View  
                        style={{height: 26, flexDirection: 'row',marginTop:15}}>
                        <Image style={{width: 20, height: 20}} source={imageSection}/>
                        <CusBaseText style={{marginTop:2,marginLeft:5, color: '#7d7d7d',fontSize:15}}>{info.section.name}</CusBaseText>
                    </View>

                    <Animated.Image
                        style={[styles.image,
                            {
                                transform: [{
                                    rotate:
                                        this.state.rotateValue.interpolate({
                                            inputRange: [0, 180],
                                            outputRange: ['0deg', '180deg']
                                        })
                                }]
                            }
                        ]}
                        source={require("../img/arrowUp.png")}>
                    </Animated.Image>
                </TouchableOpacity>
            </View>

        );

    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#F3F3F3',
    },
    container01: {
        height: 50,
        backgroundColor: "#FFF",
        marginLeft:5,
        width:widthTow,
    },
    subView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal:5,
        width:widthTow-22,
       
    },
    image: {
        width: 16,
        height: 16,
        marginTop:12,

    },

});
