@echo off
echo open ftp://fivesixsevenjudo.co.uk:jud0jud0@ftp.fivesixsevenjudo.co.uk/ -rawsettings ProxyPort=0 > ftpcmd.dat
echo bin>> ftpcmd.dat
echo cd htdocs>>ftpcmd.dat
echo synchronize remote -filemask="| *.bat; *.dat; *.log; .*; _*; .*/; _*/">>ftpcmd.dat
::echo ls>> ftpcmd.dat
echo exit>> ftpcmd.dat

winscp /script=ftpcmd.dat > upload.log
del ftpcmd.dat