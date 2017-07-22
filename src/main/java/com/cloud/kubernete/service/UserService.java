package com.cloud.kubernete.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.cloud.kubernete.entity.CurrentUser;
import com.cloud.kubernete.entity.Pager;
import com.cloud.kubernete.util.MD5Util;

@Service("userService")
public class UserService extends BaseService{

    @Autowired
    JdbcTemplate jdbcTemplate;

    public Map<String,Object> checkAdminLogin(String name, String password) {

        List<Map<String,Object>> users = jdbcTemplate.queryForList("select * from admin where name=?", name);
        if(users.size()==0)
            return null;
        Map<String,Object> user = users.get(0);
        if(MD5Util.MD5(password).equals(user.get("password"))){
            return user;
        }else{
            return null;
        }

    }

    public Pager listAdminPager(int page) {
        return pager(page,"select id,name,icon,mobile,role from admin where not role = 2");
    }

    public Map<String,Object> revertAdmin(int id) {
        return revert("admin", id);
    }

    public void addAdmin(JSONObject user) {
        jdbcTemplate.update("insert into admin(name,password,mobile,role) value (?,?,?,?)",
                user.get("name"), MD5Util.MD5(user.getString("password"))
                ,user.get("mobile"),user.getInteger("role"));
    }

    public void updateAdmin(JSONObject user){
        jdbcTemplate.update("update admin set name=?,mobile=?,role=? where id=?",
                user.get("name"), user.get("mobile"),user.getInteger("role"),user.getInteger("id"));
    }

    public String deleteAdmin(int id,CurrentUser currentUser) {
        Map<String,Object> user = revert("admin",id);
        if(user==null){
            return "此用户不存在";
        }
        if(user.get("role").equals("2")&&currentUser.getId()!=id){
            return "超级管理员不可以被其他人删除";
        }
        delete("admin", id);
        return null;
    }

    public String register(JSONObject user) {
        String mobile = user.getString("mobile");
        String pwd = user.getString("password");
        String name = user.getString("name");

        List<Map<String,Object>> l = jdbcTemplate.queryForList("select * from user where mobile=? and pfrom=0",mobile);
        if(l.size()>0){
            return "此手机已注册";
        }

        int people;
        jdbcTemplate.update("insert into mates_people (mobile,name,icon,pfrom,college) value(?,?,?,0,\"无\")",mobile,name,"/img/default_icon.png");
        people = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()",Integer.class);

        jdbcTemplate.update("insert into user (mobile,password,people) value (?,?,?)", mobile, MD5Util.MD5(pwd), people);

        return null;

    }

    public Map<String, Object> revertUser(int id) {
        List<Map<String,Object>> l = jdbcTemplate.queryForList("select u.*,p.name,p.icon,p.graduation,p.college,p.email,p.about from user u left join mates_people p on u.people=p.id where u.id=?", id);
        if(l.size()==0)
            return null;
        else{
            return l.get(0);
        }
    }

    public Map<String, Object> revertUser(String mobile) {
        List<Map<String,Object>> l = jdbcTemplate.queryForList("select u.*,p.name,p.icon,p.graduation,p.college,p.email,p.about from user u left join mates_people p on u.people=p.id where u.mobile=?",mobile);
        if(l.size()==0)
            return null;
        else{
            return l.get(0);
        }
    }

    public String updateNormalPwd(String mobile, String password) {
        jdbcTemplate.update("update user set password=? where mobile=?",MD5Util.MD5(password),mobile);
        return null;
    }

    public String updateNormalIcon(int people, String url) {
        jdbcTemplate.update("update mates_people set icon=? where id=?",url,people);
        return null;
    }

    public Pager queryNormalPager(int page, String searchType, String searchData) {
         return pager(page,PAGE_SIZE,
                 "select m.* from user u left join mates_people m on u.people=m.id where m."+searchType+"=?",searchData);

    }

    public String updateAdminPwd(int id, String opwd, String npwd) {
        int c = jdbcTemplate.update("update admin set password = ? where id=? and password=?",MD5Util.MD5(npwd),id,MD5Util.MD5(opwd));
        if(c > 0 ){
            return null;
        }else{
            return ("原密码输入不正确");
        }

    }
}
