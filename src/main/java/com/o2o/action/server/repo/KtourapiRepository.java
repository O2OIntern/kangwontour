package com.o2o.action.server.repo;

import com.o2o.action.server.db.KtourApi;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface KtourapiRepository extends CrudRepository<KtourApi, Long> {
    public List<KtourApi> findByAreacode(String areacode);
    public List<KtourApi> findByCat3(String cat3);
    public List<KtourApi> findByContentid(String contentid);
    public List<KtourApi> findByContenttypeid(String contenttypeid);
    public List<KtourApi> findByFirstimage(String firstimage);
    public List<KtourApi> findByMapx(String mapx);
    public List<KtourApi> findByMapy(String mapy);
    public List<KtourApi> findByReadcount(String readcount);
    public List<KtourApi> findBySigungucode(String sigungucode);
    public List<KtourApi> findBySigungucode(String sigungucode, Sort sort);
    public List<KtourApi> findBySigungucodeAndLang(String sigungucode, String Lang);
    public List<KtourApi> findByTitle(String title);
    public List<KtourApi> findByTitleContainingAndLang(String title,String Lang);
    public List<KtourApi> findByAddr1(String addr1);
    public List<KtourApi> findByTel(String tel);
    public List<KtourApi> findByCategoryAndLang(String category, String Lang);
    public List<KtourApi> findByCategoryInAndLangAndSigungucode(List<String> list, String Lang, String sigungucode);
    public List<KtourApi> findByCategoryAndSigungucodeAndLang(String category, String sigungucode, String Lang);
    public List<KtourApi> findByLang(String Lang);
    public List<KtourApi> findByCat3AndSigungucodeAndLang(String Cat3, String sigungucode, String Lang);
    public List<KtourApi> findByCat3AndLang(String Cat3, String Lang);
    @Query(value = "select x.* from public.ktour_api x where upper(regexp_replace(x.title, '[[:punct:]]|[[:space:]]', '', 'g')) like concat('%',upper(regexp_replace(:title, '[[:punct:]]|[[:space:]]', '', 'g')), '%') and lang in (:Lang)", nativeQuery = true)
    public List<KtourApi> queryByTitleAndLang(String title, String Lang);
    //그룹핑 정렬 -> 모든 지역의 카운트 불러오기(sigungu 코드 이용) 지도 보여줄 때 카운트 api 함수 쓰고 지역 선택시 관광지 불러오도록
    @Query(value = "select sigungucode, count(*) from public.ktour_api where sigungucode != '' and mapx != '' and theme IN (:theme) group by sigungucode order by sigungucode", nativeQuery = true)
    public List<Map<String, Integer>> queryCountBySigungucode(List<String> theme);
    @Query(value = "select * from public.ktour_api where sigungucode = :sigungucode and category in (:accType)", nativeQuery = true)
    public List<KtourApi> queryAccoBySigungucodeAndTheme(String sigungucode, List<String> accType);
}
