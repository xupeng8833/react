/**
 * Created by shizhida on 16/7/7.
 */

import React from 'react';
import { Router, Route, Link,browserHistory,hashHistory } from 'react-router'
/**
 * 基本外包装组件
 * 需要传入：
 * option : 可选按钮，
 *      包括：reload ：function()刷新，
 *          add ：function()/url添加
 * title : 标题
 * index : 导航
  */
export class SmartBox extends React.Component{

    render (){
        var options = [];
        if(this.props.option){
            if(this.props.option.reload){
                options.push(
                    <a key="smart-box-btn-reload" className="widget-refresh-option" onClick={this.props.option.reload}>
                        <i className="fa fa-refresh"></i>
                    </a>
                )
            }
            if(this.props.option.add){
                if(typeof add == "function"){
                    options.push(
                        <a key="smart-box-btn-add" onClick={this.props.option.add}>
                            <i className="fa fa-plus"></i>
                        </a>
                    )
                }else{
                    options.push(
                        <Link key="smart-box-btn-add" to={this.props.option.add}>
                            <i className="fa fa-plus"></i>
                        </Link>
                    )
                }
            }
        }
        var indexs = [];
        for(var i=0;i<this.props.index.length;i++){

                indexs.push(
                    <li key={"smart-box-index-lv"+i}>{this.props.index[i]}</li>
                )

        }
        return (
            <div className="padding-md">
                <ol className="breadcrumb">{indexs}</ol>
                <div className="smart-widget">
                    <div className="smart-widget-header">
                        {this.props.title}
                        <span className="smart-widget-option">
								<span className="refresh-icon-animated">
									<i className="fa fa-circle-o-notch fa-spin"></i>
								</span>
                            {options}
                        </span>
                    </div>
                    <div className="smart-widget-inner">
                        <div className="smart-widget-body">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


/**
 * 数据表
 * 传入数据：
 * data:数据列表如 [{key:value},{key:value}]
 * index:表头索引如：
 *      [{name:"id",col:"id"},{name:"compute",col: function (data){... return compute}}]
 * buttons:操作按钮如：
 *      [{name:"button",onclick: function(item){do something with data...}}]
 */
export class DataTable extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            data: this.props.data,
            index: this.props.index,
            buttons: this.props.buttons
        }
    }
    componentWillReceiveProps (props){
        this.setState({
            data: props.data,
            index: props.index,
            buttons: props.buttons
        })
    }

    btnonclick (dataindex,buttonindex){
        var data = this.state.data[dataindex];
        var btn = this.state.buttons[buttonindex];
        btn.onclick(data);
    }

    render (){

        var th = [];
        var col = [];
        //组装表头
        for(var i=0;i<this.state.index.length;i++){
            th.push(<th key={"table-th-"+i}>{this.state.index[i].name}</th>);
            col.push(this.state.index[i].col)
        }
        //按钮空位
        th.push(<th key={"table-th-button"}></th>);
        var maxwidth = 1000/this.state.index.length
        //组装数据
        var row = [];
        for(var i=0;i<this.state.data.length;i++){
            var ds = [];
            var data = this.state.data[i];
            for(var j=0;j<this.state.index.length;j++){
                //判断获取索引是方法还是变量
                if(typeof col[j] == "function"){
                    ds.push(
                        <td key={"table-td-"+j} style={{maxWidth:maxwidth+"px"}}>{col[j](data)}</td>
                    )
                }else{
                    ds.push(
                        <td key={"table-td-"+j} style={{maxWidth:maxwidth+"px"}}>{data[col[j]]}</td>
                    )
                }
            }
            var btns = [];
            for(var j=0;j<this.state.buttons.length;j++){
                btns.push(
                        <button type="button" key={"table-btn-"+j}
                                className="btn btn-info btn-xs"
                                onClick={this.btnonclick.bind(this,i,j)}>{this.state.buttons[j].name}</button>
                )
            }
            ds.push(<td key={"table-td-buttons"} style={{maxWidth:maxwidth+"px"}}>{btns}</td>);
            row.push(<tr key={"table-tr-"+i}>{ds}</tr>);
        }

        var table = (
            <table className="table table-striped" id="dataTable">
                <thead>
                <tr>
                    {th}
                </tr>
                </thead>
                <tbody>
                {row}
                </tbody>
            </table>
        );
        return table

    }
};

/**
 * 分页组件
 * 需要传入：
 * pagecount 总数
 * last 当前页数
 * callback 回调更新的方法 function(page){ update data ...}
 */
export class Pager extends React.Component{

    callback(page) {
        this.props.callback(page);
    }
    render () {

        var pagecount = [];

        var start = (this.props.last - 5) > 0 ? (this.props.last - 5) : 1;

        var end = (this.props.last + 5) <= this.props.pagecount ? (this.props.last + 5) : this.props.pagecount;
        for (var i = start; i <= end; i++) {
            if (i != this.props.last) {
                pagecount.push(
                    <li key={"page-"+i}><a  onClick={this.callback.bind(this,i)}>{i}</a></li>
                )
            } else {
                pagecount.push(
                    <li key={"page-"+i} className="active"><a  onClick={this.callback.bind(this,i)}>{i}</a></li>
                )
            }
        }
        var pager = (
            <div >
                <ul className="pagination pagination-sm">
                    <li><a
                           onClick={this.callback.bind(this,this.props.last>1?this.props.last-1:1)}>&laquo;</a></li>
                    {pagecount}
                    <li><a
                           onClick={this.callback.bind(this,this.props.last<this.props.pagecount?this.props.last+1:this.props.pagecount)}>&raquo;</a></li>
                </ul>
            </div> );

        return pager;
    }
};

/**
 * 更新/上传图片组件
 * 需要输入：
 * title : 字符串 标题
 * url : 可选，默认图片url
 * onChange : 用于回调通知图片更改的回调方法，传入url参数：function(url){... do something change value}
 */
export class ImageUpdate extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            url: this.props.url
        }
    }
    componentWillReceiveProps (props){
        this.setState({
            url: props.url,
        })
    }

    choice () {
        this.refs.fileinput.click()
    }

    upload (){
        var fileObj = this.refs.fileinput.files[0];

        if(fileObj==null){
            this.setState({url:null},function(){
                this.props.onChange(null);
            }.bind(this));
            return;
        }

        var formData = new FormData();
        formData.append("file",fileObj);

        //TODO 此处使用独立文件服务器，不与本程序挂钩
        var config = {
            //url: "http://123.206.43.110:1179/upload",
            url: this.props.action,
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (returndata) {
                var imgurl = "http://123.206.43.110:1179"+returndata.data;
                this.setState({url:imgurl},function(){
                    this.props.onChange(imgurl);
                }.bind(this));
            }.bind(this),
            error: function (a,b,c) {
                console.log(a);
                console.log(b);
                console.log(c);
                alert(a.statusText);
            }
        }

        //if(config.url.substring(0,4) == "http"){
        //config.dataType = "jsonp"
        //config.jsonpCallback= "xoCallback";
        //}

        $.ajax(config);
    }

    render (){

        return (
            <div className="form-group" style={{height:"150px"}}>
                <label className="col-lg-1 control-label">{this.props.title}</label>
                <div className="col-lg-4">
                    <button type="button" href="#" onClick={this.choice.bind(this)}
                       style={{height:"150px",width:"150px",border:"solid #DDD 1px",backgroundColor:"white"}}>
                        <img src={this.state.url}/>
                    </button>
                </div>
                <div className="col-lg-6">
                        <input ref="fileinput" type="file" style={{display:"none"}} onChange={this.upload.bind(this)}/>
                </div>
            </div>
        )
    }

}
/**
 * 独立按钮的图片上传组件
 * 需要输入：
 * title : 字符串 按钮文本
 * url : 可选，默认图片url
 * onChange : 用于回调通知图片更改的回调方法，传入url参数：function(url){... do something change value}
 * action : 上传接口
 * auto ： 是否可以重复上传
 */
export class SingleButtonImageUploader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            url: this.props.url
        }
    }
    componentWillReceiveProps (props){
        this.setState({
            url: props.url,
        })
    }

    choice () {
        this.refs.fileinput.click()
    }

    upload (){
        var fileObj = this.refs.fileinput.files[0];

        if(fileObj==null){
            this.setState({url:null},function(){
                this.props.onChange(null);
            }.bind(this));
            return;
        }
        var formData = new FormData();
        formData.append("file",fileObj);

        $.ajax({
            //url: "http://123.206.43.110:1179/upload",
            url: this.props.action,
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (returndata) {
                var imgurl = "http://123.206.43.110:1179"+returndata.data;
                var t = "上传成功";
                if(this.props.auto){
                    t = this.props.title;
                    this.refs.fileinput.value=null;
                }
                this.setState({url:imgurl,title:t},function(){
                    this.props.onChange(imgurl);
                }.bind(this));
            }.bind(this),
            error: function (a,b,c) {
                alert(a.statusText);
            }
        });
    }

    render (){

        return (
            <div className="form-group" >
                <button className="btn btn-default marginTB-xs" type="button" href="#" onClick={this.choice.bind(this)}>
                    {this.props.title}
                </button>
                <div className="col-lg-6">
                    <input ref="fileinput" type="file" style={{display:"none"}} onChange={this.upload.bind(this)}/>
                </div>
            </div>
        )
    }
}

/**
 * 标准模态框
 * 传入：
 * id - 用于唯一标记的id字段
 * btns - 如[{title:"按钮",onclick:function(){...}}]
 * title - 标题
 *
 */
export class Modal extends React.Component {

    render (){

        var btns = [];
        if(this.props.btns){
            for(var i=0;i<this.props.btns.length;i++){
                var b = this.props.btns[i];
                btns.push(
                    <button type="button" className="btn btn-primary" onClick={b.onclick}>{b.title}</button>
                )
            }
        }

        return (
            <div className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby={"label"+this.props.id}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id={"label"+this.props.id}>{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            {btns}
                            <button type="button" className="btn btn-default" data-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 * 下拉可选的输入框
 * 所需参数：
 *
 * pkey : 全局唯一key
 * title : 标题
 * data/dataurl : data如[""]型待选，dataurl为get接口，请求[""]型待选数据
 * onChange : function 回调
 * inputable : boolean 是否接受输入参数，若为否，则对不在待选列表中的输入结果置为空
 */
export class SelectableInput extends React.Component{

    constructor (props){
        super(props);
        this.state={
            value:null,
            opts:[]
        }
    }

    componentDidMount(){
        if(this.props.data){
            this.setState({opts:this.props.data});
        }else{
            if(!this.props.dataurl){
                console.log("缺少必要的数据来源，请填写data或dataurl")
            }else{
                xget(this.props.dataurl,function(data){
                    var opts = [];
                    for(var i=0;i<data.length;i++){
                        opts.push(data[i].name);
                    }
                    this.setState({opts:opts})
                }.bind(this))
            }
        }
    }

    valueHolder(e){
        this.setState({value:e.target.value})
    }

    blurHolder(e){
        var v = e.target.value;
        var check = false;
        for(var i=0;i<this.state.opts.length;i++){
            if(v==this.state.opts[i]){
                check = true;
                break;
            }
        }
        var inputable = this.props.inputable || false;
        if(inputable||check){
            this.setState({value:v},function(){
                if(typeof this.props.onChange == 'function')
                    this.props.onChange(this.props.pkey,v);
                else{
                    console.log(this.props.onChange)
                }
            })
        }
    }

    render () {

        var options = [];
        for(var i=0;i<this.state.opts.length;i++){
            options.push(<option key={"opt_key_"+i}>{this.state.opts[i]}</option>);
        }
        return (
            <div className="form-group row" >
                <label className="col-lg-2 control-label">{this.props.title}</label>
                <div className="col-lg-6">
                    <input type="text" list={this.props.pkey+"_input"} value={this.state.value}
                           onChange={this.valueHolder.bind(this)} onBlur={this.blurHolder.bind(this)}/>
                </div>
                <datalist id={this.props.pkey+"_input"} >
                    {options}
                </datalist>
            </div>
        )
    }

}


/**
 * 搜索框
 * 需要：
 * searchKeys : [{key:"key",name:"键"}]
 * loadPage : function (queryString)
 */
export class SearchLabel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pagecount: 1,
            last: 1,
            search: null,//在点击搜索按钮后在此保存type和data参数以维持翻页
            searchType: props.searchKeys[0].key,//查询依据
            searchTypeName: props.searchKeys[0].name,//查询依据显示
            searchData: null//输入框数据
        }
    }

    componentWillReceiveProps (props){
        this.props = props;
        this.setState({searchData:null});
    }

    search (){
        var search = null;
        if(this.state.searchData!=null){
            search=
            {
                type:this.state.searchType,
                data:this.state.searchData
            }
        }
        this.setState({
            search:search
        },function(){
            var queryString = "";
            if(this.state.search!=null){
                queryString+="&searchType="+this.state.search.type+"&searchData="+this.state.search.data;
            }
            this.props.loadPage(queryString);
        }.bind(this))
    }

    selectSearchType (i){
        var mapper = this.props.searchKeys[i];
        this.setState({
            searchType:mapper.key,
            searchTypeName:mapper.name
        })
    }

    searchDataHolder (e){
        var value = e.target.value;
        if(value=="")
            value=null;
        this.setState({
            searchData:value
        });
    }

    render (){
        var params = this.props.searchKeys;
        var selector = [];
        for(var i=0;i<params.length;i++){
            selector.push(
                <li><a onClick={this.selectSearchType.bind(this,i)}>{params[i].name}</a></li>
            )
        }
        return (
            <form className="form-inline no-margin">
                <div className="row">
                    <div className="col-md-5">
                        <div className="input-group">
                            <input type="text" className="form-control" onChange={this.searchDataHolder.bind(this)} value={this.state.searchData}/>
                            <div className="input-group-btn">
                                <button type="button" className="btn btn-default dropdown-toggle no-shadow" data-toggle="dropdown" >
                                    {this.state.searchTypeName}
                                </button>
                                <ul className="dropdown-menu pull-right" role="menu">
                                    {selector}
                                </ul>
                                <button type="button" className="btn btn-success no-shadow" onClick={this.search.bind(this)}>查询</button>

                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

}