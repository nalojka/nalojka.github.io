<?php
session_start();

// Генерация CSRF токена
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Подключение к Supabase (используем cURL)
function supabaseAuth($email, $password) {
    $supabase_url = 'https://your-project.supabase.co';
    $supabase_key = 'your-anon-key';
    
    $data = json_encode([
        'email' => $email,
        'password' => $password
    ]);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $supabase_url . '/auth/v1/token?grant_type=password');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: ' . $supabase_key,
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return ['code' => $http_code, 'data' => json_decode($response, true)];
}

// Обработка формы
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Проверка CSRF токена
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $error = 'Ошибка безопасности: неверный CSRF токен';
    } else {
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $password = $_POST['password'];
        
        if (filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($password)) {
            $result = supabaseAuth($email, $password);
            
            if ($result['code'] === 200) {
                $_SESSION['user'] = $result['data']['user'];
                $_SESSION['access_token'] = $result['data']['access_token'];
                $success = 'Успешный вход! Перенаправление...';
                header('Refresh: 2; URL=dashboard.php');
            } else {
                $error = $result['data']['error_description'] ?? 'Ошибка входа';
            }
        } else {
            $error = 'Пожалуйста, введите корректный email и пароль';
        }
    }
    
    // Регенерируем CSRF токен после POST запроса
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход в систему</title>
    <style>
        :root{
          --bg-light: #f4f4f9;
          --bg-dark: #0f1720;
          --text-light: #111827;
          --text-dark: #f1f5f9;
          --card-light: #ffffff;
          --card-dark: #111318;
          --accent: #0d6efd;
          --accent-2: #66a3ff;
          --muted-light: #6c757d;
          --muted-dark: #9aa4b2;
          --success: #16a34a;
          --danger: #dc2626;
          --transition-fast: 0.25s;
          --transition-med: 0.4s;
        }

        /* Base */
        html,body{height:100%;margin:0;font-family:Inter, "Segoe UI", Roboto, Arial, sans-serif;}
        body{
          display:flex;align-items:center;justify-content:center;
          background:var(--bg-light);
          color:var(--text-light);
          transition: background var(--transition-med), color var(--transition-med);
          min-height:100vh;
          padding:20px;
        }
        body.dark{
          background:var(--bg-dark);
          color:var(--text-dark);
        }

        .card{
          width:100%; max-width:400px;
          background:var(--card-light);
          border-radius:14px;
          padding:22px;
          box-shadow:0 10px 30px rgba(2,6,23,0.08);
          position:relative;
          transition: background var(--transition-med), box-shadow var(--transition-med), transform var(--transition-fast);
        }
        body.dark .card{ background:var(--card-dark); box-shadow:0 6px 18px rgba(0,0,0,0.6); }

        h1{ margin:0 0 6px 0; font-size:22px; }
        p.lead{ margin:0 0 18px 0; color: #6b7280; }
        body.dark p.lead{ color: var(--muted-dark); }

        /* Theme toggle */
        .theme-toggle{
          position:absolute; right:18px; top:18px;
          background:transparent;border:none;color:inherit;font-size:20px;
          cursor:pointer; display:flex; align-items:center; gap:10px;
          padding:8px;border-radius:10px; transition: transform .35s ease;
        }
        .theme-toggle .icon{ display:inline-block; transform-origin:center; transition: transform .45s ease; }
        .theme-toggle:active{ transform: scale(0.98); }

        /* Form elements */
        .form-group{ margin-bottom:16px; }
        label{ display:block; margin-bottom:6px; font-size:14px; font-weight:500; }
        
        input[type="email"], input[type="password"]{
          width:100%; padding:10px 12px;border-radius:10px;border:1px solid #e5e7eb;
          font-size:15px; outline: none; transition: box-shadow .15s;
          box-sizing: border-box;
        }
        input[type="email"]:focus, input[type="password"]:focus{ 
          box-shadow:0 6px 20px rgba(13,110,253,0.08); 
          border-color:var(--accent); 
        }

        button.btn{
          background:var(--accent); color:#fff; padding:10px 14px;border-radius:10px;border:none; cursor:pointer;
          font-weight:600; transition: transform .12s, background .2s;
          width:100%; margin-top:10px;
        }
        button.btn:hover{ transform: translateY(-2px); background:var(--accent-2); }

        /* Messages */
        .message{
          padding:10px 12px; border-radius:10px; margin-bottom:16px;
          font-size:14px;
        }
        .message.success{
          background:#dcfce7; border:1px solid rgba(16,185,129,0.18); color:#064e3b;
        }
        .message.error{
          background:#ffe4e6; border:1px solid rgba(220,38,38,0.12); color:#6b021f;
        }

        /* Links */
        .links{ text-align:center; margin-top:16px; font-size:14px; }
        .links a{ color:var(--accent); text-decoration:none; }
        .links a:hover{ text-decoration:underline; }

        footer{ margin-top:14px; font-size:13px; color: #6b7280; text-align:center; }
        body.dark footer{ color:var(--muted-dark); }

        .hidden{ display:none !important; }
    </style>
</head>
<body>
    <div class="card">
        <button class="theme-toggle" id="themeToggle">
            <span class="icon">🌙</span>
        </button>
        
        <h1>Вход в систему</h1>
        <p class="lead">Введите свои учетные данные</p>
        
        <?php if ($error): ?>
            <div class="message error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        
        <?php if ($success): ?>
            <div class="message success"><?php echo htmlspecialchars($success); ?></div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="your@email.com" 
                       value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" required>
            </div>
            
            <div class="form-group">
                <label for="password">Пароль</label>
                <input type="password" id="password" name="password" placeholder="Ваш пароль" required>
            </div>
            
            <button type="submit" class="btn">Войти</button>
        </form>
        
        <div class="links">
            <a href="forgot_password.php">Забыли пароль?</a>
        </div>
        
        <footer>
            &copy; 2023 Ваша компания. Все права защищены.
        </footer>
    </div>

    <script>
        // Инициализация темы
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('.icon');
        
        // Проверяем сохраненную тему
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
            themeIcon.textContent = '☀️';
        }
        
        // Переключение темы
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            
            if (document.body.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
                themeIcon.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                themeIcon.textContent = '🌙';
            }
        });
    </script>
</body>
</html>
