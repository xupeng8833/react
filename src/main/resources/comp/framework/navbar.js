/**
 * Created by shizhida on 16/7/6.
 */
import React from 'react';
import { Router, Route, Link,browserHistory,hashHistory } from 'react-router'

export class SingleNav extends React.Component{

    constructor(props){
        super(props);
    }


    render(){
        var nav = (
            <li className="bg-palette1">
                <Link to={this.props.nav.component} activeClassName="active">
									<span className="menu-content block">
										<span className="menu-icon"><i className="block fa fa-list fa-lg"></i></span>
										<span className="text m-left-sm">{this.props.nav.name}</span>
									</span>
									<span className="menu-content-hover block">
										{this.props.nav.name}
									</span>
                </Link>
            </li>
        );
        return nav;
    }
};

export class MultiNav extends React.Component{

    constructor(props){
        super(props);
    }

    render(){

        var subnav = this.props.nav.subnav;
        var subcomps = [];
        for(var i=0;i<subnav.length;i++){
            subcomps.push(
                <li key={"nav-bar-"+i} >
                    <Link to={subnav[i].component} activeClassName="active">
                        <span className="submenu-label">{subnav[i].name}</span>
                    </Link>
                </li>
            )
        }

        return (
            <li className="openable bg-palette3">
                <a href="#">
									<span className="menu-content block">
										<span className="menu-icon"><i className="block fa fa-list fa-lg"></i></span>
										<span className="text m-left-sm">{this.props.nav.name}</span>
										<span className="submenu-icon"></span>
									</span>
									<span className="menu-content-hover block">
										{this.props.nav.name}
									</span>
                </a>
                <ul className="submenu bg-palette4">
                    {subcomps}
                </ul>
            </li>
        )
    }
}


export default class Navbar extends React.Component{

    /**
     * 初始化
     */
    constructor(props) {
        super(props);
        this.state={
            nav:props.nav,
            init:0
        }
    }

    componentDidMount(){
        //if(this.state.init==0){
        //    this.sidebarInit();
        //}
    }

    render(){
        var navs = [];
        for(var i=0;i<this.state.nav.navtree.length;i++){
            var nav = this.state.nav.navtree[i];
            if(!nav)
            continue;
            if(nav.subnav){
                navs.push(<MultiNav key={"nav-multibar-"+i} nav={nav} ></MultiNav>);
            }else{
                navs.push(<SingleNav key={"nav-singlebar-"+i} nav={nav} ></SingleNav>);
            }
        }
        var nav = (
            <div className="sidebar-inner scrollable-sidebar">
                <div className="main-menu">
                    <ul className="accordion">
                        <li className="menu-header">
                            Main Menu
                        </li>
                        {navs}
                    </ul>
                </div>
            </div>
        )
        return nav
    }

    sidebarInit (){
        console.log("init sidebar")
        //scrollable sidebar
        $('.scrollable-sidebar').slimScroll({
            height: '100%',
            size: '0px'
        });

        //Collapsible Sidebar Menu
        $('.sidebar-menu .openable > a').click(function()	{

            if(!$('aside').hasClass('sidebar-mini') || Modernizr.mq('(max-width: 991px)'))	{
                if( $(this).parent().children('.submenu').is(':hidden') ) {
                    $(this).parent().siblings().removeClass('open').children('.submenu').slideUp(200);
                    $(this).parent().addClass('open').children('.submenu').slideDown(200);
                }
                else	{
                    $(this).parent().removeClass('open').children('.submenu').slideUp(200);
                }
            }

            return false;
        });

        //Open active menu
        if(!$('.sidebar-menu').hasClass('sidebar-mini') || Modernizr.mq('(max-width: 767px)'))	{
            $('.openable.open').children('.submenu').slideDown(200);
        }

        //Toggle User container on sidebar menu
        $('#btn-collapse').click(function()	{
            $('.sidebar-header').toggleClass('active');
        });

        //theme setting
        $("#theme-setting-icon").click(function()	{
            if($('#theme-setting').hasClass('open'))	{
                $('#theme-setting').removeClass('open');
                $('#theme-setting-icon').removeClass('open');
            }
            else	{
                $('#theme-setting').addClass('open');
                $('#theme-setting-icon').addClass('open');
            }

            return false;
        });

        $('#sidebarToggleLG').click(function()	{
            if($('.wrapper').hasClass('display-right'))	{
                $('.wrapper').removeClass('display-right');
                $('.sidebar-right').removeClass('active');
            }
            else	{
                //$('.nav-header').toggleClass('hide');
                $('.top-nav').toggleClass('sidebar-mini');
                $('aside').toggleClass('sidebar-mini');
                $('footer').toggleClass('sidebar-mini');
                $('.main-container').toggleClass('sidebar-mini');

                $('.main-menu').find('.openable').removeClass('open');
                $('.main-menu').find('.submenu').removeAttr('style');
            }
        });

        $('#sidebarToggleSM').click(function()	{
            $('aside').toggleClass('active');
            $('.wrapper').toggleClass('display-left');
        });

        $('.sidebarRight-toggle').click(function()	{
            $('.sidebar-right').toggleClass('active');
            $('.wrapper').toggleClass('display-right');
            $('footer').toggleClass('display-right');

            return false;
        });

        this.setState({init:this.state.init+1})
    }
}

