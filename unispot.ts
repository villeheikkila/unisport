import * as denoDom from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const gyms = [
  "kluuvi",
  //"porthania",
  "kumpula",
  "meilahti",
  "otaniemi",
  "toolo",
];

const mapGymPageToRealName = (unisportNameId: string) => {
  switch (unisportNameId) {
    case "kluuvi":
      return "Kluuvi";
    case "kumpula":
      return "Kumpula";
    case "meilahti":
      return "Meilahti";
    case "otaniemi":
      return "Otaniemi";
    case "toolo":
      return "Töölö";
    default:
      return "";
  }
};

const baseUrl = "https://www.unisport.fi/paikat/";
const gymPagePrefix = "unisport-";

const days = ["ma", "ti", "ke", "to", "pe", "la", "su"];

enum Dividers {
  DayRange = "-",
  SingleDay = " ",
}

type HourMinute = {
  hour: number;
  minute: number;
};

type Range = {
  opens: HourMinute;
  closes: HourMinute;
};

type WeekType = {
  monday: null | Range;
  tuesday: null | Range;
  wednesday: null | Range;
  thursday: null | Range;
  friday: null | Range;
  saturday: null | Range;
  sunday: null | Range;
};

const parseTimeRange = (str: string): [HourMinute, HourMinute] => {
  const [start, end] = str.split("-").map((hoursMins) => {
    const [hour, minute] = hoursMins
      .split(".")
      .map((value) => parseInt(value, 10));
    return { hour, minute };
  });

  return [start, end];
};

const findAllOccurrences = (str: string, search: string) =>
  [...str.matchAll(new RegExp(search, "gi"))]
    .map(({ index }) => index)
    .flatMap((index) => (index ? [index] : []));

const unifyDayRangeSeparators = (str: string) =>
  str.replace("\u2013", Dividers.DayRange);

const parseOpeningHours = (rawString: string) => {
  const stringTillBreak = unifyDayRangeSeparators(rawString);

  const openingHours: WeekType = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  };

  const mapShortToLongDay: Record<string, keyof typeof openingHours> = {
    ma: "monday",
    ti: "tuesday",
    ke: "wednesday",
    to: "thursday",
    pe: "friday",
    la: "saturday",
    su: "sunday",
  };

  const lastPos = stringTillBreak.length;
  let position = 0;
  let dayIndex = 0;

  while (position < lastPos && dayIndex < days.length) {
    const indicesOfFoundDayString = findAllOccurrences(
      stringTillBreak,
      days[dayIndex]
    );

    const positionOfNextDay = indicesOfFoundDayString.find(
      (i) => i >= position
    );
    if (!positionOfNextDay) break;

    position = positionOfNextDay + days[dayIndex].length;

    const divider = stringTillBreak.substring(position, ++position);

    const [opens, closes] = parseTimeRange(
      stringTillBreak.substring(position, position + 10)
    );

    if (divider === Dividers.SingleDay) {
      openingHours[mapShortToLongDay[days[dayIndex]]] = { opens, closes };
      dayIndex++;
    } else if (divider === Dividers.DayRange) {
      const lastDay = stringTillBreak.substring(position, position + 2);
      const indexOfLastDayInRange = days.indexOf(lastDay.toLocaleLowerCase());

      const [opens, closes] = parseTimeRange(
        stringTillBreak.substring(position + 3, position + 13)
      );

      Array.from({ length: indexOfLastDayInRange - dayIndex + 1 })
        .map((_, i) => i + dayIndex)
        .forEach((n) => {
          openingHours[mapShortToLongDay[days[n]]] = { opens, closes };
        });

      dayIndex = indexOfLastDayInRange + 1;
    }
  }

  return openingHours;
};

const getOpeningHoursHTMLBlock = async (
  url: string
): Promise<string | null> => {
  const res = await fetch(url);
  const html = await res.text();
  const document = new denoDom.DOMParser().parseFromString(html, "text/html");

  if (document) {
    return document.getElementsByClassName("field--field_opening_hours")?.at(0)
      ?.innerHTML!;
  } else {
    return null;
  }
};

try {
  const urls = gyms.map((g) => baseUrl + gymPagePrefix + g);
  const pages = await Promise.all(urls.map((u) => getOpeningHoursHTMLBlock(u)));

  const openingHours = await Promise.all(
    pages
      .flatMap((p) => (p ? [p.substring(p.search("Aukioloajat"))] : []))
      .map((p, i) => ({
        location: mapGymPageToRealName(gyms[i]),
        openingHours: parseOpeningHours(p),
      }))
  );

  console.log(JSON.stringify(openingHours, null, 4));
} catch (error) {
  console.log(error);
}
