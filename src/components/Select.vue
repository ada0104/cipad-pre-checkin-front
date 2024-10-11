<template>
  <div class="form-dropdown" ref="dropdown" @click="toggleDropdown">
    <div class="selected-option">
      {{ selectedOption.label }}
      <SvgIcon :name="isOpen ? 'up' : 'down'" class="drop-icon" />
    </div>
    <ul v-if="isOpen" class="options-list">
      <li
        v-for="(option, index) in options"
        :key="index"
        @click.stop="selectOption(option)"
        :class="['option-item', { checked: option.name === selectedOption.name }]"
      >
        {{ option.label }}
        <SvgIcon v-if="option.name === selectedOption.name" name="check" class="icon" />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue'
import $ from 'jquery';

const props = defineProps<{
  selectedOption: { name: string; label: string }
  options: Array<{ name: string; label: string }>
}>()

const emit = defineEmits<{
  (event: 'update:selectedOption', selectedOption: { name: string; label: string }): void
}>()

const isOpen = ref(false)
const dropdown = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option: { name: string; label: string }) => {
  emit('update:selectedOption', option)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  $(document).on('click', handleClickOutside);
})

onBeforeUnmount(() => {
  $(document).off('click', handleClickOutside);
})
</script>
<style lang="scss" scoped>
.form-dropdown {
  position: relative;
  display: inline-block;
  width: 100%;
  border: none;
  border-radius: 16px;
  padding: 20px 24px;
  background: var(--Input-box);
  cursor: pointer;
  z-index: 1;

  .selected-option {
    color: var(--Primary);
    font-size: 20px;
    font-weight: 350;
    line-height: 140%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .drop-icon {
      color: var(--Outline);
    }
  }

  .options-list {
    position: absolute;
    top: calc(100% + 12px);
    left: 0;
    right: 0;
    padding: 12px;
    background-color: var(--Input-box);
    border-radius: 16px;
    border: none;
    box-shadow:
      0 68px 19px rgba(0, 0, 0, 0),
      0 43px 17px rgba(0, 0, 0, 0.01),
      0 24px 15px rgba(0, 0, 0, 0.02),
      0 11px 11px rgba(0, 0, 0, 0.03),
      0 3px 6px rgba(0, 0, 0, 0.04);
    list-style: none;
    border-radius: 16px;
  }

  .option-item {
    padding: 24px 12px;
    cursor: pointer;
    font-size: 20px;
    color: var(--On-Surface-Var);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon {
      color: var(--Primary);
    }

    &.checked {
      color: var(--Primary);
    }

    &:hover {
      border-radius: 12px;
      color: var(--Primary);
      background-color: var(--Surface);
    }
  }
}
</style>
