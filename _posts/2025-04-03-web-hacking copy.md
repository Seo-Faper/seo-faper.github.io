---
layout: default
title: "웹 해킹 입문"
tags: web
---

https://dreamhack.io/wargame/challenges/1578

1번 : banana
2번 : Infinity
3번 : -0

4번에서 f=flag로 f를 지정
l=q로 질문 리스트를 l에 할당
l[3]=f
를 하면 자바스크립트의 얕은 복사에 의해서
const로 선언된 배열 q[3]의 내용이 바뀝니다.

![](https://dreamhack-media.s3.amazonaws.com/attachments/2bd75bd927035e01fb3aff8b2515318836c71cd0a6dfdfab3449edbd0d666fdf.png)

자바스크립트의 깊은 복사와 얕은 복사에 대해서

깊은 복사는 재귀적으로 모든 값을 다 타고 내려가서 복사하는거고

얕은 복사는 최상위 객체의 주소값만 복사하는거

그래서 얕은 복사로 생긴 새로운 객체는 복사한 원본 객체와 동일한 주소를 공유하고 있어서

새로운 객체를 수정하면 연결된 원본 객체가 같이 바뀜

그게 const로 선언된 상수일 지라도..

물론 이건 리스트 같이 객체일 때만 가능함.

왜 그렇냐

const a = [1,2] 를 하는 순간 a라는 상수에 [1,2]에 대한 주소를 할당함

즉, a[0] 주소에 있는 1은 상수도 변수도 뭣도 아닌 그냥 수 라는거

그래서 해당 수를 바꾸면 const로 선언된 a 지만 그 값이 바뀜
