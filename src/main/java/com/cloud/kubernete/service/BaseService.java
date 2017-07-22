package com.cloud.kubernete.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.cloud.kubernete.entity.Pager;

public class BaseService {

    public static final int PAGE_SIZE = 10;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    protected Pager pager(int page,String sql,Object... params){
        return pager(page,PAGE_SIZE,sql,params);
    }

    /**
     * 分页查询
     * @param page
     * @param sql
     * @param params
     * @return
     */
    protected Pager pager (int page,int size,String sql,Object... params){

        //拼装分页查询参数列表
        Object[] wrapperParams = new Object[params.length+2];
        System.arraycopy(params,0,wrapperParams,0,params.length);
        wrapperParams[params.length] = (page-1)*size;
        wrapperParams[params.length+1] = size;

        List<Map<String,Object>> data =
                jdbcTemplate.queryForList(sql+" limit ?,?",wrapperParams);
        long count = jdbcTemplate.queryForObject("select count(*) from ("+sql+") d", Long.class,params);

        Pager pager = new Pager();
        pager.setLast(page);
        pager.setPagecount((int)(count/size)+1);
        pager.setRows(data);
        return pager;
    }

    /**
     * 根据id获取单个数据
     * @param table
     * @param id
     * @return
     */
    protected Map<String,Object> revert (String table,Object id){
        List<Map<String,Object>> data = jdbcTemplate.queryForList("select * from "+table+" where id=?",id);
        if(data.size()>0)
            return data.get(0);
        else
            return null;
    }

    protected void delete (String table,int id){
        jdbcTemplate.update("delete from "+table+" where id=?",id);
    }


    protected boolean nullcheck(String data){
        return data==null || "".equals(data);
    }

}
