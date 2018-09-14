package com.skycprn.web.ui;

import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.skycprn.R;
import com.skycprn.WebViewBaseActivity;
import com.skycprn.model.SwtichMode;
import com.skycprn.utils.IsNetWorkAvailable;

/**
 *  author kim
 *  web 加载界面
 */

public class WebViewActivity extends WebViewBaseActivity {

    WebView mWebview;
    WebSettings mWebSettings;
    TextView tv_title;
    ProgressBar progress_bar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web_view);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            Window window = getWindow();
            // Translucent status bar
            window.setFlags(
                    WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS,
                    WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            // Translucent navigation bar
            window.setFlags(
                    WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION,
                    WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
        }

        mWebview = (WebView) findViewById(R.id.webview);
        progress_bar = (ProgressBar) findViewById(R.id.progress_bar);

        mWebSettings = mWebview.getSettings();
        if (IsNetWorkAvailable.isNetworkAvailable(WebViewActivity.this.getApplicationContext())) {
            mWebSettings.setCacheMode(WebSettings.LOAD_DEFAULT);//根据cache-control决定是否从网络上取数据。
        } else {
            mWebSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);//没网，则从本地获取，即离线加载
        }
        mWebSettings.setJavaScriptEnabled(true);
        //mWebSettings.setPluginsEnabled(true);
        mWebSettings.setJavaScriptCanOpenWindowsAutomatically(true); //支持通过JS打开新窗口
        mWebSettings.setDefaultTextEncodingName("utf-8");//设置编码格式
        mWebSettings.setLoadsImagesAutomatically(true); //支持自动加载图片

        if(!SwtichMode.getInstance().web_url.isEmpty()){
           // System.out.println("url"+SwtichMode.getInstance().web_url);
            if(!SwtichMode.getInstance().web_url.startsWith("http")){

                mWebview.loadUrl("http://"+SwtichMode.getInstance().web_url);
            }else {

                mWebview.loadUrl(SwtichMode.getInstance().web_url);

            }

        }

        //覆盖WebView默认使用第三方或系统默认浏览器打开网页的行为，使网页用WebView打开
        mWebview.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // TODO Auto-generated method stub
                //返回值是true的时候控制去WebView打开，为false调用系统浏览器或第三方浏览器
                view.loadUrl(url);
                return true;
            }


        });

        mWebview.setWebChromeClient(new WebChromeClient() {

            //获取加载进度
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    String progress = newProgress + "%";
                    progress_bar.setVisibility(View.VISIBLE);
                    progress_bar.setProgress(newProgress);
                } else if (newProgress == 100) {
                    String progress = newProgress + "%";
                    progress_bar.setVisibility(View.GONE);
                    //  loading.setText(progress);
                }
            }


        });



    }

    //销毁Webview
    @Override
    protected void onDestroy() {
        if (mWebview != null) {
            mWebview.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
            mWebview.clearHistory();

            ((ViewGroup) mWebview.getParent()).removeView(mWebview);
            mWebview.destroy();
            mWebview = null;
        }
        super.onDestroy();
    }
}
