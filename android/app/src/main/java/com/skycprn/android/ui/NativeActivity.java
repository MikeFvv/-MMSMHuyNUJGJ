package com.skycprn.android.ui;
import android.app.Activity;
import android.os.Bundle;

import com.skycprn.MainApplication;

/**
 * Created by kim
 * on 2017/11/30.
 */

public class NativeActivity extends Activity {
     @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
         MainApplication.nativeActivity=this;
        setContentView(com.skycprn.R.layout.androidmain_layout);
    }
}
