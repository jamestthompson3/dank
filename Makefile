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

build_dev:
	hugo
	bash ./build.sh
	cd ./public && python3 -m http.server

