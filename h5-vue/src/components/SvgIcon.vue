<template>
  <svg 
    :width="size" 
    :height="size" 
    :viewBox="viewBox" 
    :class="['svg-icon', className]"
    :style="{ color: color }"
  >
    <!-- Forex Trading Icon -->
    <g v-if="name === 'forex'">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2"/>
      <circle cx="8" cy="8" r="2" fill="currentColor"/>
      <circle cx="16" cy="16" r="2" fill="currentColor"/>
    </g>

    <!-- Cryptocurrency Icon -->
    <g v-else-if="name === 'crypto'">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M9.5 8.5L14.5 15.5M14.5 8.5L9.5 15.5" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
    </g>

    <!-- Stocks Icon -->
    <g v-else-if="name === 'stocks'">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M7 14l3-3 2 2 5-5" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="7" cy="14" r="1" fill="currentColor"/>
      <circle cx="10" cy="11" r="1" fill="currentColor"/>
      <circle cx="12" cy="13" r="1" fill="currentColor"/>
      <circle cx="17" cy="8" r="1" fill="currentColor"/>
    </g>

    <!-- Platform Icon -->
    <g v-else-if="name === 'platform'">
      <rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M8 21l4-4 4 4" stroke="currentColor" stroke-width="2"/>
      <path d="M6 8h12M6 12h8" stroke="currentColor" stroke-width="1.5"/>
    </g>

    <!-- Education Icon -->
    <g v-else-if="name === 'education'">
      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 11 5.16-1 9-5.45 9-11V7l-10-5z" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
    </g>

    <!-- Analysis Icon -->
    <g v-else-if="name === 'analysis'">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M7 10l2 4 3-3 4 2" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="7" cy="10" r="1" fill="currentColor"/>
      <circle cx="9" cy="14" r="1" fill="currentColor"/>
      <circle cx="12" cy="11" r="1" fill="currentColor"/>
      <circle cx="16" cy="13" r="1" fill="currentColor"/>
    </g>

    <!-- Login Icon -->
    <g v-else-if="name === 'login'">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" fill="none" stroke="currentColor" stroke-width="2"/>
      <polyline points="10,17 15,12 10,7" stroke="currentColor" stroke-width="2" fill="none"/>
      <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/>
    </g>

    <!-- Register Icon -->
    <g v-else-if="name === 'register'">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="8.5" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
      <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" stroke-width="2"/>
      <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" stroke-width="2"/>
    </g>

    <!-- Support Icon -->
    <g v-else-if="name === 'support'">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="17" r="1" fill="currentColor"/>
    </g>

    <!-- Language Icon -->
    <g v-else-if="name === 'language'">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M2 12h20" stroke="currentColor" stroke-width="2"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" stroke-width="2"/>
    </g>

    <!-- About Icon -->
    <g v-else-if="name === 'about'">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 16v-4" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </g>

    <!-- Arrow Right Icon -->
    <g v-else-if="name === 'arrow-right'">
      <path d="M5 12h14" stroke="currentColor" stroke-width="2"/>
      <path d="M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none"/>
    </g>

    <!-- Default fallback -->
    <g v-else>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2"/>
    </g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  className: {
    type: String,
    default: ''
  }
})

const viewBox = computed(() => {
  return '0 0 24 24'
})
</script>

<style scoped>
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: all 0.3s ease;
}

.svg-icon:hover {
  transform: scale(1.1);
}
</style>
