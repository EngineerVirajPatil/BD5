import { DataTypes, sequelize } from "../lib/index.js";
import { track } from "../model/track.model.js";
import { user } from "../model/user.model.js";

export const like = sequelize.define("like", {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: "id",
    },
  },
  trackId: {
    type: DataTypes.INTEGER,
    references: {
      model: track,
      key: "id",
    },
  },
});

user.belongsToMany(track, { through: like });
track.belongsToMany(user, { through: like });
