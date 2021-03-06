import Papa from "papaparse";

const parseData = ({ data }) => {
  data.forEach(card => {
    for (const key in card) {
      if (card.hasOwnProperty(key)) {
        if (!isNaN(parseInt(card[key]))) card[key] = parseInt(card[key]);
      }
    }
  });
  return data;
};

const foodCSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv";

export const food = new Promise(ok =>
  Papa.parse(foodCSV, {
    download: true,
    header: true,
    complete: ok
  })
).then(parseData);

const guestCSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv&gid=1152907192";

export const guests = new Promise(ok =>
  Papa.parse(guestCSV, {
    download: true,
    header: true,
    complete: ok
  })
).then(parseData);

const startingCSV =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFtDoZRo1q_et75CgtM3GHHXlIHiuip-GJ9wdx5iZVjI05KvhWI5fQCbxQVoBIvEy0kTASL151dJyS/pub?output=csv&gid=1960705512";

export const starting = new Promise(ok =>
  Papa.parse(startingCSV, {
    download: true,
    header: true,
    complete: ok
  })
).then(parseData);

export default Promise.all([food, guests, starting]).then(
  ([food, guest, starting]) => ({
    food,
    guest,
    starting
  })
);
