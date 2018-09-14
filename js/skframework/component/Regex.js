/**
 * Created by Mike on 2017/10/14.
 *   用法：  先导入这个类
 *  例：   if (!Regex(this.domainName, "enom")) {
                Alert.alert('该域名不合法！请重新输入!');
                return;
           }
 */
const RegexCheck = (_value, _type) => {

    if (_type == 'user') {
        // 账号类型
        if (!/^[0-9a-z\_]{5,20}$/i.test(_value)) {
            return false;
        }
    }
    if (_type == 'password'){
        // 密码类型
        if (!/^[0-9a-z\_]{6,20}$/i.test(_value)){
            return false;
        }
    }
    if (_type == 'LoginUser') {
        // 登录账号类型
        if (!/^[0-9a-zA-Z\_]{4,20}$/.test(_value)) {
            return false;
        }
    }
    if (_type == 'LoginPassword'){
        // 登录密码类型
        if (!/^[0-9a-zA-Z\_]{4,20}$/.test(_value)){
            return false;
        }
    }
    if (_type == 'email') {
        // 邮箱类型
        if (!/^[0-9a-zA-Z\_]+(\.[0-9a-zA-Z\_]+)*\@[0-9a-zA-Z\_]+(\.[0-9a-zA-Z\_]+)+$/.test(_value)) {
            return false;
        }
    }
    if (_type == 'ip') {
        // IP地址
        if (!/^[0-9]{1,3}(\.[0-9]{1,3}){3}$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'bankcard') {
        // 银行卡类型
        if (!/^[0-9]{10,20}$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'realname') {
        // 真实姓名
        // if (!/^[\u4E00-\u9FA5]{2,5}$/.test(_value)) {
        //   return false;
        // }
        if (/[\;\,\'\"\\\/\(\)\^\%\#\@\*\&]/.test(_value)) {
            return false;
        }
    }

    if (_type == 'url') {
        if (!/^http(s)?\:\/\/[a-zA-Z0-9\%\$\#\@\_\/]+(\.[a-zA-Z0-9\%\$\#\@\_\/]+)+$/.test(_value)) {
            return false;
        }
    }

    // 域名
    if (_type == 'enom') {
        if (!/^[a-zA-Z0-9\_]+(\.[a-zA-Z0-9\_]+)+$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'date') {
        // 日期格式
        if (!/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'time') {
        // 时间格式
        if (!/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'number') {
        // 数值类型
        if (!/^[0-9]+(\.[0-9]+)?$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'int') {
        // 整数型
        if (!/^[0-9]+$/.test(_value)) {
            return false;
        }
    }
    if (_type == 'float') {
        // 小数型
        if (!/^[0-9]+\.[0-9]+$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'datetime') {
        // 日期时间格式
        if (!/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}\s[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'money') {
        // 金额
        if (!/^(([1-9]\d*)(\.\d{1,4})?)$|(0\.0?([1-9]\d?))$/.test(_value)) {
            return false;
        }
    }

    if (_type == 'notnull') {
        if (_value == '') {
            return false;
        }
    }

    if (_type == 'qq') {
        // qq号码
        if (!/^[1-9][0-9]{5,15}$/.test(_value)) {
            return false;
        }
    }

    // 验证码格式验证
    if (_type == 'vcode') {
        // 整数型
        if (!/^[0-9]{4}$/.test(_value)) {
            return false;
        }
        if (_value.length != 4) {
            return false;
        }
        
    }

    // 手机号码格式验证
    if (_type == 'phonum') {

        if (_value.length != 11)
        {
            return false;
        }
        // 整数型
        // if (!/^1[3|4|5|6|7|8][0-9]{9}$/.test(_value))
        if(!(/^1(3|4|5|6|7|8)\d{9}$/.test(_value)))
        {
            return false;
        }
    }
    return true;

};

module.exports = RegexCheck; 