import sys
import os
import struct
from PIL import Image


with open('mojave.xtr', 'rb') as f_in:
    raw_data = f_in.read()

    index = 0
    while raw_data[index:index + 1] != b'\x0c':
        index += 1
    index += 2  # skip form feed and comments
    raw_data = raw_data[index:]

    pack = struct.unpack('f' * 128 * 64, raw_data)

    print(pack)


img = Image.new( 'RGB', (128, 64), "black") # create a new black image
pixels = img.load() # create the pixel map

x = 0
y = 63
for i in range(len(pack)):
    #print(pack[i])
    color = int(((pack[i] - 1371) / (1513 - 1371)) * 255);
    #1513.9091796875
    #1371.5048828125

    pixels[x,y] = (color, color, color) # set the colour accordingly
    x += 1
    if x >= 128:
        x = 0
        y -= 1

print(max(pack));
print(min(pack));

img.save('out.bmp');

img.show()
