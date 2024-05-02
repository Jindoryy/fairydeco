package com.a402.fairydeco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@EnableJpaAuditing
@SpringBootApplication
public class ServerMainApplication {

  public static void main(String[] args) {
    SpringApplication.run(ServerMainApplication.class, args);
  }
  @Bean
  public WebMvcConfigurer corsConfigure() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**").allowedOrigins("*").allowedMethods("GET","PUT","POST","DELETE");
      }

    };
  }

}
