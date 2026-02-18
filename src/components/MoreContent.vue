<template>
  <div class="more-content">
    <span class="greeting">
      字体版权信息
    </span>
    <div class="font-info">
      <div class="font-item">
        <strong>寒蝉团圆体 Round</strong>
        <a href="https://github.com/Warren2060/ChillReunion" target="_blank">GitHub</a>
        <span>OFL-1.1</span>
      </div>
      <div class="font-item">
        <strong>得意黑 Smiley Sans</strong>
        <a href="https://atelier-anchor.com/typefaces/smiley-sans" target="_blank">官网</a>
        <span>OFL-1.1</span>
      </div>
      <div class="font-item">
        <strong>ZSFT-486 (Dancing Script)</strong>
        <a href="https://github.com/google/fonts/tree/main/ofl/dancingscript" target="_blank">GitHub</a>
        <a href="https://fonts.google.com/specimen/Dancing+Script" target="_blank">Google Fonts</a>
        <span>OFL-1.1</span>
      </div>
      <div class="font-item">
        <strong>MiSans</strong>
        <a href="https://hyperos.mi.com/font/zh/" target="_blank">官网</a>
        <a href="https://hyperos.mi.com/font-download/MiSans%E5%AD%97%E4%BD%93%E7%9F%A5%E8%AF%86%E4%BA%A7%E6%9D%83%E8%AE%B8%E5%8F%AF%E5%8D%8F%E8%AE%AE.pdf" target="_blank">许可协议</a>
        <span>© Xiaomi Inc.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { Error } from "@icon-park/vue-next";
import { mainStore } from "@/store";

const store = mainStore();
</script>

<style lang="scss" scoped>
.more-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
  max-height: 100%;
  flex: 1;

  .greeting {
    font-family: MiSans VF;
    font-weight: 520;
    font-size: 1.05rem;
    width: 100%;
    text-align: center;
    padding: 0 10px;
    color: var(--text-color);
    margin-bottom: 20px;
  }

  .font-info {
    width: 100%;
    max-width: 600px;
    padding: 0 20px;

    .font-item {
      margin-bottom: 15px;
      padding: 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);

      strong {
        display: block;
        margin-bottom: 8px;
        color: var(--text-color);
        font-size: 1rem;
      }

      a {
        display: inline-block;
        margin-right: 12px;
        margin-bottom: 4px;
        color: #4fc3f7;
        text-decoration: none;
        font-size: 0.9rem;

        &:hover {
          text-decoration: underline;
        }
      }

      span {
        display: block;
        margin-top: 6px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.85rem;
        line-height: 1.4;
      }
    }
  }

  @media (max-width: 560px) {
    .font-info {
      padding: 0 10px;

      .font-item {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }

      .font-item::-webkit-scrollbar {
        display: none;
      }

      .font-item strong,
      .font-item a,
      .font-item span {
        white-space: nowrap;
      }
    }
  }

}
</style>

