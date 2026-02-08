# OLS Assistant - Hệ thống Trợ lý Thông minh

Dự án tích hợp Spring Boot (Backend), Vite/React (Frontend), và Node.js AI Agent (OpenAI). Hệ thống cho phép người dùng tương tác với trợ lý AI được cá nhân hóa cho dự án.

## 🚀 Quy trình cài đặt dự án

Theo dõi các bước dưới đây để thiết lập môi trường chạy dự án lần đầu tiên.

### 1. Chuẩn bị mã nguồn

Clone dự án về máy cá nhân:

```bash
git clone https://github.com/luusytruong/ols-assistant.git
cd ols-assistant
```

### 2. Cài đặt Dependencies

Dự án sử dụng `pnpm` workspace. Bạn cần cài đặt thư viện cho toàn bộ các module từ thư mục gốc:

```bash
pnpm install
```

### 3. Cấu hình biến môi trường (.env)

Bạn cần thiết lập mã khóa OpenAI để Agent có thể hoạt động:

1.  **Tại thư mục gốc:**

    ```bash
    cp .env.example .env
    ```

    Mở file `.env` vừa tạo và điền `OPENAI_API_KEY` của bạn:

    ```env
    OPENAI_API_KEY=your_sk_key_here
    ```

2.  **Tại thư mục `agent` (Optional nếu chạy local không dùng Docker):**
    ```bash
    cd agent
    cp .env.example .env
    cd ..
    ```

### 4. Khởi chạy bằng Docker Compose

Đây là cách nhanh nhất để chạy toàn bộ hệ thống (Database, Backend, Agent, Frontend):

```bash
docker compose up -d
```

---

## 🛠 Thông tin các dịch vụ

Sau khi khởi chạy thành công, các dịch vụ sẽ hoạt động tại các địa chỉ sau:

| Dịch vụ         | Công nghệ    | URL                                            | Cổng (Port) |
| :-------------- | :----------- | :--------------------------------------------- | :---------- |
| **Frontend**    | Vite + React | [http://localhost:5173](http://localhost:5173) | `5173`      |
| **Backend API** | Spring Boot  | [http://localhost:8080](http://localhost:8080) | `8080`      |
| **AI Agent**    | Node.js      | [http://localhost:3001](http://localhost:3001) | `3001`      |
| **Database**    | MySQL 8.0    | `localhost`                                    | `3307`      |

---

## 📝 Một số lệnh hữu ích

- **Xem logs toàn bộ hệ thống:** `docker compose logs -f`
- **Dừng hệ thống:** `docker compose down`
- **Build lại hệ thống (khi có thay đổi code):** `docker compose up -d --build`
- **Kiểm tra trạng thái các container:** `docker ps`

## 📧 Liên hệ & Hỗ trợ

Nếu gặp khó khăn trong quá trình cài đặt, vui lòng kiểm tra lại file `.env` hoặc xem logs của các container để debug.
