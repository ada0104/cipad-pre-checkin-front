<template>
<div
    class="form-dropdown"
    @click="toggleDropdown"
    >
    <div class="selected-option">
        {{ selectedOption.label }}
        <SvgIcon
            :name="isOpen ? 'up' : 'down'"
            class="drop-icon"
            />
    </div>
    <ul
        v-if="isOpen"
        class="options-list"
        >
    <li
        v-for="(option, index) in options"
        :key="index"
        @click.stop="selectOption(option)"
        :class="['option-item', { 'checked': option.value === selectedOption.value }]"
        >
        {{ option.label }}
        <SvgIcon
            v-if="option.value === selectedOption.value"
            name="check"
            class="icon"
            />
    </li>
    </ul>
</div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  selectedOption: { value: string; label: string };
  options: Array<{ value: string; label: string }>;
}>();

const emit = defineEmits<{
  (event: 'update:selectedOption', selectedOption: { value: string; label: string }): void;
}>();

const isOpen = ref(false);

const toggleDropdown = () => {
 isOpen.value = !isOpen.value;
};

const selectOption = (option: { value: string; label: string }) => {
  emit('update:selectedOption', option);
  isOpen.value = false;
};
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

  .selected-option {
    color: var(--Primary);
    font-size: 20px;
    font-weight: 350;
    line-height: 140%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
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
    box-shadow: 0px 68px 19px 0px rgba(0, 0, 0, 0.00), 0px 43px 17px 0px rgba(0, 0, 0, 0.01), 0px 24px 15px 0px rgba(0, 0, 0, 0.02), 0px 11px 11px 0px rgba(0, 0, 0, 0.03), 0px 3px 6px 0px rgba(0, 0, 0, 0.04);
    list-style: none;
    border-radius: 16px;
  }

  .option-item {
    padding: 24px 12px;
    cursor: pointer;
    font-size: 20px;
    color: var(--On-Surface-Var);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;

    .icon{
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