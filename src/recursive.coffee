con = console
d = document
canvas = null
size = 600
centre = size / 2
ctx = null

rotMod = Math.PI / 4 # 0.2

settings = {}

createSlider = (prop, min, max, ini, granularity = 1) ->
  div = d.createElement("div")

  label = d.createElement("label")
  label.innerHTML = "#{prop}:"

  input = d.createElement("input")
  input.type = "text"
  input.value = ini

  range = d.createElement("input")
  range.type = "range"
  range.min = min / granularity
  range.max = max / granularity
  range.name = prop
  range.value = ini / granularity

  div.appendChild(label)
  div.appendChild(range)
  div.appendChild(input)
  d.body.appendChild(div)

  change = (e) ->
    v = e.target.value * granularity
    settings[prop] = Number(v)
    input.value = v
    redraw()

  changeText = (e) ->
    v = e.target.value
    settings[prop] = Number(v)
    range.value = v / granularity
    redraw()

  input.addEventListener("change", changeText)
  range.addEventListener("change", change)
  range.addEventListener("input", change)
  settings[prop] = ini

createSlider("items", 1, 10, 2)
createSlider("maxRecursion", 1, 10, 5)
createSlider("angleSpiral", 0, 2, 1, 0.01)
createSlider("angleSpread", 0, 2, Math.PI / 2, 0.01)
createSlider("symmetry", -1, 1, 0, 0.01)
createSlider("scale", 0, 10, 1, 0.01)






redraw = () ->
  canvas.width = canvas.width
  draw(centre, 50, 0, 0)

draw = (x, y, branchAngle, level) ->

  level++

  items = settings.items
  maxRecursion = settings.maxRecursion
  angleSpiral = settings.angleSpiral
  angleSpread = settings.angleSpread

  alpha = 1 - level / maxRecursion

  for j in [0...items]

    half = (items - 1) / 2

    branchScale = 1 - (j - half) / half * settings.symmetry

    scale = settings.scale / level * branchScale

    w = 30 * scale
    h = 100 * scale

    rotation = angleSpread * (j - half) + branchAngle * angleSpiral

    # con.log("draw", level, j, scale)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotation) # Math.PI / 2)

    rgb = 0    
    ctx.fillStyle = "rgba(#{rgb},#{rgb},#{rgb},#{alpha})"
    ctx.fillRect( - w * 1 / 2, 0, w * 1, h * 1)

    ctx.restore()

    newX = x + h * - Math.sin(rotation)
    newY = y + h * Math.cos(rotation)

    if level < maxRecursion
      draw(newX, newY, rotation, level, j)





















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