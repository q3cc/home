import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

const projectGlobals = {
  defineProps: "readonly",
  defineEmits: "readonly",
  withDefaults: "readonly",
  h: "readonly",
  vue: "readonly",
  ref: "readonly",
  reactive: "readonly",
  computed: "readonly",
  watch: "readonly",
  provide: "readonly",
  inject: "readonly",
  defineComponent: "readonly",
  onBeforeMount: "readonly",
  onMounted: "readonly",
  onBeforeUnmount: "readonly",
  nextTick: "readonly",
  ElMessage: "readonly",
  $openList: "readonly",
};

export default [
  {
    ignores: ["node_modules/**", "dist/**", ".gitignore"],
  },
  {
    files: ["**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...projectGlobals,
      },
    },
  },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-async-promise-executor": "off",
      "vue/no-unused-vars": "off",
    },
  },
  {
    files: ["src/api/**/*.ts"],
    rules: {
      "no-unused-vars": "error",
    },
  },
  {
    files: ["src/utils/**/*.ts"],
    rules: {
      "no-unused-vars": "error",
    },
  },
];
