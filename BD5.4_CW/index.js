import express from "express";

const app = express();
import { track } from "./model/track.model.js";
import { sequelize } from "./lib/index.js";
import { user } from "./model/user.model.js";
import { like } from "./model/like.model.js";

import { Op } from "@sequelize/core";

app.use(express.json());

let movieData = [
  {
    name: "Raabta",
    genre: "Romantic",
    release_year: 2012,
    artist: "Arjit Singh",
    album: "Agent Vinod",
    duration: 4,
  },
  {
    name: "Naina Da Kya Kasoor",
    genre: "Pop",
    release_year: 2010,
    artist: "Amit Trivedi",
    album: "Andhadhun",
    duration: 3,
  },
  {
    name: "Ghoomar",
    genre: "Traditional",
    release_year: 2018,
    artist: "Shreya Goshal",
    album: "Padmavaat",
    duration: 3,
  },
  {
    name: "Hawa Banke",
    genre: "Romantic",
    release_year: 2019,
    artist: "Darshan Raval",
    album: "Hawa Banke(Single)",
    duration: 3,
  },
  {
    name: "Ghungroo",
    genre: "Dance",
    release_year: 2019,
    artist: "Arjit Singh",
    album: "War",
    duration: 5,
  },
  {
    name: "Makhna",
    genre: "Hip-Hop",
    release_year: 2019,
    artist: "Tanisk Bagchi",
    album: "Drive",
    duration: 3,
  },
];

let newTrack = {
  name: "Freedom Fighter",
  genre: "Drama",
  release_year: 2005,
  artist: "Lata Mangeshkar Ji",
  album: "Freedom Fighter",
  duration: 4,
};

let updateTrack = {
  name: "One Man Army",
  album: "One Man Army",
};

async function fetchAllTracks() {
  let response = track.findAll();
  return response;
}

async function fetchTrachById(id) {
  let response = await track.findOne({ where: { id } });
  return response;
}

async function fetchTrackByArtist(artist) {
  let response = await track.findAll({ where: { artist } });
  return response;
}

async function fetchTrackByOrderByReleaseYear(order) {
  let response = await track.findAll({ order: [["release_year", order]] });
  return response;
}

async function addNewTrack(newData) {
  let newResponse = await track.create(newData);
  return newResponse;
}

async function updateTrackById(updateTrack, id) {
  let trackByIdDetails = await track.findOne({ where: { id } });
  let oldTrackDetailSave = JSON.parse(JSON.stringify(trackByIdDetails)); //Main Line
  if (trackByIdDetails === null || trackByIdDetails === 0) {
    return null;
  }
  await trackByIdDetails.set(updateTrack);
  await trackByIdDetails.save();
  return { oldData: oldTrackDetailSave, newData: trackByIdDetails };
}

async function deleteTrackById(id) {
  let response = await track.destroy({ where: { id } });
  if (response === null || response === 0) {
    return null;
  }
  return response;
}

async function fetchAllUsers() {
  let response = await user.findAll();
  return response;
}

async function addNewUser(newData) {
  let newResponse = await user.create(newData);
  return newResponse;
}

async function updateUserById(updateUser, id) {
  let userByIdDetails = await user.findOne({ where: { id } });
  let oldUserDetailSave = JSON.parse(JSON.stringify(userByIdDetails));
  if (oldUserDetailSave === null || oldUserDetailSave === 0) {
    return null;
  }
  await userByIdDetails.set(updateUser);
  await userByIdDetails.save();
  return { oldData: oldUserDetailSave, newData: userByIdDetails };
}

async function deleteUserById(id) {
  let response = await user.destroy({ where: { id } });
  if (response === null || response === 0) {
    return null;
  }
  return response;
}

async function likeTrack(userId, trackId) {
  let response = await like.create({ userId, trackId });
  return response;
}

async function dislike(userId, trackId) {
  let response = await like.destroy({
    where: {
      userId: userId,
      trackId: trackId,
    },
  });
  if (response === null || response.length === 0) {
    return {};
  }
  return response;
}

async function fetchAllLikedTracks(userId) {
  let trackIds = await like.findAll({ where: { userId } });

  let trackRecords = [];
  for (let i = 0; i < trackIds.length; i++) {
    trackRecords.push(trackIds[i].trackId);
  }

  let response = await track.findAll({
    where: { id: { [Op.in]: trackRecords } },
  });
  return response;
}

async function fetchAllLikedTracksByArtist(userId, artist) {
  let trackIds = await like.findAll({ where: { userId } });

  let trackRecords = [];
  for (let i = 0; i < trackIds.length; i++) {
    trackRecords.push(trackIds[i].trackId);
  }

  let response = await track.findAll({
    where: { id: { [Op.in]: trackRecords }, artist: artist },
  });
  return response;
}

app.get("/seed-data", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await user.create({
      username: "test1",
      password: "test1",
      email: "test1@gmail.com",
    });
    await track.bulkCreate(movieData);
    /* await like.create({
      userId: 1,
      trackId: 1,
    });*/
    res.status(200).json({ message: "Data seeded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error seeding the data", error: error.message });
  }
});

app.get("/tracks", async (req, res) => {
  try {
    let result = await fetchAllTracks();
    if (result.length === 0) {
      res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

app.get("/tracks/id/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await fetchTrachById(id);
    if (result.length === 0 || result === null) {
      res.status(404).json({ message: "No Data Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

app.get("/tracks/artist/:artist", async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await fetchTrackByArtist(artist);
    if (result.length === 0 || result === null) {
      res.status(404).json({ message: "No Data Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

app.get("/tracks/sort/release_year", async (req, res) => {
  try {
    let order = req.query.order;
    let result = await fetchTrackByOrderByReleaseYear(order);
    if (result.length === 0 || result === null) {
      res.status(404).json({ message: "No Data Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

app.post("/tracks/new", async (req, res) => {
  try {
    let newData = req.body.newTrack;
    let response = await addNewTrack(newData);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

app.post("/tracks/update/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await updateTrackById(updateTrack, id);
    if (result === null || result === 0) {
      res.status(404).json({ message: "No Data Found" });
    }
    res
      .status(200)
      .json({ oldTrack: result.oldData, newTrack: result.newData });
  } catch (error) {
    res.status(500).json({
      message: "Error in updating Data",
      error: error.message,
    });
  }
});

app.post("/tracks/delete/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await deleteTrackById(id);
    if (result === null || result === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in deleting Data",
      error: error.message,
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    let response = await fetchAllUsers();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

app.post("/users/new", async (req, res) => {
  try {
    let newData = req.body.newUser;
    let response = await addNewUser(newData);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error in creating Data",
      error: error.message,
    });
  }
});

app.post("/users/update/:id", async (req, res) => {
  try {
    let newData = req.body.newUser;
    let id = parseInt(req.params.id);
    let result = await updateUserById(newData, id);
    if (result === null || result === 0) {
      res.status(404).json({ message: "No Data Found" });
    }
    res
      .status(200)
      .json({ oldTrack: result.oldData, newTrack: result.newData });
  } catch (error) {
    res.status(500).json({
      message: "Error in updating Data",
      error: error.message,
    });
  }
});

app.post("/users/delete/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await deleteUserById(id);
    if (result === null || result === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in deleting Data",
      error: error.message,
    });
  }
});

app.get("/likes", async (req, res) => {
  let response = await like.findAll();
  res.status(200).json(response);
});

// users/1/like?trackId=1
app.get("/users/:id/like", async (req, res) => {
  try {
    let userId = parseInt(req.params.id);
    let trackId = parseInt(req.query.trackId);
    let result = await likeTrack(userId, trackId);
    res.status(200).json({ message: "Data added successfully", result });
  } catch (error) {
    res.status(500).json({
      message: "Error in creating Data",
      error: error.message,
    });
  }
});

// users/1/dislike?trackId=1
app.get("/users/:id/dislike", async (req, res) => {
  try {
    let userId = parseInt(req.params.id);
    let trackId = parseInt(req.query.trackId);
    let result = await dislike(userId, trackId);
    res.status(200).json({ message: "Data deleted successfully", result });
  } catch (error) {
    res.status(500).json({
      message: "Error in deleting Data",
      error: error.message,
    });
  }
});

// users/1/liked
app.get("/users/:id/liked", async (req, res) => {
  try {
    let userId = parseInt(req.params.id);
    let result = await fetchAllLikedTracks(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

// users/1/likedArtist?artist=Arjit Singh
app.get("/users/:id/likedArtist", async (req, res) => {
  try {
    let userId = parseInt(req.params.id);
    let artist = req.query.artist;
    let result = await fetchAllLikedTracksByArtist(userId, artist);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching Data",
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Express server initialized");
});
