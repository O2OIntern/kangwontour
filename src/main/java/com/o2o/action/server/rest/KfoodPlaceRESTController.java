package com.o2o.action.server.rest;

import com.o2o.action.server.db.KfoodPlace;
import com.o2o.action.server.repo.FoodplaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class KfoodPlaceRESTController {

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    FoodplaceRepository foodplaceRepository;

    @GetMapping(value = "/foodplace")
    public List<KfoodPlace> getFoodplace() {

        List<KfoodPlace>  kfoodPlaces= new ArrayList<KfoodPlace>();;
        Iterable<KfoodPlace> iterable = foodplaceRepository.findAll();
        iterable.forEach(kfoodPlaces::add);

        return kfoodPlaces;
    }

    @GetMapping(value = "/findfoodplace")
    public List<KfoodPlace> getLocalfood(
            @RequestParam("localfood") String localfood
            ,
            @RequestParam(value = "lang",defaultValue = "ko") String lang
    ) {

        List<KfoodPlace> kfoodPlaces = new ArrayList<KfoodPlace>();
        //Iterable<KfoodPlace> iterable = foodplaceRepository.findByLocalfood(localfood);
        Iterable<KfoodPlace> iterable = foodplaceRepository.findByLocalfoodAndLang(localfood, lang);
        iterable.forEach(kfoodPlaces::add);

        return kfoodPlaces;
    }
}
