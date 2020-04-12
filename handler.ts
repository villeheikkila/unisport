const Telegraf = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN, {
  webhookReply: false,
});

module.exports.webhook = async (event) => {
  try {
    const body = JSON.parse(event.body);

    bot.hears("bulli", ({ reply }) => reply("No bulli!"));

    bot.hears("sää", async ({ reply }) => {
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
    });

    await bot.handleUpdate(body);
    return { statusCode: 200, body: "" };
  } catch (error) {
    return { statusCode: 500 };
  }
};
