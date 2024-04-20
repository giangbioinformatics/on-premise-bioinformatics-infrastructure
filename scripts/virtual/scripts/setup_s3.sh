# !/bin/bash
# Start MinIO server
docker rm -f minio >/dev/null 2>&1
docker run -d \
  --name minio \
  -p ${FORWARD_MINIO_PORT:-9000}:9000 \
  -p ${FORWARD_MINIO_CONSOLE_PORT:-9090}:9090 \
  -e MINIO_ROOT_USER=root \
  -e MINIO_ROOT_PASSWORD=password \
  minio/minio:latest server /data

sleep 5

# Set up MinIO client and create buckets
docker run --rm --link minio:minio --entrypoint=/bin/sh minio/mc -c "mc alias set myminio http://minio:9000 root password; mc mb -p myminio/project1; mc anonymous set public myminio/project1"