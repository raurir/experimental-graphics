# http://pcg.wikidot.com/pcg-algorithm:maze


con = console
d = document

ctx = null
can = d.createElement("canvas")
time = 0 # Math.random() * 1e10
xwide = 16
yhigh = 16
unit = 16

ran = Math.random()

# Math.random = () -> return ran # Math.E / Math.PI

random = {
  randint: (min,max) -> return parseInt(min + Math.random() * (max - min))
  shuffle: (array) ->
    m = array.length
    while (m)
      i = Math.floor(Math.random() * m--)
      t = array[m]
      array[m] = array[i]
      array[i] = t
    return array
}

logShape = () =>
  s = ''
  for y in [0...yhigh]
    for x in [0...xwide]
      s += field[y][x]
    s += "\n"
  con.log s



#the grid of the maze
#each cell of the maze is one of the following:
# '#' is wall
# '.' is empty space
# ',' is exposed but undetermined
# '?' is unexposed and undetermined

field = []

for y in [0...yhigh]
  row = []
  for x in [0...xwide]
    row.push('?')
  field.push(row)

# con.log(field)

#list of coordinates of exposed but undetermined cells.
frontier = []

carve = (y, x) ->

  # Make the cell at y,x a space.
  # Update the fronteer and field accordingly.
  # Note: this does not remove the current cell from frontier, it only adds new cells.

  extra = []
  field[y][x] = '.'
  if x > 0
    if field[y][x-1] == '?'
      field[y][x-1] = ','
      extra.push([y,x-1])
  if x < xwide - 1
    if field[y][x+1] == '?'
      field[y][x+1] = ','
      extra.push([y,x+1])
  if y > 0
    if field[y-1][x] == '?'
      field[y-1][x] = ','
      extra.push([y-1,x])
  if y < yhigh - 1
    if field[y+1][x] == '?'
      field[y+1][x] = ','
      extra.push([y+1,x])
  extra = random.shuffle(extra)
  for i in extra
    # con.log(i, extra)
    frontier.push(i)

harden = (y, x) ->
  # console.log "harden", y, x
  #Make the cell at y,x a wall.
  field[y][x] = '#'

check = (y, x, nodiagonals = true) ->

  # con.log("check", y, x)

  ###
  Test the cell at y,x: can this cell become a space?
  true indicates it should become a space,
  false indicates it should become a wall.
  ###

  edgestate = 0
  if x > 0
    if field[y][x-1] == '.'
      edgestate += 1
  if x < xwide-1
    if field[y][x+1] == '.'
      edgestate += 2
  if y > 0
    if field[y-1][x] == '.'
      edgestate += 4
  if y < yhigh-1
    if field[y+1][x] == '.'
      edgestate += 8

  if nodiagonals
    #if this would make a diagonal connecition, forbid it
    #the following steps make the test a bit more complicated and are not necessary,
    #but without them the mazes don't look as good
    if edgestate == 1
      if x < xwide-1
        if y > 0
          if field[y-1][x+1] == '.'
            return false
        if y < yhigh-1
          if field[y+1][x+1] == '.'
            return false
      return true
    else if edgestate == 2
      if x > 0
        if y > 0
          if field[y-1][x-1] == '.'
            return false
        if y < yhigh-1
          if field[y+1][x-1] == '.'
            return false
      return true
    else if edgestate == 4
      if y < yhigh-1
        if x > 0
          if field[y+1][x-1] == '.'
            return false
        if x < xwide-1
          if field[y+1][x+1] == '.'
            return false
      return true
    else if edgestate == 8
      if y > 0
        if x > 0
          if field[y-1][x-1] == '.'
            return false
        if x < xwide-1
          if field[y-1][x+1] == '.'
            return false
      return true
    return false
  else
    #diagonal walls are permitted
    if [1,2,4,8].indexOf(edgestate) isnt -1
      return true
    return false


# draw a circle
# for i in [0..100]
#   r = xwide / 2 - 4 # 30 + i * 1 + (Math.random() - 0.5) * 2
#   a = i / 100 * Math.PI * 2 # + (Math.random() - 0.5) * 0.2
#   x = Math.round(Math.sin(a) * r + xwide / 2)
#   y = Math.round(Math.cos(a) * r + yhigh / 2)
#   if y < yhigh and x < xwide and y >= 0 and x >= 0
#     carve(y, x)

# draw border around edge
borderIndex = 0
borderLength = xwide * 2 + yhigh * 2 - 4 # perimeter, in blocks
exits = []
# exits[0] = Math.floor(Math.random() * borderLength)
# exits[1] = (exits[0] + Math.floor(2 + Math.random() * (borderLength - 3))) % borderLength
# exits = getExits()
exits = [xwide / 2, xwide + yhigh * 2 - 4 + xwide / 2]
# exits = [xwide + yhigh * 2 - 4 + xwide / 2]



###
for i in [0..10000]
  exits = getExits(2)
  # make sure they are not the same
  con.warn("exits are the same", exits) if exits[0] is exits[1]
  # make sure they are within the acceptable range
  con.warn("ecits outside range", exits) if exits[0] > borderLength or exits[1] > borderLength
  # and make sure they are not beside each other.
  con.warn("exits beside each other", exits[0], exits[1]) if Math.abs(exits[0] - exits[1]) < 2
con.log("test worked", exits)
###
exitNum = 0
for y in [0...yhigh]
  for x in [0...xwide]
    if x is 0 or y is 0 or x is xwide - 1 or y is yhigh - 1
      if exits.indexOf(borderIndex) is -1
        harden(y, x)
      else
        exitNum++
        # draw an exit
        if exitNum is 1
          carve(y, x)
        else
          # field[y][x] = "."
          carve(y, x)
        d = if y is 0 then 1 else -1
        for entry in [1..4]
          y1 = y + entry * d
          harden(y1, x - 2)
          harden(y1, x - 1)
          # carve(y1, x)
          # field[y1][x] = "."
          harden(y1, x + 1)
          harden(y1, x + 2)

      borderIndex++

#choose a original point at random and carve it out.
# xchoice = random.randint(0, xwide-1)
# ychoice = random.randint(0, yhigh-1)
# carve(ychoice, xchoice)



logShape()


#parameter branchrate:
#zero is unbiased, positive will make branches more frequent, negative will cause long passages
#this controls the position in the list chosen: positive makes the start of the list more likely,
#negative makes the end of the list more likely

#large negative values make the original point obvious

#try values between -10, 10

e = Math.E

branchrate = 10

iterations = 0

init = (cb, _xwide, _yhigh) ->
  # xwide = _xwide if _xwide?
  # ywide = _yhigh if _yhigh?
  can.width = xwide * unit
  can.height = yhigh * unit
  # d.body.appendChild(can)

  ctx = can.getContext("2d")
  console.log "maze.coffee init", cb
  draw(cb)

keepDrawing = () => frontier.length > 2 and iterations < 1e10

iterativeDraw = () ->
  if keepDrawing()
    #select a random edge
    pos = Math.random()
    pos = Math.pow(pos, Math.pow(e, -branchrate))
    if pos >= 1 or pos < 0
      console.log pos
    index = Math.floor(pos * frontier.length)
    choice = frontier[index]

    # con.log("pos ...", pos, index)
    # con.log("choice ...", choice)
    if check(choice[0],choice[1])
      carve(choice[0],choice[1])
    else
      harden(choice[0],choice[1])
    frontier.splice(index, 1)

  iterations++

fill = () =>
  for y in [0...yhigh]
    for x in [0...xwide]
      f = field[y][x]
      rgb = {"#": 50, ".": 150, "?": 200, ",": 200}[f]
      ctx.fillStyle = "rgba(#{rgb},#{rgb},#{rgb},1)"
      ctx.fillRect(x * unit, y * unit, unit, unit)

draw = (cb) ->
  again = () =>
    # can.width = can.width
    time += 0.5

    for d in [0..10]
      iterativeDraw()

    if keepDrawing()
      console.log "drawing"
      requestAnimationFrame(again)
    else
      console.log "done"
      # print the maze

      # set unexposed cells to be walls
      for y in [0...yhigh]
        for x in [0...xwide]
          f = field[y][x]
          if f is '?' or f is ","
            field[y][x] = '#'

      # dodgy hack to draw top line down.
      # drawn = false
      # y = 1
      # while field[y][x] isnt "#" and drawn is false
      #   x = exits[0]
      #   f = field[y][x]
      #   con.log(x, y, f)
      #   if f is "#"
      #     carve(y, x)
      #     drawn = true
      #   else
      #     continue

      # logShape()

      cb?()

    fill()
  again()

getMaze = () =>
  return field

# init()
# draw()

maze = {
  getMaze: getMaze
  init: init
  stage: can
  resize: () -> console.log "resize maze not implemented!"
  kill: () -> console.log "kill maze not implemented!"
}

# con.log(maze)

window.maze = maze
define("maze", window.maze)
