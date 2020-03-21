("use strict");
const HomePage = require("../models").homepage;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        {
          title: "My time at Codaisseur",
          description: "A tell all tale",
          userId: 1
        },
        {
          title: "I am a dummy",
          backgroundColor: "#40C076",
          color: "#EDEDED",
          userId: 2
        }
      ].map(homepage => HomePage.create(homepage))
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("homepages", null, {});
  }
};
