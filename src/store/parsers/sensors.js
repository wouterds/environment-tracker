const parse = (raw) => {
  let data = {};

  switch (raw.sensor) {
    case 'bme280':
      data.pressure = raw.data.pressure;
      data.temperature = raw.data.temperature;
      data.humidity = raw.data.humidity;
      break;

    case 'ccs811':
      data.co2 = raw.data.co2;
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
