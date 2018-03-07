<template>
    <div class="gantt-header">
        <div class="gantt-header-navigator">
            <div class="gantt-header-today">
                <button @click="onToday">
                    今天
                </button>
            </div>
            <div class="gantt-header-arrow">
                <button @click="onPrev">&lt;</button>
                <button @click="onNext">&gt;</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ganttHeader',
    props: {
        onToday: {
            type: Function
        },
        onPrev: {
            type: Function
        },
        onNext: {
            type: Function
        }
    }
}
</script>
<style lang="less">
.gantt-header {
    display: flex;
    width: 100%;
    height: 45px;
    line-height: 45px;
    background: #f3f4f5;
    box-sizing: border-box;
    border-left: 2px solid #dcdee2;
    padding: 0 10px;
    button {
        width: 45px;
        height: 30px;
    }
    &-navigator {
        color: #8d919a;
        right: 10px;
        position: absolute;
        display: inline-flex;
        &>div {
            margin-right: 10px;
        }
        &>div:last-child {
            margin-right: 0;
        }
    }
    &-arrow {
        button {
            margin-left: 0;
        }
    }
}
</style>
