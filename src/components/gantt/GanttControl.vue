<template>
    <div id="gantt-placeholder"></div>
</template>
<script>
import './lib/v.4.2/dhtmlxgantt.css'
import './lib/v.4.2/dhtmlxgantt'
import './lib/v.4.2/dhtmlxgantt_marker'
import './lib/v.4.2/dhtmlxgantt_tooltip'

import './lib/lang/locale_cn'
import './lib/override_gantt.less'

import { animationScroll } from 'utils/animationScroll'
import {
    $$, addClass, removeClass, on
} from 'utils/dom'

import moment from 'moment'
import _ from 'lodash'

import testGanttData from './ganttData'

const { gantt } = window

export default {
    name: 'GanttControl',
    props: {
        ganttData: {
            type: Object,
            default: () => { }
        },
        startDate: {
            type: Number,
            default: 0
        },
        endDate: {
            type: Number,
            default: 0
        },
        floatingPanelOpen: {
            type: Boolean,
            default: true
        },
        hideWeekend: {
            type: Boolean,
            default: true
        },
        onTaskUpdate: Function,
        showTaskId: String
    },
    data() {
        return {
            events: []
        }
    },
    computed: {
        filterGanttData() {
            if (testGanttData) return testGanttData

            // 处理看板
            const Colors = [
                '',
                '#fd6461',
                '#f7a650',
                '#ffdf7f',
                '#89cc76',
                '#77beff',
                '#d08ce0',
                '#a5a5a7'
            ]

            const {
                kanbanList,
                kanbankbcList,
                kbcList,
                kbcTaskList,
                taskList: taskLists,
                kanbanId
            } = this

            const kanban = kanbanList[kanbanId]
            const kanbankbcs = kanbankbcList[kanbanId]

            if (!kanban || !Object.keys(kanbankbcList).length
                || !kanbankbcs || !Object.keys(taskLists).length) {
                return {
                    data: []
                }
            }

            if (!kanban) {
                return {
                    data: []
                }
            }

            const kanbanlist = {
                id: kanban.id,
                text: kanban.name,
                // start_date: this.getStartDate(value.start_date),
                // duration: this.getDuration(value.start_date, value.due_date),
                progress: 0,
                open: true,
                type: 'project',
            }

            if (!kanbankbcs) {
                return {
                    data: [kanbanlist]
                }
            }

            const kbctasklist = kanbankbcs.reduce((acc, kbcid) => {
                const kanbanColumn = kbcList[kbcid]
                const kbcTasks = kbcTaskList[kbcid]

                if (!kanbanColumn) return kanbanlist
                const kbclist = {
                    id: kanbanColumn.kbc.id,
                    text: kanbanColumn.kbc.name,
                    parent: kanbanColumn.kbc.kanbanId,
                    type: 'tasklist',
                    open: true,
                }

                if (!kbcTasks || !Object.keys(taskLists).length) {
                    acc.push(kbclist)
                    return acc
                }

                const tasklist = kbcTasks.map(taskid => {
                    const task = taskLists[taskid]
                    const noStartDue = !task.startDate && !task.dueDate

                    return {
                        id: task.id,
                        projectId: task.projectId,
                        text: task.name,
                        startDate: task.startDate,
                        dueDate: task.dueDate,
                        start_date: noStartDue
                            ? moment(this.startDate).startOf('day').toDate()
                            : this.getStartDate(task.startDate, task.dueDate),
                        duration: noStartDue ? 366 : this.getDuration(
                            task.startDate,
                            task.dueDate
                        ),
                        startDueStatus: this.getNoStartDueDateIndicator(
                            task.startDate,
                            task.dueDate
                        ),
                        type: 'task',
                        status: this.getTaskStatus(task.startDate, task.dueDate, task.done),
                        progress: 0,
                        parent: kbcid,
                        label: Colors[task.label],
                        real_start_date: moment(task.startDate).toDate(),
                        real_due_date: moment(task.dueDate).toDate(),
                        deleted: task.deleted
                    }
                })
                acc.push(kbclist)
                return acc.concat(tasklist)
            }, [])

            return {
                data: [kanbanlist, ...kbctasklist]
            }
        },
    },
    watch: {
        $route({ params }, old) {
            if (params.kbId === old.params.kbId) return
            this.componentDidMount()
        },
        filterGanttData: 'updateGanttTask',
        endDate: 'componentDidMount',
    },
    methods: {
        updateGanttTask(val, oldVal) {
            if (!val || !oldVal) {
                this.componentDidMount()
                return
            }

            // const updatedTask = _.differenceWith(val.data, oldVal.data, _.isEqual)
            // const updatedOldTask = _.differenceWith(oldVal.data, val.data, _.isEqual)
            const isEqual = (arrVal, othVal) => JSON.stringify(arrVal) === JSON.stringify(othVal)
            const updatedTask = _.differenceWith(val.data, oldVal.data, isEqual)
            const updatedOldTask = _.differenceWith(oldVal.data, val.data, isEqual)
            // console.log('updatedddd:', updatedTask, updatedOldTask)

            if (updatedTask.length === 1) {
                updatedTask.forEach(task => {
                    if (task.deleted) {
                        gantt.deleteTask(task.id)
                    } else {
                        const ganttTask = gantt.getTask(task.id)
                        if (!ganttTask) {
                            const index = this.kbcTaskList[task.parent]
                                .findIndex(id => id === task.id)
                            const specifiedTask = Object.assign({}, task)
                            gantt.addTask(specifiedTask, task.parent, index)
                            return
                        }
                        gantt.setSizes()
                        ganttTask.text = task.text
                        ganttTask.duration = task.duration
                        ganttTask.status = task.status
                        ganttTask.startDate = task.startDate
                        ganttTask.dueDate = task.dueDate
                        ganttTask.start_date = moment(task.start_date, 'DD-MM-YYYY').toDate()
                        ganttTask.end_date = moment(task.start_date, 'DD-MM-YYYY').add(task.duration, 'days').toDate()
                        ganttTask.real_start_date = task.real_start_date
                        ganttTask.real_due_date = task.real_due_date
                        ganttTask.startDueStatus = task.startDueStatus
                        ganttTask.label = task.label
                        ganttTask.deleted = task.deleted
                        ganttTask.parent = task.parent
                        gantt.updateTask(task.id)
                    }
                })
            }

            gantt.selectTask(this.showTaskId)

            if (updatedTask.length - updatedOldTask.length === 1) {
                const newA = updatedTask.map(({ id }) => id)
                const oldA = updatedOldTask.map(({ id }) => id)
                const difference = _.difference(newA, oldA)
                const task = updatedTask.find(({ id }) => id === difference[0])
                const index = this.kbcTaskList[task.parent]
                    .findIndex((id) => id === task.id)
                const specifiedTask = Object.assign({}, task)
                gantt.addTask(specifiedTask, task.parent, index)
                return
            }
            if (updatedOldTask.length === updatedTask.length) return

            if (updatedTask.length > 1) {
                this.componentDidMount()
                // gantt.clearAll()
                // this.addMarkerGantt()
                // gantt.parse(val)
            }

            // gantt.selectTask(this.showTaskId)
        },

        getStartDate(startDate, dueDate) {
            if (startDate) {
                return moment(startDate).format('DD-MM-YYYY')
            }
            if (dueDate) {
                return moment(dueDate).format('DD-MM-YYYY')
            }
            return null
        },

        getTaskStatus(startDate, dueDate, taskStatus) {
            if (!startDate && !dueDate) {
                let status = 'no-start-due'
                if (taskStatus) status += '-completed'
                return status
            }

            if (taskStatus) return 'completed'
            const currentDate = Math.abs(moment(moment(dueDate).startOf('day')).diff(moment(startDate).startOf('day'), 'days'))

            if (moment(startDate).add(currentDate, 'days').isBefore(moment(), 'day')) {
                return 'overdue'
            }
            if (moment(startDate).add(currentDate, 'days').isSame(moment(), 'day')) {
                return 'due-today'
            }

            return 'planned'
        },

        getDuration(startDate, dueDate) {
            if (!startDate || !dueDate) return 1
            // const dateOffset = moment(dueDate).hour() === 0 ? 0 : 1
            const dateOffset = 1
            const duration = moment(moment(dueDate).startOf('day')).diff(moment(startDate).startOf('day'), 'days') + dateOffset
            return duration || 1
        },

        getNoStartDueDateIndicator(startDate, dueDate) {
            if (!startDate) return 'no-start-date'
            if (!dueDate) return 'no-due-date'
            return ''
        },

        componentDidMount() {
            this.ganttEvents().destroy()
            if (gantt.getVisibleTaskCount() > 0) gantt.clearAll()
            this.configGantt()
            this.templatesGantt()
            this.attachEventGantt()
            this.initiateGantt(this.filterGanttData)
            this.addMarkerGantt()
            this.attachJqueryEvent()
            this.scrollToCurrentDay()
        },

        shouldComponentUpdate(nextProps) {
            if (!nextProps.floatingPanelOpen) gantt.unselectTask()
            gantt.setSizes()
            const updatedTask = _
                .differenceWith(nextProps.data.data, this.props.data.data, _.isEqual)
            if (updatedTask.length === 1) this.updateGanttTaskById(updatedTask[0])
            return this.isRetrieveNewData(this.props, nextProps)
        },

        scrollToCurrentDay() {
            const todayFlag = $$('.today')
            if (todayFlag.length > 0) {
                const todayPosition = todayFlag[0].offsetLeft
                const screenOffset = 180
                animationScroll({
                    end: todayPosition - screenOffset, type: 'scrollLeft', tagName: 'gantt_task', rate: 6
                })
            }
        },

        highlightRow(taskId) {
            if (!taskId) return
            this.clearHighlight(taskId)
            addClass(gantt.getTaskRowNode(taskId), 'active')
            addClass($$(`.gantt_task_row[task_id="${taskId}"]`), 'active')
        },

        clearHighlight(taskId) {
            removeClass($$('.gantt_row'), 'active')
            removeClass($$('.gantt_task_row'), 'active')
            removeClass($$('.gantt_tree_content'), 'active')
        },

        initiateGantt(data) {
            const ganttData = _.cloneDeep(data)
            gantt.init('gantt-placeholder')
            gantt.clearAll()
            gantt.parse(ganttData)
            gantt.config.start_date = this.startDate
            gantt.config.end_date = this.endDate
            gantt.render()
            gantt.selectTask(this.showTaskId)
        },

        configGantt() {
            gantt.config.columns = [{
                name: 'text', label: ' ', width: '*', tree: true
            }]
            gantt.config.row_height = 21
            gantt.config.scale_unit = 'month'
            gantt.config.scale_height = 65
            gantt.config.date_scale = '%Y年 %M'
            gantt.config.min_column_width = 31
            gantt.config.show_progress = false
            gantt.config.prevent_default_scroll = false
            gantt.config.grid_width = 245
            gantt.config.show_task_cells = false
            gantt.config.show_marker = true
            gantt.config.grid_resize = false
            gantt.config.smart_scales = true
            gantt.config.subscales = [
                { unit: 'week', step: 1, date: '第 %W 周' },
                {
                    unit: 'day',
                    step: 1,
                    date: '%j',
                    css: (date) => {
                        let subClassName = 'sub_scale'
                        if (date.getDay() === 6 || date.getDay() === 0) subClassName += ' weekend'
                        return subClassName
                    }
                }
            ]
            gantt.config.drag_links = false
            gantt.config.details_on_dblclick = false
            // 只读模式
            // gantt.config.readonly = true
            // 拖拉任务
            // gantt.config.order_branch = true
            // gantt.config.order_branch_free = true
        },

        templatesGantt() {
            gantt.templates.tooltip_text = (start, end, task) => {
                if (task.type === 'tasklist' || task.type === 'project') return task.text
                return `<b>任务名称:</b> ${task.text}<br/>
                        <b>持续时间：${(task.startDate || task.dueDate) ? task.duration : '未知'}</b><br/>
                        <b>开始日期:</b> ${task.startDate ? moment(task.startDate).format('YYYY-MM-DD') : '无开始日期'}<br/>
                        <b>截止日期:</b> ${task.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : '无截止日期'}`
            }

            gantt.templates.grid_blank = (item) => `<div class="gantt_hide_item">${item.status}</div>`
            gantt.templates.task_class = (start, end, task) => (task.type === 'task' ? `${task.status} ${task.type} ${task.startDueStatus}` : task.type)

            gantt.templates.grid_row_class = (start, end, task) => {
                switch (task.type) {
                    case 'project': return 'gantt_grid_project'
                    case 'tasklist': return 'gantt_grid_tasklist'
                    default:
                        return false
                }
            }

            gantt.templates.grid_folder = (item) => ''
            gantt.templates.task_row_class = (start, end, task) => 'gantt_grid_row'
            gantt.templates.grid_file = (item) => (`<div class="gantt_label" style="background: ${item.label}"></div>`)
            gantt.templates.task_cell_class = (item, date) => {
                if (date.getDay() === 6 || date.getDay() === 0) {
                    return 'weekend'
                }
                return false
            }
            gantt.templates.scale_cell_class = (date) => 'main_scale'
            gantt.templates.scale_row_class = (scale) => {
                switch (scale.unit) {
                    case 'day': return 'day_scale'
                    case 'month': return 'month_scale'
                    default: return 'week_scale'
                }
            }
            gantt.ignore_time = (date) => {
                if (date.getDay() === 0 || date.getDay() === 6) {
                    return this.hideWeekend
                }
                return false
            }

            gantt.templates.grid_open = (item) => {
                const arrow = item.$open ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
                const status = item.$open ? 'close' : 'open'
                return (`<div class="gantt_tree_icon gantt_${status}"><i class="${arrow}"></i></div>`)
            }
            gantt.templates.task_text = (start, end, task) => {
                let text = ''
                if (task.startDueStatus) {
                    text += `<div class="gantt_${task.startDueStatus}"></div>`
                }
                switch (task.type) {
                    case 'project':
                        text += '<div class="gantt_project_start-indicator"></div><div class="gantt_project_end-indicator"></div>'
                        break
                    case 'tasklist':
                        text += '<div class="gantt_tasklist_start-indicator"></div><div class="gantt_tasklist_end-indicator"></div>'
                        break
                    default:
                        break
                }
                return text
            }
        },

        adjustMarkers(top) {
            const markers = [].slice.call(document.querySelectorAll('.gantt_marker_content'), 0)
            if (markers.length > 0) markers[0].style.top = `${top}px`
        },

        ganttEvents() {
            return {
                on: (event, handle) => {
                    const eventName = gantt.attachEvent(event, handle)
                    this.events.push(eventName)
                },
                destroy: () => {
                    this.events.forEach((event) => {
                        gantt.detachEvent(event)
                    })
                    this.events = []
                }
            }
        },

        attachEventGantt() {
            this.events = []
            const ganttEvents = this.ganttEvents()
            this.ganttEvents().on('onGanttScroll', (left, top) => this.adjustMarkers(top))
            // ganttEvents.on('onDataRender', () => this.adjustMarkers(gantt.getScrollState().y))
            // ganttEvents.on('onBeforeTaskUpdate', (id, item) => {
            //     // this.updateTaskDate(id, item)
            //     // this._throttleOnTaskUpdate(item)
            //     // return true
            // })
            ganttEvents.on('onBeforeTaskChanged', (id, mode, task) => {
                console.log('drag:', id, mode, task, task.end_date)
                return true
            })

            // gantt.attachEvent('onTaskDrag', (id, mode, task, original) => {
            //     console.log('taskDrag:', id, mode, task, original)
            // })

            ganttEvents.on('onBeforeTaskDrag', (id, mode, e) => {
                const task = gantt.getTask(id)
                return task.startDate || task.dueDate
            })

            ganttEvents.on('onAfterTaskDrag', (id, mode, e) => {
                const task = gantt.getTask(id)
                this.updateTaskDate(id, task)
            })

            // ganttEvents.on('onTaskClick', (id, e) => {
            //     console.log(e.target)
            //     const target = $(e.target)
            //     const status = target.siblings('.gantt_hide_item').text()
            //     return !(status === 'no-start-due' || target.text().includes('no-start-due'))
            // })

            // gantt.attachEvent('onGanttScroll', (left, top) => this.adjustMarkers(top))
            // gantt.attachEvent('onDataRender', () => this.adjustMarkers(gantt.getScrollState().y))
            // gantt.attachEvent('onBeforeTaskUpdate', (id, item) => {
            //     this._throttleOnTaskUpdate(item)
            //     return true
            // })

            // gantt.attachEvent('onTaskClick', (id, e) => {
            //     const target = $(e.target)
            //     const status = target.siblings('.gantt_hide_item').text()
            //     return !(status === 'no-start-due' || target.text().includes('no-start-due'))
            // })
        },

        attachJqueryEvent() {
            let downPositionX = ''

            // $(window).on('mousewheel', (e) => {
            //     if (e.originalEvent.deltaY < 2) {
            //         if ($('.gantt_data_area').position().left < 1) e.preventDefault()
            //     }
            // })
            on($$('.gantt_data_area, .gantt_grid_data, .gantt_row, .gantt_tree_content'), 'mouseover', (e) => {
                const target = e.target.closest('[task_id]')
                if (!target) return
                const hoverTaskId = target.getAttribute('task_id')
                if (this.floatingPanelOpen) {
                    this.highlightRow(hoverTaskId)
                    return
                }
                gantt.selectTask(hoverTaskId)
            })

            // on($$('.gantt_task_row'), 'mouseout', (e) => {
            //     if (this.floatingPanelOpen) return
            //     gantt.unselectTask()
            // })

            on($$('.gantt_grid_scale'), 'mouseover', (e) => {
                if (this.floatingPanelOpen) return
                gantt.unselectTask()
            })

            on($$('.gantt_task'), 'mousedown', (e) => {
                downPositionX = e.clientX

                const target = e.target.closest('[task_id]')
                if (!target) return
                const taskId = target.getAttribute('task_id')

                gantt.selectTask(taskId)
            })

            on($$('.gantt_task'), 'mouseup', (e) => {
                if (e.clientX === downPositionX) {
                    const target = e.target.closest('[task_id]')
                    if (!target) return
                    const taskId = target.getAttribute('task_id')

                    gantt.selectTask(taskId)
                    this.onShowTaskById(taskId)
                }
                if (!this.floatingPanelOpen) gantt.unselectTask()
            })
        },

        addMarkerGantt() {
            // const stringDate = gantt.date.date_to_str(gantt.config.task_date)
            const today = moment()
                .hour(12)
                .minute(0)
                .second(0)
                .toDate()
            //        console.log(today)moment().format('LL')
            //        var today = new Date(2013, 3, 5)
            gantt.addMarker({
                start_date: today,
                css: 'today',
                text: '今天',
                title: `今天： ${moment(today).format('YYYY-MM-DD')}`
            })

            gantt.renderMarkers()
        },

        updateTaskDate(id, task) {
            // 判断更新时间
            console.log('拖拽更新任务时间')
        },

        updateGanttTaskById(task) {
            const ganttTask = gantt.getTask(task.id)
            if (!ganttTask) return
            Object.assign(ganttTask, task)
            // ganttTask.text = task.text
            // ganttTask.duration = task.duration
            // ganttTask.status = task.status
            // ganttTask.start_date = moment(task.start_date, 'DD-MM-YYYY').toDate()
            // ganttTask.end_date = moment(task.start_date, 'DD-MM-YYYY')
            // .add(task.duration, 'days').toDate()
            // ganttTask.startDueStatus = task.startDueStatus
            // ganttTask.label = task.label
            gantt.updateTask(task.id)
        },

        onShowTaskById(taskId) {
            console.log('打开任务：', taskId)
            this.$router.push({
                query: {
                    show: `/task/${taskId}`
                }
            })
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.componentDidMount()
        })
    },
    beforeDestroy() {
        this.ganttEvents().destroy()
    },
    destroyed() {
        // window.gantt = null
        const ganttEvents = this.ganttEvents()
        ganttEvents.destroy()
    }
}
</script>
