#include <Wire.h>
#include <Adafruit_PN532.h>

#define SDA 10
#define SCL 11

Adafruit_PN532 nfc(SDA, SCL);

void setup(void) {
  Serial.begin(115200);
  while (!Serial) delay(10);

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1);
  }
  nfc.SAMConfig();
}

void loop(void) {
  uint8_t success;e
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;                        


  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    for (uint8_t i=0; i < uidLength; i++) {
      Serial.print("0x");Serial.print(uid[i], HEX);
    }
    Serial.println("");
  }
  delay(1000);
}
