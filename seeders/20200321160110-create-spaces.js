"use strict";
const User = require("../models").user;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user1 = await User.findOne({
      where: { email: "test@test.com" },
    });

    const user2 = await User.findOne({
      where: { email: "dummy@dummy.com" },
    });

    await queryInterface.bulkInsert(
      "spaces",
      [
        {
          title: "My time at Codaisseur",
          description: "A tell all tale",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user1.id,
        },
        {
          title: "I am a dummy",
          backgroundColor: "#40C076",
          color: "#EDEDED",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: user2.id,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("spaces", null, {});
  },
};
