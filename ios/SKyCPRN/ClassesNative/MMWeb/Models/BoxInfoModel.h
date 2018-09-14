//
//  BoxInfoModel.h
//  MwancpQuery
//
//  Created by Mike on 2017/9/28.
//  Copyright © 2017年 Mike. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface BoxInfoModel : NSObject


@property (nonatomic, copy) NSString *upload_url;

@property (nonatomic, copy) NSString *clickhref;

@property (nonatomic, copy) NSString *phone_img;

@property (nonatomic, copy) NSString *content;

@property (nonatomic, copy) NSString *send_time;
@property (nonatomic, copy) NSString *msgtype;


-(instancetype)initWithDict:(NSDictionary *)dict;
+(instancetype)friendWithDict:(NSDictionary *)dict;


@end
