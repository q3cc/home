import { getIPV4Addr, getXMWeather, getIPV4AddrLocation } from "@/api";
import { stopSpeech, SpeechLocal } from "@/utils/speech";
import xmAdcodeData from '@/assets/data/xiaomi_weather_adcode.json';
import xmStatusData from '@/assets/data/xiaomi_weather_status.json';
import { mainStore } from "@/store";

import type {
    AdCode,
    WeatherInfo,
    XMAdcodeItem,
    XMWeatherStatusData,
    XMBeaufortLevel
} from "@/typings/weather";

const xmAdcodeDataTyped = xmAdcodeData as XMAdcodeItem[];
const xmStatusDataTyped = xmStatusData as XMWeatherStatusData;
const adcodeMap = new Map<string, string>(
    xmAdcodeDataTyped.map((item) => [item.name, item.city_num])
);
const weatherStatusMap = new Map<number, string>(
    xmStatusDataTyped.weatherinfo.map((item) => [item.code, item.wea])
);

const weatherData = reactive<{
    adCode: AdCode;
    weather: WeatherInfo;
}>({
    adCode: {
        city: null,
        adcode: null,
    },
    weather: {
        weather: null,
        temperature: null,
        winddirection: null,
        windpower: null,
    },
});

const speakIfEnabled = (enabled: boolean, fileName: string) => {
    if (!enabled) return;
    stopSpeech();
    SpeechLocal(fileName);
};

const failWeather = (enabled: boolean, fileName = "天气加载失败.mp3"): never => {
    speakIfEnabled(enabled, fileName);
    throw new Error("天气信息获取失败");
};

export async function getXMWT() {
    console.log("正在使用小米天气接口");
    const store = mainStore();
    // 获取 IP
    const ipv4addr = await getIPV4Addr();
    if (ipv4addr.ip == null || !ipv4addr) {
        failWeather(store.webSpeech, "位置信息获取失败.mp3");
    };
    // 获取位置信息
    const location = await getIPV4AddrLocation(ipv4addr.ip);
    if (String(location?.code) !== "0" || !location?.data.region || !location?.data.city) {
        failWeather(store.webSpeech, "位置信息获取失败.mp3");
    };
    // 加载 Adcode
    weatherData.adCode = {
        city: location.data.county || location.data.city || location.data.region || "未知地区",
        adcode: findCityAdcode(location.data.region, location.data.city, location.data.county),
    };
    if (weatherData.adCode.adcode == null) {
        failWeather(store.webSpeech);
    };
    // 获取天气信息
    const xmWeather = await getXMWeather(weatherData.adCode.adcode);
    try {
        const currentWeather = xmWeather.current;
        const weatherCode = parseInt(currentWeather.weather, 10);
        const temperature = currentWeather.temperature.value;
        const windDirection = windDegreeToDirection(parseFloat(currentWeather.wind.direction.value));
        const weatherDescription = getWeatherDescription(weatherCode);
        weatherData.weather = {
            weather: weatherDescription,
            temperature: temperature,
            winddirection: windDirection,
            windpower: convertWindSpeed(currentWeather.wind.speed.value, { returnRange: true, includeDescription: false }),
        };
        return weatherData;
    } catch {
        failWeather(store.webSpeech);
    };
};

const findCityAdcode = (region: string, city: string, county: string): string | null => {
    if (county) {
        const fullCountyName = `${city}.${county}`;
        const match = adcodeMap.get(fullCountyName);
        if (match) return match;
    };
    const cityMatch = adcodeMap.get(city);
    if (cityMatch) return cityMatch;
    const regionCityMatch = adcodeMap.get(`${region}.${city}`);
    if (regionCityMatch) return regionCityMatch;
    const regionMatch = adcodeMap.get(region);
    if (regionMatch) return regionMatch;
    return null;
};

const getWeatherDescription = (weatherCode: number): string => {
    return weatherStatusMap.get(weatherCode) || "未知天气";
};

const windDegreeToDirection = (degree: number): string => {
    const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
    const index = Math.round(degree / 45) % 8;
    return directions[index] + '风';
};

export const BEAUFORT_SCALE: XMBeaufortLevel[] = [
    { level: 0, minSpeed: 0, maxSpeed: 0.2, description: "无风" },
    { level: 1, minSpeed: 0.3, maxSpeed: 1.5, description: "软风" },
    { level: 2, minSpeed: 1.6, maxSpeed: 3.3, description: "轻风" },
    { level: 3, minSpeed: 3.4, maxSpeed: 5.4, description: "微风" },
    { level: 4, minSpeed: 5.5, maxSpeed: 7.9, description: "和风" },
    { level: 5, minSpeed: 8.0, maxSpeed: 10.7, description: "清风" },
    { level: 6, minSpeed: 10.8, maxSpeed: 13.8, description: "强风" },
    { level: 7, minSpeed: 13.9, maxSpeed: 17.1, description: "疾风" },
    { level: 8, minSpeed: 17.2, maxSpeed: 20.7, description: "大风" },
    { level: 9, minSpeed: 20.8, maxSpeed: 24.4, description: "烈风" },
    { level: 10, minSpeed: 24.5, maxSpeed: 28.4, description: "狂风" },
    { level: 11, minSpeed: 28.5, maxSpeed: 32.6, description: "暴风" },
    { level: 12, minSpeed: 32.7, maxSpeed: Infinity, description: "飓风" }
];

export interface WindConversionOptions {
    returnRange?: boolean;
    includeDescription?: boolean;
};

export function convertWindSpeed(
    speed: number,
    options: WindConversionOptions = {}
): string {
    const { returnRange = false, includeDescription = false } = options;
    const level = BEAUFORT_SCALE.find(
        l => speed >= l.minSpeed && speed <= l.maxSpeed
    );
    if (!level) {
        return "未知风级";
    };
    if (returnRange) {
        if (speed > level.minSpeed + (level.maxSpeed - level.minSpeed) * 0.7) {
            const nextLevel = BEAUFORT_SCALE.find(l => l.level === level.level + 1);
            if (nextLevel) {
                return includeDescription
                    ? `${level.level}-${nextLevel.level}级 (${level.description})`
                    : `${level.level}-${nextLevel.level}级`;
            };
        };
    };
    return includeDescription
        ? `${level.level}级 (${level.description})`
        : `${level.level}级`;
};
