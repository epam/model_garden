.PHONY: init-dev

build:
	docker build -t model_garden:latest .

init-dev:
	which virtualenv 1>/dev/null || pip install virtualenv
	[ -d .venv ] || virtualenv --python=python3 .venv
	. .venv/bin/activate && pip install -U -r requirements.txt -r test-requirements.txt

lint:
	flake8 .

test:
	pytest -v --cov=model_garden --cov-report=term-missing --no-cov-on-fail tests
