package com.cloud.kubernete.web.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.cloud.kubernete.web.IngoreCheck;

@Controller
@RequestMapping("/")
public class AdminViews {

    @IngoreCheck
    @RequestMapping("login")
    public String signin(){
        return "signin.html";
    }

    @IngoreCheck
    @RequestMapping("index")
    public String login() {return "admin.html";}
}
