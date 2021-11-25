function Drag(opts) {

  this.opts = {
    dragEle: '',
    boxEle: 'body',
  };
  
  Object.keys(opts).forEach((key) => {
    this.opts[key] = opts[key];
  })
  
  this.init()
  this.setEvent()
}

Drag.prototype = {
  $: function (o, p) {
    return (p || document).querySelector(o);
  },
  init: function() {
    this.dragDom = typeof this.opts.dragEle === 'string' ? this.$(this.opts.dragEle) : this.opts.dragEle; //获得拖拽元素
    this.boxDom = typeof this.opts.boxEle === 'string' ? this.$(this.opts.boxEle) : this.opts.boxEle; //获得容器元素
    this.dragDom.style.cursor = 'move'
    this.oldLeft = 0
    this.oldTop = 0
  },
  setEvent: function() {
    const { dragDom } = this
    let startHandler = (e) => {
      let touch = e.touches[0]
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = touch.clientX - dragDom.offsetLeft
      const disY = touch.clientY - dragDom.offsetTop

      const dragDomWidth = dragDom.offsetWidth
      const dragDomHeight = dragDom.offsetHeight

      const boxWidth = this.boxDom.clientWidth
      const boxHeight = this.boxDom.clientHeight
      const boxOffsetTop = this.boxDom.getBoundingClientRect().top
      const boxOffsetLeft = this.boxDom.getBoundingClientRect().left

      const minDragDomLeft = dragDom.offsetLeft - boxOffsetLeft
      const maxDragDomLeft = boxOffsetLeft + boxWidth - dragDom.offsetLeft - dragDomWidth

      const minDragDomTop = dragDom.offsetTop - boxOffsetTop
      const maxDragDomTop = boxOffsetTop + boxHeight - dragDom.offsetTop - dragDomHeight

      let moveHandler = (e) => {
        let touch = e.touches[0]
        // 通过事件委托，计算移动的距离
        let left = touch.clientX - (disX + dragDom.offsetLeft) + this.oldLeft
        let top = touch.clientY - (disY + dragDom.offsetTop) + this.oldTop

        // 边界处理
        if (-(left) > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }

        if (top < -minDragDomTop) {
          top = -minDragDomTop
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        this.left = left
        this.top = top

        // 移动当前元素
        dragDom.style.transform = `translate3d(${left}px, ${top}px, 10px)`
      }

      let endHandler = () => {
        this.oldLeft = this.left
        this.oldTop = this.top
        document.removeEventListener('touchmove', moveHandler)
        document.removeEventListener('touchend', endHandler)
      }

      document.addEventListener('touchmove', moveHandler)
      document.addEventListener('touchend', endHandler)

    }

    dragDom.addEventListener('touchstart', startHandler)
    this.startHandler = startHandler
  },
  removeEvent: function(){
    const { dragDom } = this
    dragDom.removeEventListener('touchstart', this.startHandler)
  },
};

export default Drag
