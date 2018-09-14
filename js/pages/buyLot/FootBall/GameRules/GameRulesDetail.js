/**
 * Created by kl on 2018/4/19.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    SectionList,
    TouchableOpacity,
    Image,
} from 'react-native';

import GameRulesKind from "./GameRulesKind";
import GameRulesData from "./GameRulesData";


let kinds = ['一般规则','主要市场','进球集锦','球员','特别','角球','牌/卡','任意球','射门','界外球','替补','越位','点球','比赛','其他'];

export default class GameRulesDetail extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({

        header: (
            <CustomNavBar
                centerText={"test"}
                leftClick={() => navigation.goBack()}
            />
        ),

    });


    constructor(props) {
        super(props);
        this.state = {
            sectionData:GameRulesData,
            selecteIndex:0,
        };
    }

    componentWillMount() {

    }

    render() {
        return (
            <SectionList
                sections={this.state.sectionData[this.state.selecteIndex]}
                renderItem={this._renderItem}
                renderSectionHeader={this._sectionHeader}
                keyExtractor={(item, index) => item + index}
                ItemSeparatorComponent={this._itemSeparator}
                ListHeaderComponent={this._listHeader}
                // style={{backgroundColor:'green'}}
                // SectionSeparatorComponent={this._sectionSeparator}
            />
        );
    }


    _listHeader = () => {
        return (
            <GameRulesKind
                dataSource={kinds}
                onChange={(value,index) => {
                    if (this.state.selecteIndex == index) {
                        return;
                    }
                    this.setState({
                        selecteIndex:index,
                    });

                }}
            />
        );
    }

    _sectionHeader = ({section:section}) => {
        if(section.kind == null){
            return <View style={{height:10}}/>
        }

        return (
            <View style={styles.sectionHeaderView}>
                <CusBaseText style={styles.sectionHeaderText}>{section.kind}</CusBaseText>
            </View>
        );
    }


    _renderItem = ({item,index,section}) => {

        if (item.isHide) {
            return (
                <TouchableOpacity
                    style={[styles.hidItemView,styles.borderStyle]}
                    activeOpacity={1}
                    onPress={()=>this._pressItemHeader(section,index)}
                >
                    <CusBaseText style={[styles.hidItemViewText,{fontWeight:'bold',color:COLORS.appColor}]}>{item.title}</CusBaseText>
                    <Image
                        style={{width:13,height:13,marginRight:15}}
                        source={item.isHide ? require('../img/arrowDown.png') : require('../img/arrowUp.png')}
                    />
                </TouchableOpacity>
            );
        }

        return (
            <View style={[styles.itemView,styles.borderStyle]}>
                <TouchableOpacity
                    style={{flexDirection:'row',justifyContent: 'space-between',alignItems:'center',height:50}}
                    activeOpacity={1}
                    onPress={()=>this._pressItemHeader(section,index)}
                >
                    <CusBaseText style={[styles.hidItemViewText,{fontWeight:'bold',color:COLORS.appColor}]}>{item.title}</CusBaseText>
                    <Image
                        style={{width:13,height:13,marginRight:15}}
                        source={item.isHide ? require('../img/arrowDown.png') : require('../img/arrowUp.png')}
                    />
                </TouchableOpacity>
                <CusBaseText style={[styles.hidItemViewText,{fontSize:13,paddingBottom:15}]}>{item.detail}</CusBaseText>
            </View>
        );

    }

    _pressItemHeader = (section,index) => {

        this.state.sectionData[this.state.selecteIndex][section.sectionID].data[index].isHide = !this.state.sectionData[this.state.selecteIndex][section.sectionID].data[index].isHide;
        this.setState({
            sectionData: this.state.sectionData,
        })
    }

    _itemSeparator = () => {
        return <View style={{ height:8, width: SCREEN_WIDTH}}></View>
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }


    componentWillUpdate() {

    }

    componentDidUpdate() {

    }

    componentWillUnmount() {

    }

}

const styles = StyleSheet.create({

    sectionHeaderView:{
        justifyContent:'center',
        width:SCREEN_WIDTH-2*15,
        height:50,
        marginLeft:15,
        marginRight:15,
    },

    sectionHeaderText:{
        fontWeight:'bold',
        fontSize:17,
        color:'#313131',
    },

    hidItemView:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        width:SCREEN_WIDTH-2*15,
        height:50,
        marginLeft:15,
        marginRight:15,
        backgroundColor:'white',
    },

    itemView:{
        width:SCREEN_WIDTH-2*15,
        marginLeft:15,
        marginRight:15,
        backgroundColor:'white',
    },

    borderStyle:{
        borderRadius:5,
        borderWidth:1,
        borderColor:'#cccccc',
    },

    hidItemViewText:{
        marginLeft:15,
        marginRight:15,
        fontSize:16,
        lineHeight:18,
        color:'#313131',
    },

});