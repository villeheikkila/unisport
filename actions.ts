import { wilks, ipf } from "./helpers";

const axios = require("axios");

const locations = [
  "kluuvi",
  "kumpula",
  "meilahti",
  "otaniemi",
  "viikki",
  "toolo",
];

const splitArgs = (text) => text.match(/^\/([^\s]+)\s?(.+)?/);

export const unisportHours = async ({ reply, update }) => {
  const text = update.message.text.toLowerCase();
  const args = splitArgs(text);
  const arg = args?.length > 1 && args[2];

  const gymIndex = arg ? locations.findIndex((e) => e === arg) : 1;

  if (gymIndex === -1) {
    reply("No gym found with that name :(");
  } else {
    try {
      const response = await axios.get(process.env.UNISPORT_API);
      await reply(
        `${locations[gymIndex]} opening hours\n\n${Object.entries(
          response.data[gymIndex].openingHours
        )
          .map((e) => `${e[0]}: ${e[1]}`)
          .join("\n")}`
      );
    } catch (error) {
      reply(`Error fetching Unisport data: ${error.message}`);
    }
  }
};

export const weatherHelsinki = async ({ reply }) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=helsinki&units=metric&appid=${process.env.OPENWEATHER_TOKEN}`
    );
    await reply(
      `The temperature in Helsinki at the moment is ${response.data.main.temp} degrees`
    );
  } catch (error) {
    reply(`Error fetching weather: ${error.message}`);
  }
};

export const calculateWilks = ({ reply, update }) => {
  const text = update.message.text.toLowerCase();
  const args = splitArgs(text);

  if (args.length > 2) {
    const values = args[2].split(" ");

    reply(
      `The wilks score at ${values[0]}kg bw and ${values[1]}kg total is ${wilks(
        values[0],
        values[1]
      ).toFixed(2)}`
    );
  } else {
    reply(`Please provide valid weight and total in kgs`);
  }
};

export const calculateIpf = ({ reply, update }) => {
  const text = update.message.text.toLowerCase();
  const args = splitArgs(text);

  if (args.length > 2) {
    const values = args[2].split(" ");

    reply(
      `The ipf score at ${values[0]}kg bw and ${values[1]}kg total is ${ipf(
        values[0],
        values[1]
      ).toFixed(2)}`
    );
  } else {
    reply(`Please provide valid weight and total in kgs`);
  }
};

export const hearsBulli = ({ replyWithSticker }) =>
  replyWithSticker(
    "CAACAgEAAxkBAAJFGl6TMGYshUXc7e5RDc317NcFXxCeAAKuDAACmX-IAsgpp18S11KAGAQ"
  );
