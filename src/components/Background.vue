<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img v-show="store.imgLoadStatus" :src="bgUrl" class="bg" alt="cover" @load="imgLoadComplete"
      @error.once="imgLoadError" @animationend="imgAnimationEnd" />
    <div :class="store.backgroundShow ? 'gray o-hidden' : 'gray'" />
    <Transition name="fade" mode="out-in">
      <a v-if="store.backgroundShow" class="down" :href="bgUrl" target="_blank" rel="noopener noreferrer">
        保存当前壁纸
      </a>
    </Transition>
  </div>
</template>

<script setup lang="js">
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";
import { Speech, stopSpeech, SpeechLocal } from "@/utils/speech";
import { initSnowfall, closeSnowfall } from "@/utils/season/snow";
import { initFirefly, closeFirefly } from "@/utils/season/firefly";
import { initLantern, closeLantern } from "@/utils/season/lantern";
import { ref, h } from 'vue';
import { gasC } from "@/utils/authServer";
import { detectDeviceType } from "@/utils/device";


const store = mainStore();
const bgUrl = ref(null);
const imgTimeout = ref(null);
const emit = defineEmits(["loadComplete"]);
const key = import.meta.env.VITE_SFILE_SKEY;
const isLoading = ref(false);
const LOCKED_COVER_TYPE = 0;

const lockWallpaperSettings = () => {
  if (store.coverType !== LOCKED_COVER_TYPE) {
    store.coverType = LOCKED_COVER_TYPE;
  };
  if (store.sBGCount != null) {
    store.setSBGCount(null);
  };
};

lockWallpaperSettings();

// 自定义壁纸
// 酪灰的小批注：这里增加了从配置文件读取壁纸数的功能，使得在增加壁纸时不需要重新编译项目，只需修改这个 json 文件内的值
// 设置一个默认值，防止在无法加载 JSON 文件时壁纸失效。应该尽量保证壁纸数始终不小于这个默认值
let bgImageCount = 10; // PC 版壁纸
let bgImageCountP = 2; // 移动版壁纸
let bgRandom = 0;
let bgRandomp = 0;
let sest = 0;
let sBGCountN = null;
let configCache = null;
let configPromise = null;

// 加载 config.json
async function loadConfig() {
  if (configCache) {
    bgImageCount = configCache.bgImageCount;
    bgImageCountP = configCache.bgImageCountP;
    return true;
  }
  if (!configPromise) {
    configPromise = (async () => {
      const confUrl = "/images/config.json";
      const configUrl = key ? await gasC(confUrl, key) : confUrl;
      const response = await fetch(configUrl);
      const data = await response.json();
      return {
        bgImageCount: Math.max(data.bgImageCount, 1),
        bgImageCountP: Math.max(data.bgImageCountP, 1),
      };
    })();
  }
  try {
    const data = await configPromise;
    configCache = data;
    bgImageCount = data.bgImageCount;
    bgImageCountP = data.bgImageCountP;
    if (sBGCountN != null && sBGCountN <= bgImageCount && sBGCountN > 0) {
      bgRandom = sBGCountN;
      bgRandomp = sBGCountN;
      sBGCountN = null;
      return true;
    } else {
      bgRandom = Math.floor(Math.random() * bgImageCount + 1);
      bgRandomp = Math.floor(Math.random() * bgImageCountP + 1);
      sBGCountN = null;
      return true;
    };
  } catch (error) {
    console.error('无法加载壁纸配置文件:', error);
    bgRandom = Math.floor(Math.random() * bgImageCount + 1);
    bgRandomp = Math.floor(Math.random() * bgImageCountP + 1);
    sBGCountN = null;
    return true;
  } finally {
    configPromise = null;
  };
};

// 更换壁纸链接
const changeBg = async (type) => {
  if (isLoading.value) return;
  isLoading.value = true;
  (async () => {
    try {
      const configLoaded = await loadConfig();
      const deviceType = detectDeviceType();
      if (!configLoaded) return;
      if (type !== LOCKED_COVER_TYPE) {
        lockWallpaperSettings();
        type = LOCKED_COVER_TYPE;
      };
      if (type == 0) {
        // 这里指定了所有自定义背景的文件格式，必须统一。可以自定义修改，比如 webp 或 png
        // 酪灰的小批注：这里添加了设备类型识别以加载不同分辨率的壁纸
        // 如果不需要区分设备类型，则只需要保留这一行 bgUrl.value = `/images/background${bgRandom}.jpg`;
        if (deviceType === 'mobile') {
          if (key) {
            const bgUrlS = `/images/phone/backgroundphone${bgRandomp}.jpg`;
            bgUrl.value = await gasC(bgUrlS, key);
          } else {
            bgUrl.value = `/images/phone/backgroundphone${bgRandomp}.jpg`;
          };
        } else if (deviceType === 'tablet' || deviceType === 'pc') {
          if (key) {
            const bgUrlS = `/images/background${bgRandom}.jpg`;
            bgUrl.value = await gasC(bgUrlS, key);
          } else {
            bgUrl.value = `/images/background${bgRandom}.jpg`;
          };
        } else {
          if (key) {
            const bgUrlS = `/images/background${bgRandom}.jpg`;
            bgUrl.value = await gasC(bgUrlS, key);
          } else {
            bgUrl.value = `/images/background${bgRandom}.jpg`;
          };
        };
      };
    } finally {
      isLoading.value = false;
    };
  })();
};

// 图片加载完成
const imgLoadComplete = () => {
  imgTimeout.value = setTimeout(
    () => {
      store.setImgLoadStatus(true);
    },
    Math.floor(Math.random() * (600 - 300 + 1)) + 300,
  );
};

// 图片动画完成
const imgAnimationEnd = () => {
  console.log("壁纸加载且动画完成");
  // 加载完成事件
  emit("loadComplete");
};

// 图片显示失败
const imgLoadError = async () => {
  console.error("壁纸加载失败：", bgUrl.value);
  ElMessage({
    message: "壁纸加载失败，已临时切换回默认",
    icon: h(Error, {
      theme: "filled",
      fill: "var(--el-message-icon-color)",
    }),
  });
  if (key) {
    const bgUrlS = `/images/background${bgRandom}.webp`;
    bgUrl.value = await gasC(bgUrlS, key);
  } else {
    bgUrl.value = `/images/background${bgRandom}.webp`;
  };
  if (store.webSpeech) {
    stopSpeech();
    const voice = import.meta.env.VITE_TTS_Voice;
    const vstyle = import.meta.env.VITE_TTS_Style;
    SpeechLocal("壁纸加载失败.mp3");
  };
};

// 监听壁纸切换
watch(
  () => store.coverType,
  async (value) => {
    if (Number(value) !== LOCKED_COVER_TYPE) {
      lockWallpaperSettings();
      return;
    };
    await changeBg(LOCKED_COVER_TYPE);
  },
  { immediate: true }
);

const SeasonStyle = async (type, state, where) => {
  const month = new Date().getMonth() + 1; // 当前月份，1-12
  if (type == 0) {
    if (sest == 1 && state == true && where == 'normal') return;
    if ([12, 1, 2].includes(month)) {
      if (state == true) {
        initSnowfall();
      } else if (state == false) {
        closeSnowfall();
      } else {
        return;
      };
    } else if ([1, 2].includes(month)) {
      if (state == true) {
        initLantern();
      } else if (state == false) {
        closeLantern();
      } else {
        return;
      };
    } else if ([7, 8, 9].includes(month)) {
      if (state == true) {
        initFirefly();
      } else if (state == false) {
        closeFirefly();
      } else {
        return;
      };
    } else {
      return;
    };
  } else if (type == 1) {
    if (state == true) {
      initSnowfall();
    } else if (state == false) {
      closeSnowfall();
    } else {
      return;
    };
  } else if (type == 2) {
    if (state == true) {
      initLantern();
    } else if (state == false) {
      closeLantern();
    } else {
      return;
    };
  } else if (type == 3) {
    if (state == true) {
      initFirefly();
    } else if (state == false) {
      closeFirefly();
    } else {
      return;
    };
  } else {
    return;
  };
  sest = 1;
};

onMounted(async () => {
  lockWallpaperSettings();
  // 加载壁纸
  await changeBg(LOCKED_COVER_TYPE);
  // 加载季节特效
  if (store.seasonalEffects) { await SeasonStyle(0, true, 'normal') } else { sest = 1 };
});

onBeforeUnmount(() => {
  if (imgTimeout.value) {
    clearTimeout(imgTimeout.value);
  };
});

watch(() => store.seasonalEffects, async (value) => {
  if (sest == 0) return;
  if (value) {
    await SeasonStyle(0, true, 'userChange');
  } else {
    await SeasonStyle(0, false, 'userChange');
    await SeasonStyle(1, false, 'userChange');
    await SeasonStyle(2, false, 'userChange');
    await SeasonStyle(3, false, 'userChange');
  };
});

watch(() => store.sBGCount, async (value) => {
  if (value == null || value == 0) return;
  sBGCountN = null;
  store.setSBGCount(null);
});
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;

  &.show {
    z-index: 1;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    backface-visibility: hidden;
    filter: blur(20px) brightness(0.3);
    transition:
      filter 0.3s,
      transform 0.3s;
    animation: fade-blur-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.45s;
  }

  .gray {
    opacity: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);

    transition: 1.5s;

    &.o-hidden {
      opacity: 0;
      transition: 1.5s;
    }
  }

  .down {
    font-size: 16px;
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: block;
    padding: 20px 26px;
    border-radius: 8px;
    background-color: #00000030;
    width: 120px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      transform: scale(1.05);
      background-color: #00000060;
    }

    &:active {
      transform: scale(1);
    }
  }
}
</style>
