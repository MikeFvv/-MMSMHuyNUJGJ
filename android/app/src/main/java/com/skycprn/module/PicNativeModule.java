package com.skycprn.module;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.AlertDialog;
import android.util.Base64;
import android.util.Log;
import android.widget.RelativeLayout;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.skycprn.utils.ImageUtils;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;

import static android.app.Activity.RESULT_OK;
import static android.text.TextUtils.isEmpty;

/**
 * Created by User on 2017/10/23.
 */

public class PicNativeModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private Context mContext;
    RelativeLayout rl;
    File cameraFile;
    public static final int REQUEST_CODE_CAMERA = 1;
    public static final int REQUEST_CODE_PICTURE = 2;
    public static final int REQUEST_CODE_CUT = 3;
    private final ReactApplicationContext reactContext;
    public static ArrayBlockingQueue<String> myBlockingQueue = new ArrayBlockingQueue<String>(1);

    //存储权限
    String permissionSave = "android.permission.WRITE_EXTERNAL_STORAGE";

    public PicNativeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        this.reactContext = reactContext;
        //必须加这个,否则ActivityEventListener的方法不会回调
        this.reactContext.addActivityEventListener(this);
    }


    @Override
    public String getName() {
        //返回的这个名字是必须的，在rn代码中需要这个名字来调用该类的方法。
        return "PicNativeModule";
    }

    // 定义了一个方法，该方法必须使用注解@ReactMethod标明，说明是RN要调用的方法。
    @ReactMethod
    public void rnCallNativePic(){

        cameraAndPic();


    }



    //发起网络请求
    @ReactMethod
    public void sendHttpRequest(final String address, final Callback successCallback,final Callback errorCallback){
        new Thread(new Runnable() {
            @Override
            public void run() {
                HttpURLConnection httpURLConnection = null;

                try {
                    URL url = new URL(address);
                    httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("GET");
                    httpURLConnection.setConnectTimeout(8000);
                    httpURLConnection.setReadTimeout(8000);
                    httpURLConnection.setDoInput(true);
                    httpURLConnection.setDoOutput(true);

                    InputStream inputStream = httpURLConnection.getInputStream();
                    // 获取到的输入流进行读取
                    BufferedReader reader = new BufferedReader(new
                            InputStreamReader(inputStream));
                    StringBuilder reponse = new StringBuilder();
                    String line;
                    while ((line =reader.readLine())!=null){
                        reponse.append(line);
                    }

                    successCallback.invoke(reponse.toString());

                } catch (Exception e) {
                    errorCallback.invoke(e.toString());
                }finally {
                    if (httpURLConnection!=null){
                        httpURLConnection.disconnect();
                    }
                }

            }
        }).start();


    }

    //打开系统权限设置
    @ReactMethod
    public void openSetting(){
        ImageUtils.goAppDetailSettingIntent(mContext);
    }


    // 保存图片到本地相册
    @ReactMethod
    public void rnSavePic(String base64,final Callback callback){
        try{
        Bitmap bitmap = null;
        if (!isEmpty(base64)) {

            //base64
            if (base64.contains("data:image")) {
                String[] arrStr = base64.split("[,]");
                if (arrStr.length > 1) {
                    bitmap = ImageUtils.base64ToBitmap(arrStr[1]);
                }
            } else {
                //url
                bitmap = ImageUtils.returnBitmap(base64);
            }
        }

             Log.d("ztf", "1");

            boolean permissionIs = ImageUtils.hasPermission(mContext, permissionSave);
            if (permissionIs){
                if (bitmap!=null){
                    boolean boo = ImageUtils.saveImageToGallery(mContext, bitmap);
                    Log.d("ztf", "4 boo: "+boo);
                    if (boo){
                        Log.d("ztf", "4.5");

                        Toast.makeText(mContext,"保存成功",Toast.LENGTH_LONG).show();
                        callback.invoke(0);

                    }else {
                        //openCallback.invoke("保存失败,您需要在设置中打开存储权限");
                        callback.invoke(1);
                    }
                }else {
                    Log.d("ztf", "5");
                    callback.invoke(2);
                }
            }else {
                //openCallback.invoke("保存失败!您需要在设置中打开存储权限");
                callback.invoke(1);
            }

        }catch (Exception e){
            Log.d("ztf", "6 e:"+e.toString());
            callback.invoke(2);
        }


    }

    private void cameraAndPic() {

        final Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            //responseHelper.invokeError(callback, "can't find current Activity");
            Log.d("ztf", "can't find current Activity");
            return;
        }

        cameraFile = new File(Environment.getExternalStorageDirectory()
                .getAbsolutePath() + "/head.jpg");
        if (!cameraFile.exists()) {
            cameraFile.getParentFile().mkdirs();
        }

        final AlertDialog.Builder normalDialog =
                new AlertDialog.Builder(currentActivity);
        normalDialog.setTitle("我是一个普通Dialog");
        normalDialog.setMessage("你要点击哪一个按钮呢?");
        normalDialog.setPositiveButton("拍照",
                new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Log.d("ztf", "点击拍照: ");

                        if (!android.os.Environment.getExternalStorageState()
                                .equals(android.os.Environment.MEDIA_MOUNTED)) {
                            Toast.makeText(mContext, "sd卡不存在", Toast.LENGTH_SHORT)
                                    .show();

                            return;
                        }
                        /*currentActivity.startActivityForResult(new Intent(
                                MediaStore.ACTION_IMAGE_CAPTURE).putExtra(
                                MediaStore.EXTRA_OUTPUT,
                                Uri.fromFile(cameraFile)), REQUEST_CODE_CAMERA);*/

                        if (Build.VERSION.SDK_INT >= 24) {
                            Intent takeIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                            takeIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraFile);
                            currentActivity.startActivityForResult(takeIntent, 1);
                        } else {
                            Intent takeIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                            takeIntent.putExtra(MediaStore.EXTRA_OUTPUT, cameraFile);
                            currentActivity.startActivityForResult(takeIntent, 1);
                        }


                    }
                });

        normalDialog.setNegativeButton("相册",
                new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        Log.d("ztf", "点击相册: ");
                        //Toast.makeText(mContext,"点击关闭",Toast.LENGTH_SHORT).show();
                        Intent intent;
                        if (Build.VERSION.SDK_INT < 19) {
                            intent = new Intent(Intent.ACTION_GET_CONTENT);
                            intent.setType("image*//*");
                        } else {
                            intent = new Intent(
                                    Intent.ACTION_PICK,
                                    android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                        }
                        currentActivity.startActivityForResult(intent, REQUEST_CODE_PICTURE);
                    }
                });
        // 显示
        normalDialog.show();

    }






    private void setPic(String path) {
        Bitmap bitmap = BitmapFactory.decodeFile(path);
        String toBase64 = bitmapToBase64(bitmap);
        Log.d("ztf", "toBase64:"+toBase64);

        //PicNativeModule.myBlockingQueue.add(toBase64);
        /*this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("toBase64",toBase64);*/

    }

    /*
     * 图片裁剪
     */
    private void cropImageUri(Activity activity,Uri uri, int outputX, int outputY,
                              int requestCode, Uri outUri) {
        Log.d("ztf", "outUri: "+outUri);
        Intent intent = new Intent("com.android.camera.action.CROP");

        intent.setDataAndType(uri, "image/*");

        intent.putExtra("crop", "true");

        intent.putExtra("aspectX", 1);

        intent.putExtra("aspectY", 1);

        intent.putExtra("outputX", outputX);

        intent.putExtra("outputY", outputY);

        intent.putExtra("scale", true);

        intent.putExtra(MediaStore.EXTRA_OUTPUT, outUri);

        intent.putExtra("return-data", false);

        intent.putExtra("outputFormat", Bitmap.CompressFormat.JPEG.toString());

        intent.putExtra("noFaceDetection", true); // no face detection

        activity.startActivityForResult(intent, requestCode);

    }

    /**
     * bitmap转为base64
     * @param bitmap
     * @return
     */
    public static String bitmapToBase64(Bitmap bitmap) {

        String result = null;
        ByteArrayOutputStream baos = null;
        try {
            if (bitmap != null) {
                baos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);

                baos.flush();
                baos.close();

                byte[] bitmapBytes = baos.toByteArray();
                result = Base64.encodeToString(bitmapBytes, Base64.DEFAULT);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (baos != null) {
                    baos.flush();
                    baos.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    //保存文件到指定路径
    public static boolean saveImageToGallery(Context context, Bitmap bmp) {
        // 首先保存图片
        String storePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "dearxy";
        File appDir = new File(storePath);
        if (!appDir.exists()) {
            appDir.mkdir();
        }
        String fileName = System.currentTimeMillis() + ".jpg";
        File file = new File(appDir, fileName);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            //通过io流的方式来压缩保存图片
            boolean isSuccess = bmp.compress(Bitmap.CompressFormat.JPEG, 60, fos);
            fos.flush();
            fos.close();

            //把文件插入到系统图库
            //MediaStore.Images.Media.insertImage(context.getContentResolver(), file.getAbsolutePath(), fileName, null);

            //保存图片后发送广播通知更新数据库
            Uri uri = Uri.fromFile(file);
            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri));
            if (isSuccess) {
                return true;
            } else {
                return false;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Log.d("ztf", "onActivityResult: requestCode:"+requestCode+" resultCode:"+resultCode);
        if (data != null){
            Log.d("ztf", "data:"+data.getData());
        }
        if (resultCode == RESULT_OK) {
            if (requestCode == REQUEST_CODE_CAMERA) { // 发送照片
                if (cameraFile != null && cameraFile.exists()) {
                    // setPic(cameraFile.getAbsolutePath());
                    cropImageUri(activity,Uri.fromFile(cameraFile), 130, 130,
                            REQUEST_CODE_CUT, Uri.fromFile(cameraFile));
                }
            } else if (requestCode == REQUEST_CODE_PICTURE) {
                if (data != null) {
                    Uri selectedImage = data.getData();
                    cropImageUri(activity,selectedImage, 130, 130, REQUEST_CODE_CUT,
                            Uri.fromFile(cameraFile));
                }
            } else if (requestCode == REQUEST_CODE_CUT) {
                if (data != null) {
                    setPic(cameraFile.getAbsolutePath());
                }
            }
        }

    }

    @Override
    public void onNewIntent(Intent intent) {

    }


    //返回头像数据
    @ReactMethod
    public void backImg(String token,String uid,String img,String url,Callback successback,Callback erroback) {

        HttpClient client = new DefaultHttpClient();
        // 创建一个Post请求
        HttpPost post = new HttpPost(url);
        // 将参数设置到Post请求里面
        List<NameValuePair> params = new ArrayList<NameValuePair>();
        params.add(new BasicNameValuePair("ac", "UploadUserHeadIconByBase64"));
        params.add(new BasicNameValuePair("token", token));
        params.add(new BasicNameValuePair("uid", uid));
        params.add(new BasicNameValuePair("img", img));
        HttpEntity entity = null;
        try {
            entity = new UrlEncodedFormEntity(params);
            post.setEntity(entity);//       执行一个Post请求
            HttpResponse response = client.execute(post);
            if (response.getStatusLine().getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                BufferedReader reader = new BufferedReader(new InputStreamReader(is));
                String resp = reader.readLine();
                JSONObject  jsonArray = new JSONObject(resp);
                int msg = jsonArray.optInt("msg");
                if ( 0 == msg){
                    String data = jsonArray.optString("data");
                    successback.invoke(data);
                }else {
                    erroback.invoke("请求错误");
                }

            }} catch(Exception e){
                e.printStackTrace();
            erroback.invoke("请求错误!");
            }

        }
    }