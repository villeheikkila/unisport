"use strict";
const axios = require("axios");
import { extractData } from "./crawler";

const locations = [
  "kluuvi",
  "kumpula",
  "meilahti",
  "otaniemi",
  "viikki",
  "toolo",
];

const allGymData = (data) =>
  Promise.all(
    data.map((location) =>
      axios(`https://unisport.fi/paikat/unisport-${location}`)
    )
  );

module.exports.unisport = async () => {
  const data = await (await allGymData(locations)).map(({ data }, i) =>
    extractData(data, locations[i])
  );

  return { statusCode: 200, body: JSON.stringify(data) };
};
