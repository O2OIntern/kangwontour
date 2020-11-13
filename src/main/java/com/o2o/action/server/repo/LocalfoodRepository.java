package com.o2o.action.server.repo;

import org.springframework.data.repository.CrudRepository;
import com.o2o.action.server.db.KlocalFood;

import java.util.List;

public interface LocalfoodRepository extends CrudRepository<KlocalFood, Long> {
    //public List<KlocalFood> findByLocationname(String locationname);
    public List<KlocalFood> findByLocationnameAndLang(String locationname, String Lang);
    public List<KlocalFood> findByLang(String Lang);
    public List<KlocalFood> findByLocalfood(String localfood);
    public List<KlocalFood> findByImageurl(String imageurl);
    public List<KlocalFood> findByDescription(String description);
}
