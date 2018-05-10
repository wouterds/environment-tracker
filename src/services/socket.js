import { store } from 'store';
import { setSensors } from 'store/actions/sensors';

/**
 * New message from socket
 *
 * @param {Object} rawData
 */
const newMessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    // Sensor data
    case 'sensor-data':
      store.dispatch(setSensors(data));
      break;
  }
}

/**
 * Connect to websocket
 */
const connect = () => {
  // Source
  const source = `${location.protocol === 'https:' ? 'wss' : 'ws'}:/${location.host}/api`;
  // const source = 'wss://tracker.wouterdeschuyter.be/api';

  // Open connection
  const websocket = new WebSocket(source);

  // Subscribe to new messages
  websocket.onmessage = newMessage;
};

export { connect };
