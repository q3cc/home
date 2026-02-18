<template>
  <div class="setting">
    <el-collapse class="collapse" v-model="activeName" accordion>
      <el-collapse-item title="个性壁纸" name="1">
        <div class="bg-set">
          <span class="bg-lock-tip">当前仅保留随机内置壁纸，已禁止切换。可在背景页点击“保存当前壁纸”。</span>
        </div>
      </el-collapse-item>
      <el-collapse-item title="主题设置" name="2">
        <div class="item">
          <span class="text">主题模式</span><br><br>
          <el-radio-group v-model="theme" size="small" text-color="#FFFFFF">
            <el-radio value="system" border>跟随系统</el-radio>
            <el-radio value="time" border>跟随时间</el-radio>
            <el-radio value="bg" border>跟随背景</el-radio>
            <el-radio value="light" border>浅色模式</el-radio>
            <el-radio value="dark" border>深色模式</el-radio>
          </el-radio-group>
        </div>
      </el-collapse-item>
      <el-collapse-item title="个性化调整" name="3">
        <div class="item">
          <span class="text">建站日期显示</span>
          <el-switch v-model="siteStartShow" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div class="item">
          <span class="text">音乐点击是否打开面板</span>
          <el-switch v-model="musicClick" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div class="item">
          <span class="text">显示季节特效</span>
          <el-switch v-model="seasonalEffects" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div class="item">
          <span class="text">底栏背景模糊</span>
          <el-switch v-model="footerBlur" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div class="item">
          <span class="text">显示底栏音乐进度条</span>
          <el-switch v-model="footerProgressBar" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="播放器配置" name="4">
        <div class="item">
          <span class="text">自动播放</span>
          <el-switch v-model="playerAutoplay" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div class="item">
          <span class="text">随机播放</span>
          <el-switch v-model="playerOrder" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall"
            active-value="random" inactive-value="list" />
        </div>
        <div class="item">
          <span class="text">循环模式</span>
          <el-radio-group v-model="playerLoop" size="small" text-color="#FFFFFF">
            <el-radio value="all" border>列表</el-radio>
            <el-radio value="one" border>单曲</el-radio>
            <el-radio value="none" border>不循环</el-radio>
          </el-radio-group>
        </div>
      </el-collapse-item>
      <el-collapse-item title="歌词设置" name="5">
        <div class="item">
          <span class="text">显示底栏歌词</span>
          <el-switch v-model="playerLrcShow" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div v-if="playerLrcShow" class="item">
          <span class="text" white-space="pre">允许调用 AMLL TTML Database 加载网易云没有的歌词<br>&nbsp;&nbsp;&nbsp;（在 Github
            不稳定的网络中可能导致歌词载入速度变慢）</span>
          <el-switch v-model="playerDWRCATDB" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div v-if="playerLrcShow && playerDWRCATDB" class="item">
          <span class="text" white-space="pre">调用 AMLL TTML Database 时使用镜像加速</span>
          <el-switch v-model="playerDWRCATDBF" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div v-if="playerLrcShow" class="item">
          <span class="text">逐字歌词解析总开关</span>
          <el-switch v-model="playerDWRCShow" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div v-if="playerLrcShow && playerDWRCShow" class="item">
          <span class="text">逐字效果增强开关</span>
          <el-switch v-model="playerDWRCShowPro" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="语音设置" name="6">
        <div class="item">
          <span class="text">网页语音交互总开关</span>
          <el-switch v-model="webSpeech" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
        <div v-if="webSpeech" class="item">
          <span class="text">播报歌名</span>
          <el-switch v-model="playerSpeechName" inline-prompt :active-icon="CheckSmall" :inactive-icon="CloseSmall" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="其他设置" name="7">
        <div class="text">暂时没有其它啦qwq</div>
      </el-collapse-item>
      <el-collapse-item v-if="setV" title="开发设置" name="8">
        <DevSet />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { CheckSmall, CloseSmall } from "@icon-park/vue-next";
import DevSet from "@/components/DevSet.vue";
import { mainStore } from "@/store";
import { storeToRefs } from "pinia";

const store = mainStore();
const {
  siteStartShow,
  musicClick,
  playerLrcShow,
  footerBlur,
  playerAutoplay,
  playerOrder,
  playerLoop,
  webSpeech,
  playerSpeechName,
  playerDWRCShow,
  playerDWRCShowPro,
  playerDWRCATDB,
  playerDWRCATDBF,
  footerProgressBar,
  seasonalEffects,
  setV,
  theme,
} = storeToRefs(store);

// 默认选中项
const activeName = ref("0");
</script>

<style lang="scss" scoped>
.setting {
  .text {
    color: var(--text-color);
  }

  .collapse {
    border-radius: 8px;
    --el-collapse-content-bg-color: var(--set-coll-background-ck-color);
    border-color: transparent;
    overflow: hidden;

    :deep(.el-collapse-item__header) {
      background-color: var(--set-coll-background-color);
      color: var(--text-color);
      font-size: 15px;
      padding-left: 18px;
      border-color: transparent;
    }

    :deep(.el-collapse-item__wrap) {
      border-color: transparent;

      .el-collapse-item__content {
        padding: 20px;

        .bg-set {
          display: flex;
          align-items: center;

          .bg-lock-tip {
            color: var(--text-color);
            font-size: 14px;
            line-height: 1.6;
          }
        }

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          font-size: 14px;

          .el-switch__core {
            border-color: transparent;
            background-color: var(--set-radio-bg-ck-color);
          }

          .el-radio-group {
            .el-radio {
              margin: 2px 10px 2px 0;
              border-radius: 5px;

              &:last-child {
                margin-right: 0;
              }
            }
          }
        }

        .el-radio-group {
          justify-content: space-between;

          .el-radio {
            margin: 10px 16px;
            background: var(--set-radio-bg-color);
            border: 2px solid transparent;
            border-radius: 8px;

            .el-radio__label {
              color: var(--text-color);
            }

            .el-radio__inner {
              background: var(--set-radio-bg-color) !important;
              border: 2px solid var(--set-radio-border-color) !important;
            }

            &.is-checked {
              background: var(--set-radio-bg-color) !important;
              border: 2px solid var(--set-radio-border-color) !important;
            }

            .is-checked {
              .el-radio__inner {
                background-color: var(--set-radio-bg-ck-color) !important;
                border-color: var(--set-radio-border-ck-color) !important;
              }

              &+.el-radio__label {
                color: var(--text-color) !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
