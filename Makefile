
server:
	node process/server.js

server-cluster:
	node process/server-cluster.js

jobs:
	node process/jobs.js

jobs-cluster:
	node process/jobs-cluster.js

updates:
	npm outdated --depth 0

prod:
	git checkout dev; git pull origin dev; git checkout master; git pull origin master; git merge dev; git push origin master; git checkout dev;