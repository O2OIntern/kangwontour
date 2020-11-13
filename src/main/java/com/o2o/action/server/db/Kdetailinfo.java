package com.o2o.action.server.db;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@Entity
@Table
public class Kdetailinfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    @Column(nullable = false)

    String contentid;
    String contenttypeid;
    String cat3;
    String title;
    String addr1;
    String areacode;
    String sigungucode;
    String tel;
    @Column(length = 4096)
    String overview;
    @Column(length = 4096)
    String homepage;
    String firstimage;
    String mapx;
    String mapy;
    String chkbabycarriage;
    String accomcount;
    String infocenter;
    String parking;
    String parkingfee;
    String reservation;
    String restdate;
    String chkpet;
    String opentime;
    @Column(length = 2048)
    String usetime;
    @Column(length = 2048)
    String usefee;
    String discountinfo;
    String firstmenu;
    String packing;
    String useseason;
    String checkintime;
    String checkouttime;
    String chkcooking;
    @Column(length = 2048)
    String expagerange;
    String openperiod;
    String opendate;
    String fairday;
    String saleitem;
    String lang;

//    @OneToMany
//    @JoinColumn(name="contentid")
//    Collection<Kdetailimg> detailimg;




    public Kdetailinfo() {
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

    public String getContenttypeid() {
        return contenttypeid;
    }

    public void setContenttypeid(String contenttypeid) { this.contenttypeid = contenttypeid;
    }

    public String getCat3() {
        return cat3;
    }

    public void setCat3(String cat3) {
        this.cat3 = cat3;
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

    public String getAreacode() {
        return areacode;
    }

    public void setAreacode(String areacode) {
        this.areacode = areacode;
    }

    public String getSigungucode() {
        return sigungucode;
    }

    public void setSigungucode(String sigungucode) {
        this.sigungucode = sigungucode;
    }

    public String getTel() { return tel;
    }

    public void setTel(String tel) { this.tel = tel;
    }

    public String getOverview() { return overview; }

    public void setOverview(String overview) { this.overview = overview;
    }

    public String getHomepage() { return homepage; }

    public void setHomepage(String homepage) { this.homepage = homepage;
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

    public String getChkbabycarriage() {
        return chkbabycarriage;
    }

    public void setChkbabycarriage(String chkbabycarriage) {
        this.chkbabycarriage = chkbabycarriage;
    }

    public String getAccomcount() {
        return accomcount;
    }

    public void setAccomcount(String accomcount) {
        this.accomcount = accomcount;
    }

    public String getInfocenter() {
        return infocenter;
    }

    public void setInfocenter(String infocenter) {
        this.infocenter = infocenter;
    }

    public String getParking() {
        return parking;
    }

    public void setParking(String packing) {
        this.packing = packing;
    }

    public String getParkingfee() {
        return parkingfee;
    }

    public void setParkingfee(String parkingfee) {
        this.parkingfee = parkingfee;
    }

    public String getReservation() {
        return reservation;
    }
    public void setReservation(String reservation) {
        this.reservation = reservation;
    }

    public String getRestdate() {
        return restdate;
    }
    public void setRestdate(String restdate) {
        this.restdate = restdate;
    }

    public String getChkpet() {
        return chkpet;
    }
    public void setChkpet(String chkpet) {
        this.chkpet = chkpet;
    }

    public String getOpentime() {
        return opentime;
    }
    public void setOpentime(String opentime) {
        this.opentime = opentime;
    }

    public String getUsetime() {
        return usetime;
    }
    public void setUsetime(String usetime) {
        this.usetime = usetime;
    }

    public String getExpagerange() {
        return expagerange;
    }
    public void setExpagerange(String expagerange) {
        this.expagerange = expagerange;
    }

    public String getDiscountinfo() {
        return discountinfo;
    }
    public void setDiscountinfo(String discountinfo) {
        this.discountinfo = discountinfo;
    }

    public String getSaleitem() {
        return saleitem;
    }
    public void setSaleitem(String saleitem) {
        this.saleitem = saleitem;
    }

    public String getLang() {
        return lang;
    }
    public void setLang(String lang) {
        this.lang = lang;
    }

//    public Collection<Kdetailimg> getDetailimg() {
//        return detailimg;
//    }
//
//    public void setDetailimg( List<Kdetailimg> detailimg) {
//        this.detailimg = detailimg;
//    }

}
