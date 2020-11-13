package com.o2o.action.server.db;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table
public class KfoodPlace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    @Column(nullable = false)
    String locationname;

    @Column(nullable = false)
    String localfood;

//    String name;
    String title;

    String imageurl;

    String address;

    String contentid;

    String latitude;

    String longitude;

    String contenttypeid;

    String lang;

    public KfoodPlace() {
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

    public String getLocalfood() {
        return localfood;
    }

    public void setLocalfood(String localfood) {
        this.localfood = localfood;
    }

//    public String getName() {
//        return name;
//    }

    public String getTitle() {
        return title;
    }

//    public void setName(String name) {
//        this.name = name;
//    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageurl() {
        return imageurl;
    }

    public void setImageurl(String imageurl) {
        this.imageurl = imageurl;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContentid() {
        return contentid;
    }

    public void setContentid(String contentid) {
        this.contentid = contentid;
    }

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getContenttypeid() {
        return contenttypeid;
    }

    public void setContenttypeid(String contenttypeid) {
        this.contenttypeid = contenttypeid;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }
}
