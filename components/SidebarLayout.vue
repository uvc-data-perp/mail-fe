<!-- components/SidebarLayout.vue -->
<template>
  <el-scrollbar height="100%">
    <aside
      class="el-aside sidebar"
      :class="{ 'dark:bg-[#181818] light:bg-[#f4f5fa]': true }"
      m-0
      h-screen
      p-0
      hp-100
    >
      <div class="aside-header" relative flex items-center justify-center>
        <a href="/" class="mb-3 mt-2">
          <div
            flex
            cursor-pointer
            items-center
            justify-center
            text-2xl
            font-300
          >
            <div m-4 flex flex-col children:mx-auto>
              <div wp-100>
                <span mr-1 text-green-7>CPS</span>
                <span>PORTAL</span>
              </div>
            </div>
          </div>
        </a>
        <div
          right="-2"
          absolute
          top-5
          ml-auto
          h-5
          w-50
          flex
          items-center
          justify-center
          rounded-full
          text-sm
          md:hidden
        >
          <div i-mdi-close md:hidden></div>
        </div>
      </div>

      <el-menu :default-active="activeIndex">
        <template v-for="item in menuItems" :key="item.index">
          <el-menu-item
            v-if="!item.children"
            :index="item.index"
            class="hover: transition-colors duration-200 !hover:text-emerald-400"
            :class="{
              'bg-gradient-to-tr from-blue-700 to-green-500 ':
                activeIndex == item.path,
              'font-bold': activeIndex == item.path,
              '!text-white': activeIndex == item.path,
            }"
          >
            <div :class="item.icon" mr-3></div>
            <span>{{ item.title }}</span>
          </el-menu-item>
          <!-- 서브메뉴가 있는 경우 el-menu-item 상단에 el-sub-menu 래핑 -->
          <el-sub-menu
            v-else
            :index="item.index"
            class="hover: transition-colors duration-200"
          >
            <template #title>
              <div
                w-full
                flex
                items-center
                justify-start
                class="!hover:text-emerald-400"
              >
                <div :class="item.icon" mr-3 text-base></div>
                <span>{{ item.title }}</span>
              </div>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.index"
              :index="child.index"
              class="hover: transition-colors duration-200"
              :class="{
                'bg-gradient-to-tr from-blue-700 to-green-500 ':
                  activeIndex == child.path,
                'font-bold': activeIndex == child.path,
                '!text-white': activeIndex == child.path,
              }"
            >
              <NuxtLink
                :to="child.path"
                class="flex items-center w-full hover:text-emerald-400"
              >
                <div :class="child.icon" class="mr-3 text-2"></div>
                <span>{{ child.title }}</span>
              </NuxtLink>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </aside>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const activeIndex = computed(() => route.path);

interface MenuItem {
  title: string;
  icon: string;
  index: string;
  path: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "커스텀 대시보드",
    icon: "i-ic:outline-circle",
    index: "/dashboard",
    path: "/dummy",
  },
  {
    title: "설비 관리",
    icon: "i-ic:outline-circle",
    index: "/facility",
    path: "/dummy",
  },
  {
    title: "엣지 관리",
    icon: "i-ic:outline-circle",
    index: "/edge",
    path: "/dummy",
  },
  {
    title: "인증서 관리",
    icon: "i-ic:outline-circle",
    index: "/certification",
    path: "/dummy",
  },
  {
    title: "데이터 수집",
    icon: "i-ic:outline-circle",
    index: "data-collect",
    path: "/dummy",
    children: [
      {
        title: "모델러",
        icon: "i-ic:outline-circle",
        index: "/data-collect/opcua-modeler",
        path: "/dummy",
      },
      // 더 많은 서브 메뉴 아이템들...
    ],
  },
  {
    title: "데이터 조회",
    icon: "i-ic:outline-circle",
    index: "data-retrieve",
    path: "/dummy",
    children: [
      // 서브 메뉴 아이템들...
    ],
  },
  {
    title: "AI 데이터 분석",
    icon: "i-ic:outline-circle",
    index: "ai-data-analyze",
    path: "/dummy",
    children: [
      {
        title: "불량원인 데이터 분석",
        icon: "i-ic:outline-circle",
        index: "/ai-data-analyze/defect-cause-analysis",
        path: "/dummy",
      },
      // 더 많은 서브 메뉴 아이템들...
    ],
  },
  {
    title: "메일함 📧",
    icon: "i-ic:outline-circle",
    index: "system-management",
    path: "/",
    children: [
      {
        title: "월간요약 📅",
        icon: "i-guidance:calendar",
        index: "/ai-data-analyze/defect-cause-analysis",
        path: "/mail/",
      },
      {
        title: "메일쓰기 🖋️",
        icon: "i-ic:outline-circle",
        index: "/ai-data-analyze/defect-cause-analysis",
        path: "/mail/write",
      },
      {
        title: "보낸 메일함 📧",
        icon: "i-ic:outline-circle",
        index: "/ai-data-analyze/defect-cause-analysis",
        path: `/mail/folders/1`,
      },
      {
        title: "날짜 별 예약 3️⃣0️⃣",
        icon: "i-ic:outline-circle",
        index: "/mail/folders/2",
        path: `/mail/folders/2`,
      },
      {
        title: "요일 별 예약 7️⃣ ",
        icon: "i-ic:outline-circle",
        index: "/ai-data-analyze/defect-cause-analysis",
        path: `/mail/folders/3`,
      },
      {
        title: "일회성 예약 📧",
        icon: "i-ic:outline-circle",
        index: "/ai-data-analyze/defect-cause-analysis",
        path: `/mail/folders/4`,
      },

      {
        title: "휴지통 🗑️",
        icon: "i-ic:outline-circle",
        index: "/ai-data-analyze/defect-cause-analysis",
        path: `/mail/folders/5`,
      },

      // 더 많은 서브 메뉴 아이템들...
    ],
  },
];
</script>

<style scoped></style>

<!-- 

<el-scrollbar>
  <el-menu>
    <el-menu-item index="/dashboard">
      <div i-carbon:cloud-monitoring mr-3></div>
      <span>커스텀 대시보드</span>
    </el-menu-item>
    <el-menu-item index="/facility">
      <div i-carbon:industry mr-3></div>
      <span>설비 관리</span>
    </el-menu-item>
    <el-menu-item index="/edge">
      <div i-carbon:edge-node-alt mr-3></div>
      <span>엣지 관리</span>
    </el-menu-item>
    <el-menu-item index="/certification">
      <div i-carbon:edge-node-alt mr-3></div>
      <span>인증서 관리</span>
    </el-menu-item>
    <el-sub-menu index="data-collect">
      <template #title>
        <div flex items-center justify-center>
          <div i-carbon:data-collection mr-3 text-base></div>
          <span>데이터 수집</span>
        </div>
      </template>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>모델러</span>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="data-collect">
      <template #title>
        <div flex items-center justify-center>
          <div i-carbon:data-collection mr-3 text-base></div>
          <span>데이터 조회</span>
        </div>
      </template>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>모델러</span>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="data-collect">
      <template #title>
        <div flex items-center justify-center>
          <div i-carbon:data-collection mr-3 text-base></div>
          <span>AI 데이터 분석</span>
        </div>
      </template>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2 background="#f4f5fa"></div>
        <span>불량원인 데이터 분석</span>
      </el-menu-item>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>설비 데이터 분석</span>
      </el-menu-item>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>AI 예측 모델 생성</span>
      </el-menu-item>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>AI 이상감지 대시보드</span>
      </el-menu-item>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>설비 진동 이상감지</span>
      </el-menu-item>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>설비 전력 생성</span>
      </el-menu-item>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>AI 예측 로그</span>
      </el-menu-item>

    </el-sub-menu>
    <el-sub-menu index="data-collect">
      <template #title>
        <div flex items-center justify-center>
          <div i-carbon:data-collection mr-3 text-base></div>
          <span>시스템 관리</span>
        </div>
      </template>
      <el-menu-item index="/data-collect/opcua-modeler">
        <div i-ic:outline-circle mr-3 text-2></div>
        <span>모델러</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</el-scrollbar> -->
