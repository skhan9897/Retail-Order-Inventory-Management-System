package com.bank.retailordermanagementsystem.repository;

import com.bank.retailordermanagementsystem.entity.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {
    List<OutboxEvent> findTop50ByProcessedFalseOrderByCreatedAtAsc();
}
