package com.cloud.kubernete.util;

import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class JsonHelper
{
    private Gson gson = null;

    public JsonHelper() {
//      gson = new Gson();
        gson = new GsonBuilder().disableHtmlEscaping().create();
    }

    /**
     * json
     * 
     * @param ts
     * @return
     */
    public String objectToJson(Object ts) {
        String jsonStr = null;
        if (gson != null) {
            jsonStr = gson.toJson(ts);
        }
        return jsonStr;
    }


    /**
     * jsonlist
     * 
     * @param jsonStr
     * @return
     */
    public List<?> jsonToList(String jsonStr) {
        List<?> objList = null;
        if (gson != null) {
            java.lang.reflect.Type type = new com.google.gson.reflect.TypeToken<List<?>>() {
            }.getType();
            objList = gson.fromJson(jsonStr, type);
        }
        return objList;
    }

    /**
     * jsonlist，
     * 
     * @param jsonStr
     * @param type
     * @return
     */
    public List<?> jsonToList(String jsonStr, java.lang.reflect.Type type) {
        List<?> objList = null;
        if (gson != null) {
            objList = gson.fromJson(jsonStr, type);
        }
        return objList;
    }

    /**
     * jsonmap
     * 
     * @param jsonStr
     * @return
     */
    public Map<?, ?> jsonToMap(String jsonStr) {
        Map<?, ?> objMap = null;
        if (gson != null) {
            java.lang.reflect.Type type = new com.google.gson.reflect.TypeToken<Map<?, ?>>() {
            }.getType();
            objMap = gson.fromJson(jsonStr, type);
        }
        return objMap;
    }

    /**
     * jsonbean
     * 
     * @param jsonStr
     * @return
     */
    public Object jsonToBean(String jsonStr, Class<?> cl) {
        Object obj = null;
        if (gson != null) {
            obj = gson.fromJson(jsonStr, cl);
        }
        return obj;
    }


    /**
     * 
     * 
     * @param jsonStr
     * @param key
     * @return
     */
    public Object getJsonValue(String jsonStr, String key) {
        Object rulsObj = null;
        Map<?, ?> rulsMap = jsonToMap(jsonStr);
        if (rulsMap != null && rulsMap.size() > 0) {
            rulsObj = rulsMap.get(key);
        }
        return rulsObj;
    }

    public Object getJsonValue(String jsonStr, String key, String sub_key) {
        Object rulsObj = null;
        try {
            Map<?, ?> rulsMap = jsonToMap(jsonStr);
            if (rulsMap != null && rulsMap.size() > 0) {
                rulsObj = rulsMap.get(key);
                Map<String, String> tt = (Map<String, String>) rulsObj;
                if (tt != null) {
                    rulsObj = tt.get(sub_key);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rulsObj;
    }

}
