// This event executes when a new guild (server) is left.

module.exports = (client, guild) => {
  
  client.logger.event(`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`);

  if(!guild.available) return;
  client.user.setActivity(`${client.config.defaultSettings.prefix.value}help | ${client.guilds.size} Servers`);


  try {
  client.channels.get('533877857856913409').send(`:heavy_multiplication_x: Left Guild ${guild.name} (${guild.id}) now in ${client.guilds.size} servers.`);
} catch(err) {
console.log(err);
}
  // If the settings Enmap contains any guild overrides, remove them.
  // No use keeping stale data!
  if (client.settings.has(guild.id)) {
    client.settings.delete(guild.id);
  }
};
