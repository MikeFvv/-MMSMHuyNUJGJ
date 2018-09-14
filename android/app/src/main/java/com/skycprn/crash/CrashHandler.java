package com.skycprn.crash;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Environment;
import android.support.annotation.NonNull;
import android.util.Log;

import com.skycprn.BuildConfig;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

import static com.skycprn.utils.Contants.BUG_URL;

/**
 * 异常管理类
 * <p/>
 * Created by imtianx on 2016-7-10.
 */
public class CrashHandler implements Thread.UncaughtExceptionHandler {

    /**
     * 系统默认UncaughtExceptionHandler
     */
    private Thread.UncaughtExceptionHandler mDefaultHandler;

    /**
     * context
     */
    private Context mContext;

    /**
     * 存储异常和参数信息
     */
    private Map<String, String> paramsMap = new HashMap<>();

    /**
     * 格式化时间
     */
    private String TAG = this.getClass().getSimpleName();

    private String path;

    private String fileName = "crash-data.log";

    @SuppressLint("StaticFieldLeak")
    private static CrashHandler mInstance;

    private CrashHandler() {

    }

    /**
     * 获取CrashHandler实例
     */
    public static synchronized CrashHandler getInstance() {
        if (null == mInstance) {
            mInstance = new CrashHandler();
        }
        return mInstance;
    }

    public void init(Context context) {
        mContext = context;
        path = mContext.getFilesDir().getAbsolutePath() + "/crash/";
        mDefaultHandler = Thread.getDefaultUncaughtExceptionHandler();
        //设置该CrashHandler为系统默认的
        Thread.setDefaultUncaughtExceptionHandler(this);
        if(!BuildConfig.DEBUG){
            upCrashData();
        }
    }

    /**
     * uncaughtException 回调函数
     */
    @Override
    public void uncaughtException(Thread thread, Throwable ex) {
        if (!handleException(ex) && mDefaultHandler != null) {
            //如果自己没处理交给系统处理
            mDefaultHandler.uncaughtException(thread, ex);
        } else {
            //自己处理
            try {//延迟3秒杀进程
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Log.e(TAG, "error : ", e);
            }
            //退出程序
            System.exit(0);
        }
    }

    /**
     * 收集错误信息.发送到服务器
     *
     * @return 处理了该异常返回true, 否则false
     */
    private boolean handleException(Throwable ex) {
        if (ex == null) {
            return false;
        }
        //收集设备参数信息
        collectDeviceInfo(mContext);
        //添加自定义信息
        addCustomInfo();
        //保存日志文件
        saveCrashInfo2File(ex);
        return true;
    }


    /**
     * 收集设备参数信息
     *
     * @param ctx 上下文
     */
    private void collectDeviceInfo(Context ctx) {
        //获取versionName,versionCode
        try {
            PackageManager pm = ctx.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(ctx.getPackageName(), PackageManager.GET_ACTIVITIES);
            if (pi != null) {
                String versionName = pi.versionName == null ? "null" : pi.versionName;
                String versionCode = pi.versionCode + "";
                paramsMap.put("versionName", versionName);
                paramsMap.put("versionCode", versionCode);
            }
        } catch (PackageManager.NameNotFoundException e) {
            Log.e(TAG, "an error occured when collect package info", e);
        }
        //获取所有系统信息
        Field[] fields = Build.class.getDeclaredFields();
        for (Field field : fields) {
            try {
                field.setAccessible(true);
                paramsMap.put(field.getName(), field.get(null).toString());
            } catch (Exception e) {
                Log.e(TAG, "an error occured when collect crash info", e);
            }
        }
    }

    /**
     * 添加自定义参数
     */
    private void addCustomInfo() {
        Log.i(TAG, "addCustomInfo: 程序出错了...");
    }

    /**
     * 保存错误信息到文件中
     *
     * @param ex 异常
     */
    private void saveCrashInfo2File(Throwable ex) {
        String className = ex.toString();
        className = className.substring(className.indexOf("{") + 1, className.indexOf("}"));
        StringBuilder sb = new StringBuilder();
        sb.append(className+"@@@@@");
        for (Map.Entry<String, String> entry : paramsMap.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            sb.append(key).append("=").append(value).append("\n");
        }
        sb.append("@@@@@");
        Writer writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        ex.printStackTrace(printWriter);
        Throwable cause = ex.getCause();
        while (cause != null) {
            cause.printStackTrace(printWriter);
            cause = cause.getCause();
        }
        printWriter.close();
        String result = writer.toString();
        sb.append(result);
        try {
            if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {

                File dir = new File(path);
                if (!dir.exists()) {
                    if (dir.mkdirs()) Log.i(TAG, "文件夹创建成功");
                }
                FileOutputStream fos = new FileOutputStream(path + fileName);
                fos.write(sb.toString().getBytes());
                Log.i(TAG, "saveCrashInfo2File: " + sb.toString());
                fos.close();
            }
        } catch (Exception e) {
            Log.e(TAG, "an error occured while writing file...", e);
        }
    }

    /**
     * 上传异常
     */
    private void upCrashData() {
        try {
            File file = new File(path + fileName);
            if (!file.exists()) {
                return;
            }
            BufferedReader br = new BufferedReader(new FileReader(file));
            String readline;
            StringBuilder sb = new StringBuilder();
            while ((readline = br.readLine()) != null) {
                sb.append(readline);
            }
            br.close();
            netRequest(sb.toString());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 异常提交请求
     *
     * @param error 错误信息
     */
    private void netRequest(String error) {
        String[] split = error.split("@@@@@");
        if (split.length != 3) {
            return;
        }
        OkHttpClient client = new OkHttpClient();
        RequestBody body = new FormBody.Builder()
                .add("ac", "setAppLog")
                .add("full", split[1])
                .add("client_type", "2")
                .add("title", "rnandroid")
                .add("controller", split[0])
                .add("list", split[2])
                .add("level", "5")
                .add("facility", "rnandroid")
                .build();
        Request request = new Request.Builder()
                .url(BUG_URL)
                .post(body)
                .build();
        client.newCall(request).enqueue(new Callback() {

            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                Log.d("数据下来-错误", e.getMessage());
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                if (response.isSuccessful()) {
                    ResponseBody body = response.body();
                    if (body != null) {
                        String data = body.string();
                        Log.d("数据下来", data);
                        File file = new File(path + fileName);
                        if (file.exists()) {
                            if (file.delete()) Log.i(TAG, "文件删除成功");
                        }
                    }
                }
            }
        });
    }
}