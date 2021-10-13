const { commands, datafile} = require('../eris-core/submodules');

module.exports = {
  name: 'pet',
  description: 'Pet the dog.',
  execute(interaction, client) {
    const oldPetData = datafile.get('petData');
    const newUserPetData = (oldPetData ? oldPetData[interaction.member.user.id] ?? 0 : 0) + 1;

    datafile.set({
      petData: {
        ...oldPetData,
        [interaction.member.user.id]: newUserPetData,
      },
    });
    commands.sendImmediateResponseMessage(interaction, client, { content: `You've pet Cooper ${newUserPetData} times!` });
  },
};
