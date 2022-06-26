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
    case "kluuvi": {
      return "Kluuvi";
    }
    case "kumpula": {
      return "Kumpula";
    }
    case "meilahti": {
      return "Meilahti";
    }
    case "otaniemi": {
      return "Otaniemi";
    }
    case "toolo": {
      return "Töölö";
    }
    default: {
      return "";
    }
  }
};

const baseUrl = "https://www.unisport.fi/paikat/";
const gymPagePrefix = "unisport-";

const days = ["ma", "ti", "ke", "to", "pe", "la", "su"];

enum Dividers {
  DayRange = "-",
  SingleDay = " ",
}

type mmHH = {
  hours: number;
  mins: number;
};
type Range = {
  opens: mmHH;
  closes: mmHH;
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

const parseTimeRange = (str: string) =>
  str.split("-").map((d) => {
    const [hours, mins] = d.split(".").map((v) => parseInt(v, 10));
    return { hours, mins };
  });

const parseOpeningHours = (rawString: string) => {
  const stringTillBreak = rawString
    .substring(rawString.search("Aukioloajat"))
    .replace("\u2013", Dividers.DayRange);

  const openingHours: WeekType = {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  };

  const mapToName: Record<string, keyof typeof openingHours> = {
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
    const indicesOfToken = [
      ...stringTillBreak.matchAll(new RegExp(days[dayIndex], "gi")),
    ]
      .map(({ index }) => index)
      .flatMap((index) => (index ? [index] : []));

    const posOfNextToken = indicesOfToken.find((i) => i >= position);
    if (!posOfNextToken) break;

    position = posOfNextToken + days[dayIndex].length;

    const divider = stringTillBreak.substring(position, ++position);

    const [opens, closes] = parseTimeRange(
      stringTillBreak.substring(position, position + 10)
    );

    if (divider === Dividers.SingleDay) {
      openingHours[mapToName[days[dayIndex]]] = { opens, closes };
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
          openingHours[mapToName[days[n]]] = { opens, closes };
        });

      dayIndex = indexOfLastDayInRange + 1;
    }
  }

  return openingHours;
};

try {
  const urls = gyms.map((g) => baseUrl + gymPagePrefix + g);
  const pages = await Promise.all(urls.map((u) => getOpeningHoursHTMLBlock(u)));

  const openingHours = await Promise.all(
    pages.map((p, i) => ({
      location: mapGymPageToRealName(gyms[i]),
      openingHours: parseOpeningHours(p as any),
    }))
  );

  console.log(JSON.stringify(openingHours, null, 4));
} catch (error) {
  console.log(error);
}
