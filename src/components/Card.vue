<template>
<div
    :class="['card', cardClass]"
    :style="{ padding: cardPadding }">
    <slot name="header"></slot>
    <slot name="content"></slot>
</div>
</template>

<script setup lang="ts">
const props = defineProps({
    cardClass: {
        type: String,
        default: ''
    },
    cardPadding: {
        type: String,
        default: '56px'
    }
});
</script>

<style scoped lang="scss">
.card {
    width: 612px;
    margin-bottom: 36px;
    border-radius: 1rem;
    background: var(--Card-Background);
    box-shadow: 0px 421px 118px 0px rgba(150, 150, 150, 0.00),
    0px 269px 108px 0px rgba(150, 150, 150, 0.01),
    0px 151px 91px 0px rgba(150, 150, 150, 0.05),
    0px 67px 67px 0px rgba(150, 150, 150, 0.09),
    0px 17px 37px 0px rgba(150, 150, 150, 0.10);
}

</style>
