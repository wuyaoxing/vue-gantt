/**
 * 缓动动画
 * 使用说明
 * this.$scroll(end, type, tagName, rate)
 * end 滚动条位置(将要滚动到的)
 * type scrollLeft
 * tagName DOM对象，可为id、class、body
 * rate 步阶默认为2，可传入步阶控制速度
 */

export const animationScroll = ({ type, tagName, end = 0, rate = 2 }) => {
    if (type !== 'scrollLeft') {
        console.error('type：scrollLeft')
        return
    }

    // requestAnimationFrame的兼容处理
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (fn) => {
            setTimeout(fn, 17)
        }
    }

    const tagNameId = document.getElementById(tagName)
    const tagNameClass = document.getElementsByClassName(tagName)[0]
    const getTag = tagNameId || tagNameClass || document.body
    const _end = end
    let start = getTag.scrollLeft

    if (start === end || typeof start !== 'number') {
        return
    }
    const step = () => {
        if (rate === 0) {
            getTag.scrollLeft = end
            return
        }
        start += (end - start) / rate
        if (Math.abs(start - _end) < 1) {
            getTag.scrollLeft = end
            return
        }
        getTag.scrollLeft = start
        requestAnimationFrame(step)
    }
    step()
}

export const a = () => { }
