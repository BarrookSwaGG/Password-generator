function generatePassword() {
  const length = parseInt(document.getElementById('length').value);
  const useUpper = document.getElementById('uppercase').checked;
  const useLower = document.getElementById('lowercase').checked;
  const useNumbers = document.getElementById('numbers').checked;
  const useSymbols = document.getElementById('symbols').checked;

  let chars = '';
  if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useNumbers) chars += '0123456789';
  if (useSymbols) chars += '!@#$%^&*()_+-=[]{};:,.<>?/';

  if (chars.length === 0) {
    document.getElementById('result').textContent = 'Please select at least one option';
    document.getElementById('strength').textContent = '';
    return;
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * chars.length);
    password += chars[randIndex];
  }

  document.getElementById('result').textContent = password;
  document.getElementById('strength').textContent = `Strength: ${getStrength(password)}`;

  saveToHistory(password);
  renderHistory();
}

function getStrength(password) {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return 'Weak ❌';
  if (score === 3 || score === 4) return 'Good ⚠️';
  return 'Strong ✅';
}

function copyPassword() {
  const password = document.getElementById('result').textContent;
  navigator.clipboard.writeText(password);
  alert('Password copied to clipboard!');
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function saveToHistory(password) {
  const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
  history.unshift(password);
  if (history.length > 20) history.pop();
  localStorage.setItem('passwordHistory', JSON.stringify(history));
}

function renderHistory() {
  const list = document.getElementById('historyList');
  const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');

  list.innerHTML = '';
  history.forEach((pwd, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${pwd}`;
    list.appendChild(li);
  });
}

function exportPasswords() {
  const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
  if (history.length === 0) {
    alert('No passwords to export!');
    return;
  }

  const blob = new Blob([history.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'password-history.txt';
  a.click();
  URL.revokeObjectURL(url);
}

// Run on page load
renderHistory();
