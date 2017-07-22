package com.cloud.kubernete.datasource;

import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;

@ConfigurationProperties(prefix = "kubemaster")
public class CloudSource {
	
	private static DefaultKubernetesClient kube;
	
	private static String URL ;
	private static String username  ;
	private static String password ;
//	private static String dockerhost_url ;
//	public static String image_repertory_url;
//	public static String registry_name ;
//	public static String cloud_properties_servlet;
//	private final static String registry_password = null;
//	public static String etcd_url ;
	public static String ceph_master_URL ;
	public static String ceph_cluster_IPS ;
	public static String getURL() {
		return URL;
	}
	public static void setURL(String uRL) {
		URL = uRL;
	}
	public static String getUsername() {
		return username;
	}
	public static void setUsername(String username) {
		CloudSource.username = username;
	}
	public static String getPassword() {
		return password;
	}
	public static void setPassword(String password) {
		CloudSource.password = password;
	}
	public static String getCeph_master_URL() {
		return ceph_master_URL;
	}
	public static void setCeph_master_URL(String ceph_master_URL) {
		CloudSource.ceph_master_URL = ceph_master_URL;
	}
	public static String getCeph_cluster_IPS() {
		return ceph_cluster_IPS;
	}
	public static void setCeph_cluster_IPS(String ceph_cluster_IPS) {
		CloudSource.ceph_cluster_IPS = ceph_cluster_IPS;
	}
	
	@Bean
	public  DefaultKubernetesClient getKubeClient(){
		Config kubeconfig = new Config();
		kubeconfig.setUsername(username);
		kubeconfig.setPassword(password);
		kubeconfig.setTrustCerts(true);
		kubeconfig.setMasterUrl(URL);
		kube = new DefaultKubernetesClient(kubeconfig);
		System.out.println(username);
		System.out.println(password);
		System.out.println(URL);
		System.out.println(kube);
		return kube;
	}
	
}
