package com.o2o.action.server.db;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class KlocalFood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(nullable = false)
    String locationname;

    @Column(nullable = false)
    String localfood;

    String imageurl;

    @Column(length = 2048)
    String description;

    String lang;

    public KlocalFood() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getLocationname() {
        return locationname;
    }

    public void setLocationname(String locationname) {
        this.locationname = locationname;
    }

    public String getlocalfood() {
        return localfood;
    }

    public void setLocalfood(String localfood) {
        this.localfood= localfood;
    }

    public String getImageurl() {
        return imageurl;
    }

    public void setImageurl(String imageurl) {
        this.imageurl = imageurl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String Lang) {
        this.lang = lang;
    }
}
