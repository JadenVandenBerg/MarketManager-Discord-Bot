const { Client } = require('discord.js');
const { MessageButton } = require('discord-buttons');

const client = new Client();
require('discord-buttons')(client);
const TOKEN = 'Enter Token';
const REACTION_EMOJI = '👍';

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('guildMemberAdd', (member) => {
    let ROLE_ID = "1133865326266826793";
    const role = member.guild.roles.cache.get(ROLE_ID);
  
    if (role) {
      member.roles.add(role)
        .then(() => console.log(`Role added to ${member.user.tag}.`))
        .catch(console.error);
    } else {
      console.log(`Role with ID ${ROLE_ID} not found.`);
    }
  });

client.on("message", async (message) => {

    if (message.author.id == "585621628348792872") {
        if (message.content.includes("!setup")) {

            let userId;
    
            if (message.mentions.users.size > 0) {
                const mentionedUser = message.mentions.users.first();
                userId = mentionedUser.id;
            }
    
            const button = new MessageButton()
            .setLabel('Create Buy Order')
            .setID('sellButton' + userId)
            .setStyle('green');
    
            await message.channel.send('Press the button below to create a buy order:', button);
        }
    }
});


client.on('clickButton', async (button) => {
    if (button.id.includes('sellButton')) {
      // Handle button click event

      const userId = button.id.substring(10);
      try {
        const guild = button.guild;

        const channel = guild.channels.cache.find((ch) => ch.name === "Private Channels");

        let category;
        if (!channel) {
            category = await guild.channels.create('Private Channels', {
                type: 'category',
                permissionOverwrites: [
                  {
                    id: guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                  },
                ],
            });
        }
        else {
            category = channel;
        }
  
        const channelName = `${button.clicker.user.username}-${button.clicker.user.discriminator}`;
        const newChannel = await guild.channels.create(channelName, {
          type: 'text',
          parent: category,
          permissionOverwrites: [
            {
                id: client.users.cache.get(userId).id,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: button.clicker.id,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: guild.roles.everyone,
                deny: ['VIEW_CHANNEL'],
              },
          ],
        });

        const cancelButton = new MessageButton()
        .setLabel('Cancel/Mark As Complete')
        .setID('cancelButton')
        .setStyle('green');
  
        const welcomeMessage = `Welcome to your private channel, ${button.clicker.user}! Note that server admins can still see this channel, purely for moderation purposes.\n\nDiscuss sale terms with your seller here!\nStart by saying what you are looking to buy, and how you plan on paying.`;
        newChannel.send(welcomeMessage, cancelButton);
      } catch (error) {
        console.error('Error creating private channel:', error);
      }
    }
    else if (button.id == "cancelButton") {
        button.channel.delete();
    }
  });
client.login(TOKEN);
