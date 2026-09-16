const { SlashCommandBuilder } = require("discord.js");
const schedule = require("node-schedule");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("기억해")
    .setDescription("재선이가 기억해뒀다가 말해줄게요!")
    .addIntegerOption((option) =>
      option
        .setName("년")
        .setDescription("몇 년에 기억해둘까요?")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("월")
        .setDescription("몇 월에 기억해둘까나?")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("일")
        .setDescription("몇 일에 기억해볼까?")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("시")
        .setDescription("몇 시에 알려줘볼까? 0~23중 골라야함 ㅇㅇ")
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName("분")
        .setDescription(
          "몇 분에 알려줄까? 어 당연히 이것도 0~59중 골라야함 ㅇㅇ",
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("메시지")
        .setDescription("어 그래 날짜 쓰느라 고생했다. 뭐라고 말해줄까?")
        .setRequired(true),
    ),
  async execute(interaction) {
    const year = interaction.options.getInteger("년");
    const month = interaction.options.getInteger("월");
    const day = interaction.options.getInteger("일");
    const hour = interaction.options.getInteger("시");
    const minute = interaction.options.getInteger("분");
    const message = interaction.options.getString("메시지");
    if (
      year < 2026 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      await interaction.reply(
        "아잇 제대로 쓰삼. 년은 2026년 이상, 월은 1~12, 일은 1~31, 시는 0~23, 분은 0~59로 입력해라이야이야ㅑㅑㅑ",
      );
      return;
    }

    const monthString = String(month).padStart(2, "0");
    const dayString = String(day).padStart(2, "0");
    const hourString = String(hour).padStart(2, "0");
    const minuteString = String(minute).padStart(2, "0");

    const kstDateString = `${year}-${monthString}-${dayString}T${hourString}:${minuteString}:00+09:00`;
    const date = new Date(kstDateString);
    if (date < new Date()) {
      await interaction.reply(
        "어 과거로는 내가 어떻게 햊ㄹ 수 있는게 없다. 수고해라~",
      );
      return;
    }

    const channel = interaction.channel;
    schedule.scheduleJob(date, async () => {
      await channel.send(
        `<@${interaction.user.id}> 어 그래 형이다. ${year}-${month}-${day} ${hour}:${minute}라서 말해주는건데, \n${message}`,
      );
    });
    await interaction.reply(
      `어 그래 형이 ${year}-${monthString}-${dayString} ${hourString}:${minuteString} 이때 "${message}" 이렇게 말해줄게~`,
    );
  },
};
