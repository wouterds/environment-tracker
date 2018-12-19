import axios from 'axios';
import { addSeconds, isFuture } from 'date-fns';
import { config } from 'dotenv';

config();

interface ApiResponse {
  temperature: number;
  humidity: number;
  pressure: number;
  eco2: number;
  illuminance: number;
}

(async () => {
  const endTime = addSeconds(new Date(), 30);

  const samples: ApiResponse[] = [];
  while (isFuture(endTime)) {
    try {
      const response = await axios.get('http://esp8266');

      if (response.status !== 200) {
        continue;
      }

      samples.push(response.data);
    } catch (e) {
      continue;
    }
  }

  console.log({ samples });

  process.exit();
})();
