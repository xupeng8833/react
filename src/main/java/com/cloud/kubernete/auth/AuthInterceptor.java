package com.cloud.kubernete.auth;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import ch.qos.logback.classic.Logger;

import com.alibaba.fastjson.JSONObject;
import com.cloud.kubernete.entity.CurrentUser;
import com.cloud.kubernete.web.BaseController;
import com.cloud.kubernete.web.IngoreCheck;

/**
 * 用户权限验证
 * 根据session中的信息进行验证
 * 调用BaseController.setCurrent方法即可实现登录
 * Created by shizhida on 16/3/14.
 */
@Component("AuthInterceptor")
public class AuthInterceptor implements HandlerInterceptor {

    public static final Logger logger = (Logger) LoggerFactory.getLogger(AuthInterceptor.class);

    private UserAuth auth;


    static {
        logger.info("Auth Interceptor init!");
    }


    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object currentUser = request.getSession().getAttribute(BaseController.CURRENT_USER);

        if(handler instanceof HandlerMethod){
            HandlerMethod method = (HandlerMethod) handler;
            IngoreCheck check = method.getMethodAnnotation(IngoreCheck.class);
            String requestUri = request.getRequestURI();

            if(check!=null){
                return true;
            }else{
                AuthResult result;
                if(currentUser!=null && currentUser instanceof CurrentUser){
                    result = auth.check(requestUri, (CurrentUser) currentUser);
                }else{
                    result = auth.check(requestUri, null);
                }

                if(result.isCheck())
                    return true;
                else{
                    send(request,response,result.getMessage());
                    return false;
                }
            }
        }

        return true;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }

    /**
     * 返回登录校验错误，对于json请求返回json报错，其余直接跳转到登录页面
     * @param request
     * @param response
     * @param msg
     * @throws IOException
     */
    private void send(HttpServletRequest request,HttpServletResponse response,String msg) throws IOException {
        String accept = request.getHeader("Accept");
        if(accept!=null&&accept.contains("application/json")){
            JSONObject resp = new JSONObject();
            resp.put("state",2);
            resp.put("data",msg);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            try {
                response.getWriter().write(resp.toJSONString());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }else{
            System.out.println("sendRedirect:");
            response.sendRedirect("/login");
        }

    }


    public UserAuth getAuth() {
        return auth;
    }

    public void setAuth(UserAuth auth) {
        this.auth = auth;
    }
}
