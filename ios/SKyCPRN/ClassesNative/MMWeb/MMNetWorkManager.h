//
//  MMNetWorkManager.h
//  rainbowmkyl
//
//  Created by Mike on 2017/12/13.
//  Copyright © 2017年 Facebook. All rights reserved.
//


#import "AFNetworking.h"
#import "AFHTTPSessionManager.h"


// 定义请求类型的枚举
typedef NS_ENUM(NSUInteger,HttpRequestType)
{
  
  HttpRequestTypeGet = 0,
  HttpRequestTypePost
  
};
typedef void(^requestSuccess)( NSDictionary * object);

typedef void(^requestFailure)( NSError *error);
typedef void(^uploadProgress)(float progress);
typedef void(^downloadProgress)(float progress);


@interface MMNetWorkManager : AFHTTPSessionManager

+(instancetype)shareManager;


+(void)requestWithType:(HttpRequestType)type withUrlString:(NSString *)urlString withParaments:(id)paraments withSuccessBlock:( requestSuccess)successBlock withFailureBlock:( requestFailure)failureBlock progress:(downloadProgress)progress;


@end


