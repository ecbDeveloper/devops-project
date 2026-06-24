<template>
    <div class="breadcrumb-container">
        <ul class="breadcrumb">
            <li
                v-for="(step, index) in steps"
                :key="index"
                :class="{ active: index <= currentStep, completed: index < currentStep }"
            >
                <span
                    @click="navigate(index)"
                >
                    <i :class="step.icon"></i> {{ step.label }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    steps: Array as () => { label: string; icon: string }[],
    currentStep: {
        type: Number,
        required: true
    },
});

const emit = defineEmits(['navigate']);

const navigate = (index: number) => {
    emit('navigate', index);
};
</script>

<style scoped lang="scss">

.breadcrumb-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    overflow-x: auto;
    padding: 0 10px;

    .breadcrumb {
        display: flex;
        cursor: pointer;
        flex-wrap: nowrap;
        padding: 0;
        width: 100%;

        @include md {
            justify-content: center;
        }

        li {
            align-items: center;
            cursor:not-allowed;
            display: flex;
            flex-shrink: 0;
            position: relative;

            &::after {
                content: "";
                border: 1px solid $color-secondary;
                height: 0px;
                width: 24px;
            }

            &:last-child {
                &::after {
                    display: none;
                }
            }

            &.completed {
                cursor: pointer;

                &::after {
                    border: 1px solid $color-primary;
                }

                span {
                    background: $color-primary;
                    color: $color-white;

                    &::after {
                        border-left-color: $color-primary;

                        &:hover {
                            border-left-color: $color-primary;
                        }
                    }
                }

            }

            span {
                display: flex;
                align-items: center;
                background-color: $color-secondary;
                border-radius: 24px;
                color: #8093A7;
                font-size: 16px;
                padding: 10px 20px;
                font-weight: 600;
                text-decoration: none;
                transition: 0.3s ease;

                i {
                    margin-right: 8px;
                }
            }
        }
    }
}

</style>
