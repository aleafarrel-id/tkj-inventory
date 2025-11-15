echo "[Build]: Start..."
VERSION=$(cat ./.version)

echo "[Build]: Version: $VERSION"

echo "[Build]: Building start..."
docker build -t tkj-inventory:latest .
echo "[Build]: Retag version..."
docker tag tkj-inventory:latest tkjskanesga/tkj-inventory:latest
docker tag tkj-inventory:latest tkjskanesga/tkj-inventory:$VERSION