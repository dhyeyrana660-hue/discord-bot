# Discord Server Bot

A full-feature Discord bot starter built with JavaScript and discord.js. It includes moderation, utility, economy, server automation, reaction roles, logging, music, anti-spam, tickets, announcements, giveaways, and a leveling system.

## Features
- **Moderation**: kick, ban, mute, clear messages
- **Utility**: ping, server info, user info, help
- **Sticky Messages**: `/stick` and `/unstick`
- **Welcome & Goodbye**: Automatic join/leave messages
- **Auto-Role**: Assign roles to new members
- **Reaction Roles**: Create reaction-based role assignment
- **Server Logging**: Log messages, bans, edits, and deletions
- **Economy**: balance, daily rewards, work commands
- **Leveling**: XP system, level tracking, leaderboard
- **Giveaways**: Create and manage giveaways
- **Announcements**: Send custom announcement embeds
- **Tickets**: Support ticket system with buttons
- **Anti-Spam**: Automatic spam detection and prevention
- **Music**: Play, pause, skip, stop YouTube music
- **Slash Commands**: Full slash command support
- **Prefix Commands**: Prefix command support for compatibility

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
   - `DISCORD_TOKEN` — Your bot token from Discord Developer Portal
   - `DISCORD_CLIENT_ID` — Your bot's application ID
   - `DISCORD_GUILD_ID` — (Optional) Test server ID for faster command updates
4. Start the bot:
   ```bash
   npm start
   ```

## Commands

### Admin & Setup
- `/setwelcome <channel>` — Set welcome message channel
- `/setgoodbye <channel>` — Set goodbye message channel
- `/setautorole <role>` — Set auto-assign role for new members
- `/setlogs <channel>` — Set logging channel
- `/reactionrole <message_id> <emoji> <role>` — Create reaction role
- `/setuptickets <category>` — Set up ticket system
- `/closeticket` — Close a ticket
- `/toggleleveling` — Enable/disable XP leveling
- `/announce <channel> <title> <message> [color]` — Send announcement

### Moderation
- `/kick <user> [reason]` — Kick a member
- `/ban <user> [reason]` — Ban a member
- `/mute <user> [reason]` — Mute a member
- `/clear <amount>` — Delete messages

### Utilities
- `/ping` — Check bot latency
- `/server` — View server info
- `/user` — View user profile
- `/help` — Show all commands
- `/stick <message>` — Create sticky pinned message
- `/unstick [message_id]` — Unpin sticky message

### Economy
- `/balance` — Check coin balance
- `/daily` — Claim daily reward (200 coins)
- `/work` — Earn random coins (50-170)

### Leveling
- `/level` — Check your current level
- `/leaderboard` — View top 10 XP leaders

### Music
- `/play <query>` — Play music from YouTube
- `/pause` — Pause playback
- `/skip` — Skip current track
- `/stop` — Stop and disconnect

### Fun
- `/giveaway <prize> <duration> <winners>` — Start a giveaway

## Data Storage
The bot uses JSON files stored in the `data/` directory:
- `settings.json` — Guild configurations
- `economy.json` — User balances
- `levels.json` — User XP and levels
- `giveaways.json` — Active giveaways

## Notes
- The bot uses anti-spam protection (5 messages in 5 seconds triggers a flag)
- Leveling can be toggled per server with `/toggleleveling`
- Music requires FFmpeg installed on the hosting machine
- Tickets are created in a designated category and only visible to the ticket creator
- Giveaways use React emoji participation and randomly select winners

## Hosting Recommendations
- **Local Testing**: Works fine for development
- **Production**: Consider using Render, Railway, or a VPS for 24/7 uptime
- **Music Commands**: Require FFmpeg and stable internet connection
