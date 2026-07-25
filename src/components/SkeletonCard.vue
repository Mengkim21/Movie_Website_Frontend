<template>
  <div class="space-y-4 mb-12 px-6">
    <div class="h-8 w-1/5 bg-white/5 rounded-xl animate-pulse"></div>
    <div class="flex gap-4 overflow-hidden">
      <div v-for="i in 8" :key="i" class="min-w-[130px] md:min-w-[160px] lg:min-w-[170px] aspect-[2/3] bg-white/5 rounded-2xl"></div>
    </div>
  </div>
</template>