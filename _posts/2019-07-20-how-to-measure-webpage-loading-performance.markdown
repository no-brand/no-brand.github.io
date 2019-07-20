---
layout: post
title: How to measure web page loading performance
date: 2019-07-20 19:00:00 +0900
description: When you have a trouble with web page loading performance, you need to treat your resources carefully. Big size images must causes delay. # Add post description (optional)
img: chrome-devtools.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [web, chrome-devtools, performance]
---

## 웹페이지 로딩속도 측정방법
로딩속도를 측정해서, 웹페이지가 보여지는데 속도를 저하시키는 요소를 찾아내는 것은 중요합니다.<br>
해당요소의 용량을 줄여서 최적화하는 방향으로 진행해 나가야 합니다. 
<br><br>

## Chrome 개발자도구 사용하기
---
**Step1. 개발자도구**
 - Chrome 개발자도구를 활용하면, 웹 페이지의 네트워크 성능 분석을 손쉽게 할 수 있습니다. <br>
 - 단축키 | `F12` 혹은 `option(⌥) + command(⌘) + I` <br><br>
 [그림 1] Chrome 개발자도구로 진입 <br>
 <img src="/files/web/how-to-measure-webpage-loading-performance-1.png" width="70%">
<br>

**Step2. 네트워크 측정, 현재 문제점 파악**
 - 웹페이지가 로딩되는 요청횟수, 리소스크기, 소요시간을 확인할 수 있습니다. <br>
 - 아래의 경우, **프로필 이미지가 전체 트래픽의 90% 가량**을 차지하는 걸 확인할 수 있습니다. <br>
 - 단축키 | `shift + command(⌘) + R` <br><br>
 [그림 2] 페이지 네트워크 측정 <br>
 ![shift + command(⌘) + R](/files/web/how-to-measure-webpage-loading-performance-2.png "페이지 네트워크 측정")
 <br>

## 문제점 수정하기
---
**Step3. 이미지 사이즈 줄이기**
 ~~~
 ... 
 ~~~

**Step4. 네트워크 성능 재측정**
 - 이미지 사이즈를 수정한 후, **페이지 로딩에 소요되는 리소스 다운로드가 2MB > 304KB로 줄어든걸** 확인할 수 있습니다. <br>
 - 웹페이즈를 구성하는 로소스의 해상도, 크기의 기준에 대해서 정리해야 할 필요가 있습니다. (Todo) <br><br>
 [그림 3] 웹 페이지 로딩속도 개선하기 <br>
 ![](/files/web/how-to-measure-webpage-loading-performance-3.png "웹페이지 로딩속도 개선하기")
 <br>

<br><br>