package com.cloud.kubernete.entity;

import java.util.List;

public class ImageBean
{

    private String name;
    private List<String> tags;
    private long sizeBytes;
    public long getSizeBytes()
    {
        return sizeBytes;
    }
    public void setSizeBytes(long sizeBytes)
    {
        this.sizeBytes = sizeBytes;
    }
    public String getName()
    {
        return name;
    }
    public void setName(String name)
    {
        this.name = name;
    }
    public List<String> getTags()
    {
        return tags;
    }
    public void setTags(List<String> tags)
    {
        this.tags = tags;
    }
}
