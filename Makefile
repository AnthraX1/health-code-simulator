build: clean makeassets
	./build.sh

serve: makeassets
	sass --watch src/common/nav.scss src/common/nav.css &
	python3 -m http.server --directory src 80

makeassets:
	sed -i "s/\(\/\*\ BEGIN\ ASSETS\ \*\/\).*/\1/" src/service-worker.js || sed -i "" "s/\(\/\*\ BEGIN\ ASSETS\ \*\/\).*/\1/" src/service-worker.js
	./makeassets.sh >> src/service-worker.js

clean:
	rm -rf build
