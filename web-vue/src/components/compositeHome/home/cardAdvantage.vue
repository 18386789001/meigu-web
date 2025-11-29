<template>
  <div class="card-advantage flex flex-col items-center text-center py-8 px-6">
    <div class="image-wrapper mb-6">
      <img v-lazy="getImageUrl(imgPath)" />
    </div>
    <h3 class="text-lg text-black font-semibold mb-3">{{ title }}</h3>
    <div class="text-gray-500 text-sm">{{ desc }}</div>
  </div>
</template>
<script setup>
import { getImageUrl } from "@/utils/index";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default: "",
  },
  imgPath: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss" scoped>
.card-advantage {
  background: #f0f2f4;
  border-radius: 20px;
  min-height: 300px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 180px;
      height: auto;
      object-fit: contain;
    }
  }

  h3 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-word;
  }

  .text-gray-500 {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    line-height: 1.5;
  }
}
</style>
