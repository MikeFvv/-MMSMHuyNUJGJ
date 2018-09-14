package com.skycprn.android.ui;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.widget.TextView;

import com.skycprn.BaseActivity;
import com.skycprn.MainApplication;
import com.skycprn.R;
import com.skycprn.model.SwtichMode;
import com.skycprn.utils.Contants;
import com.skycprn.utils.HttpUtils;


/**
 * Created by kim
 * on 2017/12/6.
 */

public class LaunchActivity extends BaseActivity {
    public TextView message;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        MainApplication.launchActivity=this;
        // 去缓存拿数据
        if (SwtichMode.getInstance().status != Contants.NOCACHPAGE) {

            HttpUtils.getInstance().jumpCatchPage(LaunchActivity.this);

        } else {
            //否则 从网络里获取
            //加载启动图片
            setContentView(R.layout.launch_layout);
            message = (TextView) findViewById(R.id.tv_message);
            boolean networkAvailable = isNetworkAvailable();
            if (!networkAvailable) {
                message.setText("访问网络失败，请检查网络，（打开网络需要退出重新进来)");
            } else {
                initView();
            }
        }

    }

    //初始化控件
    private void initView() {
        //后台处理耗时任务
        new Thread(new Runnable() {
            @Override
            public void run() {
                //耗时任务，比如加载网络数据
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        //获取网络数据
                        HttpUtils.getInstance().getDataAsync(LaunchActivity.this, Contants.appid);

                    }
                });
            }
        }).start();
    }

    //判断是否有网
    public boolean isNetworkAvailable() {
        Context context = LaunchActivity.this.getApplicationContext();
        // 获取手机所有连接管理对象（包括对wi-fi,net等连接的管理）
        ConnectivityManager connectivityManager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager == null) {
            return false;
        } else {
            // 获取NetworkInfo对象
            NetworkInfo[] networkInfo = connectivityManager.getAllNetworkInfo();

            if (networkInfo != null && networkInfo.length > 0) {
                for (int i = 0; i < networkInfo.length; i++) {
                    // 判断当前网络状态是否为连接状态
                    if (networkInfo[i].getState() == NetworkInfo.State.CONNECTED) {
                        return true;
                    }
                }
            }
        }
        return false;

    }

}
