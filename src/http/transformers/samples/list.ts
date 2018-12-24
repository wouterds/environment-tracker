import { differenceInMinutes, startOfMinute, subMinutes } from 'date-fns';
import { head, last } from 'lodash';
import { Definition } from '../../../models/sample';

interface ResponseObject {
  id: string | null;
  value: number | null;
  date: Date;
}

const roundTillTenthMinute = (date: Date): Date => {
  const coeff = 1000 * 60 * 10;

  return new Date(Math.round(date.getTime() / coeff) * coeff);
};

export const transform = (
  samples: Definition[],
  groupingIntervalMinutes?: number,
): ResponseObject[] => {
  const lastItem = head(samples); // dangerous: assuming first item is last in time
  const firstItem = last(samples); // dangerous: assuming last item is firt in time

  if (!firstItem || !lastItem) {
    return [];
  }

  // The end date is the start date, round it to a nice number
  const endDate = roundTillTenthMinute(lastItem.createdAt);

  // Map samples to minutes
  const minutes = differenceInMinutes(endDate, firstItem.createdAt);
  const samplesMinuteMap: { [index: number]: Definition } = {};
  samples.forEach((sample: Definition) => {
    samplesMinuteMap[startOfMinute(sample.createdAt).getTime()] = sample;
  });

  // Loop through every {interval} of minutes between our 2 points and fill in gaps
  const response: ResponseObject[] = [];
  for (let i = 0; i < minutes; i += groupingIntervalMinutes || 1) {
    const date = subMinutes(endDate, i);
    const sample = samplesMinuteMap[date.getTime()];

    response.push({
      id: (sample && sample.id) || null,
      value: (sample && Math.floor(sample.value * 100) / 100) || null,
      date,
    });
  }

  return response;
};
