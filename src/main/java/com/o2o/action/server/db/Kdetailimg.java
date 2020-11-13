package com.o2o.action.server.db;

import javax.persistence.*;

@Entity
@Table
public class Kdetailimg {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    @Column(nullable = false)

    String contentid;
    String originimgurl;
    String serialnum;
    String smallimageurl;

    public Kdetailimg() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getContentid() {
        return contentid;
    }

    public void setContentid(String contentid) {
        this.contentid = contentid;
    }

    public String getOriginimgurl() {
        return originimgurl;
    }

    public void setOriginimgurl(String originimgurl) {
        this.originimgurl = originimgurl;
    }

    public String getSerialnum() {
        return serialnum;
    }

    public void setSerialnum(String serialnum) {
        this.serialnum = serialnum;
    }

    public String getSmallimageurl() {
        return smallimageurl;
    }

    public void setSmallimageurl(String smallimageurl) {
        this.smallimageurl = smallimageurl;
    }
}
