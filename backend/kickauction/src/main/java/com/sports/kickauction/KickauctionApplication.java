package com.sports.kickauction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class KickauctionApplication {

	public static void main(String[] args) {
		SpringApplication.run(KickauctionApplication.class, args);
	}	

}
