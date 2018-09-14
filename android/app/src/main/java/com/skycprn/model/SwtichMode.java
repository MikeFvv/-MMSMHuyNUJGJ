package com.skycprn.model;

/**
 * Created by kim
 * on 2017/12/5.
 * 网络模型
 */

public class SwtichMode {
    public static SwtichMode instance;
    public static SwtichMode getInstance() {
        synchronized (SwtichMode.class) {
            if (instance == null) {
                instance = new SwtichMode();
            }
        }
        return instance;
    }

    public String id;//:"18",
                public String appid;//:"adsf",
                public String plat;//:"2",
                public String code_key;//:"asdfa",
                public String ji_push_key;//:"sdfa",
                public String status="-1";//":"2",
                public String channel;//:"",
                public String time;//":"1512442531",
                public String yezhu_name;//:"188彩票",
                public String website;//":"188cai"
                public String web_url;//":"188cai"



}
