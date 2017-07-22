/**
 *
 * Created by shizhida on 16/6/17.
 */

Commons = {};

(function(){

    /**
     * 事件驱动
     * @constructor
     */
    Commons.EventDriver = (function(){

        var regtable = {};

        this.register = function(event,callback){
            var reciverlist = regtable[event]||[];
            reciverlist.push(callback);
            regtable[event] = reciverlist;
        };

        this.unregister = function(event,callback){
            var reciverlist = regtable[event]||[];
            var mark = -1;
            for(var i=0;i<reciverlist;i++){
                if(reciverlist[i]==callback){
                    mark = i;
                    break;
                }
            }
            if(mark!=-1){
                reciverlist.splice(mark,1);
            }
        };

        this.send = function(event,props){
            var reciverlist = regtable[event];
            console.log("call this");
            if(reciverlist){
                for(var i=0;i<reciverlist.length;i++){
                    reciverlist[i](props);
                }
            }
        };
        return this;
    }());


}());

