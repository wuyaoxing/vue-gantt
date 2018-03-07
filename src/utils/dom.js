/**
 * 匹配与选择器相符的最近的祖先元素
 * @param {*} node
 * @param {*} selector
 */
export const closest = (el, selector) => {
    let element = el
    while(element && element.matches) {
        if (element.matches(selector)) {
            return element
        }
        element = element.parentNode
    }

    return null
}

// 事件
// export const on = (el, type, handle) => el.addEventListener(type, handle)
// export const off = (el, type, handle) => el.removeEventListener(type, handle)

export const on = (els, type, handle) => {
    if (!els) return
    if (!els.length) {
        els.addEventListener(type, handle)
        return
    }
    els.forEach((el) => el.addEventListener(type, handle))
}
export const off = (els, type, handle) => {
    if (!els) return
    if (!els.length) {
        els.removeEventListener(type, handle)
        return
    }
    els.forEach((el) => el.removeEventListener(type, handle))
}

// query
const arrSlice = Array.prototype.slice
export const $ = (selector, context = document) => context.querySelector(selector)
export const $$ = (selector, context = document) => arrSlice.call(context
    .querySelectorAll(selector))

// nodelist each
const arrayEach = Array.prototype.forEach
export const each = (nodeList, callback) => arrayEach.call(nodeList, callback)

// nodelist indexOf
const arrIndexOf = Array.prototype.indexOf
export const nodeIndex = node => arrIndexOf.call(node.parentNode.children, node)

// style
export const style = (el, styles) => {
    Object.keys(styles).forEach(name => (el.style[name] = styles[name]))
}

// attr
export const attr = (el, key, value) => (el.setAttribute(key, value))
export const removeAttr = (el, key) => (el.removeAttribute(key))

// class
// export const addClass = (el, ...classArgs) => el.classList.add(classArgs)
// export const removeClass = (el, ...classArgs) => el.classList.remove(classArgs)

export const addClass = (els, ...classArgs) => {
    if (!els || els.length === 0) return
    if (!els.length) {
        els.classList.add(...classArgs)
        return
    }
    els.forEach((el) => el.classList.add(...classArgs))
}
export const removeClass = (els, ...classArgs) => {
    if (!els || els.length === 0) return
    if (!els.length) {
        els.classList.remove(...classArgs)
        return
    }
    els.forEach((el) => el.classList.remove(...classArgs))
}

// dom operation
export const insertBefore = (node, beforeNode) => node.insertAdjacentElement('beforebegin', beforeNode)
export const insertAfter = (node, afterNode) => node.insertAdjacentElement('afterend', afterNode)
export const prepend = (node, preNode) => node.insertAdjacentElement('afterbegin', preNode)

// scrollDirection
export const scrollDirection = el => {
    if(el.scrollHeight > el.offsetHeight) return 'y'
    if(el.scrollWidth > el.offsetWidth) return 'x'
    return null
}

export const prevent = e => e.preventDefault()
