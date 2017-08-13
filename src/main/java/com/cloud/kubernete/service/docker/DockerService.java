package com.cloud.kubernete.service.docker;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.cloud.kubernete.entity.ImageBean;
import com.cloud.kubernete.service.BaseService;
import com.cloud.kubernete.util.CloudImagesUtils;
import com.cloud.kubernete.util.JsonHelper;

@Service("dockerService")
public class DockerService extends BaseService{
	
	/**
	 *获取所有镜像列表的方法 
	 * @param number
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<ImageBean> listDockerImages(String number) {
		JsonHelper jsonHelper = new JsonHelper();
		CloudImagesUtils sUtils = new CloudImagesUtils();
        String imagesJson = sUtils.findImageList(number);
        Map<String, Object> imagesMap = (Map<String, Object>) jsonHelper.jsonToMap(imagesJson);
        List<String> imageslist = (List<String>) imagesMap.get("repositories");
        List<ImageBean> reqList=new ArrayList<ImageBean>();
        for (String imagename : imageslist)
        {
            String imageinfo = sUtils.findImageinfo(imagename);
            ImageBean image = (ImageBean)jsonHelper.jsonToBean(imageinfo, ImageBean.class);
            if(image.getTags()!=null)
            reqList.add(image);
        }
        return reqList;
	}

}
