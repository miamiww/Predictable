FILE1=$1
FILE2=$2

scp $FILE1 mike@theprintshop.local:/home/mike/printjobs
convert $FILE2 -resize '1920x1920>' -gravity center -background white -extent 1920x1920 output.jpg
wait $!
scp output.jpg mike@theprintshop.local:/home/mike/printjobs

ssh mike@theprintshop.local << EOF
  cd /home/mike/printjobs
  
  lp output.jpg 
  sleep 20 
  cat $FILE1 > /dev/serial0
EOF
exit
