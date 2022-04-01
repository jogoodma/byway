BACKUP_DIR           := $(shell pwd)/backups
BUYER_SERVICE_NAME   := buyer-server
BUYER_CONTAINER_NAME := byway-buyer-server-1

backup:$(BACKUP_DIR)/pico-buyer.tar.gz

restore:
	docker-compose pause $(BUYER_SERVICE_NAME)
	docker run --rm  --volumes-from $(BUYER_CONTAINER_NAME) -v $(BACKUP_DIR):/backup ubuntu sh -c "rm -rf /var/pico-image/* && tar -C / -zxvf /backup/pico-buyer-backup.tar.gz"
	docker-compose unpause $(BUYER_SERVICE_NAME)


$(BACKUP_DIR)/pico-buyer.tar.gz:$(BACKUP_DIR)
	docker-compose pause $(BUYER_SERVICE_NAME)
	docker run --rm  --volumes-from $(BUYER_CONTAINER_NAME) -v $(BACKUP_DIR):/backup ubuntu tar zcvf /backup/pico-buyer-backup.tar.gz /var/pico-image
	docker-compose unpause $(BUYER_SERVICE_NAME)

$(BACKUP_DIR):
	mkdir -p $(BACKUP_DIR)

.PHONY: restore
