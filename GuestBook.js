// 편지 데이터를 저장할 배열
let guestBookEntries = [];

// 보내기 버튼 클릭 이벤트
document.getElementById('complete-button').addEventListener('click', function() {
    const name = document.getElementById('write-name').value.trim();
    const password = document.getElementById('write-password').value.trim();
    const title = document.getElementById('write-title').value.trim();
    const content = document.getElementById('write-content').value.trim();

    if (!name || !title || !content) {
        alert('📢 작성자, 제목, 내용을 모두 입력했는지 확인해주세요!');
        return;
    }

    const entry = { name, password, title, content };
    guestBookEntries.push(entry);
    addLetterCard(entry);

    document.getElementById('write-name').value = '';
    document.getElementById('write-password').value = '';
    document.getElementById('write-title').value = '';
    document.getElementById('write-content').value = '';
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
    author.textContent = `작성자: ${entry.name}`;
    
    card.appendChild(title);
    card.appendChild(author);
    gallery.appendChild(card);
    card.dataset.index = guestBookEntries.length - 1;

    card.addEventListener('click', function() {
        showModal(entry, card);
    });
}

// 모달 뿌리기
function showModal(entry, card) {
    const modal = document.getElementById('letter-modal');
    document.getElementById('modal-title').textContent = entry.title;
    document.getElementById('modal-author').textContent = `작성자: ${entry.name}`;
    document.getElementById('modal-content').textContent = entry.content;
    document.getElementById('modal-password').value = '';
    modal.style.display = 'block';

    // 삭제 버튼 클릭 이벤트
    const deleteButton = document.getElementById('delete-button');
    deleteButton.onclick = function() {
        const inputPassword = document.getElementById('modal-password').value.trim();
        if (inputPassword === entry.password) {
            if (confirm('정말 삭제하시겠습니까? 🥹')) {
                deleteEntry(card.dataset.index, card);
                modal.style.display = 'none';
            }
        } else {
            alert('비밀번호가 틀렸습니다! 😓');
        }
    };
}

// 방명록 삭제
function deleteEntry(index, card) {
    guestBookEntries.splice(parseInt(index), 1);
    card.remove();
    const cards = document.querySelectorAll('.letter-card');
    cards.forEach((c, i) => c.dataset.index = i);
}

document.getElementById('modal-close').addEventListener('click', function() {
    document.getElementById('letter-modal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('letter-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});