// Google Sheets Configuration
const GOOGLE_SHEETS_ID = 'YOUR_SHEET_ID'; // Thay bằng ID của Google Sheet
const GOOGLE_SHEETS_API_KEY = 'YOUR_API_KEY'; // Thay bằng API Key

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

// Tự động phát nhạc khi trang load
document.addEventListener('DOMContentLoaded', function() {
  bgMusic.play().then(function() {
    audioControl.textContent = '🔊';
    audioControl.classList.add('playing');
    isPlaying = true;
  }).catch(function(error) {
    console.log('Không thể tự động phát nhạc:', error);
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
  document.body.style.overflow = 'hidden';
});

// Đóng modal
function closeModalFunc() {
  modalOverlay.classList.remove('show');
  document.body.style.overflow = 'auto';
  registerForm.reset();
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
  
  // Disable submit button
  const submitBtn = registerForm.querySelector('.btn-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Đang gửi...';
  
  // Tạo dữ liệu học sinh
  const newStudent = {
    name: studentName,
    wish: studentWish,
    message: studentMessage,
    date: new Date().toLocaleDateString('vi-VN'),
    timestamp: new Date().toISOString()
  };
  
  // Lưu vào Google Sheets
  saveStudentToGoogleSheets(newStudent);
});

// Lưu học sinh vào Google Sheets
async function saveStudentToGoogleSheets(student) {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Sheet1!A:E:append?valueInputOption=USER_ENTERED&key=${GOOGLE_SHEETS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          student.name,
          student.wish,
          student.message,
          student.date,
          student.timestamp
        ]]
      })
    });
    
    if (response.ok) {
      // Thêm vào danh sách hiển thị
      addStudentToList(student);
      
      // Hiển thị thông báo thành công
      showSuccessMessage();
      
      // Đóng modal
      closeModalFunc();
    } else {
      throw new Error('Lỗi khi lưu dữ liệu');
    }
    
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
  
  setTimeout(() => {
    li.style.animation = 'fadeInUp 0.7s forwards';
  }, 100);
}

// Load danh sách học sinh từ Google Sheets
async function loadStudentsFromGoogleSheets() {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Sheet1!A:E?key=${GOOGLE_SHEETS_API_KEY}`);
    const data = await response.json();
    
    if (data.values && data.values.length > 1) {
      // Bỏ qua header row
      const students = data.values.slice(1);
      
      // Hiển thị 50 học sinh gần nhất
      const recentStudents = students.slice(-50);
      
      recentStudents.forEach(row => {
        const student = {
          name: row[0] || '',
          wish: row[1] || '',
          message: row[2] || '',
          date: row[3] || '',
          timestamp: row[4] || ''
        };
        
        if (student.name && student.wish) {
          addStudentToList(student);
        }
      });
    } else {
      showDefaultMessages();
    }
    
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu:', error);
    showDefaultMessages();
  }
}

// Hiển thị danh sách mặc định
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

// Danh sách lời chúc mặc định
const messages = [
  "AECK chúc em Đinh Thị Hương Thuỳ thi tốt và đỗ nguyện vọng 1.",
  "AECK chúc em Hoàng Tuấn Đạt thi tốt và đỗ nguyện vọng 1.",
  // ... thêm các lời chúc khác
];

// Load danh sách khi trang load
document.addEventListener('DOMContentLoaded', function() {
  loadStudentsFromGoogleSheets();
});

// Hiệu ứng nền trái tim bay (giữ nguyên code cũ)
// ... code hearts animation 