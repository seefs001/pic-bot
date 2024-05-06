import { ADMIN_CHAT_IDS, BOT_TOKEN } from '@/constants';
import logger from '@/utils/logger';
import { Telegraf } from 'telegraf';
import echoCommand from './commands/echo';
// import listDirsCompose from './commands/listdirs';
import { authGuard } from './guards/authGuard';
import postCommand from './commands/post';

const bot = new Telegraf(BOT_TOKEN);

const commands = [
  { command: 'start', description: '显示欢迎信息～' },
  { command: 'help', description: '显示帮助～' },
  { command: 'recommend', description: '投稿，形式为 /recommend url #tag1 #tag2' },
  { command: 'echo', description: '显示 Post 预览，形式为 /echo url #tag1 #tag2' },
  { command: 'random', description: '随机图片' },
  { command: 'post', description: '(admin) 发图到频道，形式为 /post url #tag1 #tag2' },
  { command: 'mark_dup', description: '(admin) 标记该图片已被发送过，形式为 /mark_dup url ' },
  { command: 'unmark_dup', description: '(admin) 在频道评论区回复，形式为 /unmark_dup url ' },
];
//? [用户] /start
bot.start((ctx) => ctx.reply('欢迎，请尽情的享受咱吧～\n输入 /help 查看帮助哦'));

//? [用户] /help
//? [bot] 列出帮助
bot.help((ctx) => {
  const contents = commands.reduce((acc, command) => {
    return acc + `/${command.command} - ${command.description}\n`;
  }, '');
  return ctx.reply('命令列表：\n' + contents);
});

bot.use(echoCommand);
bot.use(Telegraf.optional(authGuard(), postCommand));
// bot.use(Telegraf.optional(authGuard(), listDirsCompose));

// 设置命令
bot.telegram.setMyCommands(commands);

// Enable graceful stop
process.once('SIGINT', () => {
  logger.info('[SIGINT] 呜呜呜人家要被杀掉惹...');
  ADMIN_CHAT_IDS?.length &&
    ADMIN_CHAT_IDS.forEach((adminId) => {
      bot.telegram.sendMessage(adminId, '[SIGINT] 呜呜呜人家要被杀掉惹...');
    });
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  logger.info('[SIGTERM] 呜呜呜人家要被杀掉惹...');
  ADMIN_CHAT_IDS?.length &&
    ADMIN_CHAT_IDS.forEach((adminId) => {
      bot.telegram.sendMessage(adminId, '[SIGTERM] 呜呜呜人家要被杀掉惹...');
    });
  bot.stop('SIGTERM');
});

export default bot;