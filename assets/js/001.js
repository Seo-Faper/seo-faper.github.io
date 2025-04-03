// By: h01000110 (hi)
// github.com/h01000110

var max = document.getElementsByClassName("btn")[1];
var min = document.getElementsByClassName("btn")[2];

function maximize() {
  var post = document.getElementsByClassName("content")[0];
  var cont = document.getElementsByClassName("post_content")[0];
  var wid =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.getElementsByTagName("body")[0].clientWidth;

  if (wid > 900) {
    widf = wid * 0.9;
    post.style.width = widf + "px";

    if (wid < 1400) {
      cont.style.width = "99%";
    } else {
      cont.style.width = "99.4%";
    }
  }
}

function minimize() {
  var post = document.getElementsByClassName("content")[0];
  var cont = document.getElementsByClassName("post_content")[0];
  var wid =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.getElementsByTagName("body")[0].clientWidth;

  if (wid > 900) {
    post.style.width = "800px";
    cont.style.width = "98.5%";
  }
}

max.addEventListener("click", maximize, false);
min.addEventListener("click", minimize, false);
// 드래그 기능 구현
(function () {
  var content = document.getElementsByClassName("content")[0];
  var titleBar = document.getElementsByClassName("post_title")[0];
  var offsetX, offsetY;

  titleBar.addEventListener("mousedown", function (e) {
    // 드래그 시작 시, 현재 마우스 좌표와 창의 위치 차이를 계산
    offsetX = e.clientX - content.offsetLeft;
    offsetY = e.clientY - content.offsetTop;

    // 드래그 중 mousemove 이벤트와 mouseup 이벤트 등록
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  });

  function mouseMoveHandler(e) {
    // content 요소를 절대 위치로 지정하여 좌표 업데이트
    content.style.left = e.clientX - offsetX + "px";
    content.style.top = e.clientY - offsetY + "px";
  }

  function mouseUpHandler() {
    // 드래그 종료 시 이벤트 리스너 해제
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }
})();
