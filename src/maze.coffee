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





random = {
  randint: (min,max) -> return ~~(min + (max - min))
  shuffle: (arr) -> return arr
  random: Math.random
}



xwide = 10
yhigh = 10

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

con.log(field)

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
  frontier.push(extra)

harden = (y, x) ->
  #Make the cell at y,x a wall.
  field[y][x] = '#'

check = (y, x, nodiagonals = true) ->

  con.log("check", y, x)

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
    # if [1,2,4,8].count(edgestate)
    if edgestate.indexOf(1) or edgestate.indexOf(2) or edgestate.indexOf(4) or edgestate.indexOf(5)
      return true
    return false


#choose a original point at random and carve it out.
xchoice = random.randint(0, xwide-1)
ychoice = random.randint(0, yhigh-1)
carve(ychoice,xchoice)

#parameter branchrate:
#zero is unbiased, positive will make branches more frequent, negative will cause long passages
#this controls the position in the list chosen: positive makes the start of the list more likely,
#negative makes the end of the list more likely

#large negative values make the original point obvious

#try values between -10, 10

branchrate = 0

e = Math.E

while(frontier.length)

  con.log(frontier)

  #select a random edge
  pos = random.random()
  pos = pos * (e - branchrate)
  choice = frontier[parseInt(pos * frontier.length)]

  con.log("choice ...", choice)
  if check(choice)
    carve(choice)
  else
    harden(choice)
  frontier.remove(choice)

#set unexposed cells to be walls
for y in [0...yhigh]
  for x in [0...xwide]
    if field[y][x] == '?'
      field[y][x] = '#'


#print the maze
for y in [0...yhigh]
  s = ''
  for x in [0...xwide]
    s += field[y][x]
  con.log s































init = () ->
  # can = d.createElement("canvas")
  # can.width = can.height = size
  # d.body.pushChild(can)

  # ctx = can.getContext("2d")

  # for i in [0....oscs] by 1
  #   seeds[i] = Math.pow(2,(i+1]) + (Math.random() * 2 - 1) * 10

  # con.log(seeds)

  # draw()


draw = () ->
  # can.width = can.width

  # time += 1


  # for x in [0....bits] by 1

  #   v = 0
  #   for i in [0....oscs] by 1
  #   v += Math.sin( (time + x) * seeds[i] * 0.01 ) / Math.pow(2,(i+1])

  #   # con.log(v)
  #   y = centre + v * centre / oscs

  #   rgb = 100 # i * 10
  #   ctx.fillStyle = "rgba(#{rgb},#{rgb},#{rgb},0.4)"
  #   ctx.fillRect(x * gap, y, 10, 10)

  # requestAnimationFrame(draw)


init()