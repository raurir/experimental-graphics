# http://pcg.wikidot.com/pcg-algorithm:maze

con = console
d = document

ctx = null
can = null
time = 0 # Math.random() * 1e10

ran = Math.random()

Math.random = () -> return ran # Math.E / Math.PI

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



xwide = 140
yhigh = 140

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


#choose a original point at random and carve it out.
xchoice = random.randint(0, xwide-1)
ychoice = random.randint(0, yhigh-1)

console.log xchoice, ychoice

carve(ychoice,xchoice)

#parameter branchrate:
#zero is unbiased, positive will make branches more frequent, negative will cause long passages
#this controls the position in the list chosen: positive makes the start of the list more likely,
#negative makes the end of the list more likely

#large negative values make the original point obvious

#try values between -10, 10

e = Math.E

branchrate = 3

iterations = 0


#set unexposed cells to be walls
# for y in [0...yhigh]
#   for x in [0...xwide]
#     if field[y][x] == '?'
#       field[y][x] = '#'





unit = 4
init = () ->
  can = d.createElement("canvas")
  can.width = xwide * 10
  can.height = yhigh * 10
  d.body.appendChild(can)

  ctx = can.getContext("2d")


maze = () ->
  if frontier.length and iterations < 1e10
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

draw = () ->
  # can.width = can.width
  time += 0.5

  for d in [0...1000]
    maze()

  #print the maze
  # for y in [0...yhigh]
  #   s = ''
  #   for x in [0...xwide]
  #     s += field[y][x]
  #   con.log s

  for y in [0...yhigh]
    for x in [0...xwide]
      if field[y][x] == "#"
        rgb = 200 # i * 10
        ctx.fillStyle = "rgba(#{rgb},#{rgb},#{rgb},1)"
        ctx.fillRect(x * unit, y * unit, unit, unit)


  if frontier.length
    requestAnimationFrame(draw)
  else
    console.log "done"

    for y in [0...yhigh]
      for x in [0...xwide]
        if field[y][x] == '?'
          # field[y][x] = '#'
          rgb = 255 # i * 10
          ctx.fillStyle = "rgba(#{rgb},#{rgb},#{rgb},1)"
          ctx.fillRect(x * unit, y * unit, unit, unit)




init()
draw()