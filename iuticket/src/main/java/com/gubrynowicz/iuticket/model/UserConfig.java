package com.gubrynowicz.iuticket.model;

import jakarta.persistence.*;

@Entity
public class UserConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer todoWipLimit = 5;
    private Integer inProgressWipLimit = 1;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public Integer getTodoWipLimit() {
        return todoWipLimit;
    }

    public void setTodoWipLimit(Integer todoWipLimit) {
        this.todoWipLimit = todoWipLimit;
    }

    public Integer getInProgressWipLimit() {
        return inProgressWipLimit;
    }

    public void setInProgressWipLimit(Integer inProgressWipLimit) {
        this.inProgressWipLimit = inProgressWipLimit;
    }
}