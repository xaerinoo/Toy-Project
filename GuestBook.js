// API로 데이터를 주고받기 위해 원래 코드에서 고쳐야 하는 것:
// 1. 방명록 작성 => POST 요청으로 서버에 저장
// 2. 페이지 로드시 => GET 요청으로 전체 게시글 불러오기
// 3. 게시글 삭제 => DELETE 요청으로 서버에 삭제 요청

// 서버에 저장된 방명록 데이터 불러오기
window.addEventListener('DOMContentLoaded', () => {
    fetch("http://3.39.180.27:8000/posts/")
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                data.data.forEach(post => addLetterCard(post));
            } else {
                alert("방명록을 불러오는 데 실패했습니다.");
            }
        });

});

// 보내기 버튼 클릭 이벤트
document.getElementById('complete-button').addEventListener('click', function() {
    const name = document.getElementById('write-name').value.trim();
    const password = document.getElementById('write-password').value.trim();
    const title = document.getElementById('write-title').value.trim();
    const content = document.getElementById('write-content').value.trim();

    if (!name || !title || !content) {
        alert('작성자, 제목, 내용을 모두 입력했는지 확인해주세요!');
        return;
    }

    fetch("http://3.39.180.27:8000/posts/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: name,
            password: password,
            title: title,
            content: content
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("서버 응답:", data);
        if (data.status === 200) {
            addLetterCard(data.data);
            document.getElementById('write-name').value = '';
            document.getElementById('write-password').value = '';
            document.getElementById('write-title').value = '';
            document.getElementById('write-content').value = '';
        } else {
            alert("방명록 등록에 실패했습니다.")
        }
    })
    .catch(error => {
        console.error("에러 발생:", error);
        alert("방명록 등록 중 에러가 발생했습니다.")
    });
});

// 편지 카드 생성
function addLetterCard(entry) {
    const gallery = document.getElementById('guest-book-gallery');
    const card = document.createElement('div');
    card.className = 'letter-card';
    
    // 제목 추가
    const title = document.createElement('h3');
    title.textContent = entry.title;
    
    // 작성자 추가
    const author = document.createElement('p');
    author.textContent = `작성자: ${entry.user}`;
    
    card.appendChild(title);
    card.appendChild(author);
    gallery.appendChild(card);

    card.addEventListener('click', function() {
        showModal(entry, card);
    });
}

// 모달 띄우기
function showModal(entry, card) {
    console.log("모달 오픈 시도:", entry);
    const modal = document.getElementById('letter-modal');
    document.getElementById('modal-title').textContent = entry.title;
    document.getElementById('modal-author').textContent = `작성자: ${entry.user}`;
    document.getElementById('modal-content').textContent = entry.content;
    document.getElementById('modal-password').value = '';
    modal.style.display = 'block';

    // 삭제 버튼 클릭 이벤트
    const deleteButton = document.getElementById('delete-button');
    deleteButton.onclick = function() {
        const inputPassword = document.getElementById('modal-password').value.trim();
        if (!inputPassword) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if (confirm('정말 삭제하시겠습니까? 🥹')) {
            fetch(`http://3.39.180.27:8000/posts/${entry.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password: inputPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    alert("삭제 성공!");
                    card.remove();
                    modal.style.display = 'none';
                } else {
                    alert("비밀번호가 틀렸습니다!");
                }
            })
            .catch(error => {
                console.error("삭제 요청 중 오류 발생:", error);
                alert("삭제 중 오류가 발생했습니다.");
            });
        }
    };
}

// 모달 닫기
document.getElementById('modal-close').addEventListener('click', function() {
    document.getElementById('letter-modal').style.display = 'none';
});

// 모달 바깥 눌러도 닫기
window.addEventListener('click', function(event) {
    const modal = document.getElementById('letter-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});