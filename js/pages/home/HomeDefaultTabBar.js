import React, {Component} from 'react';

import {
	StyleSheet,
	View,
	TouchableOpacity,
    Text,
    Image,
    Dimensions
} from 'react-native';
const { width, height } = Dimensions.get("window");
const KAdaptionWith = width / 414;
const KAdaptionHeight = height / 736;

class HomeDefaultTabBar extends Component {

	// propTypes = {
	// 	// goToPage: React.PropTypes.func, // 跳转到对应tab的方法
	// 	// activeTab: React.PropTypes.number, // 当前被选中的tab下标
	// 	// tabs: React.PropTypes.array, // 所有tabs集合

	// 	// tabNames: React.PropTypes.array, // 保存Tab名称
	// 	// tabIconNames: React.PropTypes.array, // 保存Tab图标
	// }

	setAnimationValue({value}) {
	
	}

	componentDidMount() {
		// Animated.Value监听范围 [0, tab数量-1]
		this.props.scrollValue.addListener(this.setAnimationValue);
	}

	renderTabOption(tab, i) {
        let color = this.props.activeTab == i ? COLORS.appColor : "#222222"; // 判断i是否是当前选中的tab，设置不同的颜色
        let backcolor = this.props.activeTab == i ? COLORS.appColor : "#ffffff";
		return (
			<TouchableOpacity key = {i} activeOpacity={1} onPress={()=>this.props.goToPage(i)} style={styles.tab}>
				<View style={styles.tabItem}>
                <CusBaseText style={{color: color,fontSize: Adaption.Font(17, 15),marginLeft:18,fontWeight: "500"}}>
						{this.props.tabNames[i]}
					</CusBaseText>
                    <Image
                        style={{width:18,height:10,marginTop:-15}}
                        source = {this.props.tabIconNames[i]} 
                    >
                    </Image>
				</View>
                <View
                key = {9}
                style={{width:width/4,height: 2, backgroundColor:backcolor}}
             />
                <View
                key = {8}
                style={{ width: width, height: 1, backgroundColor: "#f3f3f3" }}
             />
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<View style={styles.tabs}>
				{this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	tabs: {
		flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
		alignItems: 'center',
	},

	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	tabItem: {
        flex:1,
		flexDirection: 'row',
        justifyContent: 'center',
		alignItems: 'center',
	},
});


export default HomeDefaultTabBar;