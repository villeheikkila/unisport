const cheerio = require("cheerio");

const formatDateInfo = (data) =>
  data
    .map((e) => e.split(/(\s)/))
    .map((e) => e.filter((_) => _.length !== 1))
    .reduce((total, current) => {
      return { ...total, [current[0]]: current[1] };
    }, {});

const htmlToStringArray = (data) =>
  data
    .text()
    .split("\n")
    .map((e) => e.trim())
    .filter((e) => e.length !== 0);

const findOpenHours = (data, gym) => {
  const hotFix = gym === "toolo" || "viikki" ? 2 : 1;
  const firstHour = data.findIndex((e) => e === "Aukioloajat") + hotFix;
  const lastHour =
    gym !== "viikki"
      ? data.findIndex(
          (e) =>
            e.includes(
              "Kassat suljetaan 30 minuuttia ennen ilmoitettua sulkemisaikaa."
            ) ||
            e.includes(
              "Keskuksesta on oltava poistunut sulkemisaikaan mennessä."
            )
        )
      : firstHour + 8;

  return firstHour !== 0
    ? formatDateInfo(data.slice(firstHour, lastHour))
    : null;
};

const findExceptions = (data) => {
  const firstException =
    data.findIndex(
      (e) => e.includes("Poikkeusaukioloajat") || e.includes("Poikkeusinfo")
    ) + 1;

  const lastException =
    data.findIndex((e) =>
      e.includes(
        "Poikkeusaukiolopäivinä ryhmäliikunnassa ja muissa palveluissa voi olla muutoksia."
      )
    ) - 1;

  return firstException !== 0 && data.slice(firstException, lastException);
};

const findSaunaHours = (data) => {
  const firstSauna =
    data.findIndex(
      (e) => e.includes("Saunat") || e.includes("Saunat ovat lämpimänä")
    ) + 1;

  return (
    firstSauna !== 0 && formatDateInfo(data.slice(firstSauna, firstSauna + 4))
  );
};

export const extractData = (html, gym) => {
  const $ = cheerio.load(html);
  const elements = $(".field--tight-text");
  const array = htmlToStringArray(elements);

  const openingHours = findOpenHours(array, gym);
  const saunaHours = findSaunaHours(array);
  const exceptions = findExceptions(array);

  return { gym, openingHours, saunaHours, exceptions };
};
