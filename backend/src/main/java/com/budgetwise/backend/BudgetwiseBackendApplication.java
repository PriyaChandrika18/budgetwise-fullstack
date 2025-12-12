package com.budgetwise.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // ensures JPA scans all subpackages (model, service, repository, controller)
public class BudgetwiseBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BudgetwiseBackendApplication.class, args);
    }
}
