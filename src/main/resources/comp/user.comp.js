/**
 * Created by shizhida on 16/7/7.
 */

import React from 'react';
import {SmartBox,DataTable,Pager,Modal,SearchLabel} from './framework/adminUIComponents.js';
import { hashHistory } from 'react-router'
import { xget,xpost } from './framework/commonUtils.js'

export class UpdateAdminPassword extends React.Component {
    /**
     * 数据初次加载，及相关初始化处理
     */
    componentDidMount() {
    }
    constructor(props){
        super(props);
        this.state =  {
            opwd: "",
            npwd: ""
        }
    }

    doAction(){
        xpost("/user/admin/updatepwd",this.state,function(){
            alert("您已经成功修改密码");
            hashHistory.push("/");
        })
    }
    inputHolder(e){
        var name = e.target.name;
        var update = {};
        update[name] = e.target.value;
        this.setState(update);
    }

    render (){

        return (
            <SmartBox title="修改密码" index={["用户管理","修改密码"]}>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="opwd" className="col-lg-1 control-label">旧密码</label>
                        <div className="col-lg-11">
                            <input type="password" className="form-control" id="opwd" name="opwd"
                                   value={this.state.opwd} onChange={this.inputHolder.bind(this)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="npwd" className="col-lg-1 control-label">新密码</label>
                        <div className="col-lg-11">
                            <input type="password" className="form-control" id="npwd" name="npwd"
                                   value={this.state.npwd} onChange={this.inputHolder.bind(this)}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-lg-offset-2 col-lg-10">
                            <button type="button" className="btn btn-success btn-sm" onClick={this.doAction.bind(this)}>提交</button>
                        </div>
                    </div>
                </form>
            </SmartBox>
        )
    }
}

export class AddOrUpdateAdminUser extends React.Component {
    /**
     * 数据初次加载，及相关初始化处理
     */
    componentDidMount() {
        this.loadPage();
    }

    loadPage (){
        if(this.props.params.id!=null){
            xget("/user/admin/get?id="+this.props.params.id,function(data){
                console.log(data);
                this.setState({user:data})
            }.bind(this))
        }
    }

    constructor(props){
        super(props);
        this.state =  {
            user:{role:0}
        }
    }
    doAction(){
        var mobiletest = /^1(3[0-9]|4[57]|5[0-35-9]|7[01678]|8[0-9])\\d{8}$/;
        var user = this.state.user;
        if(user.name==null){
            alert("用户名不能为空");
            return;
        }
        if(!this.props.params.id)
        if((user.password==null||user.password.length<6)){
            alert("密码不可小于六位数");
            return;
        }
        if(this.props.params.id!=null){
            user.id = this.props.params.id;
            xpost("/user/admin/update",user,function(){
                alert("成功修改用户信息");
                hashHistory.push("/user/admin");
            })
        }else{
            xpost("/user/admin/add",user,function(){
                alert("成功添加用户");
                hashHistory.push("/user/admin");
            })
        }

    }

    inputHolder(e){
        var name = e.target.name;
        var update = this.state.user||{};
        update[name] = e.target.value;
        this.setState({user:update});
    }
    render (){

        var pwd = (
            <div className="form-group">
                <label htmlFor="gameid" className="col-lg-1 control-label">密码</label>
                <div className="col-lg-11">
                    <input type="text" className="form-control" id="password" name="password"
                           value={this.state.user.password} onChange={this.inputHolder.bind(this)}/>
                </div>
            </div>
        )
        if(this.props.params.id){
            pwd = null;
        }

        return (
            <SmartBox title="用户信息" index={["用户管理","增加或修改管理员"]}
                      option={{
                      reload:this.loadPage.bind(this)
                      }}>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="name" className="col-lg-1 control-label">账户</label>
                        <div className="col-lg-11">
                            <input type="text" className="form-control" id="name" name="name"
                                   value={this.state.user.name} onChange={this.inputHolder.bind(this)}/>
                        </div>
                    </div>
                    {pwd}
                    <div className="form-group">
                        <label htmlFor="mobile" className="col-lg-1 control-label">手机</label>
                        <div className="col-lg-11">
                            <input type="text" className="form-control" id="mobile" name="mobile"
                                   value={this.state.user.mobile} onChange={this.inputHolder.bind(this)}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="role" className="col-lg-1 control-label">角色</label>
                        <div className="col-lg-11">
                            <select name="role" id="role" value={this.state.user.role} onChange={this.inputHolder.bind(this)}>
                                <option value="0">普通管理员</option>
                                <option value="1">俱乐部管理员</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-lg-offset-2 col-lg-10">
                            <button type="button" className="btn btn-success btn-sm" onClick={this.doAction.bind(this)}>提交</button>
                        </div>
                    </div>
                </form>
            </SmartBox>
        )
    }
}

/**
 * 管理员列表
 */
export class AdminUserList extends React.Component{

    /**
     * 数据初次加载，及相关初始化处理
     */
    componentDidMount() {
        this.loadPage();
    }

    /**
     * 通过ajax加载页面信息
     * @param page
     */
    loadPage (page){
        var url = "/user/admin/list";
        if(typeof page == "number")
            url+="?page="+page;
        else url+="?page="+this.state.last;
        xget(url, function (data) {
            console.log(data);
            this.setState({data:data.rows,pagecount:data.pagecount,last:data.last});
        }.bind(this));
    }

    /**
     * 构造方法，初始化state等工作。
     * @param props
     */
    constructor(props){
        super(props);
        this.state =  {
            pagecount:1, //记录总页数
            last:1, //记录当前页数
            data: [], //存储数据
            //为DataTable提供映射表
            index: [
                {name: "id", col: "id"},//name：表头名，col：对应字段名称或处理方法
                {name: "用户名", col: "name"},
                {name: "手机号", col: "mobile"},
                {name: "角色", col: function(item){
                    switch(item.role){
                        case 0:return "普通管理员";
                        case 1:return "俱乐部管理员";
                        case 2:return "超级管理员";

                    }
                }},
            ],
            //为DataTable每一行增加的处理按钮
            buttons: [
                {name:"删除",onclick:function(item){
                    if(confirm("确认要删除此用户？")){
                        xget("/user/admin/delete?id="+item.id,function(){
                            this.loadPage();
                        }.bind(this))
                    }
                }.bind(this)},
                {name:"修改",onclick:function(item){
                    hashHistory.push("/user/admin/update/"+item.id);
                }.bind(this)}

            ]
        }
    }
    render (){

        return (
            <SmartBox title="用户信息列表" index={["用户管理","管理员列表"]}
                      option={{
                      reload:this.loadPage.bind(this),add:"/user/admin/add"
                      }}>
                <DataTable index={this.state.index} data={this.state.data} buttons={this.state.buttons}/>
                <Pager pagecount={this.state.pagecount} last={this.state.last} callback={this.loadPage.bind(this)} />
             </SmartBox>
        )
    }
};
