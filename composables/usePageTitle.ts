import { ref, readonly } from "vue";

const pageTitle = ref("제목");

export function usePageTitle() {
  function setPageTitle(title: string) {
    pageTitle.value = title;
  }

  return {
    pageTitle: readonly(pageTitle),
    setPageTitle,
  };
}
