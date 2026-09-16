const { SlashCommandBuilder } = require("discord.js");
const schedule = require("node-schedule");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("너뭐냐")
    .setDescription(
      "내가 뭐냐고? 내가 뭐냐고? 내가 뭐냐고? 내가 뭐냐고? 내가 뭐냐고? 내가 뭐냐고?",
    ),
  async execute(interaction) {
    await interaction.reply(
      "안녕 나를 소개하지, 이름 정재선 직업은 developer\n취미는 taichi, meditation, 독서, 영화 시청\n개발 해 탁 타닥 너 그리고 날 위해\n버그는 빼는 편이야 코드에서 질리는 맛이기에",
    );
  },
};
