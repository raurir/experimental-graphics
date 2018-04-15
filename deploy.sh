message=$1

if [ "$message" = "" ]
then
  echo "No message..."
  exit 1
fi
location=$(basename $(pwd))
if [ "$location" != experimental-graphics ]
then
  echo You must be in experimental-graphics graphic directory
  exit 2
fi

build=`md5 -q jsmin/composite.js`
echo $build

cd ../raurir.github.io/

sed -i -e 's/{HASH}/xyz/g' /main.1.4.js
^ WIP
# git pull

# cd ../experimental-graphics/

# echo "Copying files... "
# for file in index.html main.js assets/* assets/**/* lib/* lib/**/* js/* js/**/* css/*
# do
#   if [[ -f $file ]]; then
#     cp "$file" "../raurir.github.io/$file"
#     echo "$file" "../raurir.github.io/$file"
#   fi
# done

# echo "Happy with no errors? About to deploy"
# read input_variable

# cd ../raurir.github.io/

# git add .
# git commit -m "Deploying $message"
# git push