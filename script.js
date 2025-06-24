// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tri-an-2k7.firebaseapp.com",
  projectId: "tri-an-2k7",
  storageBucket: "tri-an-2k7.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
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
    await db.collection('students').add(student);
    
    // Thêm vào danh sách hiển thị
    addStudentToList(student);
    
    // Hiển thị thông báo thành công
    showSuccessMessage();
    
    // Đóng modal
    closeModalFunc();
    
  } catch (error) {
    console.error('Lỗi khi lưu dữ liệu:', error);
    alert('Có lỗi xảy ra, vui lòng thử lại!');
    
    // Reset button
    const submitBtn = document.querySelector('.btn-submit');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gửi Lời Chúc ✨';
  }
}

// Hiển thị thông báo thành công
function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.innerHTML = `
    <div class="success-content">
      <h3>🎉 Đăng ký thành công!</h3>
      <p>Cảm ơn bạn đã ghi danh! AECK sẽ gửi lời chúc tốt đẹp nhất đến bạn!</p>
      <button onclick="this.parentElement.parentElement.remove()">Đóng</button>
    </div>
  `;
  
  // Thêm CSS cho success message
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 15px;
    font-weight: 600;
  `;
  
  document.body.appendChild(successDiv);
  
  // Tự động đóng sau 3 giây
  setTimeout(() => {
    if (successDiv.parentElement) {
      successDiv.remove();
    }
  }, 3000);
}

// Thêm học sinh vào danh sách hiển thị
function addStudentToList(student) {
  const ul = document.getElementById('gratitude-list');
  const icons = ["❤️", "🌟", "🎉", "✨", "🍀", "🎓", "💖", "🥇", "🌈", "🦋", "🌻", "💐", "🧡", "🎵", "🎈", "🌺"];
  
  const li = document.createElement('li');
  const iconIndex = Math.floor(Math.random() * icons.length);
  const message = `AECK chúc em ${student.name} thi tốt và đỗ ${student.wish}.`;
  
  li.innerHTML = `<span class="icon">${icons[iconIndex]}</span> ${message}`;
  li.style.setProperty('--delay', '0.1s');
  li.style.opacity = '0';
  li.style.transform = 'translateY(30px)';
  
  ul.appendChild(li);
  
  // Trigger animation
  setTimeout(() => {
    li.style.animation = 'fadeInUp 0.7s forwards';
  }, 100);
}

// Load danh sách học sinh từ Firebase
async function loadStudentsFromFirebase() {
  try {
    const snapshot = await db.collection('students')
      .orderBy('timestamp', 'desc')
      .limit(50) // Giới hạn 50 học sinh gần nhất
      .get();
    
    snapshot.forEach(doc => {
      const student = doc.data();
      addStudentToList(student);
    });
    
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    // Fallback: hiển thị danh sách mặc định
    showDefaultMessages();
  }
}

// Hiển thị danh sách mặc định khi không có kết nối
function showDefaultMessages() {
  const ul = document.getElementById('gratitude-list');
  const icons = ["❤️", "🌟", "🎉", "✨", "🍀", "🎓", "💖", "🥇", "🌈", "🦋", "🌻", "💐", "🧡", "🎵", "🎈", "🌺"];
  
  messages.forEach((msg, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="icon">${icons[i%icons.length]}</span> ` + msg;
    li.style.setProperty('--delay', `${i*0.04+0.1}s`);
    ul.appendChild(li);
  });
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

for (let i = 0; i < 22; i++) hearts.push(randomHeart());

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

// Load danh sách học sinh từ Firebase khi trang load
document.addEventListener('DOMContentLoaded', function() {
  loadStudentsFromFirebase();
}); 