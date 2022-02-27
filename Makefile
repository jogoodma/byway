BACKUP_DIR           := $(shell pwd)/backups
BUYER_SERVICE_NAME   := buyer-server
BUYER_CONTAINER_NAME := byway_buyer-server_1

backup:$(BACKUP_DIR)/pico-buyer.tar.gz

$(BACKUP_DIR)/pico-buyer.tar.gz:$(BACKUP_DIR)
	docker-compose pause $(BUYER_SERVICE_NAME)
	docker run --rm  --volumes-from $(BUYER_CONTAINER_NAME) -v $(BACKUP_DIR):/backup ubuntu tar zcvf /backup/pico-buyer-backup.tar.gz /var/pico-image
	docker-compose unpause $(BUYER_SERVICE_NAME)

$(BACKUP_DIR):
	mkdir -p $(BACKUP_DIR)
