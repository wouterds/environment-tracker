#include <Wire.h>
#include <ESP8266WiFi.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <Adafruit_SGP30.h>
#include <TSL2561.h>

const char *ssid = "Wouter's Place";
const char *password = "";

Adafruit_BME280 bme280;
Adafruit_SGP30 sgp30;
TSL2561 tsl2561(TSL2561_ADDR_FLOAT);
WiFiServer server(80);

void setupSerial(void)
{
  Serial.begin(9600);
  Serial.println();
}

void setupI2C(void)
{
  Wire.begin(D2, D1);
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

  if (!tsl2561.begin())
  {
    Serial.println("Could not find TSL2561 sensor, check wiring!");
    while (1);
  }
}

void setupLed()
{
  pinMode(LED_BUILTIN, OUTPUT);
}

/*
 * @param float temperature [°C]
 * @param float relativeHumidity [%RH]
 * @return int absoluteHumidityScaled [mg/m^3]
 */
int calculateAbsoluteHumidity(float temperature, float relativeHumidity) {
  const float absoluteHumidity = 216.7f * (
    (relativeHumidity / 100.0f) * 6.112f * exp(
      (17.62f * temperature) / (243.12f + temperature)
    ) / (273.15f + temperature)
  ); // [g/m^3]

  return static_cast<int>(1000.0f * absoluteHumidity); // [mg/m^3]
}

void setup(void)
{
  setupSerial();
  setupLed();
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
    // Led indicator
    digitalWrite(LED_BUILTIN, HIGH);

    boolean blankLine = true;

    while (client.connected())
    {
      if (client.available())
      {
        char c = client.read();

        if (c == '\n' && blankLine)
        {
          // Read illuminance
          float illuminanceVisibleLight = tsl2561.getLuminosity(TSL2561_VISIBLE);
          float illuminanceFullSpectrum = tsl2561.getLuminosity(TSL2561_FULLSPECTRUM);
          float illuminanceIRLight = tsl2561.getLuminosity(TSL2561_INFRARED);

          // Read relative humidity
          float relativeHumidity = bme280.readHumidity();

          // Read temperature
          float temperature = bme280.readTemperature();

          // Calculate absolute humidity
          int absoluteHumidity = calculateAbsoluteHumidity(temperature, relativeHumidity)

          // Read pressure
          float pressure = bme280.readPressure() / 100.0F;

          // Enable humidity compensation for more accurate results
          sgp30.setHumidity(absoluteHumidity);

          // eCO2 placeholder
          float eco2;

          // Mesure air quality
          if (sgp30.IAQmeasure())
          {
            eco2 = sgp30.eCO2;
          }

          // Print response
          client.println("HTTP/1.1 200 OK");
          client.println("Content-Type: application/json");
          client.println("Connection: close");
          client.println();

          client.print("{");
          client.print("\"temperature\":");
          client.print(temperature);
          client.print(",");

          client.print("\"humidity\":");
          client.print("{");
          client.print("\"relative\":");
          client.print(relativeHumidity);
          client.print(",");
          client.print("\"absolute\":");
          client.print(absoluteHumidity);
          client.print("}");
          client.print(",");

          client.print("\"pressure\":");
          client.print(pressure);
          client.print(",");

          client.print("\"eco2\":");
          client.print(eco2);
          client.print(",");

          client.print("\"illuminance\":");
          client.print("{");
          client.print("\"visible\":");
          client.print(illuminanceVisibleLight);
          client.print(",");
          client.print("\"full\":");
          client.print(illuminanceFullSpectrum);
          client.print(",");
          client.print("\"ir\":");
          client.print(illuminanceIRLight);
          client.print("}");
          client.print("}");

          client.println();
          break;
        }

        if (c == '\n')
        {
          blankLine = true;
        }
        else if (c != '\r')
        {
          blankLine = false;
        }
      }
    }

    delay(1);
    client.stop();

    // Led indicator
    digitalWrite(LED_BUILTIN, LOW);
  }
}
