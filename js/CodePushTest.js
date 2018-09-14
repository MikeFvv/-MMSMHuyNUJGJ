import React, { Component } from "react";
import {
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Vibration
} from "react-native";

import CodePush from "react-native-code-push";
import LocalImg from '../publicconfig/images'



export default class CodePushTest extends Component {

  //接收上一个页面传过来的title显示出来
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerTitle: '',
  });
  // 点击返回上一页方法
  backVC = () => {
    //返回首页方法
    this.props.navigation.goBack();
  }


  constructor() {
    super();
    this.state = {
      restartAllowed: true
    };
  }

  codePushStatusDidChange(syncStatus) {
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({ syncMessage: "检查更新.." });
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({ syncMessage: "下载安装包..." });
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({ syncMessage: "等待用户操作。" });
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({ syncMessage: "安装更新。" });
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        this.setState({ syncMessage: "应用程序最新.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({ syncMessage: "用户取消更新.", progress: false });
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({ syncMessage: "更新已安装需要重启.", progress: false });
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({ syncMessage: "发生了未知错误.", progress: false });
        break;
    }
  }

  codePushDownloadDidProgress(progress) {
    this.setState({ progress });
  }

  // 是否重启更新
  toggleAllowRestart() {
    this.state.restartAllowed
      ? CodePush.disallowRestart()
      : CodePush.allowRestart();

    this.setState({
      restartAllowed: !this.state.restartAllowed
    });
  }

  getUpdateMetadata() {
    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then((metadata: LocalPackage) => {
      this.setState({
        syncMessage: metadata
          ? JSON.stringify(metadata)
          : "运行二进制版本",
        progress: false
      });
    }, (error: any) => {
      this.setState({
        syncMessage: "Error: " + error,
        progress: false
      });
    });
  }

  /** Update is downloaded silently, and applied on restart (recommended) */
  sync() {
    CodePush.sync({}, this.codePushStatusDidChange.bind(this), this.codePushDownloadDidProgress.bind(this));
  }

  /** 更新弹出确认对话框，然后立即重新启动该应用程序 */
  // syncImmediate() {
  //   CodePush.sync({
  //     installMode: CodePush.InstallMode.IMMEDIATE,
  //     updateDialog: true
  //   },
  //     this.codePushStatusDidChange.bind(this),
  //     this.codePushDownloadDidProgress.bind(this)
  //   );
  // }

  /** 更新弹出确认对话框，然后立即重新启动该应用程序 */
  syncImmediate() {
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,//启动模式三种：ON_NEXT_RESUME、ON_NEXT_RESTART、IMMEDIATE
        updateDialog: {
          appendReleaseDescription: true,//是否显示更新description，默认为false
          descriptionPrefix: "更新内容：",//更新说明的前缀。 默认是” Description:
          mandatoryContinueButtonLabel: "立即更新",//强制更新的按钮文字，默认为continue
          mandatoryUpdateMessage: "",//- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.
          optionalIgnoreButtonLabel: '稍后',//非强制更新时，取消按钮文字,默认是ignore
          optionalInstallButtonLabel: '后台更新',//非强制更新时，确认文字. Defaults to “Install”
          optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.
          title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.
        },
      },
      this.codePushStatusDidChange.bind(this),
      this.codePushDownloadDidProgress.bind(this)
    );
  }



  render() {
    let progressView;

    if (this.state.progress) {
      progressView = (
        <Text style={styles.messages}>{this.state.progress.receivedBytes}
          of {this.state.progress.totalBytes}
          bytes received</Text>
      );
    }

    return (
      <View style={styles.container}>

        <Text style={styles.welcome}>
          Welcome to CodePush!
        </Text>
        <TouchableOpacity onPress={() => Vibration.vibrate()}>
          <Text style={styles.welcome}>
            听说点击会震动哦！
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.sync.bind(this)}>
          <Text style={styles.syncButton}>新闻背景同步</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.syncImmediate.bind(this)}>
          <Text style={styles.syncButton}>按对话框驱动同步kkkkktest</Text>
        </TouchableOpacity>
        {progressView}
        <Image style={styles.image} resizeMode={Image.resizeMode.contain} source={LocalImg.ic_x120} />
        <TouchableOpacity onPress={this.toggleAllowRestart.bind(this)}>
          <Text style={styles.restartToggleButton}>重新启动 {this.state.restartAllowed
            ? "允许"
            : "被禁止的"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.getUpdateMetadata.bind(this)}>
          <Text style={styles.syncButton}>新闻更新元数据</Text>
        </TouchableOpacity>
        <Text style={styles.messages}>{this.state.syncMessage || ""}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    paddingTop: 50
  },
  image: {
    margin: 30,
    width: Dimensions.get("window").width - 100,
    height: 365 * (Dimensions.get("window").width - 100) / 651
  },
  messages: {
    marginTop: 30,
    textAlign: "center"
  },
  restartToggleButton: {
    color: "blue",
    fontSize: 17
  },
  syncButton: {
    color: "green",
    fontSize: 17
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 20
  }
});

AppRegistry.registerComponent('SKyCPRN', () => CodePushTest);