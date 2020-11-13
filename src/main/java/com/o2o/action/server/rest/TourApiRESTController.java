package com.o2o.action.server.rest;

import com.o2o.action.server.app.KangwonTour;
import com.o2o.action.server.db.KtourApi;
import com.o2o.action.server.repo.KtourapiRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import org.springframework.http.converter.json.GsonBuilderUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.ls.LSOutput;

import java.math.BigInteger;
import java.util.*;

@RestController
public class TourApiRESTController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TourApiRESTController.class);
    @Autowired
    KtourapiRepository ktourapiRepository;

    @GetMapping(value = "/tourapi")
    public List<KtourApi> getTourapi(
            @RequestParam(value = "lang",defaultValue = "ko") String lang

    ) {

        List<KtourApi>  ktourApis= new ArrayList<KtourApi>();;
        Iterable<KtourApi> iterable;
        if (lang.equals("en") || lang.equals("ko") )
            iterable = ktourapiRepository.findByLang(lang);
        else
            iterable = ktourapiRepository.findByLang("ko");
            //iterable = ktourapiRepository.findAll();
        iterable.forEach(ktourApis::add);

        return ktourApis;
    }

    @GetMapping(value = "/findtoruapi")
    public List<KtourApi> getTableTitle(
            @RequestParam("title") String title
            ,
            @RequestParam(value = "lang",defaultValue = "ko") String lang
    ) {

        List<KtourApi> ktourApis = new ArrayList<KtourApi>();
        //Iterable<KtourApi> iterable = ktourapiRepository.findByTitle(title);
//        Iterable<KtourApi> iterable = ktourapiRepository.findByTitleContainingAndLang(title, lang);
        //Iterable<KtourApi> iterable = ktourapiRepository.queryByTitleAndLang(title, lang);
        Iterable<KtourApi> iterable = ktourapiRepository.queryByTitleAndLang(title, lang);
        iterable.forEach(ktourApis::add);

        return ktourApis;
    }
    @GetMapping(value = "/findcategory")
    public List<KtourApi> getCategory(
            @RequestParam("category") String category
            ,
            @RequestParam(value = "sigungucode" ) String sigungucode
            ,
            @RequestParam(value = "lang",defaultValue = "ko") String lang
    ) {

        LOGGER.info("###Category  : " + category);
        LOGGER.info("###Sigungucode : " + sigungucode);
        LOGGER.info("###Lang : " + lang);
        List<KtourApi> ktourApis = new ArrayList<KtourApi>();
        Iterable<KtourApi> iterable;
        if (sigungucode.equals("32"))
            iterable = ktourapiRepository.findByCategoryAndLang(category, lang);
        else {
            if (category.equals("숙박업소")) {
                List<String> list = new ArrayList<>();
                list.add("호텔");
                list.add("모텔");
                list.add("콘도");
                list.add("펜션");
                list.add("게스트하우스");
                iterable = ktourapiRepository.findByCategoryInAndLangAndSigungucode(list, lang, sigungucode) ;
            }
            else if (category.equals("관광지")) {
                List<String> list = new ArrayList<>();
                list.add("자연 속 힐링");
                list.add("문화 속 힐링");
                list.add("액티비티");
                list.add("역사");
                list.add("쇼핑");
                iterable = ktourapiRepository.findByCategoryInAndLangAndSigungucode(list, lang, sigungucode) ;
            }
            else
            {
                iterable = ktourapiRepository.findByCategoryAndSigungucodeAndLang(category, sigungucode, lang);
            }
        }
        iterable.forEach(ktourApis::add);

        return ktourApis;
    }
    @GetMapping(value = "/findsigungucode")
    public List<KtourApi> getSigungucode(@RequestParam("sigungucode") String code, @RequestParam(value = "lang",defaultValue = "ko") String lang) {

        List<KtourApi> ktourApis = new ArrayList<KtourApi>();
        Iterable<KtourApi> iterable = ktourapiRepository.findBySigungucodeAndLang(code, lang);
        iterable.forEach(ktourApis::add);

        return ktourApis;
    }

    @GetMapping(value = "/findcat3")
    public List<KtourApi> getCat3(
            @RequestParam("cat3") String cat3
            ,
            @RequestParam(value = "lang",defaultValue = "ko") String lang
            ,
            @RequestParam("sigungucode") String code
    ) {

        List<KtourApi> ktourApis = new ArrayList<KtourApi>();
        Iterable<KtourApi> iterable;
        if(code.equals("32")){
            iterable = ktourapiRepository.findByCat3AndLang(cat3, lang);
        } else {
            iterable = ktourapiRepository.findByCat3AndSigungucodeAndLang(cat3, code, lang);
        }
        iterable.forEach(ktourApis::add);

        return ktourApis;
    }
//
//    public List<KtourApi> getTableSigungucode(@RequestParam("sigungucode") String code, Sort sort) {
//
//        List<KtourApi> ktourApis = new ArrayList<KtourApi>();
//        Iterable<KtourApi> iterable = ktourapiRepository.findBySigungucode(code, sort);
//        iterable.forEach(ktourApis::add);
//
//        return ktourApis;
//    }

    @GetMapping(value = "/sigungu/count")
    public Map<Integer, Integer> getCountBySigungucode(@RequestParam("theme") String theme) {

        List<String> list = new ArrayList<>();

        if("one".equals(theme)) {
            list.add("문화 속 힐링");
            list.add("전통");
        } else if("two".equals(theme)) {
            list.add("자연 속 힐링");
            list.add("문화 속 힐링");
        } else if("three".equals(theme)) {
            list.add("전통");
        } else if("four".equals(theme)) {
            list.add("문화 속 힐링");
            list.add("액티비티");
            list.add("쇼핑");
        } else if("five".equals(theme)) {
            list.add("자연 속 힐링");
            list.add("액티비티");
        } else {
            list.add("문화 속 힐링");
            list.add("액티비티");
        }

        List<Map<String, Integer>> result = ktourapiRepository.queryCountBySigungucode(list);

        Map<Integer, Integer> response = new HashMap<>();
        int sigungucode = 0;
        int count = 0;

        for(Map<String, Integer> map : result) { //key : sigungucode, count / value : 숫자
            for(Map.Entry<String, Integer> entry : map.entrySet()) {
                String key = entry.getKey();
                int value = Integer.parseInt(String.valueOf(entry.getValue()));
                if (key.equals("sigungucode")) sigungucode = value;
                else count = value;
            }
            response.put(sigungucode, count); //key : sigungucode value, value : count value
        }

        System.out.println(response);

        return response;
    }

    @GetMapping(value = "/sigungu/accommodation")
    public List<KtourApi> getAccommodationBySigungucodeAndTheme(@RequestParam("sigungucode") String sigungucode, @RequestParam("theme") String theme) {

        System.out.println("sigungucode >>>> " + sigungucode);

        List<String> list = new ArrayList<>();

        if("one".equals(theme) || "three".equals(theme)) {
            list.add("모텔");
            list.add("게스트하우스");
        } else if("two".equals(theme) || "four".equals(theme) || "six".equals(theme)) {
            list.add("호텔");
            list.add("콘도");
            list.add("펜션");
        } else if("five".equals(theme)) {
            list.add("게스트하우스");
            list.add("호텔");
        } else if("seven".equals(theme)){
            list.add("모텔");
            list.add("게스트하우스");
            list.add("호텔");
        } else if("eight".equals(theme)){
            list.add("모텔");
            list.add("호텔");
            list.add("펜션");
        }

        List<KtourApi> result = ktourapiRepository.queryAccoBySigungucodeAndTheme(sigungucode, list);

        System.out.println("accommodation result index 1 >>> " + result.size());

        return result;
    }

    @GetMapping(value = "/film")
    public List<KtourApi> getAttractionByFilm() {

        List<KtourApi> result = ktourapiRepository.findByfilm("1");

        System.out.println(result);
        return result;
    }
}


