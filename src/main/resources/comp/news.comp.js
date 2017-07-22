import React from 'react';
import {SmartBox,DataTable,Pager,Modal,Editor,ImageUpdate} from './framework/adminUIComponents.js';
import { hashHistory } from 'react-router'
import { xget,xpost,transTimestamp } from './framework/commonUtils.js'

/**
 * 新闻列表
 */
export class NewsList extends React.Component{

    /**
     * 数据初次加载，及相关初始化处理
     */
    componentDidMount() {
        this.loadPage();

    }

    loadPage (page){
        var url = "/news/list";
        if(typeof page == "number")
            url+="?page="+page;
        else url+="?page="+this.state.last;
        xget(url, function (data) {
            this.setState({data:data.rows,pagecount:data.pagecount,last:data.last});
        }.bind(this));
    }

    constructor(props){
        super(props);
        this.state =  {
            pagecount:1,
            last:1,
            data: [],
            index: [
                {name: "id", col: "id"},
                {name: "标题", col: "title"},
                {name: "简介", col: "description"},
                {name: "发布日期", col: "date"},
            ],
            buttons: [
                {name:"删除",onclick:function(item){
                    if(confirm("确认要删除此新闻？")){
                        xget("/news/delete?id="+item.id,function(){
                            this.loadPage();
                        }.bind(this))
                    }
                }.bind(this)},
                {name:"修改",onclick:function(item){
                    hashHistory.push("/news/update/"+item.id);
                }.bind(this)}
            ]
        }
    }
    render (){

        return (
            <SmartBox title="新闻列表" index={["新闻管理","列表"]}
                      option={{
                      reload:this.loadPage.bind(this),add:"/news/add"
                      }}>
                <DataTable index={this.state.index} data={this.state.data} buttons={this.state.buttons}/>
                <Pager pagecount={this.state.pagecount} last={this.state.last} callback={this.loadPage.bind(this)} />
            </SmartBox>
        )
    }
};
export class NewsEditor extends React.Component {

    constructor (props){
        super(props);
        this.state = {title:""};
    }
    componentWillReceiveProps(){
        this.componentDidMount();
    }
    componentDidMount() {
        var id = "wangeditor";
        this.editor = new wangEditor(id);
        this.editor.config.familys = [
            'SimSun', 'SimHei', 'KaiTi', 'Microsoft YaHei',
            'Arial', 'Verdana', 'Georgia'
        ];
        this.editor.config.menus.push("lineheight");
        this.editor.config.uploadImgUrl = "http://123.206.43.110:1179/editorupload";
        this.editor.config.menuFixed = 53;
        this.editor.create();
        if(this.props.params.id){
            xget("/news/info?id="+this.props.params.id, function (data) {
                this.editor.$txt.html(data.content)
                this.setState({title:data.title,cover:data.cover,description:data.description})
            }.bind(this));
        }
    }

    inputHolder(e){
        var title = e.target.value;
        var name = e.target.name;
        var update = [];
        update[name] = title;
        this.setState(update)
    }
    changeCover(url){
        this.setState({cover:url});
    }

    commit () {
        var data = {
            title:this.state.title,
            content:this.editor.$txt.html(),
            cover:this.state.cover,
            description:this.state.description
        };

        if(data.title==""){
            alert("标题不能为空");
            return;
        }
        if(data.description==""){
            alert("简介不能为空");
            return;
        }
        if(data.cover==""){
            if(confirm("加个封面图片么？")){
                return;
            }
        }
        if(!this.props.params.id){
            xpost("/news/add",data,function(result){
                    alert("提交成功");
                    hashHistory.push("/news/list");
            })
        }else{
            data.id = this.props.params.id;
            xpost("/news/update",data,function(result){
                    alert("提交成功");
                    hashHistory.push("/news/list");
            })
        }

    }

    render (){

        return (
            <SmartBox title="编辑" index={["新闻管理","新建"]} >
                <form className="form-horizontal">
                    <div className="form-group">
                        <label htmlFor="inputEmail1" className="col-lg-1 control-label">新闻标题</label>

                        <div className="col-lg-6">
                            <input type="text" className="form-control" id="title" name="title" value={this.state.title}
                                   onChange={this.inputHolder.bind(this)} placeholder="标题"/>
                        </div>

                        <div className="col-lg-4">
                            <button type="button" className="btn btn-info" onClick={this.commit.bind(this)}>发布</button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputEmail1" className="col-lg-1 control-label">简介</label>
                        <div className="col-lg-6">
                            <textarea type="text" className="form-control" id="desc" name="description" value={this.state.description}
                                   onChange={this.inputHolder.bind(this)} placeholder="简介"></textarea>
                        </div>
                    </div>
                    <ImageUpdate title="封面图片" action = "/common/imgupload" url={this.state.cover} onChange={this.changeCover.bind(this)}/>
                </form>
                <div id="wangeditor" style={{height:"600px"}}/>
            </SmartBox>
        )
    }
}

/**
 * 新闻置顶列表
 */
export class NewsTop extends React.Component{

    /**
     * 数据初次加载，及相关初始化处理
     */
    componentDidMount() {
        this.loadPage();

    }

    loadPage (){
        var url = "/top/list?from=news";
        xget(url, function (data) {
            this.setState({data:data});
        }.bind(this));
    }

    constructor(props){
        super(props);
        this.state =  {
            pagecount:1,
            last:1,
            data: [],
            index: [
                {name: "id", col: "id"},
                {name: "标题", col: "title"},
                {name: "简介", col: "description"},
                {name: "发布日期", col: function(item){return transTimestamp(item.date)}},
            ],
            buttons: [
                {name:"取消置顶",onclick:function(item){
                    if(confirm("确认要取消新闻置顶？")){
                        xget("/top/del?id="+item.did,function(){
                            this.loadPage();
                        }.bind(this))
                    }
                }.bind(this)}
            ]
        }
    }
    render (){

        return (
            <SmartBox title="新闻置顶列表" index={["新闻管理","列表"]}>
                <DataTable index={this.state.index} data={this.state.data} buttons={this.state.buttons}/>
            </SmartBox>
        )
    }
};

