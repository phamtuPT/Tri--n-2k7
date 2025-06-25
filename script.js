// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7L_ha4apWhMHRGUSQkFG7RFK1MCT4snk",
  authDomain: "data-aeck-tri-an.firebaseapp.com",
  projectId: "data-aeck-tri-an",
  storageBucket: "data-aeck-tri-an.appspot.com",
  messagingSenderId: "35346305667",
  appId: "1:35346305667:web:5722c20978b0a8ac4001b6",
  measurementId: "G-T4KRKX2KW1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Chức năng điều khiển âm thanh
const audioControl = document.getElementById('audioControl');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

audioControl.addEventListener('click', function() {
  if (isPlaying) {
    bgMusic.pause();
    audioControl.textContent = '🔇';
    audioControl.classList.remove('playing');
    isPlaying = false;
  } else {
    bgMusic.play().catch(function(error) {
      console.log('Không thể phát nhạc:', error);
    });
    audioControl.textContent = '🔊';
    audioControl.classList.add('playing');
    isPlaying = true;
  }
});

// Tự động phát nhạc khi trang load (nếu trình duyệt cho phép)
document.addEventListener('DOMContentLoaded', function() {
  // Thử phát nhạc tự động
  bgMusic.play().then(function() {
    audioControl.textContent = '🔊';
    audioControl.classList.add('playing');
    isPlaying = true;
  }).catch(function(error) {
    console.log('Không thể tự động phát nhạc:', error);
    // Giữ nguyên trạng thái tắt
  });
});

// Chức năng Modal ghi danh
const registerBtn = document.getElementById('registerBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const registerForm = document.getElementById('registerForm');

// Mở modal
registerBtn.addEventListener('click', function() {
  modalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden'; // Ngăn scroll
});

// Đóng modal
function closeModalFunc() {
  modalOverlay.classList.remove('show');
  document.body.style.overflow = 'auto'; // Cho phép scroll lại
  registerForm.reset(); // Reset form
}

closeModal.addEventListener('click', closeModalFunc);
cancelBtn.addEventListener('click', closeModalFunc);

// Đóng modal khi click bên ngoài
modalOverlay.addEventListener('click', function(e) {
  if (e.target === modalOverlay) {
    closeModalFunc();
  }
});

// Xử lý form submit
registerForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const studentName = document.getElementById('studentName').value.trim();
  const studentWish = document.getElementById('studentWish').value.trim();
  const studentMessage = document.getElementById('studentMessage').value.trim();
  
  if (!studentName || !studentWish) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }
  
  // Disable submit button để tránh spam
  const submitBtn = registerForm.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Đang gửi...';
  
  // Tạo object dữ liệu học sinh
  const newStudent = {
    name: studentName,
    wish: studentWish,
    message: studentMessage,
    date: new Date().toISOString(),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  // Lưu vào Firebase
  saveStudentToFirebase(newStudent);
});

// Lưu học sinh vào Firebase
async function saveStudentToFirebase(student) {
  try {
    // Lấy số thứ tự hiện tại (dựa trên số lượng lời chúc mặc định + số học sinh đã ghi danh)
    const snapshot = await db.collection('students').orderBy('timestamp', 'asc').get();
    const stt = messages.length + snapshot.size + 1;
    await db.collection('students').add(student);
    addStudentToList(student, false, stt);
    showSuccessMessage(stt);
    closeModalFunc();
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
    alert('Có lỗi xảy ra, vui lòng thử lại!');
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gửi Lời Chúc ✨';
  }
}

function showSuccessMessage(stt) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <div class="success-content">
      <h3>🎉 Đăng ký thành công!</h3>
      <p>Bạn là người ghi danh số <b style='color:#d32f2f;font-size:1.3em;'>#${stt}</b>! Hãy nhớ số này để tra cứu và nhận lời chúc nhé.<br>AECK sẽ gửi lời chúc tốt đẹp nhất đến bạn!</p>
      <button onclick="this.parentElement.parentElement.remove()">Đóng</button>
    </div>
  `;
  successDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    animation: fadeIn 0.3s ease;
  `;
  const successContent = successDiv.querySelector('.success-content');
  successContent.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    max-width: 400px;
    margin: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  `;
  successContent.querySelector('button').style.cssText = `
    background: linear-gradient(135deg, #ff5252 0%, #d32f2f 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 15px;
    font-weight: 600;
  `;
  document.body.appendChild(successDiv);
  setTimeout(() => {
    if (successDiv.parentElement) {
      successDiv.remove();
    }
  }, 4000);
}

// Modal xem lời chúc chi tiết
const wishModalOverlay = document.getElementById('wishModalOverlay');
const wishModalClose = document.getElementById('wishModalClose');
const wishModalBody = document.getElementById('wishModalBody');

function showWishModal(message) {
  wishModalBody.innerHTML = `
    <div class='wish-modal-title'>Đôi lời nhắn nhủ tới em</div>
    <div class='typewriter' id='typewriterText'></div>
    <div class='wish-signature' id='wishSignature' style='display:none;'>
      <span class='wish-signature-inner' id='signTypewriter'></span>
    </div>
    <div class='signature-container' id='signatureContainer' style='display:none;'>
      <img src='sign.png' class='signature-img' id='signatureImg' alt='Chữ ký AECK'/>
      <svg class='pen' id='penSVG' viewBox='0 0 48 48'>
        <image href='pen.png' width='48' height='48'/>
      </svg>
    </div>
  `;
  wishModalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  // Hiệu ứng đánh máy nội dung chính
  const text = `Hi em! Vậy là chuyến tàu thanh xuân của chúng ta sắp dừng lại và một chặng đường mới sắp mở ra. Hi vọng chúng ta đã có những giây phút đẹp khi được đồng hành cùng nhau trong quãng thời gian vừa rồi. Sau cùng, ${message} Chúc chặng đường sắp tới của em ngày càng rực rỡ và thành công hơn nhé!`;
  typeWriterEffect('typewriterText', text, 0, 80, () => {
    document.getElementById('wishSignature').style.display = '';
    // Hiệu ứng đánh máy cho dòng ký tên
    typeWriterEffect('signTypewriter', 'Đại diện <b>AECK</b> - Anh Tú', 0, 40, () => {
      document.getElementById('signatureContainer').style.display = '';
      animateSignature();
    });
  });
}

function typeWriterEffect(elementId, text, i, speed, callback) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (i <= text.length) {
    el.innerHTML = text.slice(0, i) + '<span style="border-right:2px solid #764ba2;">&nbsp;</span>';
    setTimeout(() => typeWriterEffect(elementId, text, i + 1, speed, callback), speed);
  } else {
    el.innerHTML = text;
    if (callback) callback();
  }
}

// Animation bút máy và chữ ký
function animateSignature() {
  const pen = document.getElementById('penSVG');
  const signImg = document.getElementById('signatureImg');
  if (!pen || !signImg) return;
  // Path mô phỏng đường ký (từ trên xuống dưới, dao động trái phải)
  const pathLength = 80; // chiều cao ảnh chữ ký
  let progress = 0;
  signImg.style.opacity = 1;
  signImg.style.maskImage = signImg.style.webkitMaskImage = `linear-gradient(180deg, #000 0%, transparent 0%)`;
  function step() {
    progress += 0.5; // tốc độ vẽ
    if (progress > pathLength) progress = pathLength;
    // Dao động trái phải theo hình sin
    const amplitude = 30; // px
    const frequency = 2; // số lần lắc
    const offsetX = 100 + Math.sin(progress / pathLength * Math.PI * frequency) * amplitude;
    pen.style.transform = `translate(${offsetX}px, ${progress}px)`;
    // Lộ dần chữ ký theo chiều dọc
    signImg.style.maskImage = signImg.style.webkitMaskImage = `linear-gradient(180deg, #000 0%, #000 ${progress/pathLength*100}%, transparent ${progress/pathLength*100}%)`;
    if (progress < pathLength) {
      requestAnimationFrame(step);
    } else {
      pen.style.opacity = 0;
      signImg.style.maskImage = signImg.style.webkitMaskImage = 'none';
    }
  }
  pen.style.opacity = 1;
  requestAnimationFrame(step);
}

function hideWishModal() {
  wishModalOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
}

wishModalClose.addEventListener('click', hideWishModal);
wishModalOverlay.addEventListener('click', function(e) {
  if (e.target === wishModalOverlay) hideWishModal();
});

// Gắn sự kiện click cho từng li sau khi render
function attachWishModalEvents() {
  const ul = document.getElementById('gratitude-list');
  Array.from(ul.children).forEach(li => {
    li.style.cursor = 'pointer';
    li.onclick = function() {
      // Lấy nội dung lời chúc (bỏ số thứ tự và icon)
      const msg = li.textContent.replace(/^\s*\d+\./, '').replace(/^\s*\S+\s*/, '').trim();
      showWishModal(msg);
    };
  });
}

// Hiển thị danh sách mặc định (luôn ở đầu)
function showDefaultMessages() {
  const ul = document.getElementById('gratitude-list');
  ul.innerHTML = '';
  const icons = ["❤️", "🌟", "🎉", "✨", "🍀", "🎓", "💖", "🥇", "🌈", "🦋", "🌻", "💐", "🧡", "🎵", "🎈", "🌺"];
  messages.forEach((msg, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class='stt'>${i + 1}.</span> <span class=\"icon\">${icons[i%icons.length]}</span> ` + msg;
    li.style.setProperty('--delay', `${i*0.04+0.1}s`);
    ul.appendChild(li);
  });
  attachWishModalEvents();
}

// Load danh sách học sinh từ Firebase (real-time, append xuống cuối)
function loadStudentsFromFirebaseRealtime() {
  const ul = document.getElementById('gratitude-list');
  showDefaultMessages();
  db.collection('students')
    .orderBy('timestamp', 'asc')
    .limit(50)
    .onSnapshot(snapshot => {
      while (ul.children.length > messages.length) {
        ul.removeChild(ul.lastChild);
      }
      let stt = messages.length;
      snapshot.forEach(doc => {
        const student = doc.data();
        stt++;
        addStudentToList(student, true, stt);
      });
      attachWishModalEvents();
    }, error => {
      console.error('Lỗi khi lắng nghe dữ liệu:', error);
    });
}

// Thêm học sinh vào danh sách hiển thị (append cuối, có số thứ tự)
function addStudentToList(student, noDelay, stt) {
  const ul = document.getElementById('gratitude-list');
  const icons = ["❤️", "🌟", "🎉", "✨", "🍀", "🎓", "💖", "🥇", "🌈", "🦋", "🌻", "💐", "🧡", "🎵", "🎈", "🌺"];
  const li = document.createElement('li');
  const iconIndex = Math.floor(Math.random() * icons.length);
  const message = `AECK chúc em ${student.name} thi tốt và đỗ ${student.wish}.`;
  li.innerHTML = `<span class='stt'>${stt}.</span> <span class=\"icon\">${icons[iconIndex]}</span> ${message}`;
  li.style.setProperty('--delay', noDelay ? '0s' : '0.1s');
  li.style.opacity = '0';
  li.style.transform = 'translateY(30px)';
  ul.appendChild(li); // luôn thêm vào cuối
  setTimeout(() => {
    li.style.animation = 'fadeInUp 0.7s forwards';
  }, 100);
}

// Hiệu ứng nền trái tim bay
const canvas = document.querySelector('.hearts-bg');
const ctx = canvas.getContext('2d');
let hearts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function randomHeart() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 20 + Math.random() * 40,
    size: 16 + Math.random() * 18,
    speed: 0.5 + Math.random() * 1.2,
    drift: (Math.random() - 0.5) * 0.7,
    alpha: 0.18 + Math.random() * 0.18,
    color: Math.random() > 0.5 ? '#fda085' : '#f6d365',
  };
}

for (let i = 0; i < 50; i++) hearts.push(randomHeart());

function drawHeart(x, y, size, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size * 0.3);
  ctx.bezierCurveTo(x - size / 2, y + size * 0.7, x, y + size * 0.9, x, y + size * 1.2);
  ctx.bezierCurveTo(x, y + size * 0.9, x + size / 2, y + size * 0.7, x + size / 2, y + size * 0.3);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let h of hearts) {
    drawHeart(h.x, h.y, h.size, h.color, h.alpha);
    h.y -= h.speed;
    h.x += h.drift;
    if (h.y < -40 || h.x < -40 || h.x > canvas.width + 40) {
      Object.assign(h, randomHeart());
      h.y = canvas.height + 20;
    }
  }
  requestAnimationFrame(animateHearts);
}

animateHearts();

// Danh sách lời chúc mặc định
const messages = [
  "AECK chúc em Đinh Thị Hương Thuỳ thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Hoàng Tuấn Đạt thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Thành Nguyễn thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Vũ Huyền thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Nguyễn Tấn Phát thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Trịnh Phong thi tốt và đỗ EE2.",
  "AECK chúc em Nguyễn Thị Thuý Hiền thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Doãn Hưng thi tốt và đỗ ME-E1 HUST.",
  "AECK chúc em Mạnh Tuấn thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Phương Anh thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Minh Huyền thi tốt và đỗ MI1.",
  "AECK chúc em Hoàng Hùng thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Ngô Huy Hoàng thi tốt và đỗ ULIS 2 (UET).",
  "AECK chúc em Nguyễn Tiến Minh Nhật thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Nguyễn Hưng thi tốt và đỗ EE1.",
  "AECK chúc em Nhật Long thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Nghiêm Đại thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Việt Anh thi tốt và đỗ TO1.",
  "AECK chúc em Việt Lân thi tốt và đỗ KMA.",
  "AECK chúc em Lê Tuấn Anh thi tốt và đỗ ET1.",
  "AECK chúc em Thái Hà thi tốt và đỗ ME2.",
  "AECK chúc bạn Đoàn Duy thi tốt và đỗ NEU.",
  "AECK chúc em An Huy thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Mai Nhung thi tốt và đỗ MS2.",
  "AECK chúc em Tú Khanh thi tốt và đỗ CHx.",
  "AECK chúc em Nguyễn Thành Đạt thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Phạm Duy Quyền thi tốt và đỗ HUST.",
  "AECK chúc em Nguyễn Bá Việt Dũng thi tốt và đỗ MI1.",
  "AECK chúc em Khưu Minh thi tốt và đỗ HMU.",
  "AECK chúc em Trần Phi Hùng thi tốt và đỗ TE2.",
  "AECK chúc em Khánh Hà thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Nguyễn Tiến Thành thi tốt và đỗ HUST.",
  "AECK chúc em Lê Minh Đức thi tốt và đỗ FL1-HUST.",
  "AECK chúc em Trịnh Tuấn Kiệt thi tốt và đỗ HUST.",
  "AECK chúc em Trần Thế Bảo thi tốt và đỗ HUST.",
  "AECK chúc em Đình Chí thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Mai Trung Hiếu thi tốt và đỗ EE1-HUST.",
  "AECK chúc em Trịnh Văn Đạt thi tốt và đỗ EE1-HUST.",
  "AECK chúc em Nguyễn Minh Đông thi tốt và đỗ FPT.",
  "AECK chúc em Lê Việt Hùng thi tốt và đỗ MTA.",
  "AECK chúc em Trịnh Tuấn Kiệt thi tốt và đỗ ME2-HUST.",
  "AECK chúc em Dong Phuong Anh thi tốt và đỗ HUST.",
  "AECK chúc em Phong Nguyễn đỗ IT-E7 HUST.",
  "AECK chúc em Nguyễn Ngọc Tuấn Anh thi tốt và đỗ HUST.",
  "AECK chúc em Văn An thi tốt và đỗ IT-E10.",
  "AECK chúc em Nguyễn Bá Việt Dũng thi tốt và đỗ MI1.",
  "AECK chúc em Nguyễn Văn Tài thi tốt và đỗ ME2-HUST.",
  "AECK chúc em Trần Thị Hồng Anh thi tốt và đỗ PH3-HUST.",
  "AECK chúc em Vi Minh thi tốt và đỗ HUP.",
  "AECK chúc em Nguyễn Việt Đức thi tốt và đỗ MS2-HUST.",
  "AECK chúc em Lê Thiện Giáp thi tốt và đỗ IT-E15.",
  "AECK chúc em Lê Vĩnh Phước thi tốt là đỗ HNUE.",
  "AECK chúc em Nguyễn Anh Tuấn thi tốt và đỗ IT-E10 HUST.",
  "AECK chúc em Bảo Hân thi tốt và đỗ ET2-HUST.",
  "AECK chúc em Đinh Thị Hương Thuỳ thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Minh Anh thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Ngô Hiếu thi tốt và đỗ IT-E6.",
  "AECK chúc em Hà Thảo Trang thi tốt và đỗ EE2.",
  "AECK chúc em Trần Vũ Đức thi tốt và đỗ IT2-HUST.",
  "AECK chúc em Lê Minh Nghĩa thi tốt và đỗ NEU.",
  "AECK chúc em Nguyễn Mĩ An thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Nguyễn Quốc Vững thi tốt và đỗ EM2.",
  "AECK chúc em Nguyễn Tiến Phú thi tốt và đỗ HUST.",
  "AECK chúc em Trần Đình Minh Nhật thi tốt và tổng 4 môn 36 điểm.",
  "AECK chúc Linh Linh thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Lại Đức Phong thi tốt và đỗ MTA.",
  "AECK chúc em Hoàng Xuân Minh Ngọc thi tốt và đỗ HMU.",
  "AECK chúc em Đào Nhất thi tốt và đỗ HUST.",
  "AECK chúc em Minh Đinh Xuân thi tốt và đỗ IT1-HUST."
];

// Thêm CSS cho số thứ tự
(function addSTTStyle() {
  const style = document.createElement('style');
  style.innerHTML = `.stt { display:inline-block; min-width:2em; font-weight:bold; color:#764ba2; font-size:1.1em; margin-right:6px; }`;
  document.head.appendChild(style);
})();

// --- Tìm kiếm lời chúc ---
const searchInput = document.getElementById('searchInput');
let allWishes = [];

function renderWishes(list) {
  const ul = document.getElementById('gratitude-list');
  ul.innerHTML = '';
  list.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class='stt'>${item.stt}.</span> <span class="icon">${item.icon}</span> ${item.text}`;
    li.style.setProperty('--delay', `${i*0.04+0.1}s`);
    ul.appendChild(li);
  });
  attachWishModalEvents();
}

function updateAllWishes() {
  allWishes = [];
  // Lời chúc mặc định
  const icons = ["❤️", "🌟", "🎉", "✨", "🍀", "🎓", "💖", "🥇", "🌈", "🦋", "🌻", "💐", "🧡", "🎵", "🎈", "🌺"];
  messages.forEach((msg, i) => {
    allWishes.push({
      stt: i + 1,
      icon: icons[i % icons.length],
      text: msg,
      type: 'default'
    });
  });
  // Lời chúc học sinh ghi danh
  db.collection('students').orderBy('timestamp', 'asc').get().then(snapshot => {
    let stt = messages.length;
    snapshot.forEach(doc => {
      const student = doc.data();
      stt++;
      const message = `AECK chúc em ${student.name} thi tốt và đỗ ${student.wish}.`;
      allWishes.push({
        stt,
        icon: icons[Math.floor(Math.random() * icons.length)],
        text: message,
        type: 'student',
        name: student.name,
        wish: student.wish
      });
    });
    renderWishes(allWishes);
  });
}

searchInput.addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  if (!q) {
    renderWishes(allWishes);
    return;
  }
  const filtered = allWishes.filter(item =>
    item.text.toLowerCase().includes(q) ||
    (item.name && item.name.toLowerCase().includes(q)) ||
    (item.wish && item.wish.toLowerCase().includes(q)) ||
    (item.stt + '').includes(q)
  );
  renderWishes(filtered);
});

document.addEventListener('DOMContentLoaded', function() {
  updateAllWishes();
});

// --- Modal gửi lời nhắn cảm ơn AECK ---
const thankBtn = document.getElementById('thankBtn');
const thankModalOverlay = document.getElementById('thankModalOverlay');
const closeThankModal = document.getElementById('closeThankModal');
const thankFormModal = document.getElementById('thankFormModal');
const thankInputModal = document.getElementById('thankInputModal');
const thankListModal = document.getElementById('thankListModal');

thankBtn.addEventListener('click', function() {
  thankModalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
});
closeThankModal.addEventListener('click', function() {
  thankModalOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
});
thankModalOverlay.addEventListener('click', function(e) {
  if (e.target === thankModalOverlay) {
    thankModalOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
});

function renderThanksModal(thanks) {
  thankListModal.innerHTML = '';
  if (thanks.length === 0) {
    thankListModal.innerHTML = '<div style="color:#aaa;text-align:center;">Chưa có lời nhắn nào...</div>';
    return;
  }
  thanks.slice().reverse().forEach(msg => {
    const div = document.createElement('div');
    div.className = 'thank-item';
    div.textContent = msg.text;
    thankListModal.appendChild(div);
  });
}

function loadThanksModalRealtime() {
  db.collection('thanks').orderBy('timestamp','desc').limit(30).onSnapshot(snapshot => {
    const thanks = [];
    snapshot.forEach(doc => {
      thanks.push(doc.data());
    });
    renderThanksModal(thanks);
  });
}

thankFormModal.addEventListener('submit', async function(e) {
  e.preventDefault();
  const text = thankInputModal.value.trim();
  if (!text) return;
  thankInputModal.disabled = true;
  thankFormModal.querySelector('.btn-submit').textContent = 'Đang gửi...';
  try {
    await db.collection('thanks').add({
      text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    thankInputModal.value = '';
    alert('Lời nhắn của bạn đã được gửi tới AECK!');
  } catch (err) {
    alert('Gửi thất bại, thử lại sau!');
  }
  thankInputModal.disabled = false;
  thankFormModal.querySelector('.btn-submit').textContent = 'Gửi lời nhắn 💌';
});

document.addEventListener('DOMContentLoaded', function() {
  loadThanksModalRealtime();
});

const finalBtn = document.getElementById('finalBtn');
finalBtn.addEventListener('click', function() {
  window.open('./loi_chuc/index.html', '_blank');
}); 