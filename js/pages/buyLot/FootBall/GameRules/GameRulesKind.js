/**
 * Created by kl on 2018/4/17.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';


const borderR = 5;//边框半径
const col = 4;
const blockW = 70;//块宽度
const blockH = 27;//块高度
const blankW = (SCREEN_WIDTH-2*15-blockW*col)/(col+1);//块之间的宽度
// Adaption.Width(35);

export default class GameRulesKind extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataList:props.dataSource,
            selectedIndex:0,
        };
    }

    componentWillMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                {this._renderBlocks()}
            </View>
        );
    }

    _renderBlocks = () => {

        let viewsArr = [];

        this.props.dataSource.map((value,index)=>{

            viewsArr.push(
                <RulesKindBlock
                    key={index}
                    block={value}
                    selected={this.state.selectedIndex == index?true:false}
                    onChange={(selected)=>{
                        this.props.onChange?this.props.onChange(value,index):null;
                        if (selected) {
                            this.setState({
                                selectedIndex:index,
                            });
                        }
                    }}
                />
            );

        });

        return viewsArr;
    }


}


class RulesKindBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected:props.selected,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            selected:nextProps.selected,
        });
    }

    render() {

        return (
            <TouchableOpacity
                style={[styles.blockStyle,
                    {backgroundColor:this.state.selected?COLORS.appColor:'white',
                        borderRadius:this.state.selected?borderR:0
                    }
                ]}
                activeOpacity={1}
                onPress={()=>{
                    if (this.state.selected) {
                        return;
                    }
                    this.props.onChange?this.props.onChange(!this.state.selected):null;
                }}
            >
                <CusBaseText
                    style={{fontSize:15,color:this.state.selected?'white':'#313131'}}
                >
                    {this.props.block}
                </CusBaseText>
            </TouchableOpacity>
        );
    }

}


const styles = StyleSheet.create({

    container:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft:15,
        marginRight:15,
        backgroundColor:'white',
        paddingTop:15,
        paddingBottom:13,
    },

    blockStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: blockW,
        height: blockH,
        marginLeft: blankW,
        marginBottom: 2,
        borderRadius: borderR,
        backgroundColor:COLORS.appColor,
    },

});