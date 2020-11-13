package com.o2o.action.server.rest;

import com.o2o.action.server.db.Kdetailimg;
import com.o2o.action.server.db.Kdetailinfo;
import com.o2o.action.server.repo.KdetailimgRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class KdetailimgRESTController {
    @Autowired
    KdetailimgRepository kdetailimgRepository;

    @GetMapping(value = "/detailimg")
    public List<Kdetailimg> getDetailimg() {

        List<Kdetailimg> kdetailimgs = new ArrayList<Kdetailimg>();
        Iterable<Kdetailimg> iterable = kdetailimgRepository.findAll();
        iterable.forEach(kdetailimgs::add);

        return kdetailimgs;
    }

    @GetMapping(value = "/finddetailimg")
    public List<Kdetailimg> getContentid(@RequestParam("contentid") String contentid) {

        List<Kdetailimg> kdetailimgs = new ArrayList<Kdetailimg>();
        Iterable<Kdetailimg> iterable = kdetailimgRepository.findByContentid(contentid);
        iterable.forEach(kdetailimgs::add);

        return kdetailimgs;
    }

}
