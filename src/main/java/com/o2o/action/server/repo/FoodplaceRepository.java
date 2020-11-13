package com.o2o.action.server.repo;

import com.o2o.action.server.db.KfoodPlace;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface FoodplaceRepository extends CrudRepository<KfoodPlace, Long> {
    public List<KfoodPlace> findByLocationname(String locationname);
    //public List<KfoodPlace> findByLocalfood(String localfood);
    public List<KfoodPlace> findByLocalfoodAndLang(String localfood, String Lang);
    public List<KfoodPlace> findByTitle(String title);
    public List<KfoodPlace> findByImageurl(String imageurl);
    public List<KfoodPlace> findByAddress(String Address);
    public List<KfoodPlace> findByContentid(String Contentid);
    public List<KfoodPlace> findByLatitude(String latitude);
    public List<KfoodPlace> findByLongitude(String longitude);
    public List<KfoodPlace> findByContenttypeid(String Contenttypeid);
}