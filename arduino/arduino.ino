#include <SPI.h>
#include <string.h>
#include <WiFi101.h>
#include <MQTTClient.h>
#include <dht.h>
dht DHT;
#define DHT11_PIN 6

byte mac_addr[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

static unsigned long lastTimeItHappened = 0;
int pumpRelay = 4;
int lightRelay = 5;

int temp = 0;
int hum = 0;
char message[30];

// Wifi info
char ssid[] = "nick";
char pass[] = "alexnick";

WiFiClient net;
MQTTClient client;

void setup()
{
  Serial.begin(9600);
   while (!Serial) {
    ; // wait for serial port to connect.
  }

  WiFi.begin(ssid, pass);
  client.begin("real-time-solutions.com", net);
  connect();
  pinMode(pumpRelay, OUTPUT);
  pinMode(lightRelay, OUTPUT);
}

void connect() {
  Serial.println("checking wifi...");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println("connecting to wifi.");
    delay(1000);
  }
  Serial.println("connected to wifi.");

  while (!client.connect("Arduino")) {
    Serial.println("connecting to mqtt.");
    delay(1000);
  }

  Serial.println("connected! (returning to main loop)\n");

  client.subscribe("arduino/");
}

void loop()
{ 
  if(!client.connected())
  {
    connect();
  }

  if (millis() - lastTimeItHappened >= 10000) {
    lastTimeItHappened = millis();

    int chk = DHT.read11(DHT11_PIN);
    Serial.print("Temperature:");
    Serial.println(DHT.temperature);
    Serial.print("Humidity: ");
    Serial.println(DHT.humidity);

    if(DHT.temperature != temp) {
      temp = DHT.temperature;
      sprintf(message, "{\"device\":\"temperature\", \"value\":%d}", temp);
      client.publish("server/", message);
    }
  
    if(DHT.humidity != hum) {
      hum = DHT.humidity;
      sprintf(message, "{\"device\":\"humidity\", \"value\":%d}", hum);
      client.publish("server/", message);
    }
  }
  
  client.loop();
}

void messageReceived(String topic, String payload, char * bytes, unsigned int length) {
  char str[80];
  String sensor;
  String value;
  Serial.println("Message Received");

  payload.toCharArray(str, 80);

  sensor = strtok(str, ":");
  value = strtok(NULL, ":");

  if(sensor == "pump") {
    if(value == "true") {
      digitalWrite(pumpRelay, LOW);
    } else if(value == "false") {
      digitalWrite(pumpRelay, HIGH);
    }
  } else if(sensor == "lights") {
    if(value == "true") {
      digitalWrite(lightRelay, LOW);
    } else if(value == "false") {
      digitalWrite(lightRelay, HIGH);
    }
  }
}
