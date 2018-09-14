/**
 Author kim
 Created by on 2017/10/9 0009
 dec 充值详情界面
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    StatusBar,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import * as moment from "moment";

export  default class RechargeDetail extends Component{

    static navigationOptions = ({ navigation }) => ({


        header:(
            <CustomNavBar
                centerText = {"详情"}
                leftClick={() =>  navigation.goBack() }

            />
        ),
    });

    render(){

        return <View style={styles.container}>
            <View style={styles.itemFrist}>
                <CusBaseText style={[styles.childView,{marginTop:8}]}>订单号:</CusBaseText>
                <CusBaseText style={[styles.childView_two,{marginTop:8}]}>{this.props.navigation.state.params.detialArray.value.order}</CusBaseText>
            </View>
            <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:7,backgroundColor:'#f3f3f3'}}></View>

            <View style={styles.itemView}>
                <CusBaseText style={styles.childView}>入款类型:</CusBaseText>
                <CusBaseText style={styles.childView_two}>{this.props.navigation.state.params.detialArray.value.type}</CusBaseText>
            </View>
              <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:5,backgroundColor:'#f3f3f3'}}></View>
            <View style={styles.itemView}>
                <CusBaseText style={styles.childView}>入款金额:</CusBaseText>
                <CusBaseText style={styles.childView_two}>{this.props.navigation.state.params.detialArray.value.price}元</CusBaseText>
            </View>
            <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:5,backgroundColor:'#f3f3f3'}}></View>
            <View style={styles.itemView}>
                <CusBaseText style={styles.childView}>入款优惠:</CusBaseText>
                <CusBaseText style={styles.childView_two}>{this.props.navigation.state.params.detialArray.value.price_odd}</CusBaseText>
            </View>
            <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:5,backgroundColor:'#f3f3f3'}}></View>
            <View style={styles.itemView}>
                <CusBaseText style={styles.childView}>首存优惠:</CusBaseText>
                <CusBaseText style={styles.childView_two}>{this.props.navigation.state.params.detialArray.value.price_first}</CusBaseText>
            </View>
          <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:5,backgroundColor:'#f3f3f3'}}></View>
           
            {/* <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:5,backgroundColor:'#f3f3f3'}}></View> */}
            <View style={styles.itemView}>
                <CusBaseText style={styles.childView}>入款状态:</CusBaseText>
                <CusBaseText style={styles.childView_two}>{this.props.navigation.state.params.detialArray.value.status}</CusBaseText>
            </View>
            <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:5,backgroundColor:'#f3f3f3'}}></View>
            <View style={styles.itemView}>
                <CusBaseText style={[styles.childView]}>存入时间:</CusBaseText>
                <CusBaseText style={[styles.childView_two,{color:'red'}]}>{this.props.navigation.state.params.detialArray.value.pay_time}</CusBaseText>
            </View>
              <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:5,backgroundColor:'#f3f3f3'}}></View>
            <View style={styles.itemView}>
                <CusBaseText style={styles.childView}>备注:</CusBaseText>
                <CusBaseText style={styles.childView_two}>{this.props.navigation.state.params.detialArray.value.index_mark}</CusBaseText>
            </View>
          <View style = {{width:SCREEN_WIDTH-20,marginLeft:10,height:1,marginTop:5,backgroundColor:'#f3f3f3'}}></View>
        </View>


    }


}
const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1,
        flexDirection:'column'
    },
    itemFrist:{
        marginLeft:15,
        alignItems:"center",
        flexDirection:'row',
        height:40,
        width:SCREEN_WIDTH,
    },
    itemView:{
        marginLeft:15,
        alignItems:"center",
        flexDirection:'row',
        height:40,
        width:SCREEN_WIDTH,

    },
    childView:{
       flex:0.25
    },
    childView_two:{
        flex:0.75

    }

})
