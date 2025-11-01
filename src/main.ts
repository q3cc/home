import { createApp } from "vue";
import "@/style/style.scss";
import App from "@/App.vue";
import { mainStore } from "@/store";
import { Speech, stopSpeech, SpeechLocal } from "@/utils/speech";
import { validationPlugin } from "@/store/plugins/validation";
// 引入 pinia
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// swiper
import "swiper/css";
import "uno.css";

const app = createApp(App);
const pinia = createPinia();

export default pinia;
pinia.use(piniaPluginPersistedstate);
pinia.use(validationPlugin);

app.use(pinia);
app.mount("#app");
const store = mainStore();

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("set") === "reset") {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: `正在恢复默认配置，请稍后...`,
  });
  if (store.webSpeech) {
    stopSpeech();
    const voice = import.meta.env.VITE_TTS_Voice;
    const vstyle = import.meta.env.VITE_TTS_Style;
    SpeechLocal("重置2.mp3");
  };
  store.resetStore();
};

// PWA
navigator.serviceWorker.addEventListener("controllerchange", async () => {
  // 弹出更新提醒
  console.log("站点已更新，刷新后生效");
  ElMessage("站点已更新，刷新后生效");
  if (store.webSpeech) {
    stopSpeech();
    const voice = import.meta.env.VITE_TTS_Voice;
    const vstyle = import.meta.env.VITE_TTS_Style;
    SpeechLocal("网站更新.mp3");
  };
});

const setupset = () => setTimeout(() => {
  if (urlParams.get("set") != "reset" && store.imgLoadStatus === true) {
    if (urlParams.get("bg")) {
      store.coverType = Number(urlParams.get("bg"));
    };
    if (urlParams.get("bgc") && (store.coverType == 0 || urlParams.get("bg") == "0")) {
      store.sBGCount = String(urlParams.get("bgc"));
    };
    if (urlParams.get("devs")) {
      store.setV = Boolean(urlParams.get("devs"));
    };
    if (urlParams.get("pap")) {
      store.playerAutoplay = Boolean(urlParams.get("pap"));
    };
  } else {
    setupset();
  };
}, 300);

setupset();

// 添加控制台清理命令
window.clearStorage = function() {
  console.log('正在清理用户设置的持久化存储和缓存...');

  // 清理 localStorage
  const localStorageKeys = Object.keys(localStorage);
  localStorageKeys.forEach(key => {
    if (key.startsWith('main-')) {
      localStorage.removeItem(key);
      console.log(`已清理 localStorage: ${key}`);
    }
  });

  // 清理 sessionStorage
  const sessionStorageKeys = Object.keys(sessionStorage);
  sessionStorageKeys.forEach(key => {
    if (key.startsWith('main-')) {
      sessionStorage.removeItem(key);
      console.log(`已清理 sessionStorage: ${key}`);
    }
  });

  // 清理其他可能的缓存
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log(`已清理缓存: ${cacheName}`);
      });
    });
  }

  console.log('存储清理完成！页面将在 2 秒后刷新以应用更改...');

  // 刷新页面以重置状态
  setTimeout(() => {
    window.location.href = window.location.pathname;
  }, 2000);
};

// 添加简短别名
window.clear = window.clearStorage;

console.log('控制台命令已添加：使用 clear() 或 clearStorage() 清理用户设置的持久化存储和缓存');