# 🔥 Hướng Dẫn Setup Firebase

## Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" hoặc "Add project"
3. Đặt tên project: `tri-an-2k7`
4. Chọn "Continue" và hoàn thành setup

## Bước 2: Thêm Web App

1. Trong Firebase Console, click icon web (</>) 
2. Đặt tên app: `tri-an-2k7-web`
3. Copy config object được tạo ra

## Bước 3: Cập Nhật Config

Thay thế config trong file `script.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Bước 4: Setup Firestore Database

1. Trong Firebase Console, chọn "Firestore Database"
2. Click "Create database"
3. Chọn "Start in test mode" (cho phép read/write)
4. Chọn location gần nhất (Singapore)

## Bước 5: Cập Nhật Security Rules

Trong Firestore Database > Rules, thay thế bằng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{document} {
      allow read, write: if true;
    }
  }
}
```

## Bước 6: Test

1. Mở trang web
2. Thử ghi danh một học sinh
3. Kiểm tra xem dữ liệu có xuất hiện trong Firestore không
4. Mở trang web trên thiết bị khác để test

## ⚠️ Lưu Ý Bảo Mật

- Rules hiện tại cho phép ai cũng read/write
- Cho production, nên thêm authentication
- Có thể thêm rate limiting để tránh spam

## 🚀 Deploy

Sau khi setup xong, upload files lên hosting:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## 📊 Monitoring

Trong Firebase Console có thể:
- Xem số lượng đăng ký
- Export dữ liệu
- Set up alerts
- Monitor performance 