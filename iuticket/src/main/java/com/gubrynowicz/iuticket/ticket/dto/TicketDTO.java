package com.gubrynowicz.iuticket.ticket.dto;

import com.gubrynowicz.iuticket.ticket.enums.TicketStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;

public class TicketDTO {
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private final Long id;
    private String title;
    private String description;
    private Long userId;
    private TicketStatus status;
    private Date dueDate;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Date createdAt;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Date updatedAt;

    public TicketDTO(Long id, String title, String description, Long userId, TicketStatus status, Date dueDate, Date createdAt, Date updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.status = status;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
