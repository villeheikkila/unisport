## Unisport Crawler

A simple web crawler based on Cheerio that reads the opening hours, sauna hours and notices relating those times from Unisport's website. It can be easily deployed with Serverless and requires zero configuration.

Sample of the returned JSON:

````
[
  {
    "gym": "kluuvi",
    "openingHours": {
      "ma–pe": "6.30–22.00",
      "la": "9.00–20.00",
      "su": "10.00–21.00"
    },
    "saunaHours": false,
    "exceptions": []
  },
  {
    "gym": "kumpula",
    "openingHours": {
      "ma-to": "6.45–23.15",
      "pe": "6.45–22.15",
      "la": "9.45–20.15",
      "su": "9.45–22.15"
    },
    "saunaHours": {
      "ma-to": "15.00-23.00",
      "pe": "15.00-22.00",
      "la": "10.30-20.00",
      "su": "10.30-22.00"
    },
    "exceptions": []
  },
  {
    "gym": "meilahti",
    "openingHours": {
      "ma–to": "6.45–23.15",
      "pe": "6.45–22.15",
      "la": "9.45–20.15",
      "su": "9.45–21.00"
    },
    "saunaHours": {
      "ma–to": "15.00–23.00",
      "pe": "15.00–22.00",
      "la": "11.00–20.00",
      "su": "11.00–21.00"
    },
    "exceptions": [
      "10.4. pe, pitkäperjantai: 9.45-21.15",
      "11.4. la, pääsiäislauntai: 9.45-20.15",
      "12.4. su, 1. pääsiäispäivä: 9.45-21.15",
      "13.4. ma, 2. pääsiäispäivä: 9.45-22.15",
      "30.4. to, vappuaatto: 6.45-16.00",
      "1.5. pe, vappupäivä: SULJETTU",
      "21.5. to, helatorstai: 9.45-21.00"
    ]
  },
  {
    "gym": "otaniemi",
    "openingHours": {
      "ma–to": "6.45–23.15",
      "pe": "6.45–22.15",
      "la": "9.45–20.15",
      "su": "9.45–22.15"
    },
    "saunaHours": false,
    "exceptions": [
      "30.4. to, vappuaatto: 6.45-16.00",
      "1.5. pe, vappupäivä: SULJETTU",
      "21.5. to, helatorstai: 9.45-22.15"
    ]
  },
  {
    "gym": "viikki",
    "openingHours": {
      "Ma": "15.45-18.50",
      "Ti": "15.45-20.30",
      "Ke": "16.45-20.15",
      "To": "15.45-20.00",
      "Pe": "15.45-20.30",
      "La": "10.15-13.00",
      "Su": "SULJETTU"
    },
    "saunaHours": false,
    "exceptions": false
  },
  {
    "gym": "toolo",
    "openingHours": {
      "ma-su": "5.00-24.00"
    },
    "saunaHours": false,
    "exceptions": false
  }
]
```