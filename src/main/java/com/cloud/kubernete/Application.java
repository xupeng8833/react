package com.cloud.kubernete;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.alibaba.druid.pool.DruidDataSource;
import com.cloud.kubernete.auth.AuthInterceptor;
import com.cloud.kubernete.auth.impl.DefaultUserAuth;


@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan
@PropertySource(value = "classpath:/config/application.properties", ignoreResourceNotFound = true)
public class Application extends WebMvcConfigurerAdapter  {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
    
    //加载数据库的配置文件
    @Value("${spring.datasource.url}")
    private String url;
    
    @Value("${spring.datasource.username}")
    private String username;
    
    @Value("${spring.datasource.password}")
    private String password;
    
    
    @Bean("jdbcTemplate")
    public JdbcTemplate getJdbcTemplate(@Autowired DruidDataSource dataSource){
        JdbcTemplate template = new JdbcTemplate(dataSource);
        return template;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        AuthInterceptor interceptor = new AuthInterceptor();
        interceptor.setAuth(new DefaultUserAuth());
        registry.addInterceptor(interceptor);
    }

    @Bean("dataSource")
    public DruidDataSource getDataSource(){
        DruidDataSource ds = new DruidDataSource();
//        ds.setUrl("jdbc:mysql://127.0.0.1:3306/test_spring_boot?useUnicode=true&characterEncoding=utf-8");
        ds.setUrl(url);
        ds.setUsername(username);
        ds.setPassword(password);

        ds.setInitialSize(0);
        ds.setMaxActive(20);
        ds.setMinIdle(0);
        ds.setMaxWait(10000);

        ds.setTestOnBorrow(false);
        ds.setTestOnReturn(false);
        ds.setTestWhileIdle(true);

        ds.setTimeBetweenEvictionRunsMillis(60000);
        ds.setMinEvictableIdleTimeMillis(25200000);

        ds.setRemoveAbandoned(true);
        ds.setRemoveAbandonedTimeout(1800);
        ds.setLogAbandoned(true);
        return ds;
    }
}
