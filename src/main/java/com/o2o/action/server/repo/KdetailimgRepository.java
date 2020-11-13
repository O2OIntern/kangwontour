package com.o2o.action.server.repo;


import com.o2o.action.server.db.Kdetailimg;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface KdetailimgRepository extends CrudRepository<Kdetailimg, Long> {

    public List<Kdetailimg> findByContentid(String contentid);
    public List<Kdetailimg> findByOriginimgurl(String originimgurl);
    public List<Kdetailimg> findBySerialnum(String serialnum);
    public List<Kdetailimg> findBySmallimageurl(String smallimageurl);

}
