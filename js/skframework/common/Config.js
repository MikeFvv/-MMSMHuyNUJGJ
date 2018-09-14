/**
 * Created by Mike on 2017/10/21.
 * 请求 配置文件
 * 使用方法   GlobalConfig.方法名()  例： GlobalConfig.lineBaseIPURL()
 */
'use strict';

class ConfigClass {

	constructor() {
		this.baseURL = '';
		this.userData = {};
		this.lineIPArray = [];
	}
	
	lineBaseIPURL = () => {
		//return this.baseURL + '/index.php/PhoneApi/request';
		return this.baseURL + '/request';
		// return "http://client.sg04.com/request";
	}

	lineIPArrayURL = (ipIndex) => {

		if (!this.lineIPArray || this.lineIPArray.length == 0) {
			GlobalConfig.lineIPArray.splice(0, 0, this.baseURL);  // 将主域名添加到数组开始位置
		}

		// let resultIndex = Math.floor(Math.random() * this.lineIPArray.length);

		let resultIndex = ipIndex % this.lineIPArray.length;
		this.baseURL = this.lineIPArray[resultIndex];

		return this.lineIPArray[resultIndex] + '/request';
	}

	rebateOddsTableURL = () => {
		return this.baseURL + '/request';      // 返点赔率表
	}

	cpicon = () => {
		return this.userData.upload_url + '/' + this.userData.website + '/Uploads/cpicon/'   // 彩种图片地址
	}
	backupCpicon = () => {
		return this.baseURL + '/Public/Uploads/cpicon/'   //备用彩种图片地址
	}
	homeBanner = () => {
		return this.userData.upload_url + '/' + this.userData.website + '/Uploads/banner/'   // 首页轮播图
	}
	homeNotice = () => {
		return this.userData.upload_url + '/' + this.userData.website + '/Uploads/notice/'   // 页弹窗公告
	}
	homeEvent = () => {
		return this.userData.upload_url + '/' + 'qtcai' + '/Uploads/event/'   // 首页活动
	}
	homeEventDetial = () => {
		return this.baseURL + '/index.php/phone/youhuiItem/id/'   // 首页活动详情
	}

	// 头像路径
	headImgUrl = () => {
		return this.userData.upload_url + '/' + this.userData.website + '/Uploads/user/';   //头像的基本路径,还需配置后面服务器返回的数据,才能显示图片
	}
	// 客服
	service_url = () => {
		return this.userData.service_url;
	}
	// 服务协议
	serviceProtocal = () => {
		return 'http://uploads.bxvip588.com/haocai/haocai_proctol.php';
	}

	// 支付二维码
	payQRCodeUrl = () => {
		return this.userData.upload_url + '/' + this.userData.website + '/Uploads/qrcode/';
	}

	// 默认图片
	banner_default = () => {
		return this.baseURL + '/Public/view/img/banner_default.jpg';
	}

	// 默认图片
	banner_default = () => {
		return this.baseURL + '/Public/view/img/banner_default.jpg';
	}

	// H5走势
	wap_trend = () => {
		
		// http://app.zjgguolong.com
		// http://wap.zjgguolong.com
		// http://www.qtc000.com

		// return this.baseURL + '/Public/view/img/banner_default.jpg';
		// return 'http://app.zjgguolong.com';
		
		// return 'http://192.168.100.187:8100/trend?isnested=true';
		return 'http://wap.zjgguolong.com/trend?isnested=true';

	}


}

let Config = new ConfigClass();

export default Config;
