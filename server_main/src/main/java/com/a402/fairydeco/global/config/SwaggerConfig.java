package com.a402.fairydeco.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

  @Bean
  public OpenAPI openAPI() {

    Info info = new Info()
        .title("FairyDeco API Document")
        .version("v1")
        .description("FairyDeco API 명세서");
    return new OpenAPI()
        .components(new Components())
        .info(info);
  }
}
