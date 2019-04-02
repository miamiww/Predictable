FILE1=$1

scp $FILE1 mike@theprintshop.local:/home/mike/printjobs
ssh mike@theprintshop.local << EOF
  cd /home/mike/printjobs
  cat $FILE1 > /dev/serial0
EOF
exit
