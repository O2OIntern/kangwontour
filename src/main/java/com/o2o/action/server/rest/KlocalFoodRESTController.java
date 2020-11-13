package com.o2o.action.server.rest;

import com.o2o.action.server.db.KlocalFood;
import com.o2o.action.server.repo.LocalfoodRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class KlocalFoodRESTController {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    LocalfoodRepository localfoodRepository;

    @GetMapping(value = "/localfood")
    public List<KlocalFood> getLocalfood(
            @RequestParam(value = "lang", defaultValue = "ko") String lang
    ) {

        List<KlocalFood> klocalFoods = new ArrayList<KlocalFood>();
        Iterable<KlocalFood> iterable = localfoodRepository.findByLang(lang);
        iterable.forEach(klocalFoods::add);

        return klocalFoods;
    }

    @GetMapping(value = "/findlocalfood")
    public List<KlocalFood> getLocationname(
            @RequestParam("locationname") String locationname
            ,
            @RequestParam(value = "lang",defaultValue = "ko") String lang
    ) {

        List<KlocalFood> klocalFoods = new ArrayList<KlocalFood>();
        //Iterable<KlocalFood> iterable = localfoodRepository.findByLocationname(locationname);
        Iterable<KlocalFood> iterable = localfoodRepository.findByLocationnameAndLang(locationname, lang);
        iterable.forEach(klocalFoods::add);

        return klocalFoods;
    }
}
