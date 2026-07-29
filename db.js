const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const FILE_PATH = path.join(DATA_DIR, 'db.json');

// Инициализация папки данных
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Загрузка данных
function load() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      // Структура по умолчанию для B2B
      const defaultData = {
        companies: {}, // { companyId: { email, passwordHash, name, plan: 'free'|'pro' } }
        tests: {},     // { testId: { companyId, title, questions, createdAt } }
        sessions: {},  // { sessionCode: { testId, companyId, ... } }
        labs: {}       // лаборатории (без изменений)
      };
      fs.writeFileSync(FILE_PATH, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('[db] Ошибка загрузки:', e);
    return {};
  }
}

// Сохранение данных
function save(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('[db] Ошибка сохранения:', e);
  }
}

// Обновление данных с колбэком
async function update(callback) {
  const data = load();
  const result = callback(data);
  save(data);
  return result;
}

// Инициализация кэша (для совместимости)
async function initCache() {
  // Загружаем один раз, создаём файл если нет
  load();
  return true;
}

module.exports = { load, save, update, initCache };
