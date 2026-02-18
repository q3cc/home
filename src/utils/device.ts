export type DeviceType = "mobile" | "tablet" | "pc";

export function detectDeviceType(): DeviceType {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod|windows phone/.test(userAgent)) {
    if (/ipad|tablet|playbook|silk|kindle/.test(userAgent)) {
      return "tablet";
    }
    return "mobile";
  }
  return "pc";
}
