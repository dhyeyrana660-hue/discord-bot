# Discord Server Bot

A full-feature Discord bot starter built with JavaScript and discord.js. It includes moderation commands, utility commands, and a stick message system using pinned messages.

## Features
- Moderation: kick, ban, mute, clear messages
- Utility: ping, server info, user info, help
- Sticky message system: `/stick` and `/unstick`
- Slash command support
- Prefix command support for basic compatibility

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```
3. Update your Discord values in `.env`:
   - `DISCORD_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_GUILD_ID`
4. Start the bot:
   ```bash
   npm start
   ```

## Commands
- `/ping`
- `/server`
- `/user`
- `/help`
- `/kick`
- `/ban`
- `/mute`
- `/clear`
- `/stick <message>`
- `/unstick [message_id]`

## Notes
- `DISCORD_GUILD_ID` is optional for global commands, but including it makes testing faster in one server.
- The `stick` command creates a pinned embed message in the current channel. This works like a “sticky message” for important notices.
