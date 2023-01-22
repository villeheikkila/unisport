# Serverless Telegram Bot

A simple telegram bot that can be deployed as lambda with Serverless. Supported commands:

| Environment variable   | Function                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /unisport [location]   | returns the opening hours of the selected gym and defaults to Kumpula ([unisport-crawler](https://github.com/villeheikkila/unisport-crawler) API) Token |
| /weather               | shows the current temperature in Helsinki (OpenWeather API)                                                                                             |
| /ipf [weight][total]   | returns ipf points in the men's raw sbd category                                                                                                        |
| /wilks [weight][total] | returns men's wilks score for the given values                                                                                                          |

### Environment variables

| Environment variable | Function                              |
| -------------------- | ------------------------------------- |
| TELEGRAM_TOKEN       | Telegram Bot Token                    |
| OPENWEATHER_TOKEN    | OpenWeather token for weather data    |
| UNISPORT_API         | API endpoint for the unisport-crawler |
