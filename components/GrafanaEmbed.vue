<template>
  <div class="grafana-embed-container">
    <iframe
      :src="embedUrl"
      :width="width"
      :height="height"
      frameborder="0"
      allowfullscreen
      @load="onIframeLoad"
    ></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  panelId: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: "100%",
  },
  height: {
    type: [String, Number],
    default: "200",
  },
});

const baseUrl = "http://158.247.200.126:3000";
const dashboardId = "cdx1zqzt0p69sd";
const orgId = "1";

const embedUrl = `${baseUrl}/d-solo/${dashboardId}/new-dashboard?orgId=${orgId}&panelId=${props.panelId}`;

const onIframeLoad = () => {
  console.log("Grafana iframe loaded successfully");
};

// 반응형 조정을 위한 리사이징 로직
const resizeObserver = ref(null);

onMounted(() => {
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        // 여기에서 필요한 경우 iframe 크기를 조정할 수 있습니다.
        console.log("Container width changed:", width);
      }
    });

    const container = document.querySelector(".grafana-embed-container");
    if (container) {
      resizeObserver.value.observe(container);
    }
  }
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});
</script>

<style scoped>
.grafana-embed-container {
  position: relative;
  overflow: hidden;
  width: v-bind("width");
  height: v-bind("height");
}

.grafana-embed-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
