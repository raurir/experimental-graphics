con = console
d = document
canvas = null
size = 600
centre = size / 2
ctx = null

rotMod = Math.PI / 4 # 0.2

settings = {}

createSlider = (prop, min, max, granularity = 1) ->
  div = d.createElement("div")

  label = d.createElement("label")
  label.innerHTML = "#{prop}:"

  state = d.createElement("label")
  state.innerHTML = min

  range = d.createElement("input")
  range.type = "range"
  range.min = min
  range.max = max
  range.name = prop

  div.appendChild(label)
  div.appendChild(range)
  div.appendChild(state)
  d.body.appendChild(div)

  change = (e) ->
    v = e.target.value * granularity
    settings[prop] = Number(v)
    state.innerHTML = v
    redraw()
  range.addEventListener("change", change)
  range.addEventListener("input", change)
  settings[prop] = min

createSlider("angleRange", 0, 1000, 0.001)
createSlider("items", 1, 10)
createSlider("maxRecursion", 1, 10)
createSlider("angleSpiral", 0, 20, 0.1)






redraw = () ->
  canvas.width = canvas.width
  draw(centre, 50, 0, 0)

draw = (x, y, branchAngle, level) ->

  scale = 1 / (level+1)

  w = 10 * scale
  h = 100 * scale # * (level+1)

  level++

  items = settings.items
  angleRange = settings.angleRange
  maxRecursion = settings.maxRecursion
  angleSpiral = settings.angleSpiral

  for j in [0...items]

    rotation = j * angleRange - (items - 1) * angleRange / 2 + branchAngle * angleSpiral

    # con.log("draw", level, j, scale)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation) # Math.PI / 2)
    # ctx.scale(scale, scale)

    dot = 4
    ctx.fillStyle = "rgba(255,0,0,0.1)"
    ctx.fillRect(-dot/2, -dot/2, dot, dot)

    rgb = 0 # i * 10
    ctx.fillStyle = "rgba(#{rgb},#{rgb},#{rgb},0.1)"
    ctx.fillRect( - w * 1 / 2, 0, w * 1, h * 1)

    ctx.restore()

    newX = x + h * - Math.sin(rotation)
    newY = y + h * Math.cos(rotation)


    if level < maxRecursion
      draw(newX, newY, rotation, level)





















init = () ->
  canvas = d.createElement("canvas")
  canvas.width = canvas.height = size
  d.body.appendChild(canvas)

  ctx = canvas.getContext("2d")

  # window.addEventListener("mousemove", (e) =>
  #   # rotMod = e.x * 0.05
  #   # rotMod = Math.PI / ~~(e.x / 10 + 1)
  #   # items = ~~(e.y / 10 ) + 1 # (level+1)*2
  #   # if items > 10
  #   #   items = 10
  #   # con.log(rotMod, items)
  #   # draw(centre, centre, 0)
  # )

  # setInterval(
  #   () =>
  #     for i in [0...10]
  #       rotMod += Math.PI / 32.23871238971 # 0.02
  #       draw(centre, 50, 0)
  #   10
  # )

  redraw()

init()