package com.o2o.action.server.rest;

import com.o2o.action.server.db.Kdetailinfo;
import com.o2o.action.server.db.KlocalFood;
import com.o2o.action.server.repo.KdetailinfoRepository;
import com.o2o.action.server.repo.LocalfoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class KdetailinfoRESTController {

    @Autowired
    KdetailinfoRepository kdetailinfoRepository;

    @GetMapping(value = "/detailinfo")
    public List<Kdetailinfo> getDetailinfo() {

        List<Kdetailinfo> kdetailinfos = new ArrayList<Kdetailinfo>();
        Iterable<Kdetailinfo> iterable = kdetailinfoRepository.findAll();
        iterable.forEach(kdetailinfos::add);

        return kdetailinfos;
    }

    @GetMapping(value = "/finddetailinfo")
    public List<Kdetailinfo> getContentid(
            @RequestParam("contentid") String contentid
            ,
            @RequestParam(value = "lang", defaultValue = "ko") String lang) {

        List<Kdetailinfo> kdetailinfos = new ArrayList<Kdetailinfo>();
//        Iterable<Kdetailinfo> iterable = kdetailinfoRepository.findByContentid(contentid);
        Iterable<Kdetailinfo> iterable = kdetailinfoRepository.findByContentidAndLang(contentid, lang);
        iterable.forEach(kdetailinfos::add);

        return kdetailinfos;
    }

}
