con = console
d = document

bits = 20
gap = 16
size = bits * gap * 2
centre = size / 2
ctx = null
time = 0

yOffset = 0

timeLoop = 2000
timeStep = 300
timeRingDelay = 20

init = () ->
  can = d.createElement("canvas")
  can.width = can.height = size
  d.body.appendChild(can)

  ctx = can.getContext("2d")

  setInterval(
    ()=>
      time += 1
      time %= timeLoop

      ctx.clearRect(0, 0, size, size)

      for i in [0...bits] by 1
        drawRing(i)
    1000/60
  )

drawRing = (i) ->
  perside = i * 2
  for s in [0...4] by 1

    ctx.save()
    ctx.translate(centre, centre)
    ctx.rotate(s * Math.PI / 2)

    for j in [0..perside] by 1

      inOutCubic = (t, b, c, d) ->
        ts=(t/=d)*t
        tc=ts*t
        return b+c*(-2*tc + 3*ts)

      timeStart = (i + 1) * timeRingDelay
      timeEnd = timeStart + timeStep
      timeMove = timeEnd - timeStart

      zeroToOne = if time > timeEnd
        1
      else if time > timeStart
        (time - timeStart) / timeMove
      else
        0

      yOffset = inOutCubic(zeroToOne, 0, gap, 1)

      x = gap * (-i - 1 / 2)
      y = gap * (-j + i - 1 / 2) + yOffset

      rgb = 0 # i * 10
      ctx.fillStyle = "rgba(#{rgb},#{rgb},#{rgb},1)"
      dot = 6
      ctx.fillRect(x - dot / 2, y - dot / 2, dot, dot)

    ctx.restore()

init()