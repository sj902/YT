#!/bin/bash          

video_folder="../video"

today=$(date +%F)

echo $today 

#make audio folder
audio_folder="../temp-audio/${today}"
mkdir $audio_folder

#make final op folder
op_folder="../opfiles/${today}"
mkdir $op_folder

stock_audio_folder="../stock-music" 

FILES="${video_folder}/*"
for f in $FILES
do
  echo "Processing $f file..."

  # get file size
  file_size_total=$(ffprobe -i $f -show_entries format=duration -v quiet -of csv="p=0")
  file_size=$(printf %.0f $file_size_total)

  # get file name
  complete_file_name=$(basename ${f})
  extension="${complete_file_name##*.}"
  file_name="${complete_file_name%.*}"

  # select random audio
  audio_file=$(ls $stock_audio_folder|sort -R |tail -1)
  audio_file_old_path="${stock_audio_folder}/${audio_file}"
  audio_file_new_path="${audio_folder}/${file_name}.mp3"

  echo $audio_file_new_path
  # trim audio
  ffmpeg -ss 0 -i $audio_file_old_path -t $file_size -c copy $audio_file_new_path
  
  # get op name
  output_file_name="${op_folder}/${complete_file_name}"

  # add the audio and video
  ffmpeg -i $f -i $audio_file_new_path -map 0:0 -map 1:0 $output_file_name

  echo $file_size
done

