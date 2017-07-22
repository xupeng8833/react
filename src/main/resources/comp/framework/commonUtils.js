/**
 *
 * Created by shizhida on 16/7/28.
 */
const isJsonp = false;
const jsonpCallback = "xoCallback";
const serverDomain = "http://localhost:8080/";

export function checkAllMatch(mapper,data){
    for(key in mapper){
        var func = mapper[key];
        if(func!=null){
            switch(func){
                case "password": if(!checkPassword(data[key])) return false;
                case "email": if(!checkEmail(data[key])) return false;
                case "length": if(!checkEmail(data[key])) return false;
                case "mobile": if(!checkEmail(data[key])) return false;
            }
        }
    }
    return true;
}

export function checkPassword(pwd){
    var exp = /^[a-zA-Z]\w{5,17}$/
    return exp.exec(pwd);
}

export function checkEmail(email){
    var check= /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
    return check.test(email);
}
export function checkLength(v,start,end){
    return v.length<end&&v.length>start
}
export function checkMobile(mobile){
    var exp = /^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9])\d{8}$/;
    return exp.test(mobile)
}
export function ajax (config){
  if(isJsonp){
    config.dataType = "jsonp"
    config.jsonpCallback= jsonpCallback;
    config.url = serverDomain+config.url;
  }
  $.ajax(config);
}

export function xget (url,callback){

    var config = {
        url:url,
        type: "get",
        timeout: 5000,
        dataType : 'json',
        success  : function(data) {
            if(typeof callback == "function"){
                if(data.state==0){
                    callback(data.data);
                }else if(data.state==2){
                    window.location.href="/login";
                }else{
                    alert(data.data)
                }
            }
            else{
                alert("调用错误");
            }
        },
        error : function(a,status) {
            if(status=='timeout'){//超时,status还有success,error等值的情况
                alert("网络连接超时");
                return;
            }
            alert('xget:网络连接失败或服务器错误，请稍后再试 ->'+status);
        },
    }


    ajax(config);

}

export function xpost (url,data,callback){

    var config = {
        url:url,
        type: "post",
        contentType:"application/json",
        data: JSON.stringify(data),
        timeout:5000,
        dataType : 'json',
        success  : function(data) {
            if(typeof callback == "function"){
                if(data.state==0){
                    callback(data.data);
                }else if(data.state==2){
                    window.location.href="/login";
                }else{
                    console.log(data);
                    alert(data.data)
                }
            }
            else{
                alert("调用错误");
            }
        },
        error : function(a,status) {
            if(status=='timeout'){//超时,status还有success,error等值的情况
                alert("网络连接超时");
                return;
            }
            alert('xpost:网络连接失败或服务器错误，请稍后再试 ->'+status);
        },

    }

    ajax(config);

}

export function transTimestamp(time){
    var d = new Date();
    d.setTime(time);
    return d.getYear()+1900+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes();
}
