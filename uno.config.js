import { defineConfig } from "unocss";
import {
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
} from "unocss";
import { presetScrollbar } from "unocss-preset-scrollbar";
import { animatedUno } from "animated-unocss";

export default defineConfig({
  theme: {
    fontFamily: {
      sans: ["Pretendard", "sans-serif"],
    },
  },
  rules: [
    ["font-pretendard", { "font-family": "Pretendard, sans-serif" }],
    [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`],
    [/^wp-(\d+)$/, ([, d]) => ({ width: `${d}%` })],
    [/^hp-(\d+)$/, ([, d]) => ({ height: `${d}%` })],
    [/^wv-(\d+)$/, ([, d]) => ({ width: `${d}vw` })],
    [/^wpx-(\d+)$/, ([, d]) => ({ width: `${d}px` })],
    [/^hpx-(\d+)$/, ([, d]) => ({ height: `${d}px` })],
    [/^max-wp-(\d+)$/, ([, d]) => ({ "max-width": `${d}%` })],
    [/^min-wp-(\d+)$/, ([, d]) => ({ "min-width": `${d}%` })],
    [/^min-hp-(\d+)$/, ([, d]) => ({ "min-height": `${d}%` })],
    [/^min-wv-(\d+)$/, ([, d]) => ({ "min-width": `${d}vw` })],
    [/^tp-(\d+)$/, ([, d]) => ({ top: `${d}%` })],
    [/^rounded-(\d+)$/, ([, d]) => ({ "border-radius": `${d}%` })],
  ],
  shortcuts: [
    [
      "btn",
      "px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50",
    ],
    [
      "icon-btn",
      "inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600",
    ],
    ["app-item-center", "flex items-center justify-center"],
    ["app-text-center", "flex items-center"],
    ["reactive-card", "wp-100 hp-50 md:wp-50 md:hp-30 xl:wp-25 lg:hp-20"],
    [
      "custom-avatar",
      "app-item-center border border-rounded rounded-full w-9 h-9 z-4",
    ],
    ["custom-dialog", "overflow-y-hidden scrollbar"],
    [
      "custom-scrollbar",
      "overflow-y-scroll scrollbar scrollbar-rounded hp-70 dark:scrollbar-track-color-dark",
    ],
    ["custom-dialog-info-normal", "!wp-90 lg:!wp-80"],
    ["custom-dialog-info-compact", "!wp-90 lg:!wp-60"],
    ["custom-dialog-form-normal", "!wp-90 lg:!wp-30"],
    ["custom-dialog-form-compact", "!wp-90 lg:!wp-25"],
    ["custom-dialog-large-normal", "!wp-90 lg:!wp-95"],
    ["custom-dialog-large-compact", "!wp-90 lg:!wp-35"],
    ["custom-dialog-label-icon", "ml-1 inline-block h-4 w-4"],
    ["custom-image", "m-1 md:w-30 wp-100"],
    ["custom-xl-button", "m-1 ml-1 p-0 md:w-50 wp-100"],
    ["custom-lg-button", "m-1 ml-1 p-0 md:w-40 wp-100"],
    ["custom-md-button", "m-1 ml-1 p-0 md:w-30 wp-100"],
    ["custom-sm-button", "m-1 ml-1 p-0 md:w-20 wp-100"],
    ["theme-text-basic", "dark:text-gray text-dark"],
    ["theme-bg-basic", "dark:bg-deep-dark bg-sky-100"],
    [
      "custom-card-radio",
      "sm:h-70 sm:wp-25 wp-40 h-30 app-item-center flex flex-wrap border border-gray-100 rounded bg-gray-100 text-gray-600  cursor-pointer border-2",
    ],
    [
      "custom-card-radio-active",
      "border-blue-100 active:border-blue-100 text-blue",
    ],
    [
      "custom-card",
      "border hp-100 border-4 border-solid cursor-pointer !hover:border-gray-300 hover:font-bold !active:border-gray-400 transition",
    ],
    [
      "register-custom-card",
      "light:bg-blue-100 custom-card border-blue-200 dark:border-blue-400 wp-100",
    ],
    [
      "working-custom-card",
      "light:bg-green-100 custom-card border-green-200 dark:border-green-400 wp-100",
    ],
    ["outsourcing-custom-card", "light:bg-gray-100"],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetScrollbar({
      scrollbarWidth: "6px",
      scrollbarHeight: "6px",
      scrollbarThumbColor: "#60a5fa",
    }),
    presetTypography(),
    animatedUno(),
    presetWebFonts({
      fonts: {
        sans: "Pretendard",
        pretendard: [
          {
            name: "Pretendard",
            weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
            provider: "google",
          },
        ],
      },
    }),
  ],
});
