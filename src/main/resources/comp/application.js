/**
 * Created by shizhida on 16/7/6.
 */
import React from 'react';
import ReactDOM from 'react/lib/ReactDOM';
import { Router, Route, hashHistory,Link } from 'react-router';
import Topnav from './framework/topnav.js';
import Navbar from './framework/navbar.js';
import {AdminUserList,AddOrUpdateAdminUser,UpdateAdminPassword} from './user.comp.js';
import {NewsList,NewsEditor,NewsTop} from './news.comp.js';
import { xget,xpost } from './framework/commonUtils.js'

class IndexWrapper extends React.Component {

    constructor(props){
        super(props);
        this.state={nav:{
            component: "home",
            navtree : [

                {
                    name:"用户管理",
                    component:"/user/admin"
                },{
                    name:"新闻管理",
                    subnav:[
                        {
                            name:"新闻列表",
                            component:"/news/list"
                        }

                    ]
                }
            ]
        }}
    }
    render () {
        return (
            <div className="wrapper preload">
                <header className="top-nav" id="top-nav">
                    <Topnav />
                </header>
                <aside className="sidebar-menu fixed" id="navbar">
                    <Navbar nav={this.state.nav}/>
                </aside>
                <div className="main-container" id="main">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

class Main extends React.Component{


    render(){
        var router = (
            <Router history={hashHistory} >
                <Route path="/" component={IndexWrapper}>
                    <Route path="user/admin" component={AdminUserList}/>
                    <Route path="user/admin/add" component={AddOrUpdateAdminUser}/>
                    <Route path="user/admin/update/:id" component={AddOrUpdateAdminUser}/>
                    <Route path="user/admin/updatepwd" component={UpdateAdminPassword}/>

                    <Route path="news/list" component={NewsList}/>
                    <Route path="news/add" component={NewsEditor}/>
                    <Route path="news/top" component={NewsTop}/>
                    <Route path="news/update/:id" component={NewsEditor}/>
                </Route>
            </Router>
        );
        return router;
    }

};

ReactDOM.render(<Main />,document.getElementById("body"));
