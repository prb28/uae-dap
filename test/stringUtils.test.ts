import { StringUtils } from "../src/stringUtils";

describe("String Utils tests", function () {
  it("Should transform a hex string to an array", function () {
    const hexString = "0a0f";
    const buffer = StringUtils.hexToBytes(hexString);
    expect(buffer.length).toBe(2);
    expect(buffer[0]).toBe(10);
    expect(buffer[1]).toBe(15);
  });

  it("Should transform a hex string to a base64", function () {
    const hexString = "0a0f";
    const buffer = StringUtils.hexToBase64(hexString);
    expect(buffer).toBe("Cg8=");
  });

  it("Should transform an array to a hex string", function () {
    const buffer = [10, 15];
    const str = StringUtils.bytesToHex(buffer);
    expect(str).toBe("0a0f");
  });

  it("Should convert a ascii string to hex buffer", function () {
    const str = "abc";
    expect(StringUtils.convertStringToHex(str)).toBe("616263");
  });

  it("Should convert a number to ascii string", function () {
    expect(StringUtils.convertInt32ToASCII(0x0)).toBe("....");
    expect(StringUtils.convertInt32ToASCII(0x60006162)).toBe("`.ab");
    expect(StringUtils.convertInt32ToASCII(0x6385ff00)).toBe("c.ÿ.");
  });

  it("Should convert a hex string containing an utf8 string to utf8 string", function () {
    expect(StringUtils.convertHexUTF8StringToUTF8("C385E282AC")).toBe("Å€");
  });
});
