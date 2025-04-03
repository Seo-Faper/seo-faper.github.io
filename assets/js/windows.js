document.addEventListener("DOMContentLoaded", function () {
  let zIndexCounter = 100; // z-index 시작값
  let windowOffsetX = 20; // 새 창이 생성될 때 가로 오프셋
  let windowOffsetY = 20; // 새 창이 생성될 때 세로 오프셋

  // 페이지가 로드된 후 모든 post-link에 이벤트 리스너 추가
  addPostLinkListeners();

  function addPostLinkListeners() {
    document.querySelectorAll(".post-link").forEach(function (link) {
      if (!link.hasAttribute("data-event-attached")) {
        link.setAttribute("data-event-attached", "true");

        link.addEventListener("click", function (e) {
          e.preventDefault();

          const postId = this.getAttribute("data-post-id");
          const postTitle = this.getAttribute("data-title");
          const postDate = this.getAttribute("data-date");

          if (!postId) {
            console.error("포스트 ID가 없습니다:", this);
            return;
          }

          // 이미 열려있는 창인지 확인
          const existingWindow = document.querySelector(
            `.content[data-post-id="${postId}"]`
          );

          if (existingWindow) {
            // 이미 열려있는 창이면 활성화
            activateWindow(existingWindow);
          } else {
            // 새 창 생성
            createNewWindow(postId, postTitle, postDate);
          }
        });
      }
    });
  }

  // 새 창 생성 함수
  function createNewWindow(postId, postTitle, postDate) {
    // 필수 데이터 확인
    if (!postId || !document.getElementById("post-" + postId)) {
      console.error(
        "포스트 ID가 없거나 해당 콘텐츠를 찾을 수 없습니다:",
        postId
      );
      return;
    }

    // 새 창 요소 생성
    const newWindow = document.createElement("div");
    newWindow.className = "content";
    newWindow.setAttribute("data-post-id", postId);
    newWindow.setAttribute("id", `window-${Date.now()}`); // 고유 ID 생성

    newWindow.innerHTML = `
        <div class="post_title" style="background: linear-gradient(to right, #000080, #1084d0); padding: 2px 4px 3px 4px; position: relative;">
          <img src="/assets/img/file.png" style="float: left; width: 14px; height: 14px; margin: 0 3px 0 0;" />
          <h1 style="color: #bfb8bf; font-size: 14px; font-weight: bold; display: inline-block;">${postTitle}</h1>
          <a href="javascript:void(0);" class="close-window">
            <div class="btn" style="background: #cccccc; width: 13px; height: 11px; float: right; border: 2px solid; border-color: #fff8ff #000000 #000000 #fff8ff;">
              <span class="fa fa-times" style="font-size: 11px; position: relative; left: 2px; top: -2px;"></span>
            </div>
          </a>
          <div class="btn btn_max" style="background: #cccccc; width: 13px; height: 11px; float: right; border: 2px solid; border-color: #fff8ff #000000 #000000 #fff8ff; margin: 0 3px 0 0;">
            <span class="fa fa-window-maximize" style="font-size: 10px; position: relative; left: 1px; top: -2px;"></span>
          </div>
          <div class="btn btn_min" style="background: #cccccc; width: 13px; height: 11px; float: right; border: 2px solid; border-color: #fff8ff #000000 #000000 #fff8ff;">
            <span class="fa fa-window-minimize" style="font-size: 10px; position: relative; left: 1px; top: -2px;"></span>
          </div>
        </div>
        <ul class="topbar" style="list-style: none; padding: 0 10px; margin: 3px 0 3px 0;">
          <li style="display: inline-block; margin: 0 5px 0 0;">${
            postDate || "날짜 정보 없음"
          }</li>
        </ul>
        <div class="post_content" style="background: #fff8ff; border-width: 2px; border-style: ridge groove groove ridge; border-color: #7f787f #fff8ff #fff8ff #7f787f; width: 98.5%; margin: 0 auto; min-height: 300px; max-height: 600px; overflow-y: auto; padding: 2px;">
          ${document.getElementById("post-" + postId).innerHTML}
        </div>
        <div class="resize-handle resize-handle-e" style="position: absolute; width: 8px; height: 100%; top: 0; right: 0; cursor: e-resize;"></div>
        <div class="resize-handle resize-handle-s" style="position: absolute; width: 100%; height: 8px; bottom: 0; left: 0; cursor: s-resize;"></div>
        <div class="resize-handle resize-handle-se" style="position: absolute; width: 15px; height: 15px; bottom: 0; right: 0; cursor: se-resize;"></div>
      `;

    // 초기 위치 설정 (창이 겹치지 않도록)
    const windowCount = document.querySelectorAll(".content").length;
    newWindow.style.top = `${100 + windowOffsetY * windowCount}px`;
    newWindow.style.left = `${200 + windowOffsetX * windowCount}px`;

    // Windows 98 스타일 추가
    newWindow.style.backgroundColor = "#bfb8bf";
    newWindow.style.border = "2px solid";
    newWindow.style.borderColor = "#fff8ff #000000 #000000 #fff8ff";
    newWindow.style.padding = "2px 0";

    // 문서에 새 창 추가
    document.body.appendChild(newWindow);

    // 창 표시
    newWindow.style.display = "block";

    // 이벤트 리스너 추가
    setupWindowEventListeners(newWindow);

    // 리사이징 이벤트 리스너 설정
    setupResizeEventListeners(newWindow);

    // 활성화
    activateWindow(newWindow);

    // 코드 블록 하이라이팅 재실행 (필요한 경우)
    if (window.hljs) {
      newWindow.querySelectorAll("pre code").forEach((block) => {
        window.hljs.highlightBlock(block);
      });
    }

    // 여기에 모바일 환경 처리 코드 추가
    if (window.innerWidth <= 768) {
      // 모바일 환경 감지
      // 위치/크기 재설정
      newWindow.style.position = "relative";
      newWindow.style.top = "auto";
      newWindow.style.left = "auto";
      newWindow.style.width = "95%";
      newWindow.style.margin = "10px auto";

      // 포스트 내용 높이 자동 조정
      const postContent = newWindow.querySelector(".post_content");
      if (postContent) {
        postContent.style.maxHeight = "none";
        postContent.style.height = "auto";
        postContent.style.overflowY = "visible";
      }

      // 리사이징 핸들 숨기기
      const handles = newWindow.querySelectorAll(".resize-handle");
      handles.forEach(function (handle) {
        handle.style.display = "none";
      });

      // 스크롤을 새로 열린 창으로 이동
      setTimeout(function () {
        window.scrollTo({
          top: newWindow.offsetTop,
          behavior: "smooth",
        });
      }, 100);
    }
  }

  // 창 이벤트 리스너 설정
  function setupWindowEventListeners(windowElement) {
    // 창 활성화
    windowElement.addEventListener("mousedown", function () {
      activateWindow(this);
    });

    // 닫기 버튼
    windowElement
      .querySelector(".close-window")
      .addEventListener("click", function (e) {
        e.preventDefault();
        windowElement.remove();
      });

    // 최대화 버튼
    windowElement
      .querySelector(".btn_max")
      .addEventListener("click", function () {
        maximize(windowElement);
      });

    // 최소화 버튼
    windowElement
      .querySelector(".btn_min")
      .addEventListener("click", function () {
        minimize(windowElement);
      });

    // 드래그 기능
    setupDrag(windowElement);
  }

  // 리사이징 이벤트 리스너 설정
  function setupResizeEventListeners(windowElement) {
    const handleE = windowElement.querySelector(".resize-handle-e"); // 오른쪽
    const handleS = windowElement.querySelector(".resize-handle-s"); // 아래쪽
    const handleSE = windowElement.querySelector(".resize-handle-se"); // 오른쪽 아래 대각선

    // 오른쪽 핸들 (가로 리사이징)
    handleE.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      activateWindow(windowElement);
      setupResize(windowElement, e, "e");
    });

    // 아래쪽 핸들 (세로 리사이징)
    handleS.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      activateWindow(windowElement);
      setupResize(windowElement, e, "s");
    });

    // 대각선 핸들 (가로+세로 리사이징)
    handleSE.addEventListener("mousedown", function (e) {
      e.preventDefault();
      e.stopPropagation();
      activateWindow(windowElement);
      setupResize(windowElement, e, "se");
    });
  }

  // 리사이즈 기능 설정
  function setupResize(windowElement, startEvent, direction) {
    startEvent.preventDefault();
    const startX = startEvent.clientX;
    const startY = startEvent.clientY;
    const startWidth = windowElement.offsetWidth;
    const startHeight = windowElement.offsetHeight;
    const minWidth = 400; // 최소 너비
    const minHeight = 200; // 최소 높이

    // 리사이징 중 mousemove 이벤트 처리
    function handleResizeMove(e) {
      e.preventDefault();

      if (direction === "e" || direction === "se") {
        // 가로 리사이징
        const newWidth = Math.max(minWidth, startWidth + e.clientX - startX);
        windowElement.style.width = `${newWidth}px`;

        // 콘텐츠 영역의 너비 조정
        const postContent = windowElement.querySelector(".post_content");
        if (postContent) {
          if (newWidth < 500) {
            postContent.style.width = "97%";
          } else if (newWidth < 800) {
            postContent.style.width = "98%";
          } else {
            postContent.style.width = "98.5%";
          }
        }
      }

      if (direction === "s" || direction === "se") {
        // 세로 리사이징
        const newHeight = Math.max(minHeight, startHeight + e.clientY - startY);
        windowElement.style.height = `${newHeight}px`;

        // 콘텐츠 영역의 높이 조정
        const postContent = windowElement.querySelector(".post_content");
        if (postContent) {
          const titleHeight =
            windowElement.querySelector(".post_title").offsetHeight;
          const topbarHeight =
            windowElement.querySelector(".topbar").offsetHeight;
          const padding = 20; // 여백 고려

          const contentHeight =
            newHeight - titleHeight - topbarHeight - padding;
          postContent.style.height = `${contentHeight}px`;
          postContent.style.maxHeight = `${contentHeight}px`;
        }
      }
    }

    // 리사이징 완료 시 이벤트 리스너 제거
    function handleResizeUp() {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeUp);
    }

    // 이벤트 리스너 등록
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeUp);
  }

  // 창 활성화 함수
  function activateWindow(windowElement) {
    // 모든 창에서 활성화 클래스 제거 및 비활성 스타일 적용
    document.querySelectorAll(".content").forEach((window) => {
      window.classList.remove("active");

      // 비활성화된 창의 타이틀 바 색상 변경
      const titleBar = window.querySelector(".post_title");
      if (titleBar) {
        titleBar.style.background =
          "linear-gradient(to right, #808080, #a0a0a0)";
        const title = titleBar.querySelector("h1");
        if (title) {
          title.style.color = "#d8d8d8";
        }
      }
    });

    // 현재 창에 활성화 클래스 추가 및 활성 스타일 적용
    windowElement.classList.add("active");

    // 활성화된 창의 타이틀 바 색상 변경
    const titleBar = windowElement.querySelector(".post_title");
    if (titleBar) {
      titleBar.style.background = "linear-gradient(to right, #000080, #1084d0)";
      const title = titleBar.querySelector("h1");
      if (title) {
        title.style.color = "#bfb8bf";
      }
    }

    // z-index 증가
    windowElement.style.zIndex = ++zIndexCounter;
  }

  // 드래그 기능 설정
  function setupDrag(windowElement) {
    const titleBar = windowElement.querySelector(".post_title");
    let offsetX, offsetY;

    titleBar.addEventListener("mousedown", function (e) {
      // 다른 요소(버튼 등)를 클릭했을 때는 드래그 시작하지 않음
      if (e.target.closest(".btn")) {
        return;
      }

      // 창 활성화
      activateWindow(windowElement);

      // 드래그 시작 시, 현재 마우스 좌표와 창의 위치 차이를 계산
      offsetX = e.clientX - windowElement.offsetLeft;
      offsetY = e.clientY - windowElement.offsetTop;

      // 드래그 중 mousemove 이벤트와 mouseup 이벤트 등록
      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);

      // 기본 동작과 버블링 방지
      e.preventDefault();
    });

    function mouseMoveHandler(e) {
      // 윈도우 경계를 벗어나지 않도록 위치 계산
      let newLeft = e.clientX - offsetX;
      let newTop = e.clientY - offsetY;

      // 음수 위치 방지 (화면 밖으로 나가지 않도록)
      newLeft = Math.max(0, newLeft);
      newTop = Math.max(0, newTop);

      // 창의 위치 업데이트
      windowElement.style.left = newLeft + "px";
      windowElement.style.top = newTop + "px";
    }

    function mouseUpHandler() {
      // 드래그 종료 시 이벤트 리스너 해제
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    }
  }

  // 창 최대화 함수
  function maximize(windowElement) {
    const content = windowElement;
    const postContent = windowElement.querySelector(".post_content");
    const wid =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.getElementsByTagName("body")[0].clientWidth;

    if (wid > 900) {
      const widf = wid * 0.9;
      content.style.width = widf + "px";
      content.style.left = (wid - widf) / 2 + "px";
      content.style.top = "50px";

      if (wid < 1400) {
        postContent.style.width = "99%";
      } else {
        postContent.style.width = "99.4%";
      }

      // 최대화 시 높이도 조정
      const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.getElementsByTagName("body")[0].clientHeight;
      const titleHeight =
        windowElement.querySelector(".post_title").offsetHeight;
      const topbarHeight = windowElement.querySelector(".topbar").offsetHeight;
      const padding = 20;

      content.style.height = height * 0.8 + "px";
      postContent.style.height =
        height * 0.8 - titleHeight - topbarHeight - padding + "px";
      postContent.style.maxHeight =
        height * 0.8 - titleHeight - topbarHeight - padding + "px";
    }
  }

  // 창 최소화 함수
  function minimize(windowElement) {
    const content = windowElement;
    const postContent = windowElement.querySelector(".post_content");

    content.style.width = "800px";
    content.style.height = "auto";
    postContent.style.width = "98.5%";
    postContent.style.height = "";
    postContent.style.maxHeight = "600px";
  }

  // AJAX 콘텐츠 로드 후에도 이벤트 리스너가 작동하도록 설정
  if (window.MutationObserver) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === 1) {
              // Element 노드인 경우만
              // 새로 추가된 노드에 post-link가 있는지 확인
              const links = node.querySelectorAll
                ? node.querySelectorAll(".post-link")
                : [];
              if (links.length > 0) {
                addPostLinkListeners();
              }
            }
          }
        }
      });
    });

    // document.body의 변경사항 감시 (태그 페이지 로드 등)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
});
