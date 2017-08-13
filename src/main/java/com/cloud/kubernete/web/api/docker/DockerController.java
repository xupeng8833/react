package com.cloud.kubernete.web.api.docker;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cloud.kubernete.entity.ImageBean;
import com.cloud.kubernete.service.docker.DockerService;
import com.cloud.kubernete.web.BaseController;



/**
 * 操作docker的controller
 * @author xp
 *
 */
@RequestMapping("/v1/bata/docker")
@RestController
public class DockerController extends BaseController{
	
//	@IngoreCheck 该检测是为了确认用户是否登录，如果登录才可以访问，否则直接跳转到登录页面
	/*@GetMapping("/list/all")
    public List<PersistentVolume> listAll(@RequestParam(value="namespace")String namespace) {
		DefaultKubernetesClient kubeClient = CloudSource.getKubeClient();
		PersistentVolumeList list = kubeClient.inNamespace(namespace).persistentVolumes().list();
		List<PersistentVolume> items = list.getItems();
		return items;
    }*/
	
    @Autowired
    DockerService dockerService;
	
	@GetMapping("/image/list")
	public void getImagesList(@RequestParam(value="Number")String number,HttpServletResponse response){
		List<ImageBean> listDockerImages = dockerService.listDockerImages(number);
		renderJson(response,listDockerImages);
	}
	
	
	
   
	
}
