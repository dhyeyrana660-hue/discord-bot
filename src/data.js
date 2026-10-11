const fs = require('node:fs');
const path = require('node:path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ECONOMY_FILE = path.join(DATA_DIR, 'economy.json');
const LEVELS_FILE = path.join(DATA_DIR, 'levels.json');
const GIVEAWAYS_FILE = path.join(DATA_DIR, 'giveaways.json');

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

  if (!fs.existsSync(LEVELS_FILE)) {
    fs.writeFileSync(LEVELS_FILE, JSON.stringify({}, null, 2));
  }

  if (!fs.existsSync(GIVEAWAYS_FILE)) {
    fs.writeFileSync(GIVEAWAYS_FILE, JSON.stringify({}, null, 2));
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
      ticketCategoryId: null,
      levelingEnabled: false,
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

function getUserLevel(guildId, userId) {
  const levels = readJSON(LEVELS_FILE);
  const guildData = levels[guildId] || {};
  const userLevel = guildData[userId] || { level: 1, xp: 0 };
  return userLevel;
}

function saveUserLevel(guildId, userId, data) {
  const levels = readJSON(LEVELS_FILE);
  levels[guildId] = levels[guildId] || {};
  levels[guildId][userId] = data;
  writeJSON(LEVELS_FILE, levels);
}

function getGiveaways(guildId) {
  const giveaways = readJSON(GIVEAWAYS_FILE);
  return giveaways[guildId] || [];
}

function saveGiveaways(guildId, data) {
  const giveaways = readJSON(GIVEAWAYS_FILE);
  giveaways[guildId] = data;
  writeJSON(GIVEAWAYS_FILE, giveaways);
}

module.exports = {
  getGuildSettings,
  saveGuildSettings,
  getUserBalance,
  saveUserBalance,
  getUserLevel,
  saveUserLevel,
  getGiveaways,
  saveGiveaways,
};
