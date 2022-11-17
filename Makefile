build: clean makeassets
	./build.sh

serve: makeassets
	python3 -m http.server --directory src 80

makeassets:
	sed -i "s/\(\/\*\ BEGIN\ ASSETS\ \*\/\).*/\1/" src/service-worker.js
	./makeassets.sh >> src/service-worker.js

clean:
	rm -rf build
