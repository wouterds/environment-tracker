#include <Wire.h>
#include <ESP8266WiFi.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <Adafruit_SGP30.h>
#include <BH1750.h>

const char *ssid = "Wouter's Place";
const char *password = "";

Adafruit_BME280 bme280;
Adafruit_SGP30 sgp30;
BH1750 bh1750;

WiFiServer server(80);

void setupSerial(void)
{
  Serial.begin(115200);
  Serial.println();
}

void setupI2C(void)
{
  Wire.begin(D2, D1);
  Wire.setClock(100000);
}

void setupWifi(void)
{
  Serial.print("Connecting to: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.print("Connected to wifi, ip: ");
  Serial.println(WiFi.localIP());
}

void setupWebServer(void)
{
  server.begin();
  Serial.println("Web server running!");
}

void setupSensors(void)
{
  if (!bme280.begin())
  {
    Serial.println("Could not find BME280 sensor, check wiring!");
    while (1);
  }

  if (!sgp30.begin())
  {
    Serial.println("Could not find SGP30 sensor, check wiring!");
    while (1);
  }

  if (!bh1750.begin())
  {
    Serial.println("Could not find BH1750 sensor, check wiring!");
    while (1);
  }
}

/* return absolute humidity [mg/m^3] with approximation formula
* @param temperature [°C]
* @param humidity [%RH]
*/
uint32_t getAbsoluteHumidity(float temperature, float humidity) {
  // approximation formula from Sensirion SGP30 Driver Integration chapter 3.15
  const float absoluteHumidity = 216.7f * ((humidity / 100.0f) * 6.112f * exp((17.62f * temperature) / (243.12f + temperature)) / (273.15f + temperature)); // [g/m^3]
  const uint32_t absoluteHumidityScaled = static_cast<uint32_t>(1000.0f * absoluteHumidity); // [mg/m^3]
  return absoluteHumidityScaled;
}

void setup(void)
{
  setupSerial();
  setupI2C();
  setupWifi();
  setupWebServer();
  setupSensors();
}

void loop()
{
  WiFiClient client = server.available();
  if (client)
  {
    Serial.println("Request opened!");

    boolean blank_line = true;
    while (client.connected())
    {
      if (client.available())
      {
        char c = client.read();

        if (c == '\n' && blank_line)
        {
          // Read illuminance
          float illuminance = bh1750.readLightLevel();

          // Read relative humidity
          float humidity = bme280.readHumidity();

          // Read temperature
          float temperature = bme280.readTemperature();

          // Read pressure
          float pressure = bme280.readPressure() / 100.0F;

          // Enable humidity compensation for more accurate results
          sgp30.setHumidity(getAbsoluteHumidity(temperature, humidity));

          // eCO2 placeholder
          float eco2;

          // Mesure air quality
          if (sgp30.IAQmeasure())
          {
            eco2 = sgp30.eCO2;
          }

          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: application/json");
          client.println("Connection: close");
          client.println();
          client.print("{\"temperature\":");
          client.print(temperature);
          client.print(",\"humidity\":");
          client.print(humidity);
          client.print(",\"pressure\":");
          client.print(pressure);
          client.print(",\"eco2\":");
          client.print(eco2);
          client.print(",\"illuminance\":");
          client.print(illuminance);
          client.println("}");
          break;
        }

        if (c == '\n')
        {
          blank_line = true;
        }
        else if (c != '\r')
        {
          blank_line = false;
        }
      }
    }

    delay(1);
    client.stop();
    Serial.println("Request closed!");
  }
}
