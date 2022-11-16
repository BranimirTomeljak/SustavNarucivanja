echo "killing everything on port 80"
kill $(lsof -t -i:80)
echo "killing everything on port 3000"
kill $(lsof -t -i:3000)
echo "starting frontend"
cd sustav-narucivanja/ && ng serve --port 80 --host 0.0.0.0 > frontend.log 2>frontend.log &
echo "starting backend"
cd ../sustav-narucivanje-server && node app.js > backend.log 2>backend.log &