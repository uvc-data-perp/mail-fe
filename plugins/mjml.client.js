// plugins/mjml.client.js
import mjml2html from "mjml-browser";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("mjml2html", mjml2html);
});
