package com.cloud.kubernete.util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.DeleteMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;

import com.cloud.kubernete.config.CloudConstant;
import com.cloud.kubernete.datasource.DockerSource;
import com.cloud.kubernete.entity.ImageBean;
import com.github.dockerjava.api.command.BuildImageCmd;
import com.github.dockerjava.api.model.AuthConfig;
import com.github.dockerjava.core.command.BuildImageResultCallback;
import com.github.dockerjava.core.command.PushImageResultCallback;

/**
 * 
 * @author xp
 * @上午10:00:19
 * @Description 镜像管理工具类
 */
public class CloudImagesUtils
{
	AuthConfig authConfig = new AuthConfig()
    .withRegistryAddress(DockerSource.registryName);
    HttpClient client = new HttpClient();
    public String findImageList(String number){
        String url = DockerSource.repertoryURL+String.format(CloudConstant.ImagelistUrl, number);
        GetMethod method = new GetMethod(url);
        method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, 
                new DefaultHttpMethodRetryHandler(3, false));
        String imageList="";
        try {
          int statusCode = client.executeMethod(method);
          if (statusCode != HttpStatus.SC_OK) {
            System.err.println("Method failed: " + method.getStatusLine());
          }
          byte[] responseBody = method.getResponseBody();
          imageList=new String(responseBody);
        } catch (Exception e) {
          e.printStackTrace();
        } finally {
          method.releaseConnection();
        }  
       return imageList;
    }
    
    
    public String findImageinfo(String imagename){
        String url = DockerSource.repertoryURL+String.format(CloudConstant.ImageinfoUrl, imagename);
        GetMethod method = new GetMethod(url);
        method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, 
                new DefaultHttpMethodRetryHandler(3, false));
        String imageinfoJson = null;
        try {
          int statusCode = client.executeMethod(method);
          if (statusCode != HttpStatus.SC_OK) {
            System.err.println("Method failed: " + method.getStatusLine());
          }
          byte[] responseBody = method.getResponseBody();
          imageinfoJson=new String(responseBody);
        } catch (Exception e) {
          e.printStackTrace();
        } finally {
          method.releaseConnection();
        }  
       return imageinfoJson;
    }
    
    public List<ImageBean> getImagesList(String number){
        JsonHelper jsonHelper = new JsonHelper();
        String imagesJson = this.findImageList(number);
        Map<String, Object> imagesMap = (Map<String, Object>) jsonHelper.jsonToMap(imagesJson);
        List<String> imageslist = (List<String>) imagesMap.get("repositories");
        List<ImageBean> reqList=new ArrayList<ImageBean>();
        for (String imagename : imageslist)
        {
            String imageinfo = this.findImageinfo(imagename);
            ImageBean image = (ImageBean)jsonHelper.jsonToBean(imageinfo, ImageBean.class);
            if(image.getTags()!=null)
            reqList.add(image);
        }
        return reqList;
    }
    
    public Map<String,Object> listToMap(List<ImageBean> reqList,JsonHelper jsonHelper){
        
        String json = jsonHelper.objectToJson(reqList);
        Map<String, Object> jsonToMap = (Map<String, Object>) jsonHelper.jsonToMap(json);
        return jsonToMap;
    }
    
    /**
     * 构建镜像  
     * @param sourcePath
     * @return 构建镜像id
     */
    public String buildImage(String sourcePath,String imageName_tag){
    	BuildImageCmd buildImageCmd = DockerSource.getDockerClient().buildImageCmd().withTag(imageName_tag);
		buildImageCmd.withDockerfile(new File(getSourceURL(sourcePath)+File.separator+CloudConstant.dockerfile));
		buildImageCmd.withBaseDirectory(new File(getSourceURL(sourcePath)));
		String imageId = buildImageCmd.withNoCache(true).exec(new BuildImageResultCallback()).awaitImageId();
		return imageId;
    }
    
    private String getSourceURL(String sourcePath){
//    	File f = new File(Platform.getConfigurationLocation().getURL()
//                .getFile());
//        return f.getParentFile().getPath() + "/IMAGERE_SOURCE/"+sourcePath;
    	return "";
    }
    
    public void pushImageToRegistry(String imageID,String imageName_tag){
    	String[] split = imageName_tag.split(":");
    	if(split.length<2){
    		return;
    	}
    	String imageName=DockerSource.registryName+split[0];
    	DockerSource.getDockerClient().tagImageCmd(imageID,imageName, split[1]).exec();
    	DockerSource.getDockerClient()
		 .pushImageCmd(imageName)
		 .withTag(split[1])
		 .withAuthConfig(authConfig)
         .exec(new PushImageResultCallback())
         .awaitSuccess();
    	DockerSource.getDockerClient().removeImageCmd(DockerSource.registryName+imageName_tag).exec();
    	DockerSource.getDockerClient().removeImageCmd(imageName_tag).exec();
    }
    
    public boolean deleteImageOnRegistry(Map<String, Object> inArgMap){
    	String name_tag = (String) inArgMap.get("imageName_tag");
    	String[] split = name_tag.split(":");
    	if(split.length<2)
    		return false;
    	String digest = getRegistryImageDigest(split[0],split[1]);
    	if(digest==null)
    		return false;
    	return deleteImageBydigest(split[0], digest);
    }
    
    private String getRegistryImageDigest(String name,String tag){
    	String url = DockerSource.repertoryURL+String.format(CloudConstant.image_manifests,name,tag);
    	GetMethod method = new GetMethod(url);
    	method.setRequestHeader("Accept", "application/vnd.docker.distribution.manifest.v2+json");
        method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, 
                new DefaultHttpMethodRetryHandler(3, false));
        try {
          int statusCode = client.executeMethod(method);
          if (statusCode != HttpStatus.SC_OK) {
            System.err.println("Method failed: " + method.getStatusLine());
            return null;
          }
          String Digest = method.getResponseHeader("Docker-Content-Digest").getValue();
          System.out.println(Digest);
          return Digest;
        } catch (Exception e) {
          e.printStackTrace();
          return null;
        } finally {
          method.releaseConnection();
        }  
    }
    
    private boolean deleteImageBydigest(String name,String digest){
    	DeleteMethod method =null;
    	try{
    		method = new DeleteMethod(buildRegistryManifestsURL(name, digest));
            method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER, 
                    new DefaultHttpMethodRetryHandler(3, false));
            int statusCode = client.executeMethod(method);
            if(statusCode!=202){
            	return false;
            }
            return true;
    	}catch(Exception e){
    		return false;
    	}finally{
    		method.releaseConnection();
    	}
    }
    private String buildRegistryManifestsURL(String name,String tag){
    	return  DockerSource.repertoryURL+String.format(CloudConstant.image_manifests,name,tag);
    }
}
