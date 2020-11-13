package com.o2o.action.server.db;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table
public class KtourApi implements Comparable<KtourApi> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    @Column(nullable = false)
    String areacode;

    @Column(nullable = false)
    String cat3;

    String contentid;

    String contenttypeid;

    String firstimage;

    String mapx;

    String mapy;

    String readcount;
    String sigungucode;
    String title;
    String addr1;
    String tel;
    String category;
    String lang;
    String film;

    @Transient
    double distance;

    public KtourApi() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getAreacode() {
        return areacode;
    }

    public void setAreacode(String areacode) {
        this.areacode = areacode;
    }

    public String getCat3() {
        return cat3;
    }

    public void setCat3(String cat3) {
        this.cat3 = cat3;
    }

    public String getContentid() {
        return contentid;
    }

    public void setContentid(String contentid) {
        this.contentid = contentid;
    }

    public String getContenttypeid() {
        return contenttypeid;
    }

    public void setContenttypeid(String contenttypeid) {
        this.contenttypeid = contenttypeid;
    }

    public String getFirstimage() {
        return firstimage;
    }

    public void setFirstimage(String firstimage) {
        this.firstimage = firstimage;
    }

    public String getMapx() {
        return mapx;
    }

    public void setMapx(String mapx) {
        this.mapx = mapx;
    }

    public String getMapy() {
        return mapy;
    }

    public void setMapy(String mapy) {
        this.mapy = mapy;
    }

    public String getReadcount() {
        return readcount;
    }

    public void setReadcount(String readcount) {
        this.readcount = readcount;
    }

    public String getSigungucode() {
        return sigungucode;
    }

    public void setSigungucode(String sigungucode) {
        this.sigungucode = sigungucode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddr1() {
        return addr1;
    }

    public void setAddr1(String addr1) {
        this.addr1 = addr1;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }
    public double getDistance() {
        return distance;
    }
    public void setDistance(double distance) {
        this.distance = distance;
    }
    @Override
    public int compareTo(@NotNull KtourApi o) {
        if (distance > o.distance)
            return 1;
        else if (distance < o.distance)
            return -1;
        return 0;
    }

    public String getFilm() {
        return film;
    }

    public void setFilm(String film) {
        this.film = film;
    }
}
