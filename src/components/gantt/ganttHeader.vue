<template>
    <div class="gantt-header">
        <div class="gantt-header-title">
            Gantt
        </div>
        <div class="gantt-header-toolbar">
            <button class="gantt-header-today"
                    @click="onToday">
                今天
            </button>
            <div class="gantt-header-arrow">
                <button @click="onPrev">&lt;</button>
                <button @click="onNext">&gt;</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'GanttHeader',
    props: {
        onToday: Function,
        onPrev: Function,
        onNext: Function
    }
}
</script>
<style lang="less">
.gantt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 45px;
    padding: 0 10px;
    border-left: 2px solid #dcdee2;
    background: #f3f4f5;
    &-title {
        font-size: 20px;
        font-weight: bold;
    }
    &-toolbar {
        display: flex;
        color: #8d919a;
        & > button:first-of-type {
            margin-right: 10px;
        }
    }
    button {
        width: 45px;
        height: 30px;
        line-height: 30px;
    }
}
</style>
