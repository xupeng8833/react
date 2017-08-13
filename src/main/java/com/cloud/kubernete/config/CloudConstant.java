package com.cloud.kubernete.config;

public class CloudConstant {
	 /**
     * 镜像及镜像仓库
     */
    public static String ImagelistUrl="/v2/_catalog?n=%s";
    public static String ImageinfoUrl="/v2/%s/tags/list";
    
    public final static String dockerfile="Dockerfile";
    
    public static String image_manifests="/v2/%s/manifests/%s";
    
	
}
