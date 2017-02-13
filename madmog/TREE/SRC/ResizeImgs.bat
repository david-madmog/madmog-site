@echo off

rem This batch file copies the images from the big ones into the prod directory, 
rem   and then uses a GIMP script to resize them to 100x100
rem GIMP script can be found at:
rem   C:\Users\davidp\.gimp-2.8\scripts
rem
rem NOTE: Will only act on PNG's

copy /y "C:\Users\davidp\Documents\Personal\Madmog website\TREE\SRC\BigImgs\*.png" "C:\Users\davidp\Documents\Personal\Madmog website\TREE\Imgs\"

cd C:\Program Files\GIMP 2\bin

gimp-2.8 -d -f -s -i -b "(batch-image-resize \"C:\\Users\\davidp\\Documents\\Personal\\Madmog website\\TREE\\Imgs\\*.png\" 100 )" -b "(gimp-quit 0)"


