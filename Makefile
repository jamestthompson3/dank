SHELL := /bin/bash
OUT    = @echo `date +[\ %F\ -\ %T\ ]`

watch:
	$(OUT) "Watching..."
	@while sleep 5; do make -s build; done

build:
	bash ./build.sh

build_hugo:
	hugo --minify
	bash ./build.sh
	cp *.html *.xml ./public/

build_dev:
	cp *.html *.xml ./public/
	cd ./public && python3 -m http.server

