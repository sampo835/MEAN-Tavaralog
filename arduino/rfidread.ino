#include <Wire.h>
#include <Adafruit_PN532.h>

#define SDA 10
#define SCL 11

Adafruit_PN532 nfc(SDA, SCL);

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    delay(10);
  }

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("Didn't find PN53x board");
    while (1);
  }
  
  nfc.SAMConfig();
}

void loop() {
  uint8_t success;
  uint8_t uid[7] = {0};  // Array to store UID
  uint8_t uidLength;

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    for (uint8_t i = 0; i < uidLength; i++) {
      Serial.print("0x");
      Serial.print(uid[i], HEX);
    }
    Serial.println();
    
    delay(1500);  // 3-second delay after successful UID read
  }
  else {
    delay(1000);  // 1-second delay if no UID is read
  }
}
