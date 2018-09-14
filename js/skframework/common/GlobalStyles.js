/**
 * Created by Mike on 2017/10/22.
 * 全局样式
 */

module.exports = { 
    
    nav_headerLeft_touch: {
        paddingLeft: 15,
        height: 44,
        width: 55,
        justifyContent: 'center',
    },

    //与上面nav_headerLeft_touch保持相同宽高,否则安卓版标题不会居中
    nav_blank_view: {
        height: 44,width: 55,justifyContent: 'center',paddingRight:15,
    },

    nav_headerLeft_view: {
        width: 15, 
        height: 15, 
        borderColor: '#fff', 
        borderLeftWidth: 1, 
        borderBottomWidth: 1, 
        transform: [{ rotate: '45deg' }]
    },



    line: {
        flex: 1,
        height: 0.4,
        opacity: 0.5,
        backgroundColor: 'darkgray',
    },
    cell_container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderStyle: null,
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    },
    listView_container: {
        flex: 1,
        backgroundColor: '#f3f3f4',
    },

};