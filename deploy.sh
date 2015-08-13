message=$1

if [ "$message" = "" ]
then
  echo "No message..."
  exit 1
fi

cd ../raurir.github.io/
git pull

cd ../experimental-graphics/

echo "Copying files... "
for file in index.html main.js lib/* lib/**/* js/* js/**/* css/*
do
  if [[ -f $file ]]; then
    cp "$file" "../raurir.github.io/$file"
    # echo "$file" "../raurir.github.io/$file"
  fi
done

cd ../raurir.github.io/

git add .
git commit -m "Deploying $message"
git push