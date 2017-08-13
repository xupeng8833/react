package com.cloud.kubernete.datasource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientBuilder;
import com.github.dockerjava.jaxrs.JerseyDockerCmdExecFactory;


@Component
@ConfigurationProperties(prefix = "docker")
public class DockerSource {
	
	/**
	 * docker用于构建镜像的客户端
	 */
	private static DockerClient dockerClient;
	
	private static String dockerhost;
	public static String repertoryURL;
	public static String registryName;
	
	private final static String registry_password = null;
	
	
	public static String getDockerhost() {
		return dockerhost;
	}
	public static void setDockerhost(String dockerhost) {
		DockerSource.dockerhost = dockerhost;
	}
	public static String getRepertoryURL() {
		return repertoryURL;
	}
	public static void setRepertoryURL(String repertoryURL) {
		DockerSource.repertoryURL = repertoryURL;
	}
	public static String getRegistryName() {
		return registryName;
	}
	public static void setRegistryName(String registryName) {
		DockerSource.registryName = registryName;
	}
	
	
	
	private static DefaultDockerClientConfig config() {
		return config(registry_password);
	}

	private static DefaultDockerClientConfig config(String password) {
		DefaultDockerClientConfig.Builder builder = DefaultDockerClientConfig
				.createDefaultConfigBuilder()
				.withRegistryUrl(repertoryURL)
				.withDockerHost(dockerhost);
		if (password != null) {
			builder = builder.withRegistryPassword(password);
		}
		return builder.build();
	}
	
	@Bean
	public static  DockerClient getDockerClient(){
		dockerClient = DockerClientBuilder.getInstance(config())
				.withDockerCmdExecFactory(new JerseyDockerCmdExecFactory())
				.build();
		System.out.println("docker========="+repertoryURL);
		System.out.println("docker========="+dockerhost);
		System.out.println("docker========="+dockerClient);
	    return dockerClient;
	}
	

}
