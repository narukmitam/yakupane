const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

const rolePanelCommand = new SlashCommandBuilder()
    .setName('rolepanel')
    .setDescription('役職パネルを表示します');

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'rolepanel') {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('role_red')
                    .setLabel('🔴 Red')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('role_blue')
                    .setLabel('🔵 Blue')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({
            content: '欲しい役職を選んでください',
            components: [row]
        });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // customId と roleId の対応表
    const roleMap = {
        role_red: 'ROLE_ID_RED',
        role_blue: 'ROLE_ID_BLUE'
    };

    const roleId = roleMap[interaction.customId];
    if (!roleId) return;

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) {
        return interaction.reply({ content: '役職が見つかりません', ephemeral: true });
    }

    if (member.roles.cache.has(roleId)) {
        await member.roles.remove(role);
        await interaction.reply({ content: `❌ ${role.name} を外しました`, ephemeral: true });
    } else {
        await member.roles.add(role);
        await interaction.reply({ content: `✅ ${role.name} を付与しました`, ephemeral: true });
    }
});

client.login('BOT_TOKEN');