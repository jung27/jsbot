const { SlashCommandBuilder } = require("discord.js");
const schedule = require("node-schedule");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("정병")
    .setDescription("아 정신나갈것 같아.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("전염")
        .setDescription(
          "사실 너도 똑같더라고 내 기쁨은 늘 질투가 되고 슬픔은 항상 약점이 돼",
        )
        .addUserOption((option) =>
          option.setName("대상").setDescription("너 T야?").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("치료")
        .setDescription("이게 치료가 되는 거였구나")
        .addUserOption((option) =>
          option
            .setName("대상")
            .setDescription("정병 있는 사람만")
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    // 역할 확인 후 명령어 사용자가 정병 있으면 전염 가능, 명령어 사용자가 정병 없으면 치료 가능
    const subcommand = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser("대상");
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const targetMember = await interaction.guild.members.fetch(targetUser.id);
    const role = interaction.guild.roles.cache.find(
      (role) => role.name === "정병",
    );
    if (!role) {
      await interaction.guild.roles.create({
        name: "정병",
        color: "#aa00ff",
      });
    }

    const hasRole = member.roles.cache.has(role.id);
    const targetHasRole = targetMember.roles.cache.has(role.id);

    if (subcommand === "전염") {
      if (!hasRole) {
        await interaction.reply({
          content: "어 닌 정병 아니라서 그런거 모단다잉~",
          ephemeral: true,
        });
        return;
      }
      if (targetHasRole) {
        await interaction.reply({
          content: `${targetUser.username} 얜 이미 정병이 있는 아이야.`,
          ephemeral: true,
        });
        return;
      }
      await targetMember.roles.add(role);
      await interaction.reply({
        content: `${targetUser.username}가 정병이 도졌스요!ㅠㅠ`,
      });
    } else if (subcommand === "치료") {
      if (hasRole) {
        await interaction.reply({
          content: "닌 정병이라 그란거 못해여~",
          ephemeral: true,
        });
        return;
      }
      if (!targetHasRole) {
        await interaction.reply({
          content: `${targetUser.username} 얜 정병이 없는 아이다 돌팔이야`,
          ephemeral: true,
        });
        return;
      }
      await targetMember.roles.remove(role);
      await interaction.reply({
        content: `${targetUser.username}가 무려 정병 !완 치!`,
      });
    }
  },
};
