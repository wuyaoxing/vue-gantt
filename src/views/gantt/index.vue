<template>
    <div class="gantt-container">
        <gantt-header :onPrev="onPrev"
                      :onNext="onNext"
                      :onToday="onToday"></gantt-header>
        <gantt-body :startDate="ganttStart"
                    :endDate="ganttEnd"
                    :showTaskId="showTaskId"></gantt-body>
    </div>
</template>
<script>
import ganttHeader from 'components/gantt/ganttHeader'
import ganttBody from 'components/gantt/ganttBody'
import { animationScroll } from 'utils/animationScroll'
import { $$ } from 'utils/dom'

import moment from 'moment'

export default {
    name: 'gantt',
    components: {
        ganttHeader,
        ganttBody,
    },
    data () {
        return {
            ganttStart: this.getGanttDate().start,
            ganttEnd: this.getGanttDate().end,
            T_token: 0,
            timelineSetting: null,
            loading: true,
        }
    },
    computed: {
        showTaskId () {
            // 匹配打开的任务id
            return ''
        },
    },
    methods: {
        initGantt () {
            // 从后端获取数据
            console.log('从后端获取数据')
        },
        getGanttDate (num) {
            const ganttStart = new Date()
            const ganttEnd = new Date()
            let start,
                end
            if (num) {
                start = ganttStart.setMonth(ganttStart.getMonth() - 6 - (11 * num))
                end = ganttEnd.setMonth(ganttEnd.getMonth() + (6 - (11 * num)))
            } else {
                start = ganttStart.setMonth(ganttStart.getMonth() - 6)
                end = ganttEnd.setMonth(ganttEnd.getMonth() + 6)
            }
            this.ganttStart = start
            this.ganttEnd = end
            return {
                start,
                end
            }
        },

        onPrevYear () {
            this.T_token += 1
            this.getGanttDate(this.T_token)
        },

        onNextYear () {
            this.T_token -= 1
            this.getGanttDate(this.T_token)
        },

        onPrev () {
            const ganttScreenWidth = $$('.gantt_task')[0].clientWidth
            const currentPosition = $$('.gantt_task')[0].scrollLeft
            if (currentPosition - ganttScreenWidth > 0) {
                animationScroll({ end: currentPosition - ganttScreenWidth, type: 'scrollLeft', tagName: 'gantt_task', rate: 6 })
            } else {
                this.onPrevYear()
            }
        },

        onNext () {
            const ganttDataWidth = $$('.gantt_data_area')[0].clientWidth
            const ganttScreenWidth = $$('.gantt_task')[0].clientWidth
            const currentPosition = $$('.gantt_task')[0].scrollLeft
            if (currentPosition < (ganttDataWidth - ganttScreenWidth)) {
                animationScroll({ end: currentPosition + ganttScreenWidth, type: 'scrollLeft', tagName: 'gantt_task', rate: 6 })
            } else {
                this.onNextYear()
            }
        },

        onToday () {
            if (this.ganttStart && this.ganttEnd) {
                if (moment().isBetween(this.ganttStart,
                    this.ganttEnd)) {
                    const todayPosition = $$('.today')[0].offsetLeft
                    const screenOffset = 180
                    animationScroll({ end: todayPosition - screenOffset, type: 'scrollLeft', tagName: 'gantt_task', rate: 6 })
                } else {
                    this.T_token = 0
                    this.getGanttDate()
                }
            }
        }
    },
    created () {
        this.initGantt()
        this.$root.$on('task-show', taskId => { window.gantt.selectTask(taskId) })
        this.$root.$on('task-hide', taskId => { window.gantt.unselectTask(taskId) })
    },
    destroyed () {
        this.$root.$off('task-show', () => { window.gantt.selectTask() })
        this.$root.$off('task-hide', () => { window.gantt.unselectTask() })
    }
}
</script>
