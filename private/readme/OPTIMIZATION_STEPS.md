# Optimization Steps

Asset optimization was done with the gifsicle program

First, gif's were converted to the web colormap using ```gifsicle [INPUT_FILE] --use-colormap web -o [OUTPUT_FILE]```

Next, gif's were converted to the black and white colormap and optimized using ```gifsicle [INPUT_FILE] --use-colormap colormap/gray4.txt -O3 -o [OUTPUT_FILE]```

I noticed that when using the bw colormap provided by gifsicle, artifacts will often be left behind.
However, the colormap/gray4.txt colormap does not leave these same artifacts.
