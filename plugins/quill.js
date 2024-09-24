export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    import("quill").then((Quill) => {
      import("quill-better-table").then((QuillBetterTable) => {
        Quill.default.register(
          "modules/better-table",
          QuillBetterTable.default
        );
        nuxtApp.provide("Quill", Quill.default);
      });
    });
  }
});
