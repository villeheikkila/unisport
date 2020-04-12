type Genders = "man" | "woman";
type Lifts = "sbd" | "squat" | "bench" | "deadlift";
type Equipments = "raw" | "equipped";

type Events = {
  [key in Lifts]: number[];
};

type Categories = {
  [key in Equipments]: Events;
};

type IPF = {
  [key in Genders]: Categories;
};

const IPF: IPF = {
  man: {
    raw: {
      sbd: [310.67, 857.785, 53.216, 147.0835],
      squat: [123.1, 363.085, 25.1667, 75.4311],
      bench: [86.4745, 259.155, 17.57845, 53.122],
      deadlift: [103.5355, 244.765, 15.3714, 31.5022],
    },
    equipped: {
      sbd: [387.265, 1121.28, 80.6324, 222.4896],
      squat: [150.485, 446.445, 36.5155, 103.7061],
      bench: [133.94, 441.465, 35.3938, 113.0057],
      deadlift: [110.135, 263.66, 14.996, 23.011],
    },
  },
  woman: {
    raw: {
      sbd: [125.1435, 228.03, 34.5246, 86.8301],
      squat: [50.479, 105.632, 19.1846, 56.2215],
      bench: [25.0485, 43.848, 6.7172, 13.952],
      deadlift: [47.136, 67.349, 9.1555, 13.67],
    },
    equipped: {
      sbd: [176.58, 373.315, 48.4534, 110.0103],
      squat: [74.6855, 171.585, 21.9475, 52.2948],
      bench: [49.106, 124.209, 23.199, 67.4926],
      deadlift: [51.002, 69.8265, 8.5802, 5.7258],
    },
  },
};

export const ipf = (
  bodyweight: number,
  total: number,
  sex: Genders = "man",
  equipment: Equipments = "raw",
  event: Lifts = "sbd"
): number => {
  const params = IPF[sex][equipment][event];
  const mean = params[0] * Math.log(bodyweight) - params[1];
  const dev = params[2] * Math.log(bodyweight) - params[3];
  const points = 500 + (100 * (total - mean)) / dev;
  return isNaN(points) || points < 0 || bodyweight < 40 ? 0 : points;
};

const wilksCoefficient = (
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
  f: number,
  x: number
): number => {
  const x2 = x * x,
    x3 = x2 * x,
    x4 = x3 * x,
    x5 = x4 * x;
  return 500.0 / (a + b * x + c * x2 + d * x3 + e * x4 + f * x5);
};

const wilksCoefficientWoman = (bodyweight: number): number => {
  const bw = Math.min(Math.max(bodyweight, 26.51), 154.53);
  return wilksCoefficient(
    594.31747775582,
    -27.23842536447,
    0.82112226871,
    -0.00930733913,
    0.00004731582,
    -0.00000009054,
    bw
  );
};

const wilksCoefficientMan = (bodyweight: number): number => {
  const bw = Math.min(Math.max(bodyweight, 40.0), 201.9);
  return wilksCoefficient(
    -216.0475144,
    16.2606339,
    -0.002388645,
    -0.00113732,
    7.01863e-6,
    -1.291e-8,
    bw
  );
};

export const wilks = (
  bodyweight: number,
  total: number,
  sex: Genders = "man"
): number =>
  sex === "man"
    ? wilksCoefficientMan(bodyweight) * total
    : wilksCoefficientWoman(bodyweight) * total;
