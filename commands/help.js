exports.run = (client, message, args, level) => {
    if (!args[0]) {
        const settings = message.settings;
        const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);
        const commandNames = myCommands.keyArray();
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        settings.prefix = settings.prefix.value;

        let currentCategory = "";
        let output = `= Command List =\n\n[Use ${settings.prefix}help <commandname> for details]\n`;
        const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
        sorted.forEach(c => {
            const cat = c.help.category.toProperCase();
            if (currentCategory !== cat) {
                output += `\n== ${cat} ==\n`;
                currentCategory = cat;
            }
            output += `${settings.prefix}${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
        });
        message.channel.send(output, {
            code: "asciidoc",
            split: true
        });
    } else {
        // Show individual command's help.
        let command = args[0];
        let alias = "";
        let extended = "";
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            if (level < client.levelCache[command.conf.permLevel]) return;
            if (command.conf.aliases[0]) {
                alias = `\naliases::${command.conf.aliases.join(", ")}`;
            }
            if (command.help.extended) {
                extended = `\nextended::${command.help.extended}`;
            }
            message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage::${command.help.usage}${alias}${extended}`, {
                code: "asciidoc", split: true
            });
        } else if (client.aliases.has(args[0])) {
            command = client.commands.get(client.aliases.get(args[0]));
            if (level < client.levelCache[command.conf.permLevel]) return;
            if (command.conf.aliases[0]) {
                alias = `\naliases::${command.conf.aliases.toString().replace(",", ", ")}`;
            }
            if (command.help.extended) {
                extended = `\nextended::${command.help.extended}`;
            }
            message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage::${command.help.usage}${alias}${extended}`, {
                code: "asciidoc"
            });

        }



    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["h", "halp"],
    permLevel: "User"
};

exports.help = {
    name: "help",
    category: "System",
    description: "Displays all the available commands for your permission level.",
    usage: "help [command]"
};
