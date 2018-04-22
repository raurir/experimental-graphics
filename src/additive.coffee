con = console
d = document

bits = 200
gap = 2
size = bits * gap
centre = size / 2
ctx = null
can = null
time = 0 # Math.random() * 1e10

oscs = 4
seeds = []

init = () ->
  can = d.createElement("canvas")
  can.width = can.height = size
  d.body.appendChild(can)

  ctx = can.getContext("2d")

  for i in [0...oscs] by 1
    seeds[i] = Math.pow(2,(i+1)) + (Math.random() * 2 - 1) * 10

  con.log(seeds)

  draw()


draw = () ->
  can.width = can.width

  time += 1


  for x in [0...bits] by 1

    v = 0
    for i in [0...oscs] by 1
      v += Math.sin( (time + x) * seeds[i] * 0.01 ) / Math.pow(2,(i+1))

    # con.log(v)
    y = centre + v * centre / oscs

    rgb = 0 # i * 10
    ctx.fillStyle = "rgba(#{rgb},#{rgb},#{rgb},1)"
    ctx.fillRect(x * gap, y, 10, 10)

  requestAnimationFrame(draw)


init()