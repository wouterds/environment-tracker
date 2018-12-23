import { differenceInMinutes, startOfMinute, subMinutes } from 'date-fns';
import { head, last } from 'lodash';
import { Definition } from '../../../models/sample';

interface ResponseObject {
  id: string | null;
  value: number | null;
  date: Date;
}

export const transform = (
  samples: Definition[],
  groupingIntervalSeconds: number,
): ResponseObject[] => {
  const groupingIntervalInMinutes = Math.ceil(groupingIntervalSeconds / 60);

  const lastItem = head(samples); // dangerous: assuming first item is last in time
  const firstItem = last(samples); // dangerous: assuming last item is firt in time

  if (!firstItem || !lastItem) {
    return [];
  }

  // Map samples to minutes
  const minutes = differenceInMinutes(lastItem.createdAt, firstItem.createdAt);
  const samplesMinuteMap: { [index: number]: Definition } = {};
  samples.forEach((sample: Definition) => {
    samplesMinuteMap[startOfMinute(sample.createdAt).getTime()] = sample;
  });

  // Loop through every interval of minutes between our 2 points and fill in gaps
  const response: ResponseObject[] = [];
  const endDate = startOfMinute(lastItem.createdAt);
  for (let i = 0; i < minutes; i += groupingIntervalInMinutes) {
    const date = subMinutes(endDate, i);
    const sample = samplesMinuteMap[date.getTime()];

    response.push({
      id: (sample && sample.id) || null,
      value: (sample && sample.value) || null,
      date,
    });
  }

  return response;
};
