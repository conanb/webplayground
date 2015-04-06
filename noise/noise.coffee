# 3-dimensional perlin noise
gradiants = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], 
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
]

permutations = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184,84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]

perm = new Array 512
grad = new Array 512

for i in [0..255]
  perm[i] = perm[i+256] = permutations[i%256]
  grad[i] = grad[i+256] = gradiants[i%12]

dot3 = (g, x, y, z) ->
  return g[0]*x + g[1]*y + g[2]*z

mix = (a, b, t) ->
  return (1.0-t)*a + t*b

fade = (t) ->
  return t*t*t*(t*(t*6.0-15.0)+10.0)

perlin3 = (x, y, z) ->
  # Find unit grid cell containing point 
  X = Math.floor x
  Y = Math.floor y
  Z = Math.floor z

  # Get relative xyz coordinates of point within that cell 
  x = x - X
  y = y - Y
  z = z - Z
 
  # Wrap the integer cells at 255 (smaller integer period can be introduced here) 
  X = X & 255
  Y = Y & 255
  Z = Z & 255

  # Calculate a set of eight gradient indices 
  gi000 = perm[X+perm[Y+perm[Z]]] % 12
  gi001 = perm[X+perm[Y+perm[Z+1]]] % 12
  gi010 = perm[X+perm[Y+1+perm[Z]]] % 12
  gi011 = perm[X+perm[Y+1+perm[Z+1]]] % 12
  gi100 = perm[X+1+perm[Y+perm[Z]]] % 12
  gi101 = perm[X+1+perm[Y+perm[Z+1]]] % 12
  gi110 = perm[X+1+perm[Y+1+perm[Z]]] % 12
  gi111 = perm[X+1+perm[Y+1+perm[Z+1]]] % 12

  # Calculate noise contributions from each of the eight corners 
  n000= dot3 grad[gi000], x, y, z 
  n100= dot3 grad[gi100], x-1, y, z
  n010= dot3 grad[gi010], x, y-1, z
  n110= dot3 grad[gi110], x-1, y-1, z
  n001= dot3 grad[gi001], x, y, z-1
  n101= dot3 grad[gi101], x-1, y, z-1
  n011= dot3 grad[gi011], x, y-1, z-1
  n111= dot3 grad[gi111], x-1, y-1, z-1

  # Compute the fade curve value for each of x, y, z 
  u = fade x
  v = fade y
  w = fade z

  # Interpolate along x the contributions from each of the corners 
  nx00 = mix n000, n100, u
  nx01 = mix n001, n101, u
  nx10 = mix n010, n110, u
  nx11 = mix n011, n111, u

  # Interpolate the four results along y 
  nxy0 = mix nx00, nx10, v
  nxy1 = mix nx01, nx11, v

  # Interpolate the two last results along z 
  nxyz = mix nxy0, nxy1, w

  # clamp to [0,1] range
  return nxyz

turbulence = (n, w) ->
  t = -.5;
  f = 1
  while f <= w
    t += Math.abs(n / f)
    f *= 2
  return t