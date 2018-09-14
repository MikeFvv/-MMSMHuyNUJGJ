//
//  MMNetWorkManager.m
//  rainbowmkyl
//
//  Created by Mike on 2017/12/13.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "MMNetWorkManager.h"

@implementation MMNetWorkManager


+(instancetype)shareManager
{
  
  static MMNetWorkManager * manager = nil;
  
  static dispatch_once_t onceToken;
  
  dispatch_once(&onceToken, ^{
    
    manager = [[MMNetWorkManager alloc] initWithBaseURL:nil];
    
    manager.requestSerializer.timeoutInterval = 10;
    manager.requestSerializer.cachePolicy = NSURLRequestReloadIgnoringLocalCacheData;
    
    manager.requestSerializer = [AFHTTPRequestSerializer serializer];
    
    AFJSONResponseSerializer * response = [AFJSONResponseSerializer serializer];
    
    response.removesKeysWithNullValues = YES;
    
    manager.responseSerializer = response;
    
    
    [manager.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    [manager.responseSerializer setAcceptableContentTypes:[NSSet setWithObjects:@"text/plain",@"application/json",@"text/json",@"text/javascript",@"text/html", nil]];
    
  });
  
  return manager;
}




+(void)requestWithType:(HttpRequestType)type withUrlString:(NSString *)urlString withParaments:(id)paraments withSuccessBlock:(requestSuccess)successBlock withFailureBlock:(requestFailure)failureBlock progress:(downloadProgress)progress
{
  
  
  switch (type) {
      
    case HttpRequestTypeGet:
    {
      
      
      [[MMNetWorkManager shareManager] GET:urlString parameters:paraments progress:^(NSProgress * _Nonnull downloadProgress) {
        
        progress(downloadProgress.completedUnitCount / downloadProgress.totalUnitCount);
        
      } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        
        successBlock(responseObject);
        
      } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        
        failureBlock(error);
      }];
      
      break;
    }
      
    case HttpRequestTypePost:
      
    {
      
      [[MMNetWorkManager shareManager] POST:urlString parameters:paraments progress:^(NSProgress * _Nonnull uploadProgress) {
        
        progress(uploadProgress.completedUnitCount / uploadProgress.totalUnitCount);
        
        
      } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        
        successBlock(responseObject);
        
      } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        
        failureBlock(error);
        
      }];
    }
      
  }
  
}



@end
