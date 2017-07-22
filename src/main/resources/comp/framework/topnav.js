/**
 * Created by shizhida on 16/7/6.
 */

import React from 'react';
import { Router, Route, hashHistory,Link } from 'react-router';

export default class Topnav extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            user:{}
        };

    }
    componentDidMount() {
        //$.get("user/current", function (data) {
        //    console.log(data);
        //    this.setState({user:data});
        //}.bind(this));

    }

    render() {

        var top = (
            <div className="top-nav-inner">
                <div className="nav-header">
                    <button type="button" className="navbar-toggle pull-left sidebar-toggle" id="sidebarToggleSM">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>

                    <ul className="nav-notification pull-right">
                        <li>
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown"><i
                                className="fa fa-cog fa-lg"></i></a>
                            <span className="badge badge-danger bounceIn">1</span>
                            <ul className="dropdown-menu dropdown-sm pull-right">
                                <li className="user-avatar">
                                    <img src="images/profile/profile1.jpg" alt="" className="img-circle"/>

                                    <div className="user-content">
                                        <h5 className="no-m-bottom">{this.state.user.name}</h5>

                                        <div className="m-top-xs">
                                            <a href="/user/logout">登出</a>
                                        </div>
                                        <div className="m-top-xs">
                                            <Link to="/user/admin/updatepwd">修改密码</Link>
                                        </div>
                                    </div>
                                </li>


                            </ul>
                        </li>
                    </ul>

                    <a href="index.html" className="brand">
                        <i className="fa fa-database"></i><span className="brand-name">QuickAdmin</span>
                    </a>
                </div>
                <div className="nav-container">
                    <button type="button" className="navbar-toggle pull-left sidebar-toggle" id="sidebarToggleLG">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>

                    <div className="pull-right m-right-sm">
                        <div className="user-block hidden-xs">
                            <a href="#" id="userToggle" data-toggle="dropdown">
                                <img src="images/profile/profile1.jpg" alt=""
                                     className="img-circle inline-block user-profile-pic"/>

                                <div className="user-detail inline-block">
                                    {this.state.user.name}
                                    <i className="fa fa-angle-down"></i>
                                </div>
                            </a>

                            <div className="panel border dropdown-menu user-panel">
                                <div className="panel-body paddingTB-sm">
                                    <ul>

                                        <li>
                                            <a href="/user/logout">
                                                <i className="fa fa-power-off fa-lg"></i><span
                                                className="m-left-xs">登出</span>
                                            </a>
                                        </li>
                                        <li>
                                            <Link to="/user/admin/updatepwd">
                                                <i className="fa fa-power-off fa-lg"></i><span
                                                className="m-left-xs">修改密码</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        return top;
    }
};

