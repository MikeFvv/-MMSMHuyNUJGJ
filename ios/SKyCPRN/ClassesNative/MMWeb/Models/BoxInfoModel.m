//
//
//  MwancpQuery
//
//  Created by Mike on 2017/9/28.
//  Copyright © 2017年 Mike. All rights reserved.
//

#import "BoxInfoModel.h"

@implementation BoxInfoModel


+(instancetype)friendWithDict:(NSDictionary *)dict {
  return [[self alloc] initWithDict:dict];
}

-(instancetype)initWithDict:(NSDictionary *)dict {
  
  if (dict == nil) {
    return nil;
  }
  
  if (self = [super init]) {
    self.upload_url = dict[@"upload_url"];
    self.clickhref = dict[@"clickhref"];
    self.phone_img = dict[@"phone_img"];
    self.content = dict[@"content"];
    self.send_time = dict[@"send_time"];
    self.msgtype = dict[@"msgtype"];
  }
  return self;
}

@end
