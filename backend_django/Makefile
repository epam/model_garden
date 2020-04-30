build:
	docker build -t model_garden:latest .

lint:
	flake8 .

test:
	pytest -v --cov=model_garden --cov-report=term-missing --no-cov-on-fail tests
