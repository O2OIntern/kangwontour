// jshint esversion: 6
/**
  * 랜덤 번호 생성 함수
  */

 function random_number(min, max) {
 	return Math.floor(Math.random() * (max - min + 1)) + min;
 }
