<div align="center">
  
![header](https://capsule-render.vercel.app/api?text=expressTest&animation=fadeIn)

</div> 

## 스택(stacks)
<div align="center">

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white) 

![NODEJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![EXPRESSJS](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

![ESLINT](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![PRETTIER](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)
</div>

## 목적
다음과 같은 기능을 실행 가능한 **블로그** 구현을 목적으로 합니다.
1. 로그인
2. 글 작성 및 편집
3. 검색
4. 댓글
5. 방문자 및 조회수 통계 및 분석
6.구독 및 즐겨찾기

## 구현 기능
**1. 로그인**   
사용자 인증  
사용자마다 권한 관리  

**2. 글 작성 및 편집**  
메인페이지에서 실시간 인기글 및 랭킹 확인 가능하도록 구현  
*좋아요/싫어요 버튼 구현*  
*신고 버튼 구현*  
해당 게시글 url복사 기능 구현(공유)  
글 작성 시 카테고리/태그를 선택할 수 있도록 구현  

**3. 검색**  
글 내용, 제목, 태그 등으로 검색할 수 있는 검색 기능  


**4. 댓글**  
댓글 고정 기능  
*좋아요/싫어요 버튼 구현*  
*신고 버튼 구현*  

**5. 방문자 및 조회수 통계 및 분석**    
통계/분석을 통해 특정 방문자에 대한 글 추천 기능 추가  

**6. 구독 및 즐겨찾기**    
독자들이 특정 사용자,태그,카테고리의 새로운 글을 구독  

## 디렉토리 구성 
**src/**  
**loaders** : 모듈을 입력받아 js에서 처리할 수 있도록  
  **models** : 데이터 베이스 구조 저장  
  **router** : 서버 연결 기능  
  **services** : 서비스 정보를 제공, 서비스를 게시, 검색, 연결할  수 있는 단일 위치를 제공  
  **utils** : 재사용이 가능한 utility함수, 헬퍼 함수 등을 포함하는 dir(예 : 날짜계산, 주어진 객체가 배열인지)  

## 실행 방법
app.js 실행을 통하여 서버 연결  
