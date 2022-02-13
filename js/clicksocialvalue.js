class Circle {
            constructor({ origin, speed, color, angle, context }) {
                this.origin = origin
                this.position = { ...this.origin }
                this.color = color
                this.speed = speed
                this.angle = angle
                this.context = context
                this.renderCount = 0
            }

            draw() {
                this.context.fillStyle = this.color
                this.context.beginPath()
                this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
                this.context.fill()
            }

            move() {
                this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x
                this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3)
                this.renderCount++
            }
        }

        class Boom {
            constructor({ origin, context, circleCount = 10, area }) {
                this.origin = origin
                this.context = context
                this.circleCount = circleCount
                this.area = area
                this.stop = false
                this.circles = []
            }

            randomArray(range) {
                const length = range.length
                const randomIndex = Math.floor(length * Math.random())
                return range[randomIndex]
            }

            randomColor() {
                const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
                return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range)
            }

            randomRange(start, end) {
                return (end - start) * Math.random() + start
            }

            init() {
                for (let i = 0; i < this.circleCount; i++) {
                    const circle = new Circle({
                        context: this.context,
                        origin: this.origin,
                        color: this.randomColor(),
                        angle: this.randomRange(Math.PI - 1, Math.PI + 1),
                        speed: this.randomRange(1, 6)
                    })
                    this.circles.push(circle)
                }
            }

            move() {
                this.circles.forEach((circle, index) => {
                    if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
                        return this.circles.splice(index, 1)
                    }
                    circle.move()
                })
                if (this.circles.length == 0) {
                    this.stop = true
                }
            }

            draw() {
                this.circles.forEach(circle => circle.draw())
            }
        }

        class CursorSpecialEffects {
            constructor() {
                this.computerCanvas = document.createElement('canvas')
                this.renderCanvas = document.createElement('canvas')

                this.computerContext = this.computerCanvas.getContext('2d')
                this.renderContext = this.renderCanvas.getContext('2d')

                this.globalWidth = window.innerWidth
                this.globalHeight = window.innerHeight

                this.booms = []
                this.running = false
            }

            handleMouseDown(e) {
                const boom = new Boom({
                    origin: { x: e.clientX, y: e.clientY },
                    context: this.computerContext,
                    area: {
                        width: this.globalWidth,
                        height: this.globalHeight
                    }
                })
                boom.init()
                this.booms.push(boom)
                this.running || this.run()
            }

            handlePageHide() {
                this.booms = []
                this.running = false
            }

            init() {
                const style = this.renderCanvas.style
                style.position = 'fixed'
                style.top = style.left = 0
                style.zIndex = '999999999999999999999999999999999999999999'
                style.pointerEvents = 'none'

                style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth
                style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight

                document.body.append(this.renderCanvas)

                window.addEventListener('mousedown', this.handleMouseDown.bind(this))
                window.addEventListener('pagehide', this.handlePageHide.bind(this))
            }

            run() {
                this.running = true
                if (this.booms.length == 0) {
                    return this.running = false
                }

                requestAnimationFrame(this.run.bind(this))

                this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight)
                this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight)

                this.booms.forEach((boom, index) => {
                    if (boom.stop) {
                        return this.booms.splice(index, 1)
                    }
                    boom.move()
                    boom.draw()
                })
                this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight)
            }
        }

        const cursorSpecialEffects = new CursorSpecialEffects()
        cursorSpecialEffects.init()
        var a_idx = 0;
        jQuery(document).ready(function ($) {
            //点击body时触发事件
            $("body").click(function (e) {
                //需要显示的词语
                var a = new Array("zhang", "wen", "yu", "xiang", "992", "520");
                //设置词语给span标签
                var $i = $("<span/>").text(a[a_idx]);
                //下标等于原来下标+1  余 词语总数
                a_idx = (a_idx + 1) % a.length;
                //获取鼠标指针的位置，分别相对于文档的左和右边缘。
                //获取x和y的指针坐标
                var x = e.pageX, y = e.pageY;
                //在鼠标的指针的位置给$i定义的span标签添加css样式
                $i.css({
                    "z-index": 999,
                    "top": y - 20,
                    "left": x,
                    "position": "absolute",
                    "font-weight": "bold",
                    "color": rand_color()
                });
                // 随机颜色
                function rand_color() {
                    return "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
                }
                //在body添加这个标签
                $("body").append($i);
                //animate() 方法执行 CSS 属性集的自定义动画。
                //该方法通过CSS样式将元素从一个状态改变为另一个状态。CSS属性值是逐渐改变的，这样就可以创建动画效果。
                //详情请看http://www.w3school.com.cn/jquery/effect_animate.asp
                $i.animate({
                    //将原来的位置向上移动180
                    "top": y - 180,
                    "opacity": 0
                    //1500动画的速度
                }, 1500, function () {
                    //时间到了自动删除
                    $i.remove();
                });
            });
        })
            ;