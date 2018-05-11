const parse = (raw) => {
  let data = {};

  switch (raw.sensor) {
    case 'bme280':
      data.temperature = raw.data
        .filter(item => item.type === 'temperature')
        .map(item => item.value);
      data.humidity = raw.data
        .filter(item => item.type === 'humidity')
        .map(item => item.value);
      data.pressure = raw.data
        .filter(item => item.type === 'pressure')
        .map(item => item.value);
      break;

    case 'bh1750':
      data.light = raw.data
        .filter(item => item.type === 'light')
        .map(item => item.value);
      break;
  }

  return data;
};

export {
  parse,
};
