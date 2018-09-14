import React, {Component} from 'react'
import {
    StyleSheet,
    Text,
    Animated,
    View,
    TouchableOpacity
} from 'react-native'

import SortableGrid from './AllenDragAndReplace';


export default class basicExample extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({

        headerTintColor: "white",
        headerStyle: {
            backgroundColor: COLORS.appColor,
            marginTop: Android ? (parseFloat(global.versionSDK) > 19 ? StatusBar.currentHeight : 0) : 0
        },
        title: navigation.state.params.title,
        headerTitleStyle: {alignSelf: 'center'},
        //加入右边空视图,否则标题不居中  ,alignSelf:'center'
        headerRight: (
            <View style={GlobalStyles.nav_blank_view}/>
        ),
        headerLeft: (
            <TouchableOpacity
                style={GlobalStyles.nav_headerLeft_touch}
                activeOpacity={1}
                onPress={() => {
                    navigation.goBack()
                    setTimeout(() => {
                        PushNotification.emit('allenReceiveSc', {});
                    }, 200)


                }}>
                <View style={GlobalStyles.nav_headerLeft_view}/>
            </TouchableOpacity>
        ),
    });

    constructor() {
        super()
        this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        this.state = {
            animation: new Animated.Value(0),
        }
    }

    getColor() {
        let r = this.randomRGB()
        let g = this.randomRGB()
        let b = this.randomRGB()
        return 'rgb(' + r + ', ' + g + ', ' + b + ')'
    }

    randomRGB = () => 160 + Math.random() * 85

    startCustomAnimation = () => {
        console.log("Custom animation started!")

        // Animated.timing(
        //     this.state.animation,
        //     {toValue: 100, duration: 500}
        // ).start(() => {
        //
        //     Animated.timing(
        //         this.state.animation,
        //         {toValue: 0, duration: 500}
        //     ).start()
        //
        // })
    }

    getDragStartAnimation = () => {
        return {
            transform: [
                {
                    scaleX: this.state.animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, -1.5],
                    })
                },
                {
                    scaleY: this.state.animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, 1.5],
                    })
                },
                {
                    rotate: this.state.animation.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0 deg', '450 deg']
                    })
                }
            ]
        }
    }

    render() {
        return (
            <View style={{paddingTop: 0,backgroundColor:'yellow',flex:1}}>
                <Text style={{alignSelf: 'center', fontWeight: 'bold', marginBottom: 10}}>Allen animation</Text>
                <SortableGrid
                    blockTransitionDuration={200}
                    activeBlockCenteringDuration={50}
                    itemsPerRow={3}
                    dragActivationTreshold={0}
                    dragStartAnimation={this.getDragStartAnimation()}
                    onDragRelease={(itemOrder) => console.log("Drag was released, the blocks are in the following order: ", itemOrder)}
                    onDragStart={this.startCustomAnimation}
                    ref={'SortableGrid'}
                >
                    {
                        this.numbers.map((letter, index) =>
                            <View
                                ref={'itemref_' + index}
                                key={index}
                                style={[
                                    styles.block,
                                    {backgroundColor: this.getColor()}
                                ]}
                            >
                                <Text style={{color: 'white', fontSize: 45}}>{letter}</Text>
                            </View>
                        )
                    }
                </SortableGrid>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    block: {
        flex: 1,
        margin: 8,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});




// import React, { Component } from 'react'
// import {
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity
// } from 'react-native'
//
// import SortableGrid from './AllenDragAndReplace';
//
// export default class basicExample extends Component {
//
//
//     static navigationOptions = ({navigation, screenProps}) => ({
//
//         headerTintColor: "white",
//         headerStyle: {
//             backgroundColor: COLORS.appColor,
//             marginTop: Android ? (parseFloat(global.versionSDK) > 19 ? StatusBar.currentHeight : 0) : 0
//         },
//         title: navigation.state.params.title,
//         headerTitleStyle: {alignSelf: 'center'},
//         //加入右边空视图,否则标题不居中  ,alignSelf:'center'
//         headerRight: (
//             <View style={GlobalStyles.nav_blank_view}/>
//         ),
//         headerLeft: (
//             <TouchableOpacity
//                 style={GlobalStyles.nav_headerLeft_touch}
//                 activeOpacity={1}
//                 onPress={() => {
//                     navigation.goBack()
//                     setTimeout(() => {
//                         PushNotification.emit('allenReceiveSc', {});
//                     }, 200)
//
//
//                 }}>
//                 <View style={GlobalStyles.nav_headerLeft_view}/>
//             </TouchableOpacity>
//         ),
//     });
//
//     constructor() {
//         super()
//         this.alphabets = ['A','B','C','D','E','F',
//             'G','H','I','J','K','L',
//             'M','N','O','P','Q','R',
//             'S','T','U','V','W','X']
//     }
//
//     getColor() {
//         let r = this.randomRGB()
//         let g = this.randomRGB()
//         let b = this.randomRGB()
//         return 'rgb(' + r + ', ' + g + ', ' + b + ')'
//     }
//     randomRGB = () => 160 + Math.random()*85
//
//     render() {
//         return (
//             <SortableGrid
//                 blockTransitionDuration      = { 300 }
//                 activeBlockCenteringDuration = { 1000 }
//                 itemsPerRow                  = { 4 }
//                 dragActivationTreshold       = { 0 }
//                 onDragRelease                = { (itemOrder) => console.log("Drag was released, the blocks are in the following order: ", itemOrder) }
//                 onDragStart                  = { ()          => console.log("Some block is being dragged now!") }
//             >
//                 {
//                     this.alphabets.map( (letter, index) =>
//                         <View key={index} style={[styles.block, { backgroundColor: this.getColor() }]}>
//                             <Text style={{color: 'white', fontSize: 50}}>{letter}</Text>
//                         </View>
//                     )
//                 }
//             </SortableGrid>
//         )
//     }
//
// }
//
// const styles = StyleSheet.create({
//     block: {
//         flex: 1,
//         margin: 8,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center'
//     }
// });