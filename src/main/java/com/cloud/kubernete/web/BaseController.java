package com.cloud.kubernete.web;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


import com.alibaba.fastjson.JSONObject;
import com.cloud.kubernete.entity.CurrentUser;

public class BaseController {

    public static final boolean useJsonp = false;
    public static final String JSONP_FUNC = "xoCallback";
    public static final String CURRENT_USER = "current_user";

    private void render(HttpServletResponse response,String data){
        if(useJsonp){
            data = JSONP_FUNC+"("+data+")";
        }
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try {
            response.getWriter().write(data);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 对于需要数据的操作的返回，当数据为null时失败
     * @param response
     * @param data
     */
    protected void renderJson(HttpServletResponse response,Object data){

        if(data == null){
            renderFail(response,"服务器找不到数据");
            return;
        }

        JSONObject wrapper = new JSONObject();
        wrapper.put("state",0);
        wrapper.put("data", data);
        render(response, wrapper.toJSONString());

    }

    /**
     * 报错并返回错误信息
     * @param response
     * @param msg
     */
    protected void renderFail(HttpServletResponse response,String msg){
        JSONObject wrapper = new JSONObject();
        wrapper.put("state",1);
        wrapper.put("data", msg);
        render(response, wrapper.toJSONString());
    }

    /**
     * 正确返回，附带消息
     * @param response
     * @param msg
     */
    protected void renderSuccess(HttpServletResponse response,String msg){
        JSONObject wrapper = new JSONObject();
        wrapper.put("state",0);
        wrapper.put("data",msg);
        render(response, wrapper.toJSONString());
    }

    /**
     * 对于增删等不需要数据的操作返回，当msg为null时为成功
     * @param response
     * @param msg
     */
    protected void renderUpdate(HttpServletResponse response,String msg){
        if(msg!=null){
            renderFail(response,msg);
        }else{
            renderJson(response,"成功修改");
        }
    }

    /**
     * 获取当前登录的用户信息
     * @param request
     * @return
     */
    protected CurrentUser currentUser(HttpServletRequest request){
        return currentUser(request.getSession());
    }
    protected CurrentUser currentUser(HttpSession session){
        CurrentUser user = (CurrentUser) session.getAttribute(CURRENT_USER);
        return user;
    }

    /**
     * 设置当前登录的用户(登录）
     * @param cu
     * @param request
     */
    protected void setCurrentUser(CurrentUser cu,HttpServletRequest request){
        setCurrentUser(cu,request.getSession());
    }

    protected void setCurrentUser(CurrentUser cu,HttpSession session){
        session.setAttribute(CURRENT_USER, cu);
    }

    /**
     * 移除当前登录的用户（登出）
     * @param request
     */
    protected void removeCurrentUser(HttpServletRequest request){
        removeCurrentUser(request.getSession());
    }
    protected void removeCurrentUser(HttpSession session){
        session.removeAttribute(CURRENT_USER);
    }
}
