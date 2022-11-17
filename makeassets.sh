cd src

printf "assets={"
printf "\"root\":[\"./\","
find . -maxdepth 1 -type f -not -path '*/.*' -not -path './service-worker.js' | xargs printf "\"%s\"," "$@"
printf "],"
for DIR in $(find . -type d -mindepth 1 -maxdepth 1); do
  printf "\""${DIR#*./}"\":["
  printf "\"%s/\"," "${DIR#*./}"
  find $DIR -type f -not -path '*/.*' | xargs printf "\"%s\"," "$@"
  # find $DIR -type d -not -path '*/.*' | xargs printf "\"%s/\"," "$@"
  printf "],"
done
printf "};"