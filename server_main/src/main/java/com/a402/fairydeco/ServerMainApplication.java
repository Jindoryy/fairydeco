package com.a402.fairydeco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class ServerMainApplication {

  public static void main(String[] args) {
    SpringApplication.run(ServerMainApplication.class, args);
  }

}
