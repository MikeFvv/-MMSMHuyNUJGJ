package com.skycprn.model;

import com.eleven.lib.appupdatelibrary.modle.AppUpdateInfoInterface;

/**
 * Created by Vic Zhou on 2017/9/3.
 * apk 更新类
 */

public class AppUpdateInfo implements AppUpdateInfoInterface {
    /**
     * "env":"2",
     "code":"101",
     "name":"1.0.1",
     "type":"1",
     "desc":"这个版本跟新了，修复了xxxbug",
     "url":"uploads.bxvip588.com/bxvip/Uploads/apk/53e5d48822c7f8f1c007570f52ce63c0.apk"
     */
    private int env;
    private int code;
    private int type;
    private String name;
    private String url;
    private String desc;
    private String apkMd5;
    private String applicationId;


    @Override
    public int getApkEnv() {
        return env;
    }

    @Override
    public void setApkEnv(int apkEnv) {
        this.env = apkEnv;
    }

    @Override
    public int getVersionCode() {
        return code;
    }

    @Override
    public void setVersionCode(int versionCode) {
        this.code = versionCode;
    }

    @Override
    public int getApkUpdateType() {
        return type;
    }

    @Override
    public void setApkUpdateType(int apkUpdateType) {
        this.type = apkUpdateType;

    }

    @Override
    public String getVersionName() {
        return name;
    }

    @Override
    public void setVersionName(String versionName) {
        this.name = versionName;
    }

    @Override
    public String getApkUrl() {
        return url;
    }

    @Override
    public void setApkUrl(String apkUrl) {
        this.url = apkUrl;
    }

    @Override
    public String getApkDesc() {
        return desc;
    }

    @Override
    public void setApkDesc(String apkDesc) {
        this.desc = apkDesc;
    }

    @Override
    public String getApkMd5() {
        return apkMd5;
    }

    @Override
    public void setApkMd5(String apkMd5) {
        this.apkMd5 = apkMd5;
    }

    @Override
    public String getApplicationId() {
        return applicationId;
    }

    @Override
    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }

    @Override
    public String toString() {
        return "AppUpdateInfo{" +
                "env=" + env +
                ", code=" + code +
                ", type=" + type +
                ", name='" + name + '\'' +
                ", url='" + url + '\'' +
                ", desc='" + desc + '\'' +
                ", apkMd5='" + apkMd5 + '\'' +
                '}';
    }


}
