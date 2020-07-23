.PHONY: init-dev
init-dev:
	which virtualenv 1>/dev/null || pip install virtualenv
	[ -d .venv ] || virtualenv --python=python3 .venv
	. .venv/bin/activate && pip install -U -r requirements.txt -r test-requirements.txt

.PHONY: lint
lint:
	flake8 .

.PHONY: test
test:
	pytest -v --cov=model_garden --cov-report=term-missing --no-cov-on-fail tests

.PHONY: cov
cov:
	pytest -v --cov=model_garden --cov-report=html --no-cov-on-fail tests && open htmlcov/index.html
