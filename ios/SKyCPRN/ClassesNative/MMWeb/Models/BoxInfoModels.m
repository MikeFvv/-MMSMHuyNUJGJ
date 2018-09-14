//
//  BoxInfoModels.m
//  MwancpQuery
//
//  Created by Mike on 2017/9/28.
//  Copyright © 2017年 Mike. All rights reserved.
//

#import "BoxInfoModels.h"
#import "BoxInfoModel.h"

@implementation BoxInfoModels

+(instancetype)friendWithDict:(NSDictionary *)dict {
  return [[self alloc] initWithDict:dict];
}

-(instancetype)initWithDict:(NSDictionary *)dict{
  if (self = [super init]) {
    
    self.msg = dict[@"msg"];
    self.param = dict[@"param"];
    self.data = [BoxInfoModel friendWithDict:dict[@"data"]];

  }
  return self;
}

@end
