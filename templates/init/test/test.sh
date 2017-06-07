curl http://localhost:3000/maps
curl http://localhost:3000/maps?withRelated=floors
curl http://localhost:3000/maps/1
curl http://localhost:3000/maps/1?withRelated=floors
curl -X POST -d "id=23456789&hotel_id=6666&hotel_name=ceshi&default_floor=3&status=0&latlng=5&owner=1" http://localhost:3000/maps
curl -X POST -d "operator=1&type=2" http://localhost:3000/logs
