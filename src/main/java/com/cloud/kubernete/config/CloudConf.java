package com.cloud.kubernete.config;

import io.fabric8.kubernetes.client.Config;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;

import java.io.InputStream;
import java.util.Properties;

public class CloudConf {
	/**
	 * kube集群客户端
	 */
	private static DefaultKubernetesClient kube;
	
	private static Config kubeconfig;
	private static String kube_master_url ;
	private static String kube_username  ;
	private static String kube_password ;
	public static String ceph_master_URL ;
	public static String ceph_cluster_IPS ;
	static {
		initProperties();
		initKubeClient();
	}
	
	public static DefaultKubernetesClient getKubeClient(){
		if(kube==null)
			initKubeClient();
		return kube;
	}
	
	
	private static void initKubeClient(){
		kubeconfig = new Config();
		kubeconfig.setUsername(kube_username);
		kubeconfig.setPassword(kube_password);
		kubeconfig.setTrustCerts(true);
		kubeconfig.setMasterUrl(kube_master_url);
		kube = new DefaultKubernetesClient(kubeconfig);
	}
	
	private static void initProperties(){
		try {
			Properties properties = new Properties();
	        InputStream in = CloudConf.class.getClassLoader().getResourceAsStream("application.properties");
			properties.load(in);
	        initConfParams(properties);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private static void initConfParams(Properties properties){
		kube_master_url = properties.getProperty("kubemaster.URL");
		kube_username = properties.getProperty("kubemaster.username");
		kube_password = properties.getProperty("kubemaster.password");
		ceph_master_URL = properties.getProperty("kubemaster.ceph_master_URL");
		ceph_cluster_IPS = properties.getProperty("kubemaster.ceph_cluster_IPS");
	}
	
}
