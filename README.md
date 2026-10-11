# Discord Server Bot

A full-feature Discord bot starter built with JavaScript and discord.js. It includes moderation, utility, economy, server automation, reaction roles, logging, and music commands.

## Features
- Moderation: kick, ban, mute, clear messages
- Utility: ping, server info, user info, help
- Sticky message system: `/stick` and `/unstick`
- Welcome and goodbye messages
- Auto-role assignment for new members
- Reaction-role setup
- Server logging
- Economy: balance, daily, work
- Music: play, pause, skip, stop
- Slash command support
- Prefix command support for compatibility

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
- `/setwelcome <channel>`
- `/setgoodbye <channel>`
- `/setautorole <role>`
- `/setlogs <channel>`
- `/reactionrole <message_id> <emoji> <role>`
- `/balance`
- `/daily`
- `/work`
- `/play <query>`
- `/pause`
- `/skip`
- `/stop`

## Notes
- `DISCORD_GUILD_ID` is optional for global commands, but including it makes testing faster in one guild.
- The sticky command creates a pinned embed message in the current channel. This works like a “sticky message” for important notices.
- For the music commands, the bot needs to be in a voice channel in the guild. If you use music heavily, consider using a more advanced music library or VPS hosting with FFmpeg installed.
