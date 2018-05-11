const parse = (raw) => {
  let data = {};

  switch (raw.sensor) {
    case 'bme280':
      data.pressure = raw.data.pressure;
      data.temperature = raw.data.temperature;
      data.humidity = raw.data.humidity;
      break;

    case 'bh1750':
      data.light = raw.data.light;
      break;
  }

  return data;
};

export {
  parse,
};
