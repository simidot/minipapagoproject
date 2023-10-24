/*
    용어 정의
    source ~ : 번역할 텍스트, 번역할 언어의 타입(ko, ja..)
    target ~ : 번역된 결과 텍스트, 번역될 언어의 타입(ko, ja..)
*/


let [sourceSelect, targetSelect] = document.getElementsByClassName('form-select');
let [sourceTextArea, targetTextArea] = document.getElementsByClassName('textarea');

let targetLanguage = 'en'; // 기본 값은 '영어'
let inputTimeout;

// 번역할 언어의 타입 변경 이벤트
// 번역 목표 언어인 targetSelect 변경 시 다시 번역되도록

// targetSelect.addEventListener('change', (event) => { // event를 e로 줄여서 사용하기도 함
//     // event - 특정 이벤트(마우스 클릭, 키보드 입력, 값 변경 등) 자체(객체)
//     // target - 해당 이벤트가 발생한 타겟 엘리먼트(태그)
//     // value - 해당 엘리먼트에 바인딩된(할당된) 값
//     targetLanguage = event.target.value; // <select>의 <option> 태그 내에 있는 value attribute 값을 취득
    
//     const text = event.target.value;
//     if (text) {
//         detectLanguage(text);
//     }
// });

// // 번역할 텍스트인 sourceTextArea에 입력된 값 가져오기
// sourceTextArea.addEventListener('input', (event) => {
//         // 이전에 설정한 타이머를 취소
//         clearTimeout(delayTimer);

//          // 새로운 타이머 설정
//         delayTimer = setTimeout(function() {
//             const text = event.target.value; // 입력된 값
//             if (text.trim() !== "") {
//                 // 여기에서 서버 요청을 보내고 결과를 표시
//                 detectLanguage(text);
//             }
//         }, 800); // 500ms(0.5초) 후에 요청 보내도록 설정
// });

targetSelect.addEventListener("change", (event) => {
    targetLanguage = event.target.value;
  
    const text = sourceTextArea.value;
    if (text) {
      detectLanguage(text);
    }
  });
  
  sourceTextArea.addEventListener("input", (event) => {
    clearTimeout(inputTimeout);
    // 2000 밀리초(2초) 후에 트리거할 함수 설정
    inputTimeout = setTimeout(() => triggerEvent(event), 2000); // 화살표 함수를 사용하여 triggerEvent 호출
  });
  
  function triggerEvent(event) {
    const text = event.target.value;
    detectLanguage(text);
    // if (text.trim() !== "") {
    //   sendTranslationRequest(text);
    // }
  }


// 언어 감지 기능 함수
const detectLanguage = (text) => {
    let sourceLanguage;

    const url = '/detect';
    const options = { // 순수 JS 객체
        method: 'POST',
        headers : { //HTTP 요청 시 header에 정보 추가
            'Content-Type' : 'application/json'  
        },
        body : JSON.stringify({ query : text }) //문자열화
    };

    // const xhr = new XMLHttpRequest();
    
    // // 응답이 완료되었을 경우 동작하는 이벤트 핸들러
    // xhr.onload = () => {
    //     if (xhr.status === 200) {
    //         console.log(xhr.response); // 결과 데이터 출력
    //     }
    // }

    // xhr.open('post', url);
    // xhr.send();

    // webAPI, fetch() - JS 내장 메서드
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        sourceLanguage = data.langCode; //언어 감지 결과로 받은 값을 할당
        translateLanguage(sourceLanguage, text);
        sourceSelect.value = sourceLanguage;
    });
    return sourceLanguage;
}

//언어 번역 요청 기능 함수
const translateLanguage = (sourceLanguage, text) => {
    const url = '/translate'; 

    const body = {
        source : sourceLanguage,
        target : targetLanguage,
        text, 
    }

    const options = { // 순수 JS 객체
        method: 'POST',
        headers : { //HTTP 요청 시 header에 정보 추가
            'Content-Type' : 'application/json'  
        },
        body : JSON.stringify(body) //문자열화
    };
    //fetch를 통한 요청 전송
    fetch(url, options)
    .then(response => response.json())
    .then(data => {
        let result = data.message.result.translatedText;
        console.log(result);
        targetTextArea.textContent = result;
    });
}

const switchTarget = (sourceLanguage, targetLanguage, text) => {
    const url = '/switch';

    const body = {
        source : sourceLanguage,
        target : targetLanguage,
        text, 
    }

    const options = { // 순수 JS 객체
        method: 'POST',
        headers : { //HTTP 요청 시 header에 정보 추가
            'Content-Type' : 'application/json'  
        },
        body : JSON.stringify(body) //문자열화
    };
}
