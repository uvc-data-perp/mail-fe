<template>
  <el-calendar>
    <template #date-cell="{ data }">
      <div
        :class="{ 'has-events': getReservationsForDate(data.date).length > 0 }"
      >
        {{ formatDate(data.date) }}
        <NuxtLink
          v-for="reservation in getReservationsForDate(data.date)"
          :key="reservation.id"
          :to="{
            name: 'mail-read-folderId-documentId',
            params: {
              folderId: getFolderId(reservation),
              documentId: reservation.id,
            },
            query: {
              groupId: reservation.groupId,
              status: reservation.status,
              expiredDate: reservation.expiredDate,
              reservedDate: reservation.reservedDate,
              sentDate: reservation.sentDate,
              sendingTime: reservation.sendingTime,
              sendingDays: reservation.sendingDays,
            },
          }"
          class="event-title"
        >
          {{ reservation.subject }}
          <!-- {{ props.mailData }} -->
        </NuxtLink>
      </div>
    </template>
  </el-calendar>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  mailData: {
    type: Array,
  },
});

const dummy = ref([
  [
    {
      id: "66f9fcc927c4678e3d363410",
      from: "default@groundkim.comm",
      to: "shyk31971@gmail.com",
      subject: "추가되는 요일제목7✔",
      text: "추가되는 요일내용7",
      html: "<b>추가되는 요일내용7</b>",
      status: "Waiting",
      sentTimestamp: null,
      v: 0,
      reservedTime: "1967264100_d_66f9fcc927c4678e3d363412",
      reservedDate: "2024-09-29T06:15:00.000Z",
    },
    {
      id: "66f9fcc927c4678e3d36340e",
      from: "default@groundkim.comm",
      to: "shyk31971@gmail.com",
      subject: "추가되는 요일제목8✔",
      text: "추가되는 요일내용8",
      html: "<b>추가되는 요일내용8</b>",
      status: "Waiting",
      sentTimestamp: null,
      v: 0,
      reservedTime: "1967177700_d_66f9fcc927c4678e3d363412",
      reservedDate: "2024-10-30T06:15:00.000Z",
    },
  ],
]);

const getFolderId = (reservation) => {
  if (reservation.status === "Sent") {
    return `1`;
  } else if (reservation.status === "Trashed") {
    return `5`;
  } else if (reservation.status === "Waiting") {
    const [, type, groupId] = reservation.reservedTime.split("_");

    switch (type) {
      case "r":
        return `2`;
      case "d":
        return `3`;
      case "w":
        return `4`;
      default:
        return ""; // 또는 적절한 기본값
    }
  }
};

const reservations = computed(() => {
  return props.mailData.map((item) => ({
    ...item,
    sentDate: new Date(item.sentDate),
    reservedDate: new Date(item.reservedDate),
  }));
});

const getReservationsForDate = (date) => {
  const targetDate = new Date(date);
  return reservations.value.filter(
    (reservation) =>
      reservation.sentDate.toDateString() === targetDate.toDateString() ||
      reservation.reservedDate.toDateString() === targetDate.toDateString()
  );
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
};
</script>

<style scoped>
.has-events {
  background-color: #e6f7ff;
}

.event-title {
  font-size: 0.8em;
  color: #1989fa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  text-decoration: none;
}

.event-title:hover {
  text-decoration: underline;
}
</style>
