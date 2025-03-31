package com.gubrynowicz.iuticket.user.dto;

public class UserConfigDTO {
    private Integer todoWipLimit;
    private Integer inProgressWipLimit;

    public UserConfigDTO(Integer todoWipLimit, Integer inProgressWipLimit) {
        this.todoWipLimit = todoWipLimit;
        this.inProgressWipLimit = inProgressWipLimit;
    }

    public Integer getInProgressWipLimit() {
        return inProgressWipLimit;
    }

    public void setInProgressWipLimit(Integer inProgressWipLimit) {
        this.inProgressWipLimit = inProgressWipLimit;
    }

    public Integer getTodoWipLimit() {
        return todoWipLimit;
    }

    public void setTodoWipLimit(Integer todoWipLimit) {
        this.todoWipLimit = todoWipLimit;
    }
}
