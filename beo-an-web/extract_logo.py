from PIL import Image
import numpy as np
import os

input_path = "/Users/miko/Development/websites/asia/design_to_be_followed.jpg"
output_path = "/Users/miko/Development/websites/asia/beo-an-web/public/brand_assets.png"

def remove_background(img_path, out_path):
    img = Image.open(img_path).convert("RGBA")
    data = np.array(img)

    # BG color from top-left pixel
    bg_color = data[0, 0]
    
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    tolerance = 25
    mask = (np.abs(r.astype(int) - bg_color[0]) < tolerance) & \
           (np.abs(g.astype(int) - bg_color[1]) < tolerance) & \
           (np.abs(b.astype(int) - bg_color[2]) < tolerance)

    data[mask, 3] = 0
    Image.fromarray(data).save(out_path)
    print("Extract successful!")

if __name__ == "__main__":
    remove_background(input_path, output_path)
