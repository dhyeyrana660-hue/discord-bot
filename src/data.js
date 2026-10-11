const fs = require('node:fs');
const path = require('node:path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ECONOMY_FILE = path.join(DATA_DIR, 'economy.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({}, null, 2));
  }

  if (!fs.existsSync(ECONOMY_FILE)) {
    fs.writeFileSync(ECONOMY_FILE, JSON.stringify({}, null, 2));
  }
}

function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

ensureDataFiles();

function getGuildSettings(guildId) {
  const settings = readJSON(SETTINGS_FILE);
  if (!settings[guildId]) {
    settings[guildId] = {
      welcomeChannelId: null,
      goodbyeChannelId: null,
      logChannelId: null,
      autoRoleId: null,
      reactionRoles: {},
    };
    writeJSON(SETTINGS_FILE, settings);
  }

  return settings[guildId];
}

function saveGuildSettings(guildId, updates) {
  const settings = readJSON(SETTINGS_FILE);
  settings[guildId] = { ...getGuildSettings(guildId), ...updates };
  writeJSON(SETTINGS_FILE, settings);
  return settings[guildId];
}

function getUserBalance(guildId, userId) {
  const economy = readJSON(ECONOMY_FILE);
  const guildData = economy[guildId] || {};
  const userBalance = guildData[userId] || { balance: 0, lastDaily: 0, lastWork: 0 };
  return userBalance;
}

function saveUserBalance(guildId, userId, data) {
  const economy = readJSON(ECONOMY_FILE);
  economy[guildId] = economy[guildId] || {};
  economy[guildId][userId] = data;
  writeJSON(ECONOMY_FILE, economy);
}

module.exports = {
  getGuildSettings,
  saveGuildSettings,
  getUserBalance,
  saveUserBalance,
};
