package com.cloud.kubernete.web;

import io.fabric8.kubernetes.api.model.PersistentVolume;
import io.fabric8.kubernetes.api.model.PersistentVolumeList;
import io.fabric8.kubernetes.client.DefaultKubernetesClient;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cloud.kubernete.config.CloudConf;


@RequestMapping("kubernetes")
@RestController
public class KubernetesController {
	
	@GetMapping("/list/all")
    public List<PersistentVolume> listAll(@RequestParam(value="namespace")String namespace) {
		DefaultKubernetesClient kubeClient = CloudConf.getKubeClient();
		PersistentVolumeList list = kubeClient.inNamespace(namespace).persistentVolumes().list();
		List<PersistentVolume> items = list.getItems();
		return items;
    }
	
	
	
	
}
