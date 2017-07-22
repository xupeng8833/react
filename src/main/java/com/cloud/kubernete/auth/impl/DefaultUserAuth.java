package com.cloud.kubernete.auth.impl;

import org.springframework.stereotype.Component;

import com.cloud.kubernete.auth.AuthResult;
import com.cloud.kubernete.auth.UserAuth;
import com.cloud.kubernete.entity.CurrentUser;

@Component("defaultUserAuth")
public class DefaultUserAuth implements UserAuth {


    public AuthResult check(String path, CurrentUser user) {

        if(path.equals("/error"))
            return AuthResult.success;

        if(user==null)
        {
            return AuthResult.error("用户未登录，请刷新页面以进入登录页");
        }
        else{
            if(user.getType()==CurrentUser.TYPE_ADMIN){
                return AuthResult.success;
            }else{
                return AuthResult.error("用户权限不足，请以管理员身份登录");
            }
        }

    }
}
