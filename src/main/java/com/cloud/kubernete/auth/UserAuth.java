package com.cloud.kubernete.auth;

import com.cloud.kubernete.entity.CurrentUser;


public interface UserAuth {

    public AuthResult check(String path,CurrentUser user);
}
