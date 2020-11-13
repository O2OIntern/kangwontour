package com.o2o.action.server.repo;

import com.o2o.action.server.db.Kdetailimg;
import com.o2o.action.server.db.Kdetailinfo;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;

public interface KdetailinfoRepository extends CrudRepository<Kdetailinfo, Long> {
    public List<Kdetailinfo> findByContentid(String contentid);
    public List<Kdetailinfo> findByContentidAndLang(String contentid, String lang);
    public List<Kdetailinfo> findByContenttypeid(String contenttypeid);
    public List<Kdetailinfo> findByCat3(String cat3);
    public List<Kdetailinfo> findByTitle(String title);
    public List<Kdetailinfo> findByAddr1(String addr1);
    public List<Kdetailinfo> findByAreacode(String areacode);
    public List<Kdetailinfo> findBySigungucode(String sigungucode);
    public List<Kdetailinfo> findBySigungucode(String sigungucode, Sort sort);
    public List<Kdetailinfo> findByTel(String tel);
    public List<Kdetailinfo> findByOverview(String overview);
    public List<Kdetailinfo> findByHomepage(String homepage);
    public List<Kdetailinfo> findByFirstimage(String firstimage);
    public List<Kdetailinfo> findByMapx(String mapx);
    public List<Kdetailinfo> findByMapy(String mapy);
    public List<Kdetailinfo> findByChkbabycarriage(String chkbabycarriage);
    public List<Kdetailinfo> findByAccomcount(String  accomcount);
    public List<Kdetailinfo> findByInfocenter(String infocenter);
    public List<Kdetailinfo> findByParking(String parking);
    public List<Kdetailinfo> findByParkingfee(String parkingfee);
    public List<Kdetailinfo> findByReservation(String reservation);
    public List<Kdetailinfo> findByRestdate(String restdate);
    public List<Kdetailinfo> findByChkpet(String chkpet);
    public List<Kdetailinfo> findByOpentime(String opentime);
    public List<Kdetailinfo> findByUsetime(String usetime);
    public List<Kdetailinfo> findByUsefee(String usefee);
    public List<Kdetailinfo> findByDiscountinfo(String discountinfofood);
    public List<Kdetailinfo> findByFirstmenu(String firstmenu);
    public List<Kdetailinfo> findByPacking(String packing);
    public List<Kdetailinfo> findByUseseason(String useseason);
    public List<Kdetailinfo> findByCheckintime(String checkintime);
    public List<Kdetailinfo> findByCheckouttime(String checkouttime);
    public List<Kdetailinfo> findByChkcooking(String chkcooking);
    public List<Kdetailinfo> findByExpagerange(String expagerange);
    public List<Kdetailinfo> findByOpenperiod(String openperiod);
    public List<Kdetailinfo> findByOpendate(String opendate);
    public List<Kdetailinfo> findByFairday(String fairday);
    public List<Kdetailinfo> findBySaleitem(String shopguide);
    public List<Kdetailinfo> findByLang(String lang);
    //public List<Kdetailinfo> findByDetailimg(Collection<Kdetailimg> detailimg);



}
