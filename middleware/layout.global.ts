export default defineNuxtRouteMiddleware((to) => {
  if (to.path.includes("mail")) {
    to.meta.layout = "mail";
  } else {
    to.meta.layout = "default"; // mail이 아닌 경우 기본 레이아웃 사용
  }
});
