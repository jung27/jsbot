// Require the necessary discord.js classes
const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} = require("discord.js");
const { token } = require("./config.json");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const loadSchedules = () => {
  // 봇 폴더 최상단에 있는 schedules.json 경로 설정
  const schedulesPath = path.join(process.cwd(), "schedules.json");

  // 저장된 스케줄 파일이 있다면 읽어오기
  if (fs.existsSync(schedulesPath)) {
    let schedules = JSON.parse(fs.readFileSync(schedulesPath, "utf-8"));
    const now = new Date();
    let remainingSchedules = [];

    for (const sched of schedules) {
      const targetDate = new Date(sched.date);

      // 아직 예약 시간이 지나지 않은 것만 다시 스케줄링
      if (targetDate > now) {
        remainingSchedules.push(sched);

        schedule.scheduleJob(targetDate, async () => {
          const channel = readyClient.channels.cache.get(sched.channelId);
          if (channel) {
            await channel.send(
              `<@${sched.userId}> 어 그래 형이다. ${sched.date}라서 말해주는건데, \n"${sched.message}"`,
            );
          }

          // 💡 발송이 완료된 스케줄은 JSON 파일에서 삭제하여 청소하기
          if (fs.existsSync(schedulesPath)) {
            let currentSchedules = JSON.parse(
              fs.readFileSync(schedulesPath, "utf-8"),
            );
            currentSchedules = currentSchedules.filter(
              (s) => s.id !== sched.id,
            );
            fs.writeFileSync(
              schedulesPath,
              JSON.stringify(currentSchedules, null, 2),
            );
          }
        });
      }
    }
    // 서버가 꺼져있는 동안 이미 시간이 지나버린 과거의 스케줄은 목록에서 제외하고 업데이트
    fs.writeFileSync(
      schedulesPath,
      JSON.stringify(remainingSchedules, null, 2),
    );
    console.log(
      `[복구 완료] ${remainingSchedules.length}개의 예약을 다시 설정했습니다.`,
    );
  }
};

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  console.log("현재 서버 시간:", new Date().toString());

  // 서버가 켜질 때마다 스케줄 복구
  loadSchedules();
});

// Log in to Discord with your client's token
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.login(token);
