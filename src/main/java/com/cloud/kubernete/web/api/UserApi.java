package com.cloud.kubernete.web.api;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.alibaba.fastjson.JSONObject;
import com.cloud.kubernete.entity.CurrentUser;
import com.cloud.kubernete.entity.Pager;
import com.cloud.kubernete.service.UserService;
import com.cloud.kubernete.web.BaseController;
import com.cloud.kubernete.web.IngoreCheck;

@RequestMapping("/user/")
@Controller
public class UserApi extends BaseController {


    @Autowired
    UserService userService;

    @IngoreCheck
    @RequestMapping("current")
    public void current(HttpServletRequest req,HttpServletResponse resp){
        renderJson(resp,currentUser(req));
    }


    @IngoreCheck
    @RequestMapping("admin/login")
    public void adminLogin (@RequestParam String name,@RequestParam String password,HttpServletResponse response,
                            HttpSession session){
        Map<String, Object> user = userService.checkAdminLogin(name, password);

        if(user == null){
            renderFail(response,"登录失败");
        }else{
            CurrentUser cu = new CurrentUser();
            cu.setIcon("");
            cu.setId((Integer) user.get("id"));
            cu.setRole((Integer) user.get("role"));
            cu.setType(CurrentUser.TYPE_ADMIN);
            cu.setName((String) user.get("name"));
            setCurrentUser(cu,session);
            renderJson(response, "登录成功");
        }
    }

    @RequestMapping("admin/list")
    public void adminList (@RequestParam int page,HttpServletResponse response){
        Pager users = userService.listAdminPager(page);
        renderJson(response,users);
    }

    @RequestMapping("admin/get")
    public void getAdmin (@RequestParam int id,HttpServletResponse resp){
        Map<String,Object> user = userService.revertAdmin(id);
        renderJson(resp,user);
    }

    @RequestMapping("admin/add")
    public void addAdmin (@RequestBody JSONObject user,HttpServletResponse resp){
        String name = user.getString("name");
        String password = user.getString("password");
        String mobile = user.getString("mobile");
        if(name==null||password==null||mobile==null){
            renderFail(resp,"参数不能为空");
            return;
        }
        if(password.length()<6){
            renderFail(resp,"密码长度至少为六位");
            return;
        }
        userService.addAdmin(user);
        renderJson(resp,"成功添加管理员");
    }

    @RequestMapping("admin/update")
    public void updateAdmin (@RequestBody JSONObject user,HttpServletResponse resp){
        String name = user.getString("name");
        String mobile = user.getString("mobile");
        if(name==null||mobile==null){
            renderFail(resp,"参数不能为空");
            return;
        }
        userService.updateAdmin(user);
        renderJson(resp,"成功修改管理员");
    }

    @RequestMapping("admin/updatepwd")
    public void updateAdminPwd (@RequestBody JSONObject fuck, HttpServletResponse response,HttpSession session){
        int id = currentUser(session).getId();
        String opwd = fuck.getString("opwd");
        String npwd = fuck.getString("npwd");

        String result = userService.updateAdminPwd(id,opwd,npwd);

        if(result==null){
            renderJson(response,"成功修改密码");
        }
        else{
            renderFail(response,result);
        }

    }


    @RequestMapping("admin/delete")
    public void deleteAdmin(@RequestParam int id,HttpServletRequest request,HttpServletResponse resp){
        String result = userService.deleteAdmin(id, currentUser(request));
        if(result!=null){
            renderFail(resp,result);
            return;
        }
        renderJson(resp, "成功删除管理员");
    }

    @IngoreCheck
    @RequestMapping("logout")
    public void logout(HttpServletRequest request,HttpServletResponse response){
//        CurrentUser currentUser = currentUser(request);
        removeCurrentUser(request);
        try {
            response.sendRedirect("/login");
            return;
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



}