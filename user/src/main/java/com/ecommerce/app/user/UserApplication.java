package com.ecommerce.app.user;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class UserApplication {

    public static void main(String[] args) {
//        System.out.println("JVM Timezone = " + java.util.TimeZone.getDefault().getID());

        SpringApplication.run(UserApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }

}
