/**
 * Created by kl on 2018/4/17.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';

import GameRulesDetail from "./GameRulesDetail"

const topBlockW = 257/2.0;//Adaption.Width(257);
const topBlockH = 28;//Adaption.Width(56);

export default class GameRulesHome extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({

        header: (
            <CustomNavBar
                centerText = {"玩法规则"}
                leftClick={() =>  navigation.goBack() }
            />
        ),

    });

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.topBlock}
                    activeOpacity={1}
                    // onPress={}
                >
                    <CusBaseText style={styles.topBlockText}>足球</CusBaseText>
                </TouchableOpacity>

                <GameRulesDetail
                />

            </View>
        );
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },

    topBlock:{
        width:topBlockW,
        height:topBlockH,
        borderRadius:topBlockW/2,
        marginLeft:(SCREEN_WIDTH-topBlockW)/2,
        marginTop:20,
        marginBottom:20,
        backgroundColor:COLORS.appColor,
        justifyContent: 'center',
        alignItems: 'center',
    },

    topBlockText:{
        color:'white',
        fontSize:18,
    },

});