// import axios from "axios";
import fetchJsonp from "fetch-jsonp";
import { gwg } from "@/utils/authServer";

const REQUEST_TIMEOUT = 8000;
const JSONP_TIMEOUT = 8000;

const fetchWithTimeout = async (
  url: string,
  init: RequestInit = {},
  timeout = REQUEST_TIMEOUT,
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchJson = async <T = any>(
  url: string,
  init: RequestInit = {},
  timeout = REQUEST_TIMEOUT,
): Promise<T> => {
  const response = await fetchWithTimeout(url, init, timeout);
  if (!response.ok) {
    throw new Error(`请求失败: ${response.status}`);
  }
  return (await response.json()) as T;
};

/**
 * JSONP 请求模块
 */
// JSONP 请求函数，并返回 JSON 【关于为什么要有这个呢...请腾讯自觉扫一下（x）】
const loadJSONP = (
  url: string,
  callbackName: string,
  timeout = JSONP_TIMEOUT,
) => {
  return new Promise((resolve, reject) => {
    // 创建 script 标签
    const script = document.createElement('script');
    script.async = true;
    let settled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete (window as any)[callbackName];
    };
    // 定义 JSONP 回调函数
    (window as any)[callbackName] = (data: any) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(data); // 解析 JSON 数据
    };
    script.src = url;
    script.onerror = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('JSONP 请求失败'));
    };
    timeoutId = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("JSONP 请求超时"));
    }, timeout);
    document.body.appendChild(script);
  });
};

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id, serverse, idse) => {
  const ensureArray = (data: any) => (Array.isArray(data) ? data : []);
  const normalizeSong = (item: any, overrideUrl?: string) => ({
    name: item.name || item.title,
    artist: item.artist || item.author,
    album: item.album || import.meta.env.VITE_SITE_NAME,
    url: overrideUrl ?? item.url,
    cover: item.cover || item.pic,
    lrc: item.lrc,
  });
  const safeFetchJson = async (url: string, label: string) => {
    try {
      const data = await fetchJson(url);
      return ensureArray(data);
    } catch (e) {
      console.error(`${label} 请求失败:`, e);
      return [];
    }
  };
  let dataf: any[] = [];
  if (serverse != null && idse != null) {
    const [data1, data2] = await Promise.all([
      safeFetchJson(
        `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
        "音乐源 1",
      ),
      safeFetchJson(
        `${import.meta.env.VITE_SONG_API}?server=${serverse}&type=${type}&id=${idse}`,
        "音乐源 2",
      ),
    ]);
    dataf = [...data2, ...data1];
  } else {
    const data = await safeFetchJson(
      `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
      "音乐源 1",
    );
    dataf = [...data];
  };
  const data = ensureArray(dataf);
  if (data.length > 0 && data[0]?.url?.startsWith("@")) {
    const [, , , url] = data[0].url.split("@").slice(1);
    if (!url) return data.map((v) => normalizeSong(v));
    let jsonpData: any = null;
    try {
      jsonpData = await fetchJsonp(url).then((res) => res.json());
    } catch (error) {
      console.error("QQ 音乐 JSONP 请求失败:", error);
      return data.map((v) => normalizeSong(v));
    }
    const sipList = jsonpData.req_0?.data?.sip || [];
    const domain = (sipList.find((i: string) => !i.startsWith("http://ws")) || sipList[0] || "").replace("http://", "https://");
    return data.map((v, i) => normalizeSong(v, domain + (jsonpData.req_0?.data?.midurlinfo[i]?.purl || "")));
  } else {
    return data.map((v) => normalizeSong(v));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  return await fetchJson("https://v1.hitokoto.cn");
};

/**
 * 天气
 */
// 获取腾讯地理位置信息（JSONP 方式）
export const getTXAdcode = async (key) => {
  const callback = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const url = `https://apis.map.qq.com/ws/location/v1/ip?key=${key}&output=jsonp&callback=${callback}`;
  return await loadJSONP(url, callback);
};

// 获取腾讯地理天气信息（JSONP 方式）
export const getTXWeather = async (key, adcode) => {
  const callback = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const url = `https://apis.map.qq.com/ws/weather/v1/?key=${key}&adcode=${adcode}&type=now&output=jsonp&callback=${callback}`;
  return await loadJSONP(url, callback);
};

// 获取腾讯地理位置信息（鉴权模式 JSONP 方式）
export const getTXAdcodeS = async (key, skey) => {
  const callback = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const url = `https://apis.map.qq.com/ws/location/v1/ip?key=${key}&output=jsonp&callback=${callback}`;
  const urls = await gwg(url, skey);
  return await loadJSONP(urls, callback);
};

// 获取腾讯地理天气信息（鉴权模式 JSONP 方式）
export const getTXWeatherS = async (key, adcode, skey) => {
  const callback = `jsonpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const url = `https://apis.map.qq.com/ws/weather/v1/?key=${key}&adcode=${adcode}&type=now&output=jsonp&callback=${callback}`;
  const urls = await gwg(url, skey);
  return await loadJSONP(urls, callback);
};


// 获取高德地理位置信息
export const getGDAdcode = async (key) => {
  return await fetchJson(`https://restapi.amap.com/v3/ip?key=${key}`);
};

// 获取高德地理位置信息（带IP）
export const getGDAdcodeI = async (ipv4, key) => {
  return await fetchJson(`https://restapi.amap.com/v3/ip?ip=${ipv4}&key=${key}`);
};

// 获取高德地理天气信息
export const getGDWeather = async (key, city) => {
  return await fetchJson(`https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`);
};

// 补充的获取 IPV4 地址的 API
export const getIPV4Addr = async () => {
  return await fetchJson(`https://v4.yinghualuo.cn/bejson?format=json`);
};

// 补充的获取 IPV6 地址的 API
export const getIPV6Addr = async () => {
  return await fetchJson(`https://v6.yinghualuo.cn/bejson?format=json`);
};

// 免 KEY 区域
// 强烈建议自己注册腾讯或高德的 API
// 获取韩小韩天气 API
export const getHXHWeather = async () => {
  return await fetchJson("https://api.vvhan.com/api/weather");
};

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getOtherWeather = async () => {
  return await fetchJson("https://api.oioweb.cn/api/weather/GetWeather");
};

// ------
// 由于这些非公开接口没有 CORS 不允许跨域，必须使用中转。如果您希望使用这个接口，记得捐赠酪灰，帮助其承担服务器费用！
// 这些接口有着较为严格的速率限制，所以有时会出现不可用的问题。如果追求稳定性，请务必自行申请腾讯或高德的 KEY 使用他们的专业服务！

// 获取小米天气 API
export const getXMWeather = async (city) => {
  // const res = await fetch(`https://weatherapi.market.xiaomi.com/wtr-v3/weather/all?latitude=0&longitude=0&isLocated=true&locationKey=weathercn%3A${city}&days=2&appKey=weather20151024&sign=zUFJoAR2ZVrDy1vF3D07&locale=zh_cn&alpha=false&isGlobal=false`);
  return await fetchJson(`https://api.nanorocky.top/xmw/?city=weathercn%3A${city}`);
};

// 获取 IPV4 地址的地理位置信息 API
export const getIPV4AddrLocation = async (ipv4) => {
  // const res = await fetch(`https://ip.taobao.com/outGetIpInfo?ip=${ipv4}&accessKey=alibaba-inc`);
  return await fetchJson(`https://api.nanorocky.top/tbipinfo/?ip=${ipv4}`);
};

// ------

/**
 * Github 测试
 */
export const testGitHubConnectivity = async (): Promise<number> => {
  const testUrl = 'https://raw.githubusercontent.com/NanoRocky/home/blob/EFU/public/images/icon/github.png';
  try {
    const response = await fetchWithTimeout(testUrl, {
      method: 'HEAD',
    }, 3000);
    if (response.ok) {
      return 1;
    } else {
      return 0;
    }
  } catch {
    return 0;
  }
};
